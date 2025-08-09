# 💬 Real-Time Chat App

A full-stack real-time chat application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.io** for instant messaging.  
Supports **1-on-1 chat, group chat, file sharing, and video calls** via WebRTC.

## 🚀 Features
- 🔐 **User Authentication** (JWT-based)
- 💬 **1-on-1 and Group Chats**
- 📂 **File & Image Sharing** (Cloudinary Integration)
- 📡 **Real-Time Messaging** with Socket.io
- 📞 **Video & Audio Calls** via WebRTC
- 🟢 **Online/Offline Status**
- 🔔 **Push Notifications**
- 🎨 **Responsive UI** (Tailwind CSS)


## 🛠️ Tech Stack
**Frontend:**
- React.js
- Tailwind CSS
- Socket.io-client
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- JSON Web Tokens (JWT)
- Multer (for file uploads)

**Other:**
- Cloudinary (Media Storage)
- WebRTC (Video Calls)


## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/siyamregn777/Real-Time-Chat-App.git
cd chat-app
````

2. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `server` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run the app**

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

---

## 📸 Screenshots

<!-- ![Chat App Screenshot](https://via.placeholder.com/800x400) -->

---

## 🗂 Folder Structure

```
chat-app/
│
├── backend/              # Backend (Express + MongoDB + Socket.io)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── controllers/     # Route handlers
│   ├── config/          # DB & cloudinary config
│   ├── server.js        # Entry point
│
├── frontend/              # Frontend (React)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Pages
│   │   ├── context/     # Context API
│   │   ├── App.js
│   │   └── index.js
│
└── README.md
```

---

## 📜 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## ✨ Author

**Your Name** – [GitHub](https://github.com/siyamregn777)
```

---

If you want, I can **also prepare badges, live demo links, and a GIF preview** so this README looks **GitHub-trending ready**.  
Do you want me to make that upgraded version?
```
