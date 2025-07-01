import mongoose from "mongoose";

const NofiticationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    url: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NofiticationSchema);
export default Notification;
