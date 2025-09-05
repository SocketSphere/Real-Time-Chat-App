import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Video,
  Phone,
  Calendar as CalendarIcon,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    type: "meeting",
    participants: [],
    location: "",
    color: "#3b82f6",
  });

  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  // Fetch events for the current month
  const fetchEvents = async () => {
    if (!isLogin || !userId) return;

    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await axios.get(
        `http://localhost:5000/api/calendar/month/${year}/${month}?userId=${userId}`
      );

      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new event
  const createEvent = async (eventData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/calendar", {
        ...eventData,
        createdBy: userId,
      });
      return response.data;
    } catch (err) {
      console.error("Failed to create event:", err);
      throw new Error(err.response?.data?.error || "Failed to create event");
    }
  };

  // Update existing event
  const updateEvent = async (eventId, updates) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/calendar/${eventId}`,
        updates
      );
      return response.data;
    } catch (err) {
      console.error("Failed to update event:", err);
      throw new Error(err.response?.data?.error || "Failed to update event");
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/calendar/${eventId}?userId=${userId}`);

    } catch (err) {
      console.error("Failed to delete event:", err);
      throw new Error(err.response?.data?.error || "Failed to delete event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, isLogin, userId]);

  const navigateMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Next month days (fill 6 weeks)
    const totalCells = 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!Array.isArray(events)) return [];
    return events.filter((event) => {
      if (!event?.start) return false;
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Invalid time";
    }
  };

  // Handle create/update form submit
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
        createdBy: userId,
      };

      if (editingEventId) {
        // Update existing event
        const updatedEvent = await updateEvent(editingEventId, eventData);
        setEvents((prev) =>
          prev.map((ev) => (ev._id === editingEventId ? updatedEvent : ev))
        );
        setEditingEventId(null);
      } else {
        // Create new event
        const createdEvent = await createEvent(eventData);
        setEvents((prev) => [...prev, createdEvent]);
      }

      setShowEventForm(false);
      setNewEvent({
        title: "",
        description: "",
        start: "",
        end: "",
        type: "meeting",
        participants: [],
        location: "",
        color: "#3b82f6",
      });
      alert(editingEventId ? "Event updated successfully!" : "Event created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        setEvents((prev) =>
          Array.isArray(prev) ? prev.filter((event) => event._id !== eventId) : []
        );
        alert("Event deleted successfully!");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "video":
        return <Video size={18} className="text-red-500" />;
      case "call":
        return <Phone size={18} className="text-green-500" />;
      case "meeting":
        return <Users size={18} className="text-blue-500" />;
      default:
        return <CalendarIcon size={18} className="text-gray-500" />;
    }
  };

  const days = getDaysInMonth();
  const todayEvents = getEventsForDate(selectedDate);

  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96">
        <CalendarIcon className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg text-center mb-4">
          Please login to access the calendar.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
        <button
          onClick={() => {
            setShowEventForm(true);
            setEditingEventId(null);
            setNewEvent({
              title: "",
              description: "",
              start: "",
              end: "",
              type: "meeting",
              participants: [],
              location: "",
              color: "#3b82f6",
            });
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" /> New Event
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
          disabled={loading}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-xl font-semibold text-gray-800">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 rounded-full hover:bg-gray-100"
          disabled={loading}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isToday =
            day.date.toDateString() === new Date().toDateString();
          const isSelected =
            day.date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(day.date)}
              className={`p-2 rounded-lg cursor-pointer transition-all min-h-24
                ${isToday ? "bg-blue-50 border border-blue-200" : ""} 
                ${isSelected ? "ring-2 ring-blue-500" : ""} 
                ${!day.isCurrentMonth ? "text-gray-400" : "text-gray-800 hover:bg-gray-50"}`}
            >
              <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event._id}
                    className="text-xs p-1 rounded text-white truncate"
                    style={{ backgroundColor: event.color || "#3b82f6" }}
                    title={event.title}
                  >
                    {formatTime(event.start)} {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Events */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Events on {selectedDate.toLocaleDateString()}
        </h3>
        {todayEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No events scheduled</p>
        ) : (
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <div
                key={event._id}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <Clock size={14} className="mr-1" />
                      {formatTime(event.start)} - {formatTime(event.end)}
                      {event.location && <span className="ml-3">• {event.location}</span>}
                    </div>
                    {event.participants && event.participants.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Users size={14} className="mr-1" />
                        {event.participants.map(p => p.firstName).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getEventIcon(event.type)}
                    <button
                      onClick={() => {
                        setEditingEventId(event._id);
                        setNewEvent({
                          title: event.title,
                          description: event.description || "",
                          start: new Date(event.start).toISOString().slice(0, 16),
                          end: new Date(event.end).toISOString().slice(0, 16),
                          type: event.type || "meeting",
                          participants: event.participants || [],
                          location: event.location || "",
                          color: event.color || "#3b82f6",
                        });
                        setShowEventForm(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingEventId ? "Edit Event" : "Create New Event"}
            </h3>
            <form onSubmit={handleSubmitEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    rows={3}
                    placeholder="Event description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.start}
                      onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.end}
                      onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="video">Video Call</option>
                    <option value="call">Phone Call</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    placeholder="Meeting location"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventForm(false);
                    setEditingEventId(null);
                    setNewEvent({
                      title: "",
                      description: "",
                      start: "",
                      end: "",
                      type: "meeting",
                      participants: [],
                      location: "",
                      color: "#3b82f6",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingEventId ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;