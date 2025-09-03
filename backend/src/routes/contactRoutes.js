import express from "express";
import { getContacts, addContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/:userId", getContacts);   // Get contacts of a user
router.post("/add", addContact);          // Add a new contact

export default router;
