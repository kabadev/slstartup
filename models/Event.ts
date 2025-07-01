import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    type: {
      type: String,
      required: [true, "Event type is required"],
      enum: {
        values: ["In-person", "Virtual", "Hybrid"],
        message: "{VALUE} is not a valid event type",
      },
      default: "In-person",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
      minlength: [3, "Location must be at least 3 characters"],
    },
    attendees: {
      type: Number,
      required: [true, "Maximum attendees is required"],
      min: [1, "At least 1 attendee is required"],
    },
    registeredAttendees: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: String, // Changed from ObjectId to String for Clerk user IDs
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for checking if event is at capacity
eventSchema.virtual("isAtCapacity").get(function () {
  return this.registeredAttendees >= this.attendees;
});

// Pre-save hook to generate slug from title
eventSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();

  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .concat("-", Date.now().toString().slice(-4));

  next();
});

// Index for faster queries
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ slug: 1 });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
