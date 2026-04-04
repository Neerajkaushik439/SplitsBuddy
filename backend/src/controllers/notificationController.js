const notificationService = require('../services/NotificationService');

const createNotification = async (req, res) => {
  try {
    const { userId, senderId, type, message, groupId, meta } = req.body;

    const notification = await notificationService.createNotification({
      userId,
      senderId,
      type,
      message,
      groupId,
      meta
    });

    res.status(201).json({
      notification,
      message: "Notification created successfully"
    });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ message: err.message });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const {userId} = req.user

    const notifications = await notificationService.getUserNotifications(userId);

    res.status(200).json({
      notifications,
      message: "Successfully fetched notifications"
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;

    const notification = await notificationService.markAsRead(id, userId);

    res.status(200).json({
      notification,
      message: "Notification marked as read"
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;

    const result = await notificationService.markAllAsRead(userId);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createNotification,   // ✅ now included
  getUserNotifications,
  markAsRead,
  markAllAsRead
};