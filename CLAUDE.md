# CLAUDE.md

คำแนะนำสำหรับ Claude Code เมื่อทำงานในโปรเจกต์นี้

## โปรเจกต์นี้คืออะไร

**D1-Model** คือการออกแบบ "หุ่นยนต์ AI ขนาดเล็ก" (Mini Robot) ที่เน้นแนวคิด **Modular Brain** —
ใช้สมองชุดเดียว (Raspberry Pi 5 + ESP32-S3) สลับใส่ในตัวถัง (Body) ที่ต่างกันได้
เพื่อตอบโจทย์ลูกค้าหลายกลุ่ม (ตุ๊กตาน่ารัก, หุ่นยนต์หน้าผู้หญิง, หุ่นยนต์กลไก, custom)

ฟังก์ชันหลักของหุ่นคือการ **สนทนาโต้ตอบด้วย AI** และ **หันหน้าตามคำสั่ง/บทสนทนา**
โดยอิงจากการเรียก AI ผ่าน Backend API (แนวทาง Online-First ไม่ใช่ on-device inference)

> สถานะตอนนี้: **เอกสารวางแผน/วิสัยทัศน์เท่านั้น — ยังไม่มีโค้ดจริงใน repo นี้**

## เอกสารอ้างอิงหลัก

- [docs/d1-model.md](docs/d1-model.md) — **"ภาพจบ" ของโปรเจกต์** ทุกการตัดสินใจ/พัฒนาในอนาคต
  ต้องอ้างอิงกลับมาที่เอกสารนี้เพื่อให้สอดคล้องกับวิสัยทัศน์ตั้งต้น (เช่น สถาปัตยกรรม Hardware,
  รายการ Action ที่หุ่นต้องรองรับ, แนวคิด Modular Body)
- [docs/d1-model-pc-version.md](docs/d1-model-pc-version.md) — แผนช่วงพัฒนาก่อนมี Pi 5 จริง
  (ใช้ PC แทน Pi 5 ชั่วคราว) พร้อมแผน migration ไป Pi 5

## สถาปัตยกรรมที่วางแผนไว้ (สำคัญต่อบริบทการทำงาน)

```
ผู้ใช้ → ESP32-S3 (Peripheral: ไมค์, ลำโพง, Servo หัว)
        ↓ Serial / WiFi
   Raspberry Pi 5 — "robot-brain" service
        ↓ HTTP
   Backend API Server (STT, Conversation History, AI API Center, Action Pattern)
        ↓
   Response → Pi 5 → TTS/Audio → ESP32, Action Command → ESP32 (Servo)
```

ในช่วง **Development (PC Version)**: PC ทำหน้าที่แทน Pi 5 ชั่วคราว เชื่อมกับ ESP32 ผ่าน
USB Serial — เพื่อพัฒนา/ทดสอบให้เสร็จก่อน ค่อย migrate โค้ดไปรันบน Pi 5 จริง

## หลักการที่ควรยึดเมื่อเสนอแนะหรือออกแบบเพิ่มเติม

- ทุกฟีเจอร์/ส่วนประกอบใหม่ ควรเช็คว่าสอดคล้องกับวิสัยทัศน์ "Modular Brain" หรือไม่
  (สมองต้องย้ายไป Body อื่นได้โดยแก้ไขน้อยที่สุด — ปรับแค่ calibrate servo angle)
- ระบบเป็นแบบ **Online-First** — พึ่งพา Backend API/AI Server ไม่ใช่ระบบที่รันแยกตัวบนหุ่น
- ขณะนี้ยังอยู่ขั้น **PC Version** ของการพัฒนา ([docs/d1-model-pc-version.md](docs/d1-model-pc-version.md))
  หากมีการเขียนโค้ด ควรออกแบบให้ migrate ไป Raspberry Pi 5 ได้ง่าย (เช่น Serial port,
  การรันเป็น systemd service)
- Action ของหุ่นยนต์ที่ต้องรองรับใน v1: `HEAD_NOD`, `HEAD_SHAKE`, `LOOK_LEFT/RIGHT`,
  `LOOK_UP/DOWN`, `BLINK`, `IDLE` — รายการนี้คือ baseline ห้ามตัดออกหากไม่ได้ตกลงกับผู้ใช้ก่อน

## Stack ที่ตั้งใจใช้ (ตามเอกสาร — ยังไม่มีโค้ดยืนยัน)

- **ESP32-S3 firmware**: VS Code + PlatformIO
- **robot-brain** (รันบน PC ระหว่างพัฒนา / Pi 5 ตอน production): Python หรือ Node.js
- **Backend API**: Bun

> หมายเหตุ: รายการข้างต้นมาจากเอกสารวางแผน หากเริ่มเขียนโค้ดจริง ให้ตรวจสอบ
> `package.json` / `requirements.txt` / `platformio.ini` เพื่อยืนยัน stack ที่ใช้จริงก่อนเสมอ
