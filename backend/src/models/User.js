import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true }, 
    loginId: { type: String, required: true, unique: true, trim: true }, // email or username
    password:{ type: String, required: true },
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["online", "offline", "away"], 
      default: "offline" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
