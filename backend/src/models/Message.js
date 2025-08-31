import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // for private chat
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },   // for group chat
    content: { type: String, required: true },
    attachments: [{ type: String }], // array of file URLs
    status: { 
      type: String, 
      enum: ["sent", "delivered", "read"], 
      default: "sent" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
