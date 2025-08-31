// src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    const conn = await mongoose.connect(process.env.MONGO_URI
, {
      // Add these options for better connection handling
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.error("💡 Connection string used:", process.env.MONGO_URI?.replace(/:[^:]*@/, ':****@')); // Mask password
    process.exit(1);
  }
};

export default connectDB;