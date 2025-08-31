import express from "express";
import { createGroup, getGroups, getGroup } from "../controllers/groupController.js";

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/groups/:id", getGroup); 

export default router;
