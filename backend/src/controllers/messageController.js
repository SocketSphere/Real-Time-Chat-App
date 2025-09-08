import Message from "../models/Message.js";

// backend/controllers/messageController.js
import { createNotification } from "./notificationsController.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, group, content } = req.body;
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
    
    // Populate sender and receiver/group
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "firstName lastName")
      .populate("receiver", "firstName lastName")
      .populate("group", "name");
    
    // Create notification for the receiver (direct message)
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
    
    // Create notifications for all group members (group message)
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
