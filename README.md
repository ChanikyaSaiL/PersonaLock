# PersonaLock 🛡️

A full-stack, consent-driven biometric authentication system designed to enhance traditional login mechanisms using facial and voice-based identity verification.

PersonaLock bridges the gap between conventional password-based authentication and biometric validation to create a secure, scalable, and fully user-consent-driven platform. The system natively enforces consent protocols before securely capturing, encrypting, and uploading facial imagery and voice samples to cloud storage.

### ✨ Key Features
* **Consent-Driven Architecture:** Explicit user consent is legally tracked and gated before any biometric data collection begins. 
* **Multimodal Biometric Collection:** Custom React wizards that dynamically record **5 standardized face angles** and **10 precise voice samples** via native browser `MediaRecorder` APIs.
* **Premium Dynamic UI:** A stunning, fully animated glassmorphic frontend utilizing deep-violet glowing gradients, Framer Motion transitions, and responsive Tailwind CSS v4 styling.
* **Robust Security:** Full backend parsing featuring `bcryptjs` password hashing and `jsonwebtoken` (JWT) authenticated login routes.
* **Cloud Storage:** Direct integration with Cloudinary mapping for secure, remote asset hosting. 

---

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS v4, Framer Motion, Lucide-React, Axios
* **Backend:** Node.js, Express.js, MongoDB + Mongoose
* **Storage & Security:** Cloudinary, Multer, Bcrypt, JWT (JSON Web Tokens)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v20+ recommended)
* MongoDB (Local or Atlas URI)
* Cloudinary Account (for storage secrets)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and populate it:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/` to interact with the UI.

---

## 📜 Legal & Research
This system ensures that biometric data is collected strictly for research and identity modeling purposes only after explicit User Agreement toggles have been validated on the server side. Data is stored safely using modern cloud architecture.
