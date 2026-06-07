function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3100,
  databaseUrl: required("DATABASE_URL"),
  databaseSsl: process.env.DATABASE_SSL === "true",
  aiGatewayUrl: process.env.AI_GATEWAY_URL || "http://localhost:3009",
  aiDefaultProvider: process.env.AI_DEFAULT_PROVIDER || undefined,
  aiDefaultModel: process.env.AI_DEFAULT_MODEL || undefined,
};
