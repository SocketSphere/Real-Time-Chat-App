import express from "express";
import {
  getNotificationSettings,
  updateNotificationSettings
} from "../controllers/notificationsController.js";

const router = express.Router();

// Middleware to verify authentication
const authenticate = (req, res, next) => {
  // Add your authentication logic here
  next();
};

router.get("/:userId", authenticate, getNotificationSettings);
router.put("/:userId", authenticate, updateNotificationSettings);

export default router;