const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const {
  isDbConnected,
  MOCK_USER,
  MOCK_JOBS,
  MOCK_COMPANIES,
  MOCK_APPLICATIONS,
  MOCK_SAVED_JOBS,
} = require('../utils/mockFallback');

/**
 * @desc    Get recruiter dashboard
 * @route   GET /api/dashboard/recruiter
 * @access  Private/Recruiter
 */
const getRecruiterDashboard = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    const company = MOCK_COMPANIES[0] || { _id: 'mock_company_1', companyName: 'Demo Tech Corp' };
    return ApiResponse.success(res, 'Recruiter dashboard data retrieved (Demo Mode)', {
      company: {
        id: company._id,
        name: company.companyName,
        logo: company.logo || '',
        isVerified: true,
      },
      stats: {
        totalJobs: MOCK_JOBS.length,
        activeJobs: MOCK_JOBS.length,
        totalApplications: MOCK_APPLICATIONS.length,
        pendingApplications: 1,
        shortlistedCandidates: 1,
        reviewedApplications: 1,
        hiredCandidates: 0,
        rejectedCandidates: 0,
        totalViews: 450,
      },
      recentJobs: MOCK_JOBS,
      recentApplications: MOCK_APPLICATIONS,
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
        totalApplications: MOCK_APPLICATIONS.length,
        pendingApplications: 1,
        shortlistedApplications: 1,
        rejectedApplications: 0,
        hiredApplications: 0,
        withdrawnApplications: 0,
        savedJobsCount: MOCK_SAVED_JOBS.length,
        profileCompletion: 85,
      },
      recentApplications: MOCK_APPLICATIONS,
      recentSavedJobs: MOCK_SAVED_JOBS,
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


