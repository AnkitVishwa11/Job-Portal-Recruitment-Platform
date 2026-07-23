const config = require('../config');
const ApiError = require('../utils/ApiError');

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error in development
  if (config.env === 'development') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for ${field}. This ${field} already exists.`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ApiError(400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new ApiError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    error = new ApiError(401, message);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large. Maximum size is 5MB.';
    error = new ApiError(400, message);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field.';
    error = new ApiError(400, message);
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    ...(config.env === 'development' && { stack: error.stack }),
  };

  // Operational, trusted error: send message to client
  if (error.isOperational) {
    return res.status(statusCode).json(response);
  }

  // Programming or unknown errors: don't leak details
  console.error('UNEXPECTED ERROR:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};

module.exports = errorHandler;

