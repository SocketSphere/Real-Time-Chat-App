import mongoose from "mongoose";

const securitySettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: ""
    },
    loginAlerts: {
      type: Boolean,
      default: true
    },
    sessionTimeout: {
      type: Number,
      default: 30
    }
  },
  { timestamps: true }
);

securitySettingsSchema.index({ userId: 1 });

export default mongoose.model("SecuritySettings", securitySettingsSchema);