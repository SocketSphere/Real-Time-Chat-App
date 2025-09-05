import File from "../models/File.js";
import Folder from "../models/Folder.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId, folderId } = req.body;

    const file = new File({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: userId,
      folder: folderId || null
    });

    await file.save();
    await file.populate('uploadedBy', 'firstName lastName');

    res.status(201).json(file);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// Get files and folders
export const getFiles = async (req, res) => {
  try {
    const { userId, folderId } = req.query;

    const files = await File.find({
      uploadedBy: userId,
      folder: folderId || null
    }).populate('uploadedBy', 'firstName lastName');

    const folders = await Folder.find({
      createdBy: userId,
      parentFolder: folderId || null
    });

    res.json({ files, folders });
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

// Download file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', file.type);

    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
};

// Create folder
export const createFolder = async (req, res) => {
  try {
    const { name, userId, parentFolder } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "Name and userId are required" });
    }

    const folder = new Folder({
      name,
      createdBy: userId,
      parentFolder: parentFolder || null
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ error: "Failed to create folder" });
  }
};

// Delete file or folder
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    if (type === 'file') {
      const file = await File.findById(id);
      
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      await File.findByIdAndDelete(id);
    } else if (type === 'folder') {
      // Delete all files in folder first
      const files = await File.find({ folder: id });
      for (const file of files) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        await File.findByIdAndDelete(file._id);
      }

      await Folder.findByIdAndDelete(id);
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};

// Search files
export const searchFiles = async (req, res) => {
  try {
    const { userId, query } = req.query;

    const files = await File.find({
      uploadedBy: userId,
      $text: { $search: query }
    }).populate('uploadedBy', 'firstName lastName');

    const folders = await Folder.find({
      createdBy: userId,
      $text: { $search: query }
    });

    res.json({ files, folders });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search files" });
  }
};