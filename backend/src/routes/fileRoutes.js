import express from "express";
import multer from "multer";
import {
  uploadFile,
  getFiles,
  downloadFile,
  createFolder,
  deleteItem,
  searchFiles
} from "../controllers/fileController.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  }
});

// Routes
router.get("/", getFiles);
router.get("/search", searchFiles);
router.get("/download/:id", downloadFile);
router.post("/upload", upload.single('file'), uploadFile);
router.post("/folder", createFolder);
router.delete("/:id", deleteItem);

export default router;