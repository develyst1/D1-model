# D1-Model Backend

Backend API ของ [D1-Model](../README.md) — ตามบทบาท "Backend API Server" ในเอกสาร [docs/d1-model.md](../docs/d1-model.md):
เก็บ **Conversation History** ใน PostgreSQL และเป็น proxy เรียก **AI API Center**
(ใช้ [AI Develyst gateway](../../develyst-ai) ที่มีอยู่แล้ว)

> สถานะ: รันบน PC ระหว่างพัฒนา (ดู [docs/d1-model-pc-version.md](../docs/d1-model-pc-version.md))
> — ยังไม่มี Pi 5 จริง โค้ดส่วนนี้ออกแบบให้ migrate ไป Pi 5 ได้โดยไม่ต้องแก้โครงสร้าง

## Stack

- **Bun + Hono** — HTTP server
- **TypeScript**
- **PostgreSQL** — ผ่าน `Bun.sql` (native client ของ Bun, ไม่ใช้ ORM เพิ่ม)

## Setup

### 1. ติดตั้ง dependencies

```bash
bun install
```

### 2. ตั้งค่า PostgreSQL

สร้าง role + database (รันด้วย superuser เช่น `psql -U postgres`):

```sql
CREATE USER dev_user WITH PASSWORD 'smart2026';
CREATE DATABASE d1_model_db OWNER dev_user;
```

หรือใช้ `docker-compose.yml` ที่ให้มา (ถ้ามี Docker):

```bash
docker compose up -d
```

### 3. ตั้งค่า .env

คัดลอก `.env.example` → `.env` แล้วปรับค่าตามจริง:

```env
DATABASE_URL=postgres://dev_user:smart2026@localhost:5432/d1_model_db
AI_GATEWAY_URL=http://localhost:3009
PORT=3100
```

### 4. รัน migration (สร้างตาราง)

```bash
bun run migrate
```

### 5. รันเซิร์ฟเวอร์

ต้องรัน [AI Develyst gateway](../../develyst-ai) (`bun run dev`, default port 3009) ควบคู่กันด้วย
เพื่อให้ `/chat` เรียก AI ได้

```bash
bun run dev      # hot-reload, ใช้ระหว่างพัฒนา
bun run start    # รันแบบปกติ
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:3100`

## Endpoints

| Endpoint | คำอธิบาย |
|---|---|
| `GET /` | ข้อมูล service + รายการ endpoint |
| `POST /chat` | **endpoint หลัก** — robot-brain เรียกเพื่อส่งข้อความ, persist ประวัติ, เรียก AI gateway |
| `GET/POST /profiles` | CRUD โปรไฟล์ผู้ใช้ (`display_name`, `gender`, `style`) |
| `GET/PATCH/DELETE /profiles/:id` | CRUD โปรไฟล์รายตัว |
| `GET/POST /conversations` | CRUD บทสนทนา (`?profile_id=` เพื่อกรอง) |
| `GET/PATCH/DELETE /conversations/:id` | CRUD บทสนทนารายตัว (`GET` คืน `messages` ด้วย) |
| `GET/POST /conversations/:id/messages` | อ่าน/เพิ่ม message ในบทสนทนา (เพิ่มมือ ไม่เรียก AI) |

### ตัวอย่าง: `POST /chat`

```json
// request
{
  "profile_id": "<uuid ของ profile>",   // optional — ใช้สร้าง system prompt ส่วนตัว
  "conversation_id": "<uuid>",           // optional — ไม่ใส่ = สร้างบทสนทนาใหม่
  "message": "สวัสดี! คุณคือใคร?",
  "provider": "deepseek",                // optional — ไม่ใส่ = ปล่อยให้ gateway fallback
  "model": "deepseek-v4-flash"           // optional
}
```

```json
// response (success)
{
  "success": true,
  "data": {
    "conversation_id": "...",
    "message": { "id": "...", "role": "assistant", "content": "...", "provider": "deepseek", ... },
    "ai": { "provider": "deepseek", "model": "deepseek-v4-flash", "content": "...", "usage": {...}, "latency_ms": 2300 }
  }
}
```

`/chat` จะ:
1. หา/สร้าง `conversation` (ผูกกับ `profile_id` ถ้ามี)
2. โหลด `profile` แล้วสร้าง **system prompt** จาก `gender`/`style` เพื่อให้ AI ตอบในโทนที่เหมาะกับผู้ใช้คนนั้น
3. โหลดประวัติบทสนทนาเดิม + persist ข้อความใหม่ของผู้ใช้
4. เรียก [AI Develyst gateway](../../develyst-ai) ผ่าน `POST /chat` (normalize response เป็น `AIResponse` เสมอ)
5. persist คำตอบของ AI พร้อม token usage และ latency แล้วส่งกลับ

## โครงสร้างโปรเจกต์

```
src/
├── index.ts              Hono app entrypoint
├── config/env.ts         อ่านค่าจาก .env
├── db/
│   ├── client.ts         Bun.sql client
│   ├── schema.sql        ตาราง profiles / conversations / messages
│   └── migrate.ts        รัน schema.sql
├── repositories/         CRUD queries (profiles, conversations, messages)
├── routes/               Hono routes (profiles, conversations, chat)
├── services/aiGateway.ts client เรียก AI Develyst gateway
└── types/index.ts        shared types
```

## หมายเหตุสำหรับ migrate ไป Raspberry Pi 5

โค้ดนี้ไม่ผูกกับ Windows/PC — ใช้ env vars (`DATABASE_URL`, `AI_GATEWAY_URL`, `PORT`) ทั้งหมด
เมื่อย้ายไป Pi 5 เพียง clone repo, `bun install`, ตั้งค่า `.env` ให้ตรงกับ Postgres/AI gateway
บน Pi แล้วรันเป็น `systemd` service ตามแผนใน [docs/d1-model-pc-version.md](../docs/d1-model-pc-version.md)
