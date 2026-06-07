import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { env } from "./config/env";
import profiles from "./routes/profiles";
import conversations from "./routes/conversations";
import chat from "./routes/chat";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) =>
  c.json({
    name: "D1-Model Backend",
    version: "0.1.0",
    description: "Backend API ของ D1-Model: เก็บ conversation history (PostgreSQL) และพร็อกซีไปยัง AI Develyst gateway",
    ai_gateway: env.aiGatewayUrl,
    endpoints: {
      "POST /chat": "ส่งข้อความถึงหุ่น — persist ประวัติ + เรียก AI gateway",
      "GET/POST /profiles": "CRUD โปรไฟล์ผู้ใช้ (ชื่อ, gender, style)",
      "GET/PATCH/DELETE /profiles/:id": "CRUD โปรไฟล์ผู้ใช้รายตัว",
      "GET/POST /conversations": "CRUD บทสนทนา",
      "GET/PATCH/DELETE /conversations/:id": "CRUD บทสนทนารายตัว (GET รวม messages)",
      "GET/POST /conversations/:id/messages": "อ่าน/เพิ่ม message ในบทสนทนา",
    },
  })
);

app.route("/chat", chat);
app.route("/profiles", profiles);
app.route("/conversations", conversations);

Bun.serve({
  port: env.port,
  fetch: app.fetch,
});

console.log(`🤖 D1-Model backend running on http://localhost:${env.port}`);
console.log(`   → AI gateway: ${env.aiGatewayUrl}`);
