// backend/controllers/notificationController.js
import Notification from "../models/Notification.js";
import mongoose from "mongoose"; 
// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "firstName lastName profileImage")
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Get unread notification count for a user
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    const count = await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });
    
    res.json({ count });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notificationId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(notificationId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// Clear all notifications for a user
export const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    await Notification.deleteMany({ recipient: userId });
    
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    console.error("Error clearing notifications:", err);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};

// Create a new notification (helper function)
export const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  metadata = {},
  relatedId = null,
  relatedModel = null
}) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      metadata,
      relatedId,
      relatedModel
    });
    
    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
};