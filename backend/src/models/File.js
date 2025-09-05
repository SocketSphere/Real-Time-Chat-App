import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

fileSchema.index({ uploadedBy: 1, folder: 1 });
fileSchema.index({ name: 'text' });

export default mongoose.model("File", fileSchema);