import Message from "../models/Message.js";
import { createNotification } from "./notificationsController.js";
import Group from "../models/Group.js"; // Add this import
import webSocketManager from '../websocket.js';

// Send a message - UPDATED WITH PROPER WEBSOCKET BROADCAST
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, group, content } = req.body;
    
    // Add detailed logging
    console.log('📨 SEND MESSAGE REQUEST:', { sender, receiver, content });
    
    // Validation
    if (!sender || !content) {
      return res.status(400).json({ msg: "Sender and content are required" });
    }
    if (!receiver && !group) {
      return res.status(400).json({ msg: "Provide either receiver or group" });
    }
    
    // Create message
    const message = new Message({
      sender,
      content,
      receiver: receiver || null,
      group: group || null,
    });
    await message.save();
    
    console.log('✅ Message saved to DB:', message._id);
    
    // Populate message
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "firstName lastName _id")
      .populate("receiver", "firstName lastName _id")
      .populate("group", "name");
    
    console.log('📦 Populated message:', {
      id: populatedMessage._id,
      senderId: populatedMessage.sender?._id,
      receiverId: populatedMessage.receiver?._id,
      content: populatedMessage.content
    });
    
    // 🔥 CRITICAL: Broadcast via WebSocket
    if (receiver) {
      console.log('🔌 Broadcasting to receiver:', receiver);
      
      // Convert to plain object for WebSocket
      const messageData = {
        _id: populatedMessage._id,
        sender: {
          _id: populatedMessage.sender._id,
          firstName: populatedMessage.sender.firstName,
          lastName: populatedMessage.sender.lastName
        },
        receiver: populatedMessage.receiver ? {
          _id: populatedMessage.receiver._id,
          firstName: populatedMessage.receiver.firstName,
          lastName: populatedMessage.receiver.lastName
        } : null,
        content: populatedMessage.content,
        createdAt: populatedMessage.createdAt,
        status: 'delivered'
      };
      
      console.log('📤 WebSocket payload:', {
        receiverId: receiver,
        messageType: 'new_message'
      });
      
      // Send to receiver
      const sentToReceiver = webSocketManager.sendMessageToUser(receiver, {
        type: 'new_message',
        data: messageData
      });
      
      console.log('📡 WebSocket send result to receiver:', sentToReceiver ? '✅ Success' : '❌ Failed');
      
      // Also send to sender (for delivery confirmation)
      const sentToSender = webSocketManager.sendMessageToUser(sender, {
        type: 'message_sent',
        data: {
          _id: message._id,
          status: 'delivered'
        }
      });
      
      console.log('📡 WebSocket send result to sender:', sentToSender ? '✅ Success' : '❌ Failed');
      
      // Also try sendNotification method for compatibility
      webSocketManager.sendNotification(receiver, {
        type: 'new_message',
        data: messageData
      });
    }
    
    // Create notification for the receiver
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
    
    // Create notifications for group members (group message)
    if (group) {
      // Get group details to get all members
      const groupDetails = await Group.findById(group).populate("members", "_id");
      const memberIds = groupDetails.members.map(m => m._id.toString());
      
      // Create notification for each member except the sender
      for (const memberId of memberIds) {
        if (memberId !== sender) {
          await createNotification({
            recipient: memberId,
            sender: sender,
            type: "group_message",
            title: "New Group Message",
            message: `New message in ${groupDetails.name}`,
            metadata: {
              groupName: groupDetails.name,
              content: content.substring(0, 50) + (content.length > 50 ? "..." : "")
            },
            relatedId: message._id,
            relatedModel: "Message"
          });
        }
      }
    }
    
    console.log('✅ Message processing complete');
    res.status(201).json(populatedMessage);
    
  } catch (err) {
    console.error('💥 sendMessage error:', err);
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
      .populate("sender", "username firstName lastName _id")
      .populate("receiver", "username firstName lastName _id")
      .populate("group", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};