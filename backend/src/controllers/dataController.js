import User from "../models/User.js";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";
import archiver from "archiver";
import { promises as fs } from "fs";
import path from "path";

// Export user data
export const exportUserData = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Get user data
    const user = await User.findById(userId).select('-password');
    const groups = await Group.find({ 
      $or: [{ owner: userId }, { members: userId }] 
    }).populate('owner', 'firstName lastName').populate('members', 'firstName lastName');
    
    const messages = await Message.find({ 
      $or: [{ sender: userId }, { recipients: userId }] 
    }).populate('sender', 'firstName lastName').populate('recipients', 'firstName lastName').sort({ createdAt: -1 }).limit(1000);

    // Create data object
    const userData = {
      user: user.toObject(),
      groups: groups.map(group => group.toObject()),
      messages: messages.map(message => message.toObject()),
      exportDate: new Date().toISOString()
    };

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}-${Date.now()}.zip"`);

    // Create zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create archive' });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add JSON data to archive
    archive.append(JSON.stringify(userData, null, 2), { name: 'user-data.json' });

    // Finalize archive
    await archive.finalize();

  } catch (err) {
    console.error("Error exporting user data:", err);
    res.status(500).json({ error: "Failed to export user data" });
  }
};

// Clear user data
export const clearUserData = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Delete user messages
    await Message.deleteMany({ sender: userId });
    
    // Remove user from groups (but don't delete groups they own)
    await Group.updateMany(
      { members: userId, owner: { $ne: userId } },
      { $pull: { members: userId } }
    );

    // Note: We don't delete the user account itself, just their data
    // You might want to add more data clearing logic here

    res.json({ 
      message: "User data cleared successfully",
      cleared: {
        messages: true,
        groupMemberships: true
      }
    });
  } catch (err) {
    console.error("Error clearing user data:", err);
    res.status(500).json({ error: "Failed to clear user data" });
  }
};

// Get storage statistics
export const getStorageStats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Count user messages
    const messageCount = await Message.countDocuments({ sender: userId });
    
    // Estimate storage usage (this is a simplified calculation)
    const storageStats = {
      messages: {
        count: messageCount,
        estimatedSize: messageCount * 0.5 // 0.5KB per message estimate
      },
      media: {
        count: 0, // You would need to implement media tracking
        estimatedSize: 0
      },
      totalEstimatedSize: messageCount * 0.5
    };

    res.json(storageStats);
  } catch (err) {
    console.error("Error getting storage stats:", err);
    res.status(500).json({ error: "Failed to get storage statistics" });
  }
};