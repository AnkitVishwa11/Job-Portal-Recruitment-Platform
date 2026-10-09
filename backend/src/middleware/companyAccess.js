const { Company } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { isDbConnected, MOCK_COMPANIES } = require('../utils/mockFallback');

/**
 * Middleware to attach the recruiter's company to the request
 * Only for recruiter-protected routes
 */
const attachCompany = catchAsync(async (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    if (!isDbConnected()) {
      req.userCompany = MOCK_COMPANIES[0];
      return next();
    }
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      throw new ApiError(400, 'Please create a company profile first');
    }
    req.userCompany = company;
  }
  next();
});

/**
 * Middleware to ensure the recruiter owns the company resource
 */
const ensureCompanyOwnership = (paramId = 'id') => {
  return catchAsync(async (req, res, next) => {
    if (!isDbConnected()) {
      req.userCompany = MOCK_COMPANIES[0];
      return next();
    }
    const company = await Company.findById(req.params[paramId]);
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }
    if (company.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not own this company');
    }
    req.userCompany = company;
    next();
  });
};

module.exports = { attachCompany, ensureCompanyOwnership };

