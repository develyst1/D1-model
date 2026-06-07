import { sql } from "../db/client";
import type { Profile } from "../types";

export interface ProfileInput {
  display_name: string;
  gender?: string | null;
  style?: string | null;
}

export type ProfilePatch = Partial<ProfileInput>;

export async function listProfiles(): Promise<Profile[]> {
  return sql`SELECT * FROM profiles ORDER BY created_at DESC`;
}

export async function getProfile(id: string): Promise<Profile | null> {
  const rows = await sql`SELECT * FROM profiles WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  const rows = await sql`
    INSERT INTO profiles (display_name, gender, style)
    VALUES (${input.display_name}, ${input.gender ?? null}, ${input.style ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function updateProfile(id: string, patch: ProfilePatch): Promise<Profile | null> {
  const rows = await sql`
    UPDATE profiles SET
      display_name = COALESCE(${patch.display_name ?? null}, display_name),
      gender       = COALESCE(${patch.gender ?? null}, gender),
      style        = COALESCE(${patch.style ?? null}, style),
      updated_at   = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export async function deleteProfile(id: string): Promise<boolean> {
  const rows = await sql`DELETE FROM profiles WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
