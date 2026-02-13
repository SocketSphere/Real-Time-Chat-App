import mongoose from "mongoose";

const notificationSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    messages: {
      type: Boolean,
      default: true
    },
    groups: {
      type: Boolean,
      default: true
    },
    calls: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    soundType: {
      type: String,
      default: "default"
    },
    vibration: {
      type: Boolean,
      default: true
    },
    preview: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// notificationSettingsSchema.index({ userId: 1 });

export default mongoose.model("NotificationSettings", notificationSettingsSchema);