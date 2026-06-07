**✅ นี่คือเนื้อหาเต็มของไฟล์ `d1-model.md`**

markdown
# D1-Model: AI Mini Robot - Modular Design

## ภาพรวมโครงการ (Vision)

**D1-Model** คือโมเดลหุ่นยนต์ AI ขนาดเล็ก (Mini Size) ที่ออกแบบมาเพื่อความยืดหยุ่นสูงสุด  
เป้าหมายหลักคือ **ใช้ "สมอง" เดียวกัน** (Brain) ใส่เข้าไปใน **หลายตัวถัง (Body)** เพื่อตอบโจทย์ลูกค้าที่มีรสนิยมต่างกัน

### ลักษณะเด่นของ D1-Model
- **ขนาดเล็ก** — เหมาะสำหรับวางโต๊ะหรือใช้ในบ้าน
- **ฟังก์ชันหลัก** — ถาม-ตอบสนทนา + หันหน้า (Head Movement)
- **Modular Brain** — สมอง (Raspberry Pi 5 + ESP32-S3) สามารถย้ายไปใส่ Body อื่นได้ง่าย
- **Online-First** — ใช้ AI จาก Server (AI API Center)
- **ขยายได้ในอนาคต** — เริ่มจากหัวอย่างเดียว ค่อยเพิ่มแขน ตา LED ฯลฯ

## สถาปัตยกรรมหลัก (Final Target with Pi 5)


ผู้ใช้ → ESP32-S3 (Peripheral)
          ↓ (Serial / WiFi)
     Raspberry Pi 5 (Robot Brain)
          ↓ (HTTP)
     Backend API Server
          ↓
     Response (Text + Action JSON)
          ↓
     Pi 5 → TTS → Audio → ESP32
     Pi 5 → Action Command → ESP32 (Servo)


### Hardware Components (Core)

**ESP32-S3 (Peripheral Unit)**
- INMP441 Microphone
- MAX98357 + Speaker
- 2x Servo (Head Pan + Tilt) — หันซ้าย-ขวา, ขึ้น-ลง
- Optional: LED Eyes, Small Touch Button

**Raspberry Pi 5 (Brain Unit)**
- รัน robot-brain service
- เชื่อมต่อกับ ESP32 ผ่าน UART/Serial
- Call Backend API
- TTS (Piper หรือ Cloud)
- State Management (Sleep / Active)

**Backend API**
- จัดการ Conversation History
- STT (Whisper)
- Call AI API Center (หลายโมเดล)
- Generate Action Pattern

## Modular Body Concept

สมอง + ESP32 สามารถย้ายไปใส่ Body ต่าง ๆ ได้โดย:

1. **Body Type 1: ตุ๊กตา / หุ่นน่ารัก**
   - ตัวตุ๊กตาแบบนุ่ม
   - หัวทำจากฟองน้ำหรือ 3D Print
   - เหมาะกับเด็กหรือคนชอบน่ารัก

2. **Body Type 2: หุ่นยนต์หน้าเหมือนผู้หญิง**
   - ใบหน้า 3D Print หรือ Silicone Mask
   - ตา LED หรือจอเล็ก
   - สไตล์ Anime / Realistic

3. **Body Type 3: หุ่นยนต์กลไก**
   - โลหะหรืออะคริลิค
   - เน้นความเท่ Industrial

4. **Body Type อื่น ๆ** — สามารถ custom ได้ตามลูกค้า

**การย้าย Brain:**
- ESP32 + Servo ต่อกับ Body ใหม่
- Pi 5 ใส่ในฐานหรือซ่อนในตัวถัง
- แค่ calibrate Servo angle ใหม่เล็กน้อย

## Action ที่รองรับใน D1-Model (v1)

- HEAD_NOD (พยักหน้า)
- HEAD_SHAKE (ส่ายหน้า)
- LOOK_LEFT / LOOK_RIGHT
- LOOK_UP / LOOK_DOWN
- BLINK (กระพริบตา - ถ้ามี servo ตา)
- IDLE (สุ่มขยับเบา ๆ)

## เป้าหมายระยะยาว
- ขายเป็นสินค้า (RaaS หรือ ขายตัวเครื่อง)
- Custom Body ตาม заказลูกค้า
- เพิ่มฟีเจอร์ เช่น Face Recognition, Object Detection, Movement (เมื่อมี body ที่เดินได้)

---

**เอกสารนี้คือ "ภาพจบ" ของ D1-Model**  
ทุกการพัฒนาจะต้องอ้างอิงกลับมาที่นี่เพื่อให้สอดคล้องกับวิสัยทัศน์

