// ตรงกับ ModelProvider ของ AI Develyst gateway (H:\chipint\develyst-ai)
export type ModelProvider = "openai" | "gemini" | "xai" | "deepseek";

export type MessageRole = "system" | "user" | "assistant";

export interface Profile {
  id: string;
  display_name: string;
  gender: string | null;
  style: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  profile_id: string | null;
  title: string | null;
  provider: ModelProvider | null;
  model: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  provider: ModelProvider | null;
  model: string | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  latency_ms: number | null;
  created_at: string;
}

// AIResponse ที่ normalize แล้วจาก AI Develyst gateway (POST /chat)
export interface AIResponse {
  provider: ModelProvider;
  model: string;
  content: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  latency_ms: number;
}
