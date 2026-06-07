import { Hono } from "hono";
import {
  listConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  type ConversationInput,
  type ConversationPatch,
} from "../repositories/conversations";
import { listMessages, createMessage, type MessageInput } from "../repositories/messages";

const conversations = new Hono();

// GET /conversations?profile_id=...
conversations.get("/", async (c) => {
  const profileId = c.req.query("profile_id");
  const data = await listConversations(profileId ? { profile_id: profileId } : undefined);
  return c.json({ success: true, data });
});

// GET /conversations/:id  → conversation พร้อม messages ทั้งหมด
conversations.get("/:id", async (c) => {
  const id = c.req.param("id");
  const conversation = await getConversation(id);
  if (!conversation) return c.json({ success: false, error: "conversation not found" }, 404);
  const messages = await listMessages(id);
  return c.json({ success: true, data: { ...conversation, messages } });
});

// POST /conversations  { profile_id?, title?, provider?, model? }
conversations.post("/", async (c) => {
  const body = await c.req.json<Partial<ConversationInput>>().catch(() => ({}));
  const conversation = await createConversation(body);
  return c.json({ success: true, data: conversation }, 201);
});

// PATCH /conversations/:id  { title?, provider?, model? }
conversations.patch("/:id", async (c) => {
  const body = await c.req.json<ConversationPatch>();
  const conversation = await updateConversation(c.req.param("id"), body);
  if (!conversation) return c.json({ success: false, error: "conversation not found" }, 404);
  return c.json({ success: true, data: conversation });
});

// DELETE /conversations/:id
conversations.delete("/:id", async (c) => {
  const ok = await deleteConversation(c.req.param("id"));
  if (!ok) return c.json({ success: false, error: "conversation not found" }, 404);
  return c.json({ success: true });
});

// GET /conversations/:id/messages
conversations.get("/:id/messages", async (c) => {
  const id = c.req.param("id");
  const conversation = await getConversation(id);
  if (!conversation) return c.json({ success: false, error: "conversation not found" }, 404);
  const data = await listMessages(id);
  return c.json({ success: true, data });
});

// POST /conversations/:id/messages  { role, content, ... } — เพิ่ม message ด้วยมือ (ไม่เรียก AI)
conversations.post("/:id/messages", async (c) => {
  const id = c.req.param("id");
  const conversation = await getConversation(id);
  if (!conversation) return c.json({ success: false, error: "conversation not found" }, 404);

  const body = await c.req.json<Partial<MessageInput>>();
  if (!body.role || !body.content) {
    return c.json({ success: false, error: "role and content are required" }, 400);
  }

  const message = await createMessage({ ...body, conversation_id: id, role: body.role, content: body.content });
  return c.json({ success: true, data: message }, 201);
});

export default conversations;
