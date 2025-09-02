import express from "express";
import { createGroup, getGroups,joinGroup } from "../controllers/groupController.js";

const router = express.Router();

router.post("/create", createGroup);
router.post("/join",joinGroup);
router.get("/", getGroups);

export default router;

