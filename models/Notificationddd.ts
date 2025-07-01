import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  content?: string;
  companyId?: string;
  roundId?: string;
  roundType?: string;
  amount?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title can be at most 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      minlength: [5, "Message must be at least 5 characters"],
    },
    content: {
      type: String,
      trim: true,
    },
    companyId: {
      type: String,
      trim: true,
    },
    roundId: {
      type: String,
      trim: true,
    },
    roundType: {
      type: String,
      trim: true,
    },
    amount: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\d+(\.\d{1,2})?$/.test(v); // Optional: Validates currency format
        },
        message: (props) => `${props.value} is not a valid amount format`,
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: Add index to improve query speed for unread notifications
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Optional: Text index for full-text search
notificationSchema.index({ title: "text", message: "text", content: "text" });

// Virtual property to check if it's unread (redundant but semantic)
notificationSchema.virtual("isUnread").get(function () {
  return !this.read;
});

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
