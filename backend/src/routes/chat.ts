import { Hono } from "hono";
import { callAIGateway } from "../services/aiGateway";
import { getProfile } from "../repositories/profiles";
import { createConversation, getConversation, touchConversation } from "../repositories/conversations";
import { listMessages, createMessage } from "../repositories/messages";
import type { ModelProvider } from "../types";

const chat = new Hono();

interface ChatRequestBody {
  conversation_id?: string;
  profile_id?: string;
  message: string;
  provider?: ModelProvider;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// สร้าง system prompt จาก profile (style/gender) เพื่อให้ AI ตอบในโทนที่เหมาะกับผู้ใช้แต่ละคน
function buildSystemPrompt(profile: { display_name: string; gender: string | null; style: string | null } | null): string | null {
  if (!profile) return null;
  const traits: string[] = [];
  if (profile.gender) traits.push(`น้ำเสียง/บุคลิกแบบ ${profile.gender}`);
  if (profile.style) traits.push(`สไตล์การพูดคุยแบบ ${profile.style}`);

  const traitText = traits.length ? ` โดยใช้${traits.join(" และ")}` : "";
  return `คุณคือผู้ช่วย AI ของหุ่นยนต์ D1-Model กำลังคุยกับ "${profile.display_name}"${traitText} ตอบสั้น กระชับ เป็นกันเอง`;
}

// POST /chat — endpoint หลักที่ robot-brain เรียกใช้:
// โหลด/สร้าง conversation, ผูก system prompt จาก profile, persist ประวัติ, แล้วเรียก AI Develyst gateway
chat.post("/", async (c) => {
  const body = await c.req.json<Partial<ChatRequestBody>>();

  if (!body.message?.trim()) {
    return c.json({ success: false, error: "message is required" }, 400);
  }

  // 1) หา/สร้าง conversation
  let conversation = body.conversation_id ? await getConversation(body.conversation_id) : null;
  if (body.conversation_id && !conversation) {
    return c.json({ success: false, error: "conversation not found" }, 404);
  }
  if (!conversation) {
    conversation = await createConversation({
      profile_id: body.profile_id ?? null,
      provider: body.provider ?? null,
      model: body.model ?? null,
    });
  }

  // 2) โหลด profile (ถ้ามี) เพื่อสร้าง system prompt ส่วนตัว
  const profileId = conversation.profile_id ?? body.profile_id ?? null;
  const profile = profileId ? await getProfile(profileId) : null;
  const systemPrompt = buildSystemPrompt(profile);

  // 3) โหลดประวัติบทสนทนาเดิม แล้วต่อด้วยข้อความใหม่ของผู้ใช้
  const history = await listMessages(conversation.id);
  const gatewayMessages = [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: body.message },
  ];

  await createMessage({
    conversation_id: conversation.id,
    role: "user",
    content: body.message,
  });

  // 4) เรียก AI Develyst gateway
  let aiResponse;
  try {
    aiResponse = await callAIGateway({
      provider: body.provider,
      model: body.model,
      temperature: body.temperature,
      max_tokens: body.max_tokens,
      messages: gatewayMessages,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 502);
  }

  // 5) persist คำตอบของ AI และอัปเดต provider/model ล่าสุดของ conversation
  const assistantMessage = await createMessage({
    conversation_id: conversation.id,
    role: "assistant",
    content: aiResponse.content,
    provider: aiResponse.provider,
    model: aiResponse.model,
    prompt_tokens: aiResponse.usage?.prompt_tokens ?? null,
    completion_tokens: aiResponse.usage?.completion_tokens ?? null,
    total_tokens: aiResponse.usage?.total_tokens ?? null,
    latency_ms: aiResponse.latency_ms,
  });
  await touchConversation(conversation.id, { provider: aiResponse.provider, model: aiResponse.model });

  return c.json({
    success: true,
    data: {
      conversation_id: conversation.id,
      message: assistantMessage,
      ai: aiResponse,
    },
  });
});

export default chat;
