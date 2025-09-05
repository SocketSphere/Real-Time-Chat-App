import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null
    }
  },
  { 
    timestamps: true 
  }
);

folderSchema.virtual('fileCount', {
  ref: 'File',
  localField: '_id',
  foreignField: 'folder',
  count: true
});

folderSchema.index({ createdBy: 1, parentFolder: 1 });
folderSchema.index({ name: 'text' });

export default mongoose.model("Folder", folderSchema);