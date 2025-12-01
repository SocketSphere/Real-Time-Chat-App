import Message from "../models/Message.js";

// backend/controllers/messageController.js
import { createNotification } from "./notificationsController.js";

// backend/controllers/messageController.js
import webSocketManager from '../websocket.js';

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, group, content } = req.body;
    
    // Validation (existing code...)
    if (!sender || !content) {
      return res.status(400).json({ msg: "Sender and content are required" });
    }
    if (!receiver && !group) {
      return res.status(400).json({ msg: "Provide either receiver or group" });
    }
    
    // Create message (existing code...)
    const message = new Message({
      sender,
      content,
      receiver: receiver || null,
      group: group || null,
    });
    await message.save();
    
    // Populate message (existing code...)
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "firstName lastName")
      .populate("receiver", "firstName lastName")
      .populate("group", "name");
    
    // 🔥 NEW: Broadcast via WebSocket
    if (receiver) {
      // For direct messages
      webSocketManager.sendNotification(receiver, {
        type: 'new_message',
        data: populatedMessage.toObject()
      });
      
      // Alternatively, use a dedicated method:
      webSocketManager.sendMessageToUser(receiver, {
        type: 'new_message',
        message: populatedMessage.toObject()
      });
    }
    
    // Notifications (existing code...)
    if (receiver) {
      await createNotification({
        recipient: receiver,
        sender: sender,
        type: "message",
        title: "New Message",
        message: `You have a new message`,
        metadata: {
          content: content.substring(0, 50) + (content.length > 50 ? "..." : "")
        },
        relatedId: message._id,
        relatedModel: "Message"
      });
    }
    
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages
export const getMessages = async (req, res) => {
  try {
    const { groupId, userId, senderId } = req.query;

    let filter = {};

    if (groupId) {
      filter.group = groupId; // messages in a group
    } else if (userId && senderId) {
      // one-to-one chat between sender and receiver
      filter.$or = [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId },
      ];
    }

    const messages = await Message.find(filter)
      .populate("sender", "username")
      .populate("receiver", "username")
      .populate("group", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
