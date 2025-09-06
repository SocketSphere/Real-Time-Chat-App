import Appearance from "../models/Appearance.js";
import mongoose from "mongoose";

// Get appearance settings
export const getAppearanceSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let appearance = await Appearance.findOne({ userId });

    if (!appearance) {
      appearance = new Appearance({ userId });
      await appearance.save();
    }

    res.json(appearance);
  } catch (err) {
    console.error("Error fetching appearance settings:", err);
    res.status(500).json({ error: "Failed to fetch appearance settings" });
  }
};

// Update appearance settings
export const updateAppearanceSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const allowedFields = [
      "theme", "language", "fontSize", "messageBubbleStyle", 
      "chatBackground", "accentColor", "reduceAnimations", "highContrast"
    ];
    
    const invalidFields = Object.keys(updates).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        error: `Invalid fields: ${invalidFields.join(", ")}` 
      });
    }

    const appearance = await Appearance.findOneAndUpdate(
      { userId },
      updates,
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );

    res.json({
      message: "Appearance settings updated successfully",
      appearance
    });
  } catch (err) {
    console.error("Error updating appearance settings:", err);
    
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ error: errors.join(", ") });
    }
    
    res.status(500).json({ error: "Failed to update appearance settings" });
  }
};

// Reset appearance settings
export const resetAppearanceSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const defaultSettings = {
      theme: "light",
      language: "english",
      fontSize: "medium",
      messageBubbleStyle: "default",
      chatBackground: "",
      accentColor: "#3B82F6",
      reduceAnimations: false,
      highContrast: false
    };

    const appearance = await Appearance.findOneAndUpdate(
      { userId },
      defaultSettings,
      { new: true, upsert: true }
    );

    res.json({
      message: "Appearance settings reset to default",
      appearance
    });
  } catch (err) {
    console.error("Error resetting appearance settings:", err);
    res.status(500).json({ error: "Failed to reset appearance settings" });
  }
};