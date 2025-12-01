// backend/src/server.js
import path from "path";
import connectDB from "./config/db.js";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import appearanceRoutes from "./routes/appearanceRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import privacyRoutes from "./routes/privacyRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
// import webSocketManager from "./websocket.js";

dotenv.config();

const app = express();

// 🔥 UPDATED CORS CONFIGURATION
app.use(cors({
  origin: [
    'http://127.0.0.1:5176', // Your frontend
    'http://localhost:5176',  // Alternative frontend URL
    'https://checkout.chapa.co', // Chapa checkout domain
    'https://api.chapa.co', // Chapa API domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket with the HTTP server
// webSocketManager.initialize(server);

// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/files", fileRoutes);
app.use("/api/appearance", appearanceRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/privacy", privacyRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/payments", paymentRoutes);

// Special route for Chapa callback (JSONP support)
app.get("/api/payments/verify", (req, res, next) => {
  // Set CORS headers specifically for this route
  res.header('Access-Control-Allow-Origin', 'https://checkout.chapa.co');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
      console.log("✅ CORS configured for Chapa");
    });
  })
  .catch(err => console.log(err));