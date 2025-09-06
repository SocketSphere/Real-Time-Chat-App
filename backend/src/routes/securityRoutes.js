import express from "express";
import {
  getSecuritySettings,
  toggleTwoFactorAuth,
  verifyTwoFactorToken,
  terminateSession,
  terminateAllSessions
} from "../controllers/securityController.js";

const router = express.Router();

// Middleware to verify authentication
const authenticate = (req, res, next) => {
  // Add your authentication logic here
  next();
};

router.get("/:userId", authenticate, getSecuritySettings);
router.put("/:userId/two-factor", authenticate, toggleTwoFactorAuth);
router.post("/:userId/verify-token", authenticate, verifyTwoFactorToken);
router.delete("/:userId/sessions/:sessionId", authenticate, terminateSession);
router.delete("/:userId/sessions", authenticate, terminateAllSessions);

export default router;