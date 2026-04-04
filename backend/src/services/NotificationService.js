const Notification = require('../models/Notification');

const createNotification = async ({
  userId,
  senderId,
  type,
  message,
  groupId,
  meta
}) => {
  try {
    const notification = await Notification.create({
      userId: userId,
      senderId: senderId,
      type,
      message,
      groupId: groupId,
      meta
    });

    return notification;
  } catch (err) {
    console.error("Create Notification Error:", err);
    throw err;
  }
};

const getUserNotifications = async (userId) => {
  try {
    return await Notification.find({ userId: userId })
      .populate('groupId', 'name')   // 🔥 fix name
      .populate('senderId', 'name')
      .sort({ createdAt: -1 });
  } catch (err) {
    console.error("Fetch Notifications Error:", err);
    throw err;
  }
};

const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }

    return notification;
  } catch (err) {
    console.error("Mark Read Error:", err);
    throw err;
  }
};

const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { userId: userId, isRead: false },
      { isRead: true }
    );

    return { message: 'All notifications marked as read' };
  } catch (err) {
    console.error("Mark All Read Error:", err);
    throw err;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};