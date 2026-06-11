import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: String,

    type: {
      type: String,
      enum: ["like", "comment"],
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;