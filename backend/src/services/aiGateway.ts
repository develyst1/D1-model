import { env } from "../config/env";
import type { AIResponse, ModelProvider, MessageRole } from "../types";

export interface GatewayChatMessage {
  role: MessageRole;
  content: string;
}

export interface GatewayChatRequest {
  provider?: ModelProvider;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  messages: GatewayChatMessage[];
}

interface GatewaySuccess {
  success: true;
  data: AIResponse;
}

interface GatewayFailure {
  success: false;
  error: string;
}

// เรียก AI Develyst gateway (H:\chipint\develyst-ai) ที่ POST /chat
// gateway จะ normalize response จากทุก provider ให้อยู่ในรูป AIResponse เดียวกันเสมอ
export async function callAIGateway(request: GatewayChatRequest): Promise<AIResponse> {
  const body: GatewayChatRequest = {
    ...request,
    provider: request.provider ?? (env.aiDefaultProvider as ModelProvider | undefined),
    model: request.model ?? env.aiDefaultModel,
  };

  const res = await fetch(`${env.aiGatewayUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as GatewaySuccess | GatewayFailure;

  if (!res.ok || !json.success) {
    const message = "error" in json ? json.error : `AI gateway returned ${res.status}`;
    throw new Error(`AI gateway error: ${message}`);
  }

  return json.data;
}
