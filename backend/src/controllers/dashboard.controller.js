const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { isDbConnected, MOCK_USER } = require('../utils/mockFallback');

/**
 * @desc    Get recruiter dashboard
 * @route   GET /api/dashboard/recruiter
 * @access  Private/Recruiter
 */
const getRecruiterDashboard = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Recruiter dashboard data retrieved (Demo Mode)', {
      company: { id: 'mock_company_1', name: 'Mock Corporation' },
      stats: {
        totalJobs: 3,
        activeJobs: 3,
        totalApplications: 12,
        pendingApplications: 5,
        shortlistedCandidates: 4,
        hiredCandidates: 2,
        totalViews: 450,
      },
      recentJobs: [],
      recentApplications: [],
    });
  }
  const data = await dashboardService.getRecruiterDashboard(req.user._id);
  return ApiResponse.success(res, 'Recruiter dashboard data retrieved', data);
});

/**
 * @desc    Get job seeker dashboard
 * @route   GET /api/dashboard/jobseeker
 * @access  Private/JobSeeker
 */
const getJobSeekerDashboard = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Job seeker dashboard data retrieved (Demo Mode)', {
      profile: req.user || MOCK_USER,
      stats: {
        totalApplications: 5,
        pendingApplications: 2,
        shortlistedApplications: 1,
        rejectedApplications: 1,
        hiredApplications: 1,
        withdrawnApplications: 0,
        savedJobsCount: 3,
      },
      recentApplications: [],
      recentSavedJobs: [],
    });
  }
  const data = await dashboardService.getJobSeekerDashboard(req.user._id);
  return ApiResponse.success(res, 'Job seeker dashboard data retrieved', data);
});

/**
 * @desc    Get admin dashboard
 * @route   GET /api/dashboard/admin
 * @access  Private/Admin
 */
const getAdminDashboard = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Admin dashboard data retrieved (Demo Mode)', {
      stats: {
        totalUsers: 155,
        totalRecruiters: 15,
        totalJobSeekers: 140,
        totalAdmins: 1,
        totalCompanies: 8,
        totalJobs: 12,
        openJobs: 10,
        closedJobs: 2,
        totalApplications: 45,
        pendingApplications: 15,
        hiredCandidates: 5,
      },
      recentUsers: [],
      recentJobs: [],
      recentApplications: [],
    });
  }
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


