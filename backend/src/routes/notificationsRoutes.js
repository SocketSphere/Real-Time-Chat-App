// backend/routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} from "../controllers/notificationsController.js";

const router = express.Router();

// Get all notifications for a user
router.get("/:userId", getNotifications);

// Get unread notification count
router.get("/:userId/unread", getUnreadCount);

// Mark a notification as read
router.put("/:userId/read", markAsRead);

// Mark all notifications as read
router.put("/:userId/read-all", markAllAsRead);

// Delete a notification
router.delete("/:notificationId", deleteNotification);

// Clear all notifications for a user
router.delete("/:userId/clear", clearAllNotifications);

export default router;