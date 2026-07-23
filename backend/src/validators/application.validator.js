const { body } = require('express-validator');

const createApplicationValidator = [
  body('jobId')
    .trim()
    .notEmpty()
    .withMessage('Job ID is required')
    .isMongoId()
    .withMessage('Invalid Job ID format'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter cannot exceed 2000 characters'),
];

const updateApplicationStatusValidator = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'])
    .withMessage('Invalid status value'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),
];

module.exports = {
  createApplicationValidator,
  updateApplicationStatusValidator,
};

