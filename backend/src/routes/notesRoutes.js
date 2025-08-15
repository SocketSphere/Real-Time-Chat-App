import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";

const router = express.Router();

// Get all notes
router.get("/", getAllNotes);

// Get a single note by ID
router.get("/:id", getNoteById);

// Create a new note
router.post("/", createNote);

// Update a note by ID
router.put("/:id", updateNote);

// Delete a note by ID
router.delete("/:id", deleteNote);

export default router;
