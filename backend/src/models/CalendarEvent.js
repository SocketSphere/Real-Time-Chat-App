import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ["meeting", "call", "reminder", "video"],
      default: "event"
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isAllDay: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#3b82f6" // default blue color
    },
    notification: {
      enabled: {
        type: Boolean,
        default: false
      },
      minutesBefore: {
        type: Number,
        default: 15
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for duration in minutes
calendarEventSchema.virtual('duration').get(function() {
  return Math.round((this.end - this.start) / (1000 * 60));
});

// Index for better query performance
calendarEventSchema.index({ createdBy: 1, start: 1 });
calendarEventSchema.index({ participants: 1, start: 1 });

export default mongoose.model("CalendarEvent", calendarEventSchema);