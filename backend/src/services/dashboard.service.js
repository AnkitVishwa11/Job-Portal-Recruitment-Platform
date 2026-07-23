const { User, Company, Job, Application, SavedJob } = require('../models');

/**
 * Get recruiter dashboard data
 * @param {string} userId - User ID (recruiter)
 * @returns {Object} Dashboard data
 */
const getRecruiterDashboard = async (userId) => {
  const company = await Company.findOne({ userId });

  if (!company) {
    return {
      stats: {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        shortlistedCandidates: 0,
        hiredCandidates: 0,
        totalViews: 0,
      },
      recentJobs: [],
      recentApplications: [],
    };
  }

  const companyId = company._id;

  // Get job stats
  const [totalJobs, activeJobs] = await Promise.all([
    Job.countDocuments({ companyId }),
    Job.countDocuments({ companyId, status: 'open', isActive: true }),
  ]);

  // Get application stats
  const [
    totalApplications,
    pendingApplications,
    shortlistedCandidates,
    reviewedApplications,
    hiredCandidates,
    rejectedCandidates,
  ] = await Promise.all([
    Application.countDocuments({ companyId }),
    Application.countDocuments({ companyId, status: 'pending' }),
    Application.countDocuments({ companyId, status: 'shortlisted' }),
    Application.countDocuments({ companyId, status: 'reviewed' }),
    Application.countDocuments({ companyId, status: 'hired' }),
    Application.countDocuments({ companyId, status: 'rejected' }),
  ]);

  // Get total views across all jobs
  const jobs = await Job.find({ companyId }).select('viewsCount');
  const totalViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);

  // Get recent jobs
  const recentJobs = await Job.find({ companyId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status applicationsCount viewsCount createdAt employmentType experienceLevel');

  // Get recent applications
  const recentApplications = await Application.find({ companyId })
    .populate('userId', 'firstName lastName email phone avatar')
    .populate('jobId', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    company: {
      id: company._id,
      name: company.companyName,
      logo: company.logo,
      isVerified: company.isVerified,
    },
    stats: {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      shortlistedCandidates,
      reviewedApplications,
      hiredCandidates,
      rejectedCandidates,
      totalViews,
    },
    recentJobs,
    recentApplications,
  };
};

/**
 * Get job seeker dashboard data
 * @param {string} userId - User ID (job seeker)
 * @returns {Object} Dashboard data
 */
const getJobSeekerDashboard = async (userId) => {
  const user = await User.findById(userId).select('firstName lastName email phone avatar');

  // Get application stats
  const [
    totalApplications,
    pendingApplications,
    shortlistedApplications,
    rejectedApplications,
    hiredApplications,
    withdrawnApplications,
  ] = await Promise.all([
    Application.countDocuments({ userId }),
    Application.countDocuments({ userId, status: 'pending' }),
    Application.countDocuments({ userId, status: 'shortlisted' }),
    Application.countDocuments({ userId, status: 'rejected' }),
    Application.countDocuments({ userId, status: 'hired' }),
    Application.countDocuments({ userId, status: 'withdrawn' }),
  ]);

  // Get recent applications
  const recentApplications = await Application.find({ userId })
    .populate({
      path: 'jobId',
      select: 'title location workType employmentType salaryRange status',
    })
    .populate({
      path: 'companyId',
      select: 'companyName logo location',
    })
    .sort({ createdAt: -1 })
    .limit(5);

  // Get saved jobs count
  const savedJobsCount = await SavedJob.countDocuments({ userId, isActive: true });

  // Get recent saved jobs
  const recentSavedJobs = await SavedJob.find({ userId, isActive: true })
    .populate({
      path: 'jobId',
      select: 'title location workType employmentType salaryRange status companyId',
      populate: {
        path: 'companyId',
        select: 'companyName logo',
      },
    })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    profile: user,
    stats: {
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      rejectedApplications,
      hiredApplications,
      withdrawnApplications,
      savedJobsCount,
    },
    recentApplications,
    recentSavedJobs,
  };
};

/**
 * Get admin dashboard data
 * @returns {Object} Dashboard data
 */
const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalRecruiters,
    totalJobSeekers,
    totalAdmins,
    totalCompanies,
    totalJobs,
    openJobs,
    closedJobs,
    totalApplications,
    pendingApplications,
    hiredCandidates,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'recruiter' }),
    User.countDocuments({ role: 'jobseeker' }),
    User.countDocuments({ role: 'admin' }),
    Company.countDocuments({}),
    Job.countDocuments({}),
    Job.countDocuments({ status: 'open' }),
    Job.countDocuments({ status: 'closed' }),
    Application.countDocuments({}),
    Application.countDocuments({ status: 'pending' }),
    Application.countDocuments({ status: 'hired' }),
  ]);

  // Get recent users
  const recentUsers = await User.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select('firstName lastName email role isActive createdAt');

  // Get recent jobs
  const recentJobs = await Job.find({})
    .populate('companyId', 'companyName')
    .populate('userId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status applicationsCount createdAt');

  // Get recent applications
  const recentApplications = await Application.find({})
    .populate('userId', 'firstName lastName email')
    .populate('jobId', 'title')
    .populate('companyId', 'companyName')
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    stats: {
      totalUsers,
      totalRecruiters,
      totalJobSeekers,
      totalAdmins,
      totalCompanies,
      totalJobs,
      openJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      hiredCandidates,
    },
    recentUsers,
    recentJobs,
    recentApplications,
  };
};

/**
 * Get monthly stats for reports
 * @param {number} months - Number of months to include
 * @returns {Object} Monthly stats
 */
const getMonthlyStats = async (months = 12) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const monthlyData = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const [
      usersJoined,
      jobsPosted,
      applicationsSubmitted,
      companiesCreated,
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      Job.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      Application.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      Company.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
    ]);

    monthlyData.push({
      year,
      month,
      label: `${year}-${month.toString().padStart(2, '0')}`,
      usersJoined,
      jobsPosted,
      applicationsSubmitted,
      companiesCreated,
    });
  }

  return monthlyData;
};

module.exports = {
  getRecruiterDashboard,
  getJobSeekerDashboard,
  getAdminDashboard,
  getMonthlyStats,
};


