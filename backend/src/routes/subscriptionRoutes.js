import express from "express";
import { createSubscription, getUserSubscriptions } from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/", createSubscription);
router.get("/:userId", getUserSubscriptions);

export default router;
