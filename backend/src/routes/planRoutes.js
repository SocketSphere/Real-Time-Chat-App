import express from "express";
import { createPlan, getPlans } from "../controllers/planController.js";

const router = express.Router();

router.post("/", createPlan);
router.get("/", getPlans);

export default router;
