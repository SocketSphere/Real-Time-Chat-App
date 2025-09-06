import mongoose from "mongoose";

const appearanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    theme: {
      type: String,
      enum: ["light", "dark", "auto"],
      default: "light"
    },
    language: {
      type: String,
      default: "english"
    },
    fontSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium"
    },
    messageBubbleStyle: {
      type: String,
      enum: ["default", "minimal", "rounded"],
      default: "default"
    },
    chatBackground: {
      type: String,
      default: ""
    },
    accentColor: {
      type: String,
      default: "#3B82F6"
    },
    reduceAnimations: {
      type: Boolean,
      default: false
    },
    highContrast: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

appearanceSchema.index({ userId: 1 });

export default mongoose.model("Appearance", appearanceSchema);