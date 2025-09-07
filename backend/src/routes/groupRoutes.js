import express from "express";
import { createGroup, getGroups,joinGroup,deleteGroups,leaveGroup,getGroupById } from "../controllers/groupController.js";

const router = express.Router();

router.post("/create", createGroup);
router.post("/join",joinGroup);
router.get("/", getGroups);
router.post("/leave", leaveGroup); 
router.delete("/delete", deleteGroups);
router.get("/:id", getGroupById);

export default router;

