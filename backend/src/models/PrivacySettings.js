import mongoose from "mongoose";

const privacySettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    onlineStatus: {
      type: Boolean,
      default: true
    },
    readReceipts: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ["everyone", "contacts", "nobody"],
      default: "contacts"
    },
    lastSeen: {
      type: Boolean,
      default: true
    },
    profilePhoto: {
      type: String,
      enum: ["everyone", "contacts", "nobody"],
      default: "everyone"
    },
    blockedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  { timestamps: true }
);

privacySettingsSchema.index({ userId: 1 });

export default mongoose.model("PrivacySettings", privacySettingsSchema);