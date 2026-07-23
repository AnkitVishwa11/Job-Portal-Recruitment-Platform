const { SavedJob, Job } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Save a job for later
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID (job seeker)
 * @param {string} notes - Optional notes
 * @returns {Object} Saved job
 */
const saveJob = async (jobId, userId, notes = '') => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  const existingSaved = await SavedJob.findOne({ userId, jobId });
  if (existingSaved) {
    if (existingSaved.isActive) {
      throw new ApiError(400, 'Job is already saved');
    }
    // Reactivate if previously unsaved
    existingSaved.isActive = true;
    existingSaved.notes = notes || existingSaved.notes;
    await existingSaved.save();
    return existingSaved;
  }

  const savedJob = await SavedJob.create({
    userId,
    jobId,
    notes,
  });

  return savedJob;
};

/**
 * Unsave a job
 * @param {string} savedJobId - Saved job ID
 * @param {string} userId - User ID
 */
const unsaveJob = async (savedJobId, userId) => {
  const savedJob = await SavedJob.findOneAndUpdate(
    { _id: savedJobId, userId },
    { isActive: false },
    { new: true }
  );

  if (!savedJob) {
    throw new ApiError(404, 'Saved job not found or unauthorized');
  }
};

/**
 * Get user's saved jobs
 * @param {string} userId - User ID
 * @param {Object} pagination - Pagination params
 * @returns {Object} Saved jobs and pagination metadata
 */
const getSavedJobs = async (userId, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = { userId, isActive: true };

  const [savedJobs, total] = await Promise.all([
    SavedJob.find(query)
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'companyName logo location industry',
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    SavedJob.countDocuments(query),
  ]);

  // Extract populated job data
  const jobs = savedJobs
    .filter((sj) => sj.jobId !== null)
    .map((sj) => ({
      savedJobId: sj._id,
      notes: sj.notes,
      savedAt: sj.createdAt,
      job: sj.jobId,
    }));

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Check if a job is saved by user
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID
 * @returns {Object|null} Saved job or null
 */
const isJobSaved = async (jobId, userId) => {
  return SavedJob.findOne({ userId, jobId, isActive: true });
};

/**
 * Update notes for a saved job
 * @param {string} savedJobId - Saved job ID
 * @param {string} userId - User ID
 * @param {string} notes - New notes
 * @returns {Object} Updated saved job
 */
const updateSavedJobNotes = async (savedJobId, userId, notes) => {
  const savedJob = await SavedJob.findOneAndUpdate(
    { _id: savedJobId, userId },
    { notes },
    { new: true }
  );

  if (!savedJob) {
    throw new ApiError(404, 'Saved job not found or unauthorized');
  }

  return savedJob;
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
  isJobSaved,
  updateSavedJobNotes,
};

