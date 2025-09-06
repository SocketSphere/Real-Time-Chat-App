import PrivacySettings from "../models/PrivacySettings.js";
import mongoose from "mongoose";

// Get privacy settings
export const getPrivacySettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let settings = await PrivacySettings.findOne({ userId }).populate("blockedUsers", "firstName lastName loginId");

    if (!settings) {
      settings = new PrivacySettings({ userId });
      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    console.error("Error fetching privacy settings:", err);
    res.status(500).json({ error: "Failed to fetch privacy settings" });
  }
};

// Update privacy settings
export const updatePrivacySettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const allowedFields = [
      "onlineStatus", "readReceipts", "profileVisibility", 
      "lastSeen", "profilePhoto"
    ];
    
    const invalidFields = Object.keys(updates).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        error: `Invalid fields: ${invalidFields.join(", ")}` 
      });
    }

    const settings = await PrivacySettings.findOneAndUpdate(
      { userId },
      updates,
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );

    res.json({
      message: "Privacy settings updated successfully",
      settings
    });
  } catch (err) {
    console.error("Error updating privacy settings:", err);
    
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ error: errors.join(", ") });
    }
    
    res.status(500).json({ error: "Failed to update privacy settings" });
  }
};

// Block user
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { blockedUserId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(blockedUserId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const settings = await PrivacySettings.findOneAndUpdate(
      { userId },
      { $addToSet: { blockedUsers: blockedUserId } },
      { new: true, upsert: true }
    );

    res.json({
      message: "User blocked successfully",
      settings
    });
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ error: "Failed to block user" });
  }
};

// Unblock user
export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { blockedUserId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(blockedUserId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const settings = await PrivacySettings.findOneAndUpdate(
      { userId },
      { $pull: { blockedUsers: blockedUserId } },
      { new: true }
    );

    res.json({
      message: "User unblocked successfully",
      settings
    });
  } catch (err) {
    console.error("Error unblocking user:", err);
    res.status(500).json({ error: "Failed to unblock user" });
  }
};