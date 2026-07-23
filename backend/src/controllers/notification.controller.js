const notificationService = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const filters = {};

  if (req.query.isRead !== undefined) {
    filters.isRead = req.query.isRead === 'true';
  }

  if (req.query.type) {
    filters.type = req.query.type;
  }

  const result = await notificationService.getUserNotifications(req.user._id, { page, limit, skip }, filters);
  return ApiResponse.success(res, 'Notifications retrieved successfully', result);
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
const getUnreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  return ApiResponse.success(res, 'Unread count retrieved', { count });
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Notification marked as read', { notification });
});

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  return ApiResponse.success(res, 'All notifications marked as read');
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Notification deleted successfully');
});

/**
 * @desc    Clear all read notifications
 * @route   DELETE /api/notifications/clear-read
 * @access  Private
 */
const clearReadNotifications = catchAsync(async (req, res) => {
  await notificationService.clearReadNotifications(req.user._id);
  return ApiResponse.success(res, 'Read notifications cleared');
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
};


