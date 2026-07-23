const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware to protect routes - verifies JWT token
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    // Check for token in cookies
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'You are not logged in. Please log in to access this resource.');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(401, 'Your account has been deactivated. Please contact support.');
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      throw new ApiError(401, 'Password recently changed. Please log in again.');
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Invalid or expired token. Please log in again.');
  }
});

/**
 * Middleware to restrict access to specific roles
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user.role}' is not authorized to access this resource. Required roles: ${roles.join(', ')}`
      );
    }
    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Only administrators can access this resource.');
  }
  next();
};

/**
 * Middleware to check if user is recruiter
 */
const isRecruiter = (req, res, next) => {
  if (req.user.role !== 'recruiter') {
    throw new ApiError(403, 'Only recruiters can access this resource.');
  }
  next();
};

/**
 * Middleware to check if user is job seeker
 */
const isJobSeeker = (req, res, next) => {
  if (req.user.role !== 'jobseeker') {
    throw new ApiError(403, 'Only job seekers can access this resource.');
  }
  next();
};

module.exports = { protect, authorize, isAdmin, isRecruiter, isJobSeeker };

