import Notification from "../models/Notification.js";

export const createNotification = async ({
  user,
  message,
  type,
  post,
}) => {
  await Notification.create({
    user,
    message,
    type,
    post,
  });
};