import NotificationSettings from "../models/NotificationSettings.js";
import mongoose from "mongoose";

// Get notification settings
export const getNotificationSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let settings = await NotificationSettings.findOne({ userId });

    if (!settings) {
      settings = new NotificationSettings({ userId });
      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    console.error("Error fetching notification settings:", err);
    res.status(500).json({ error: "Failed to fetch notification settings" });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const allowedFields = [
      "messages", "groups", "calls", "email", 
      "soundEnabled", "soundType", "vibration", "preview"
    ];
    
    const invalidFields = Object.keys(updates).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        error: `Invalid fields: ${invalidFields.join(", ")}` 
      });
    }

    const settings = await NotificationSettings.findOneAndUpdate(
      { userId },
      updates,
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );

    res.json({
      message: "Notification settings updated successfully",
      settings
    });
  } catch (err) {
    console.error("Error updating notification settings:", err);
    
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ error: errors.join(", ") });
    }
    
    res.status(500).json({ error: "Failed to update notification settings" });
  }
};