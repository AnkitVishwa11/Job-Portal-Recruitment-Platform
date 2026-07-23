const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');
const paginationMiddleware = require('../middleware/pagination');
const validate = require('../middleware/validate');
const { getNotificationsValidator } = require('../validators/notification.validator');

// All routes require authentication
router.use(protect);

// Get unread count (must be before /:id routes)
router.get('/unread-count', notificationController.getUnreadCount);

// Read all
router.patch('/read-all', notificationController.markAllAsRead);

// Clear read notifications
router.delete('/clear-read', notificationController.clearReadNotifications);

// Get all notifications
router.get(
  '/',
  getNotificationsValidator,
  validate,
  paginationMiddleware(),
  notificationController.getNotifications
);

// Mark single notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;


