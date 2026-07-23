const jobService = require('../services/job.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Private/Recruiter
 */
const createJob = catchAsync(async (req, res) => {
  const companyId = req.userCompany._id;
  const job = await jobService.createJob(req.body, req.user._id, companyId);
  return ApiResponse.created(res, 'Job created successfully', { job });
});

/**
 * @desc    Get job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  // Increment view count
  await jobService.incrementViewCount(req.params.id);
  return ApiResponse.success(res, 'Job retrieved successfully', { job });
});

/**
 * @desc    Update job
 * @route   PUT /api/jobs/:id
 * @access  Private/Recruiter
 */
const updateJob = catchAsync(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
  return ApiResponse.success(res, 'Job updated successfully', { job });
});

/**
 * @desc    Delete job
 * @route   DELETE /api/jobs/:id
 * @access  Private/Recruiter
 */
const deleteJob = catchAsync(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Job deleted successfully');
});

/**
 * @desc    Close job
 * @route   PUT /api/jobs/:id/close
 * @access  Private/Recruiter
 */
const closeJob = catchAsync(async (req, res) => {
  const job = await jobService.closeJob(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Job closed successfully', { job });
});

/**
 * @desc    Get jobs by company
 * @route   GET /api/companies/:companyId/jobs
 * @access  Public
 */
const getJobsByCompany = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const result = await jobService.getJobsByCompany(
    req.params.companyId,
    { isActive: true, status: 'open' },
    { page, limit, skip }
  );
  return ApiResponse.success(res, 'Jobs retrieved successfully', result);
});

/**
 * @desc    Get recruiter's jobs
 * @route   GET /api/jobs/recruiter/mine
 * @access  Private/Recruiter
 */
const getRecruiterJobs = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const result = await jobService.getRecruiterJobs(req.user._id, { page, limit, skip });
  return ApiResponse.success(res, 'Jobs retrieved successfully', result);
});

/**
 * @desc    Search and filter jobs
 * @route   GET /api/jobs
 * @access  Public
 */
const searchJobs = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const filters = {
    search: req.query.search,
    location: req.query.location,
    workType: req.query.workType,
    employmentType: req.query.employmentType,
    experienceLevel: req.query.experienceLevel,
    salaryMin: req.query.salaryMin,
    salaryMax: req.query.salaryMax,
    skills: req.query.skills,
    companyId: req.query.companyId,
    datePosted: req.query.datePosted,
  };
  const result = await jobService.searchJobs(filters, { page, limit, skip });
  return ApiResponse.success(res, 'Jobs retrieved successfully', result);
});

/**
 * @desc    Get all jobs (admin)
 * @route   GET /api/jobs/admin/all
 * @access  Private/Admin
 */
const getAllJobs = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const result = await jobService.getAllJobs({ page, limit, skip });
  return ApiResponse.success(res, 'All jobs retrieved successfully', result);
});

module.exports = {
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
  getJobsByCompany,
  getRecruiterJobs,
  searchJobs,
  getAllJobs,
};

