import express from "express";
import {
  getAppearanceSettings,
  updateAppearanceSettings,
  resetAppearanceSettings
} from "../controllers/appearanceController.js";

const router = express.Router();

// Middleware to verify authentication
const authenticate = (req, res, next) => {
  // Add your authentication logic here
  next();
};

router.get("/:userId", authenticate, getAppearanceSettings);
router.put("/:userId", authenticate, updateAppearanceSettings);
router.delete("/:userId/reset", authenticate, resetAppearanceSettings);

export default router;