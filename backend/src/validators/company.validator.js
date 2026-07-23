const { body } = require('express-validator');

const createCompanyValidator = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  body('companySize')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Invalid company size'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('location.address')
    .optional()
    .trim(),
  body('location.city')
    .optional()
    .trim(),
  body('location.state')
    .optional()
    .trim(),
  body('location.country')
    .optional()
    .trim(),
  body('location.zipCode')
    .optional()
    .trim(),
];

const updateCompanyValidator = [
  body('companyName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  body('companySize')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Invalid company size'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
];

module.exports = {
  createCompanyValidator,
  updateCompanyValidator,
};

