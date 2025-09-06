import SecuritySettings from "../models/SecuritySettings.js";
import Session from "../models/Session.js";
import mongoose from "mongoose";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

// Get security settings
export const getSecuritySettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let settings = await SecuritySettings.findOne({ userId });

    if (!settings) {
      settings = new SecuritySettings({ userId });
      await settings.save();
    }

    // Get active sessions
    const activeSessions = await Session.find({ 
      userId, 
      isActive: true 
    }).sort({ lastActive: -1 });

    res.json({
      ...settings.toObject(),
      activeSessions
    });
  } catch (err) {
    console.error("Error fetching security settings:", err);
    res.status(500).json({ error: "Failed to fetch security settings" });
  }
};

// Toggle two-factor authentication
export const toggleTwoFactorAuth = async (req, res) => {
  try {
    const { userId } = req.params;
    const { enabled } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let settings = await SecuritySettings.findOne({ userId });

    if (!settings) {
      settings = new SecuritySettings({ userId });
    }

    if (enabled && !settings.twoFactorEnabled) {
      // Generate new secret if enabling 2FA
      const secret = speakeasy.generateSecret({
        name: `ChatApp (${userId})`
      });

      settings.twoFactorEnabled = true;
      settings.twoFactorSecret = secret.base32;

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      await settings.save();

      return res.json({
        message: "Two-factor authentication enabled",
        qrCodeUrl,
        secret: secret.base32,
        settings
      });
    } else if (!enabled && settings.twoFactorEnabled) {
      // Disable 2FA
      settings.twoFactorEnabled = false;
      settings.twoFactorSecret = "";

      await settings.save();

      return res.json({
        message: "Two-factor authentication disabled",
        settings
      });
    }

    res.json({
      message: "No changes made",
      settings
    });
  } catch (err) {
    console.error("Error toggling two-factor auth:", err);
    res.status(500).json({ error: "Failed to toggle two-factor authentication" });
  }
};

// Verify two-factor token
export const verifyTwoFactorToken = async (req, res) => {
  try {
    const { userId } = req.params;
    const { token } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const settings = await SecuritySettings.findOne({ userId });

    if (!settings || !settings.twoFactorEnabled) {
      return res.status(400).json({ error: "Two-factor authentication not enabled" });
    }

    const verified = speakeasy.totp.verify({
      secret: settings.twoFactorSecret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      res.json({ 
        message: "Token verified successfully",
        verified: true 
      });
    } else {
      res.status(400).json({ 
        error: "Invalid token",
        verified: false 
      });
    }
  } catch (err) {
    console.error("Error verifying two-factor token:", err);
    res.status(500).json({ error: "Failed to verify token" });
  }
};

// Terminate session
export const terminateSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid user ID or session ID" });
    }

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId },
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ 
      message: "Session terminated successfully",
      session 
    });
  } catch (err) {
    console.error("Error terminating session:", err);
    res.status(500).json({ error: "Failed to terminate session" });
  }
};

// Terminate all sessions
export const terminateAllSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await Session.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );

    res.json({ 
      message: "All sessions terminated successfully",
      terminatedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error("Error terminating all sessions:", err);
    res.status(500).json({ error: "Failed to terminate sessions" });
  }
};