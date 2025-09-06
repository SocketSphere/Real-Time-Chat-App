import express from "express";
import {
  getPrivacySettings,
  updatePrivacySettings,
  blockUser,
  unblockUser
} from "../controllers/privacyController.js";

const router = express.Router();

// Middleware to verify authentication
const authenticate = (req, res, next) => {
  // Add your authentication logic here
  next();
};

router.get("/:userId", authenticate, getPrivacySettings);
router.put("/:userId", authenticate, updatePrivacySettings);
router.post("/:userId/block", authenticate, blockUser);
router.post("/:userId/unblock", authenticate, unblockUser);

export default router;