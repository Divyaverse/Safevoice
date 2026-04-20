🛡️ SafeVoice – Anonymous Complaint System (AWS Powered)
📌 Overview
SafeVoice is a web application that allows students to submit complaints anonymously with optional file uploads. The system ensures privacy while securely storing data using AWS cloud services.

🚀 Features
1. Anonymous complaint submission (no login required)
2. Optional file upload (image/PDF)
3. Secure cloud storage using AWS S3
4. Unique complaint ID for tracking
5. Admin dashboard to manage complaints


 How It Works
1. User submits complaint from frontend
2. Backend receives data using Express
3. Multer processes uploaded file (if any)
4. File is uploaded to AWS S3
5. S3 returns file URL + object key
6. Backend generates unique complaint ID
7. Response sent back to frontend

---

☁️ AWS Services Used
🔹 Amazon S3
- Stores uploaded files securely
- Provides file URL and object key
- Scalable cloud storage
  

🔹 IAM (Identity & Access Management)
- Created IAM user for backend access
- Used Access Key & Secret Key in ".env"
- Controls permission to upload/read files from S3

---

⚙️ Setup (Run Locally)
1. Clone Repo
git clone https://github.com/your-username/safevoice.git
cd safevoice/Backend

2.Run frotend folder:
npm install
npm run dev

3. Install Dependencies(for backend)
npm install express aws-sdk multer dotenv uuid cors

4. Create ".env"
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket
PORT=5000

5. Run Server
node server.js

---

📡 API Endpoints
- "POST /api/upload" → Upload file to S3
- "POST /api/complaint" → Submit complaint

---

 Use Cases
- College complaint system
- Anonymous reporting platform
- Feedback system

---

🏆 Highlights
- AWS S3 integration (real-time upload)
- IAM-based secure access
- Modular backend architecture
- Real-world problem solving

---

 Author
Divya Tiwari
