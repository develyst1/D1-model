import { sql } from "../db/client";
import type { Conversation, ModelProvider } from "../types";

export interface ConversationInput {
  profile_id?: string | null;
  title?: string | null;
  provider?: ModelProvider | null;
  model?: string | null;
}

export type ConversationPatch = Partial<ConversationInput>;

export async function listConversations(filter?: { profile_id?: string }): Promise<Conversation[]> {
  if (filter?.profile_id) {
    return sql`
      SELECT * FROM conversations
      WHERE profile_id = ${filter.profile_id}
      ORDER BY updated_at DESC
    `;
  }
  return sql`SELECT * FROM conversations ORDER BY updated_at DESC`;
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const rows = await sql`SELECT * FROM conversations WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function createConversation(input: ConversationInput): Promise<Conversation> {
  const rows = await sql`
    INSERT INTO conversations (profile_id, title, provider, model)
    VALUES (${input.profile_id ?? null}, ${input.title ?? null}, ${input.provider ?? null}, ${input.model ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function updateConversation(id: string, patch: ConversationPatch): Promise<Conversation | null> {
  const rows = await sql`
    UPDATE conversations SET
      title      = COALESCE(${patch.title ?? null}, title),
      provider   = COALESCE(${patch.provider ?? null}, provider),
      model      = COALESCE(${patch.model ?? null}, model),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export async function touchConversation(id: string, fields: { provider?: ModelProvider; model?: string }): Promise<void> {
  await sql`
    UPDATE conversations SET
      provider   = COALESCE(${fields.provider ?? null}, provider),
      model      = COALESCE(${fields.model ?? null}, model),
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deleteConversation(id: string): Promise<boolean> {
  const rows = await sql`DELETE FROM conversations WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
