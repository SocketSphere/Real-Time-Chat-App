import express from "express";
import {
  exportUserData,
  clearUserData,
  getStorageStats
} from "../controllers/dataController.js";

const router = express.Router();

// Middleware to verify authentication
const authenticate = (req, res, next) => {
  // Add your authentication logic here
  next();
};

router.get("/:userId/export", authenticate, exportUserData);
router.delete("/:userId/clear", authenticate, clearUserData);
router.get("/:userId/stats", authenticate, getStorageStats);

export default router;