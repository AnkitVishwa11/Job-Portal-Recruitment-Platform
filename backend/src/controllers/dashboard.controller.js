const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get recruiter dashboard
 * @route   GET /api/dashboard/recruiter
 * @access  Private/Recruiter
 */
const getRecruiterDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.getRecruiterDashboard(req.user._id);
  return ApiResponse.success(res, 'Recruiter dashboard data retrieved', data);
});

/**
 * @desc    Get job seeker dashboard
 * @route   GET /api/dashboard/jobseeker
 * @access  Private/JobSeeker
 */
const getJobSeekerDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.getJobSeekerDashboard(req.user._id);
  return ApiResponse.success(res, 'Job seeker dashboard data retrieved', data);
});

/**
 * @desc    Get admin dashboard
 * @route   GET /api/dashboard/admin
 * @access  Private/Admin
 */
const getAdminDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.getAdminDashboard();
  return ApiResponse.success(res, 'Admin dashboard data retrieved', data);
});

/**
 * @desc    Get monthly stats for reports
 * @route   GET /api/dashboard/reports
 * @access  Private/Admin
 */
const getMonthlyStats = catchAsync(async (req, res) => {
  const months = parseInt(req.query.months, 10) || 12;
  const data = await dashboardService.getMonthlyStats(months);
  return ApiResponse.success(res, 'Monthly stats retrieved', data);
});

module.exports = {
  getRecruiterDashboard,
  getJobSeekerDashboard,
  getAdminDashboard,
  getMonthlyStats,
};


