const { body } = require('express-validator');

const createJobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Job title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('requirements')
    .isArray({ min: 1 })
    .withMessage('At least one requirement is required'),
  body('requirements.*')
    .trim()
    .notEmpty()
    .withMessage('Requirement cannot be empty'),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array'),
  body('responsibilities.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Responsibility cannot be empty'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('workType')
    .trim()
    .notEmpty()
    .withMessage('Work type is required')
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Work type must be remote, onsite, or hybrid'),
  body('employmentType')
    .trim()
    .notEmpty()
    .withMessage('Employment type is required')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary'])
    .withMessage('Employment type is not valid'),
  body('experienceLevel')
    .trim()
    .notEmpty()
    .withMessage('Experience level is required')
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Experience level is not valid'),
  body('salaryRange.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  body('salaryRange.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  body('salaryRange.currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('salaryRange.isNegotiable')
    .optional()
    .isBoolean()
    .withMessage('isNegotiable must be a boolean'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('skills.*')
    .trim()
    .notEmpty()
    .withMessage('Skill cannot be empty'),
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array'),
  body('benefits.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Benefit cannot be empty'),
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('positions')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Positions must be at least 1'),
];

const updateJobValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Job title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('requirements')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one requirement is required'),
  body('requirements.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Requirement cannot be empty'),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  body('workType')
    .optional()
    .trim()
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Work type must be remote, onsite, or hybrid'),
  body('employmentType')
    .optional()
    .trim()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary'])
    .withMessage('Employment type is not valid'),
  body('experienceLevel')
    .optional()
    .trim()
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Experience level is not valid'),
  body('skills')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('status')
    .optional()
    .trim()
    .isIn(['open', 'closed', 'draft', 'filled'])
    .withMessage('Status is not valid'),
];

module.exports = {
  createJobValidator,
  updateJobValidator,
};

