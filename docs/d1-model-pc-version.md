**✅ นี่คือเนื้อหาเต็มของไฟล์ `pc-version.md`**

markdown
# PC Version - Development Stage (ก่อนมี Pi 5)

## วัตถุประสงค์
ใช้ **PC เป็นตัวแทน Raspberry Pi 5** ชั่วคราว เพื่อทดลองและพัฒนาโปรเจกต์ให้เสร็จเร็วที่สุด  
เมื่อมี Pi 5 จริง ค่อยย้ายโค้ดไปรันบน Pi ได้ทันที

## สถาปัตยกรรม PC Version


ESP32-S3
   ↓ (USB Serial หรือ WiFi)
PC (robot-brain)
   ↓ (HTTP)
Backend API Server
   ↓
PC → TTS → Audio File → Send to ESP32 (หรือเล่นตรงจาก PC)
PC → Action Command → Send to ESP32


### ความแตกต่างจาก Pi 5 Version

| Item                    | PC Version                  | Pi 5 Version (Final)       |
|-------------------------|-----------------------------|----------------------------|
| Hardware                | Laptop/Desktop              | Raspberry Pi 5             |
| Portability             | ต่ำ (ต้องใช้ PC)            | สูง (embedded)             |
| Power Consumption       | สูง                         | ต่ำ                        |
| Debugging               | ง่ายมาก                     | ปานกลาง                    |
| Deployment              | Run script manually         | Systemd service            |
| Audio Output            | สามารถเล่นจาก PC Speaker    | ต้องส่งไป ESP32 เท่านั้น   |

## วิธีใช้งาน PC Version

1. **รัน robot-brain** บน PC (Python หรือ Node.js)
2. เชื่อมต่อ ESP32 ผ่าน USB Serial (COM port)
3. รัน Backend API
4. ทดสอบการสนทนาแบบ end-to-end

### ข้อจำกัดที่ควรรู้
- PC ต้องเปิดค้าง (ไม่สะดวกเท่า Pi)
- Latency อาจต่ำกว่าเล็กน้อย
- ไม่เหมาะสำหรับ demo กับลูกค้า (เว้นแต่ซ่อน PC ไว้)
- ใช้สำหรับพัฒนาและทดสอบเท่านั้น

## Migration Plan (เมื่อมี Pi 5)

1. Clone repo `robot-brain` ไปใส่ Pi 5
2. ติดตั้ง dependencies เหมือนบน PC
3. ปรับ Serial port (`/dev/serial0`)
4. รันเป็น service ด้วย `systemd`
5. Test การเชื่อมต่อกับ ESP32 อีกครั้ง

## Development Tips สำหรับ PC Stage
- ใช้ VS Code + PlatformIO สำหรับ ESP32
- รัน Backend ด้วย Bun
- ใช้ `screen` หรือ `tmux` เพื่อรัน robot-brain ค้าง
- Log ทุกอย่างให้ละเอียดเพื่อ debug

---

**ใช้ PC Version นี้จนกว่าจะได้ Pi 5 จริง**  
เมื่อพร้อมค่อย migrate ไปยัง D1-Model เต็มรูปแบบ


---

**อ่านเสร็จแล้วอยากปรับอะไรไหมครับ?**  
เช่น เพิ่มรายละเอียดการตั้งค่า Serial บน Windows, เพิ่มตัวอย่าง command ที่ใช้รัน, หรือใส่ diagram เพิ่มเติม เป็นต้น

บอกมาได้เลย!