# D1-Model

โปรเจกต์ออกแบบ **D1-Model** หุ่นยนต์ AI ขนาดเล็ก (Mini Robot) ที่ใช้ "สมอง" (Brain) ชุดเดียว
ใส่สลับเข้าไปใน **หลายตัวถัง (Body)** ได้ — เพื่อรองรับลูกค้าที่มีรสนิยมต่างกัน โดยตอนนี้ repo
นี้เป็นเอกสารวางแผน/วิสัยทัศน์ ยังไม่มีโค้ดจริง

## ภาพรวม

- **ฟังก์ชันหลัก**: ถาม-ตอบสนทนา + หันหน้า (Head Movement)
- **Modular Brain**: Raspberry Pi 5 + ESP32-S3 ย้ายไปใส่ Body อื่นได้
- **Online-First**: เรียกใช้ AI ผ่าน Backend API Server
- **Body ที่วางแผนไว้**: ตุ๊กตาน่ารัก / หุ่นยนต์หน้าผู้หญิง / หุ่นยนต์กลไก / custom ตามลูกค้า

สถาปัตยกรรมคร่าว ๆ:

```
ผู้ใช้ → ESP32-S3 (Peripheral) → Raspberry Pi 5 (Brain) → Backend API → AI / TTS / Action
```

## เอกสารประกอบ

| เอกสาร | เนื้อหา |
|---|---|
| [docs/d1-model.md](docs/d1-model.md) | วิสัยทัศน์เต็มของโปรเจกต์, สถาปัตยกรรม Hardware (ESP32-S3 / Pi 5 / Backend), แนวคิด Modular Body, รายการ Action ที่รองรับ, เป้าหมายระยะยาว |
| [docs/d1-model-pc-version.md](docs/d1-model-pc-version.md) | แผนช่วง Development ที่ใช้ PC แทน Raspberry Pi 5 ชั่วคราว, ความแตกต่างจากเวอร์ชัน Pi 5, ขั้นตอน Migration ไป Pi 5 จริง |

## สถานะปัจจุบัน

🟡 **Planning stage** — ยังอยู่ในขั้นตอนวางแผน/ออกแบบ ยังไม่มีฮาร์ดแวร์ Pi 5 จริง
จึงพัฒนาบน [PC Version](docs/d1-model-pc-version.md) ไปก่อน แล้วค่อย migrate ไปยัง Pi 5 ทีหลัง
