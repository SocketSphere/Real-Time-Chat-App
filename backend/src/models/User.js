import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true }, 
    loginId: { type: String, required: true, unique: true, trim: true }, 
    password:{ type: String, required: true },
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    status: { 
      type: String, 
      enum: ["online", "offline", "away"], 
      default: "offline" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
