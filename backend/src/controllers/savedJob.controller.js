const savedJobService = require('../services/savedJob.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Save a job
 * @route   POST /api/saved-jobs
 * @access  Private/JobSeeker
 */
const saveJob = catchAsync(async (req, res) => {
  const { jobId, notes } = req.body;
  const savedJob = await savedJobService.saveJob(jobId, req.user._id, notes);
  return ApiResponse.created(res, 'Job saved successfully', { savedJob });
});

/**
 * @desc    Unsave a job
 * @route   DELETE /api/saved-jobs/:id
 * @access  Private/JobSeeker
 */
const unsaveJob = catchAsync(async (req, res) => {
  await savedJobService.unsaveJob(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Job removed from saved list');
});

/**
 * @desc    Get user's saved jobs
 * @route   GET /api/saved-jobs
 * @access  Private/JobSeeker
 */
const getSavedJobs = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const result = await savedJobService.getSavedJobs(req.user._id, { page, limit, skip });
  return ApiResponse.success(res, 'Saved jobs retrieved successfully', result);
});

/**
 * @desc    Check if job is saved
 * @route   GET /api/saved-jobs/check/:jobId
 * @access  Private/JobSeeker
 */
const checkSavedJob = catchAsync(async (req, res) => {
  const savedJob = await savedJobService.isJobSaved(req.params.jobId, req.user._id);
  return ApiResponse.success(res, 'Saved job status', { isSaved: !!savedJob, savedJob });
});

/**
 * @desc    Update saved job notes
 * @route   PUT /api/saved-jobs/:id
 * @access  Private/JobSeeker
 */
const updateSavedJobNotes = catchAsync(async (req, res) => {
  const { notes } = req.body;
  const savedJob = await savedJobService.updateSavedJobNotes(req.params.id, req.user._id, notes);
  return ApiResponse.success(res, 'Saved job notes updated', { savedJob });
});

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkSavedJob,
  updateSavedJobNotes,
};

