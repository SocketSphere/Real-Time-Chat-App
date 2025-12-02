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
  Trash2,
  Edit2,
  MapPin,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

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

  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  // Fetch events for the current month
  const fetchEvents = async () => {
    if (!isLogin || !userId) return;

    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await axios.get(
        `http://localhost:5000/api/calendar/month/${year}/${month}?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      }
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
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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
      await axios.delete(`http://localhost:5000/api/calendar/${eventId}?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Failed to delete event:", err);
      throw new Error(err.response?.data?.error || "Failed to delete event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, isLogin, userId, token]);

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
        toast.success("Event updated successfully!");
      } else {
        // Create new event
        const createdEvent = await createEvent(eventData);
        setEvents((prev) => [...prev, createdEvent]);
        toast.success("Event created successfully!");
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
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        setEvents((prev) =>
          Array.isArray(prev) ? prev.filter((event) => event._id !== eventId) : []
        );
        toast.success("Event deleted successfully!");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // const getEventIcon = (type) => {
  //   switch (type) {
  //     case "video":
  //       return <Video size={16} className="text-red-500 dark:text-red-400" />;
  //     case "call":
  //       return <Phone size={16} className="text-green-500 dark:text-green-400" />;
  //     case "meeting":
  //       return <Users size={16} className="text-blue-500 dark:text-blue-400" />;
  //     default:
  //       return <CalendarIcon size={16} className="text-gray-500 dark:text-gray-400" />;
  //   }
  // };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "video":
        return "bg-red-500 dark:bg-red-600";
      case "call":
        return "bg-green-500 dark:bg-green-600";
      case "meeting":
        return "bg-blue-500 dark:bg-blue-600";
      default:
        return "bg-purple-500 dark:bg-purple-600";
    }
  };

  const days = getDaysInMonth();
  const todayEvents = getEventsForDate(selectedDate);

  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <CalendarIcon className="w-16 h-16 text-blue-500 dark:text-blue-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Calendar
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md">
          Please login to access your calendar and schedule events.
        </p>
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Schedule and manage your events
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900 p-4 md:p-6 transition-colors duration-300">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              disabled={loading}
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              disabled={loading}
            >
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
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
            className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors duration-300"
          >
            <Plus size={18} />
            New Event
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading events...</p>
          </div>
        )}

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-medium text-gray-600 dark:text-gray-400 py-2"
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
                className={`p-2 rounded-xl cursor-pointer transition-all duration-200 min-h-28 md:min-h-32
                  ${isToday ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : ""} 
                  ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""} 
                  ${!day.isCurrentMonth ? "text-gray-400 dark:text-gray-600" : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className={`text-sm font-medium ${isToday ? "text-blue-600 dark:text-blue-400 font-bold" : ""}`}>
                    {day.date.getDate()}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                  )}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event._id}
                      className={`text-xs p-1.5 rounded-lg text-white truncate ${getEventTypeColor(event.type)}`}
                      title={`${event.title} - ${formatTime(event.start)}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-white/80 text-[10px] truncate">
                        {formatTime(event.start)}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Date Events */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Events on {selectedDate.toLocaleDateString()}
          </h3>
          {todayEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No events scheduled</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Click "New Event" to schedule something
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-4 rounded-xl hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</h4>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.participants && event.participants.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{event.participants.length} participants</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
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
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 transition-colors duration-200"
                        title="Edit event"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 transition-colors duration-200"
                        title="Delete event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Event Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {editingEventId ? "Edit Event" : "Create New Event"}
              </h3>
              <button
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
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                    placeholder="Event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                    rows={3}
                    placeholder="Event description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.start}
                      onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.end}
                      onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="video">Video Call</option>
                    <option value="call">Phone Call</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                    placeholder="Meeting location or link"
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
                  className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors duration-300"
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