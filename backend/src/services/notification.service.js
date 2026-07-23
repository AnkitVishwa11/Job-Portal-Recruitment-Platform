const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a notification
 * @param {Object} notificationData - Notification data
 * @returns {Object} Created notification
 */
const createNotification = async (notificationData) => {
  const notification = await Notification.createNotification(notificationData);
  return notification;
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {Object} pagination - Pagination params
 * @param {Object} filters - Filter criteria
 * @returns {Object} Notifications and pagination metadata
 */
const getUserNotifications = async (userId, pagination = {}, filters = {}) => {
  const { page, limit, skip } = pagination;
  const query = { userId, ...filters };

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID
 * @returns {Object} Updated notification
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  await notification.markAsRead();
  return notification;
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 */
const markAllAsRead = async (userId) => {
  await Notification.markAllAsRead(userId);
};

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 * @returns {number} Unread count
 */
const getUnreadCount = async (userId) => {
  return Notification.getUnreadCount(userId);
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notification) {
    throw new ApiError(404, 'Notification not found or unauthorized');
  }
};

/**
 * Delete all read notifications for a user
 * @param {string} userId - User ID
 */
const clearReadNotifications = async (userId) => {
  await Notification.deleteMany({ userId, isRead: true });
};

/**
 * Create application status notification
 * @param {string} userId - Recipient user ID
 * @param {Object} data - Application-related data
 */
const createApplicationStatusNotification = async (userId, data) => {
  const { status, jobTitle, companyName, applicationId } = data;
  const statusLabels = {
    pending: 'Application Received',
    reviewed: 'Application Reviewed',
    shortlisted: 'You Have Been Shortlisted!',
    rejected: 'Application Update',
    hired: 'Congratulations! You Are Hired!',
    withdrawn: 'Application Withdrawn',
  };

  const statusMessages = {
    pending: `Your application for ${jobTitle} at ${companyName} has been received.`,
    reviewed: `Your application for ${jobTitle} at ${companyName} has been reviewed.`,
    shortlisted: `Congratulations! You have been shortlisted for ${jobTitle} at ${companyName}. We will contact you for the next steps.`,
    rejected: `Thank you for your interest in ${jobTitle} at ${companyName}. Unfortunately, we have decided to proceed with other candidates.`,
    hired: `Congratulations! You have been hired for ${jobTitle} at ${companyName}! Welcome aboard!`,
    withdrawn: `Your application for ${jobTitle} at ${companyName} has been withdrawn.`,
  };

  return createNotification({
    userId,
    type: `application_${status}`,
    title: statusLabels[status] || 'Application Update',
    message: statusMessages[status] || `Your application status has been updated to ${status}.`,
    data: {
      applicationId,
      url: `/applications/${applicationId}`,
    },
  });
};

/**
 * Create new application notification for recruiter
 * @param {string} userId - Recruiter user ID
 * @param {Object} data - Application data
 */
const createNewApplicationNotification = async (userId, data) => {
  const { jobTitle, applicantName, applicationId } = data;

  return createNotification({
    userId,
    type: 'application_received',
    title: 'New Application Received',
    message: `${applicantName} has applied for ${jobTitle}.`,
    data: {
      applicationId,
      url: `/applications/${applicationId}`,
    },
    priority: 'high',
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  clearReadNotifications,
  createApplicationStatusNotification,
  createNewApplicationNotification,
};


