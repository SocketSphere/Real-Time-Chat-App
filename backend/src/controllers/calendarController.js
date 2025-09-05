import Event from "../models/CalendarEvent.js";
import User from "../models/User.js";

// Create a new event
// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, start, end, type, participants, location, color } = req.body;
    const { createdBy } = req.body;
    if (!title || !start || !end) {
      return res.status(400).json({ error: "Title, start, and end are required" });
    }

    // Ensure start < end
    if (new Date(start) >= new Date(end)) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    const event = new Event({
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      type,
      participants,
      createdBy,
      location,
      color
    });

    await event.save();

    await event.populate("participants", "firstName lastName loginId profileImage");
    await event.populate("createdBy", "firstName lastName loginId profileImage");

    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get events for calendar monthly view
export const getCalendarEvents = async (req, res) => {
  try {
    const { year, month } = req.params;
    const { userId } = req.query; // <-- get from query params

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const query = {
      start: { $gte: startOfMonth, $lte: endOfMonth },
    };

    if (userId) {
      query.$or = [{ createdBy: userId }, { participants: userId }];
    }

    const events = await Event.find(query)
      .populate("participants", "firstName lastName loginId profileImage")
      .populate("createdBy", "firstName lastName loginId profileImage")
      .sort({ start: 1 });

    res.json(events);
  } catch (error) {
    console.error("Get calendar events error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Get events for a specific date range
export const getEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.body.createdBy || null;

    let query = {
      $or: [
        { createdBy: userId },
        { participants: userId }
      ]
    };

    // If date range is provided, filter by date
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(query)
      .populate('participants', 'firstName lastName loginId profileImage')
      .populate('createdBy', 'firstName lastName loginId profileImage')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get events for a specific date
export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.body.createdBy || null;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await Event.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      $or: [
        { createdBy: userId },
        { participants: userId }
      ]
    })
    .populate('participants', 'firstName lastName loginId profileImage')
    .populate('createdBy', 'firstName lastName loginId profileImage')
    .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error("Get events by date error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single event
export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.createdBy || null;

    const event = await Event.findOne({
      _id: id,
      $or: [
        { createdBy: userId },
        { participants: userId }
      ]
    })
    .populate('participants', 'firstName lastName loginId profileImage')
    .populate('createdBy', 'firstName lastName loginId profileImage');

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.createdBy || null;
    const updates = req.body;

    // Check if user owns the event
    const event = await Event.findOne({ _id: id, createdBy: userId });
    if (!event) {
      return res.status(404).json({ error: "Event not found or access denied" });
    }

    // Don't allow changing createdBy
    if (updates.createdBy) {
      delete updates.createdBy;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('participants', 'firstName lastName loginId profileImage')
    .populate('createdBy', 'firstName lastName loginId profileImage');

    res.json(updatedEvent);
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;;

    // Check if user owns the event
    const event = await Event.findOne({ _id: id, createdBy: userId });
    if (!event) {
      return res.status(404).json({ error: "Event not found or access denied" });
    }

    await Event.findByIdAndDelete(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get upcoming events
export const getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.body.createdBy || null;
    const { limit = 5 } = req.query;

    const events = await Event.find({
      date: { $gte: new Date() },
      $or: [
        { createdBy: userId },
        { participants: userId }
      ]
    })
    .populate('participants', 'firstName lastName loginId profileImage')
    .populate('createdBy', 'firstName lastName loginId profileImage')
    .sort({ date: 1 })
    .limit(parseInt(limit));

    res.json(events);
  } catch (error) {
    console.error("Get upcoming events error:", error);
    res.status(500).json({ error: error.message });
  }
};