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
// ADD THIS IMPORT
import paymentRoutes from "./routes/paymentRoutes.js"; // Add this line
import webSocketManager from "./websocket.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket with the HTTP server
webSocketManager.initialize(server);

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
// ADD THIS ROUTE
app.use("/api/payments", paymentRoutes); // Add this line

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
    });
  })
  .catch(err => console.log(err));