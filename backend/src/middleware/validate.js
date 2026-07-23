const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to check validation results from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(', ');
    throw new ApiError(400, message);
  }
  next();
};

module.exports = validate;

