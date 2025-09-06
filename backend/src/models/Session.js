import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    device: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: "Unknown"
    },
    userAgent: {
      type: String,
      required: true
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1 });
sessionSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model("Session", sessionSchema);