// backend/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  type: { 
    type: String, 
    enum: ["message", "group_message", "contact_request", "group_invite", "system"],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  metadata: { type: Object, default: {} }, // Additional data like content preview, etc.
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of related entity (message, group, etc.)
  relatedModel: { type: String }, // Model name of related entity
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);