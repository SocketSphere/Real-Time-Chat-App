import express from "express";
import { getContacts, addContact,removeContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/:userId", getContacts);   // Get contacts of a user
router.post("/add", addContact);          // Add a new contact
router.delete("/delete", removeContact);   // Remove a contact

export default router;
