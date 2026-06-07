import { sql } from "../db/client";
import type { Message, MessageRole, ModelProvider } from "../types";

export interface MessageInput {
  conversation_id: string;
  role: MessageRole;
  content: string;
  provider?: ModelProvider | null;
  model?: string | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  latency_ms?: number | null;
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  return sql`
    SELECT * FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at ASC
  `;
}

export async function createMessage(input: MessageInput): Promise<Message> {
  const rows = await sql`
    INSERT INTO messages (
      conversation_id, role, content, provider, model,
      prompt_tokens, completion_tokens, total_tokens, latency_ms
    )
    VALUES (
      ${input.conversation_id}, ${input.role}, ${input.content},
      ${input.provider ?? null}, ${input.model ?? null},
      ${input.prompt_tokens ?? null}, ${input.completion_tokens ?? null},
      ${input.total_tokens ?? null}, ${input.latency_ms ?? null}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function deleteMessage(id: string): Promise<boolean> {
  const rows = await sql`DELETE FROM messages WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
