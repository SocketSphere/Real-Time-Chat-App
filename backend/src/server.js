import path from "path";
import { fileURLToPath } from 'url';
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
import webSocketManager from "./websocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory (backend folder)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Verify that MONGO_URI is loaded
console.log('✅ Environment loaded');
console.log('🔍 MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('🔍 PORT:', process.env.PORT);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

const app = express();

// 🔥 UPDATED CORS CONFIGURATION FOR PRODUCTION
const allowedOrigins = [
  'http://127.0.0.1:5176', // Local dev
  'http://localhost:5176', // Local dev alternative
  'https://chat-backend-edzq.onrender.com',
  'https://chatmaster-omld.onrender.com', // Your current frontend
  'https://checkout.chapa.co', // Chapa checkout
  'https://api.chapa.co', // Chapa API
  /\.onrender\.com$/, // Allows ALL Render domains
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    })) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests - KEEP ONLY ONE
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket with the HTTP server
webSocketManager.initialize(server);

// ========== ADD HEALTH ENDPOINTS HERE ==========

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'chat-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    connectedWebSocketClients: webSocketManager.clients.size
  });
});

// WebSocket health endpoint
app.get('/ws-health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'websocket',
    timestamp: new Date().toISOString(),
    connectedClients: webSocketManager.clients.size,
    endpoint: '/ws'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    message: 'Chat App API is running',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/*',
      users: '/api/users/*',
      messages: '/api/messages/*',
      groups: '/api/groups/*',
      files: '/api/files/*',
      health: '/health',
      wsHealth: '/ws-health'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Chat App Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    frontend: process.env.FRONTEND_URL || 'Not configured',
    endpoints: {
      health: '/health',
      api: '/api/*',
      websocket: 'ws://' + req.get('host') + '/ws',
      documentation: 'Check /api/status for details'
    },
    timestamp: new Date().toISOString()
  });
});

// ========== END OF HEALTH ENDPOINTS ==========

// Routes (these remain the same)
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

// Special route for Chapa callback
app.get("/api/payments/verify", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://checkout.chapa.co');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    // ADD '0.0.0.0' for Docker/Render compatibility
    server.listen(PORT, '0.0.0.0', () => {
      console.log("🚀 Server started on PORT:", PORT);
      console.log("✅ CORS configured for production");
      console.log("🌐 Frontend URL:", process.env.FRONTEND_URL || 'Not set');
      console.log("🔌 WebSocket available at: ws://localhost:" + PORT + "/ws");
    });
  })
  .catch(err => console.log(err));