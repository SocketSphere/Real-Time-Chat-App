import express from "express";
import { getUsers, getUserById,updateProfile  } from "../controllers/userController.js";
import multer from "multer";
const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);

const upload = multer({ dest: "uploads/" }); // or configure for cloud storage

router.put("/:id", upload.single("avatar"), updateProfile);

export default router;
