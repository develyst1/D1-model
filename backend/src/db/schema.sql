-- D1-Model backend schema: conversation history + user profiles
-- ใช้ gen_random_uuid() จาก pgcrypto (ติดตั้งมาด้วย postgres image มาตรฐาน)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  gender       TEXT,
  style        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title        TEXT,
  provider     TEXT,
  model        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id    UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role               TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
  content            TEXT NOT NULL,
  provider           TEXT,
  model              TEXT,
  prompt_tokens      INTEGER,
  completion_tokens  INTEGER,
  total_tokens       INTEGER,
  latency_ms         INTEGER,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_profile_id ON conversations(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
