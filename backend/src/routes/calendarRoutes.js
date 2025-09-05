import express from "express";
import {
  getEvents,
  getEventsByDate,
  createEvent,
  updateEvent,
  deleteEvent,
  getCalendarEvents
} from "../controllers/calendarController.js";

const router = express.Router();

// Get events with optional date range
router.get("/", getEvents);

// Get events for calendar view (monthly)
router.get("/month/:year/:month", getCalendarEvents);

// Get events for specific date
router.get("/date/:date", getEventsByDate);

// Create new event
router.post("/", createEvent);

// Update event
router.put("/:id", updateEvent);

// Delete event
router.delete("/:id", deleteEvent);

export default router;