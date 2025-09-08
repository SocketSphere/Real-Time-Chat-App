import express from "express";
import { getUsers, getUserById, updateProfile } from "../controllers/userController.js";
import upload from "../config/multer.js"; // memory storage upload

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);

// Use memory storage upload here
router.put("/:id", upload.single("avatar"), updateProfile);

export default router;


// import express from "express";
// import { getUsers, getUserById,updateProfile  } from "../controllers/userController.js";
// import multer from "multer";
// import upload from "../config/multer.js";

// const router = express.Router();

// router.get("/", getUsers);
// router.get("/:id", getUserById);

// // const upload = multer({ dest: "uploads/" }); // or configure for cloud storage

// router.put("/update/:id", upload.single("avatar"), updateProfile);

// export default router;
