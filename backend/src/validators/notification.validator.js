const { body, query } = require('express-validator');

const getNotificationsValidator = [
  query('isRead')
    .optional()
    .isBoolean()
    .withMessage('isRead must be a boolean value'),
  query('type')
    .optional()
    .trim()
    .isIn([
      'application_received',
      'application_status',
      'application_shortlisted',
      'application_rejected',
      'application_hired',
      'application_withdrawn',
      'job_opening',
      'job_closed',
      'job_filled',
      'saved_job_update',
      'profile_viewed',
      'message',
      'system',
    ])
    .withMessage('Invalid notification type'),
];

module.exports = {
  getNotificationsValidator,
};


