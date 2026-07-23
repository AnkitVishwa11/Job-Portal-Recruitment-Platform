const { Job, Company, Application } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new job
 * @param {Object} jobData - Job data
 * @param {string} userId - User ID (recruiter)
 * @param {string} companyId - Company ID
 * @returns {Object} Created job
 */
const createJob = async (jobData, userId, companyId) => {
  const job = await Job.create({
    ...jobData,
    userId,
    companyId,
  });

  return job;
};

/**
 * Get job by ID
 * @param {string} jobId - Job ID
 * @returns {Object} Job object
 */
const getJobById = async (jobId) => {
  const job = await Job.findById(jobId)
    .populate({
      path: 'companyId',
      select: 'companyName logo location industry',
    })
    .populate('userId', 'firstName lastName email');

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  return job;
};

/**
 * Update job
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated job
 */
const updateJob = async (jobId, userId, updateData) => {
  const job = await Job.findOne({ _id: jobId, userId });
  if (!job) {
    throw new ApiError(404, 'Job not found or unauthorized');
  }

  // Don't allow updating certain fields
  const allowedFields = [
    'title', 'description', 'requirements', 'responsibilities',
    'location', 'workType', 'employmentType', 'experienceLevel',
    'salaryRange', 'skills', 'benefits', 'applicationDeadline',
    'positions', 'status',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  Object.assign(job, updates);
  await job.save();

  return job;
};

/**
 * Delete job (soft delete)
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID
 */
const deleteJob = async (jobId, userId) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { isActive: false, status: 'closed' },
    { new: true }
  );

  if (!job) {
    throw new ApiError(404, 'Job not found or unauthorized');
  }
};

/**
 * Close job
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID
 * @returns {Object} Updated job
 */
const closeJob = async (jobId, userId) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { status: 'closed' },
    { new: true }
  );

  if (!job) {
    throw new ApiError(404, 'Job not found or unauthorized');
  }

  return job;
};

/**
 * Get jobs by company ID
 * @param {string} companyId - Company ID
 * @param {Object} filters - Additional filters
 * @param {Object} pagination - Pagination params
 * @returns {Object} Jobs and pagination metadata
 */
const getJobsByCompany = async (companyId, filters = {}, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = { companyId, ...filters };

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate('companyId', 'companyName logo location industry')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get recruiter's jobs
 * @param {string} userId - User ID
 * @param {Object} pagination - Pagination params
 * @returns {Object} Jobs and pagination metadata
 */
const getRecruiterJobs = async (userId, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = { userId };

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate('companyId', 'companyName logo')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Search and filter jobs
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination params
 * @returns {Object} Jobs and pagination metadata
 */
const searchJobs = async (filters = {}, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = { isActive: true, status: 'open' };

  // Text search
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { skills: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Location filter
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }

  // Work type filter
  if (filters.workType) {
    query.workType = filters.workType;
  }

  // Employment type filter
  if (filters.employmentType) {
    query.employmentType = filters.employmentType;
  }

  // Experience level filter
  if (filters.experienceLevel) {
    query.experienceLevel = filters.experienceLevel;
  }

  // Salary range filter
  if (filters.salaryMin || filters.salaryMax) {
    query['salaryRange.min'] = {};
    query['salaryRange.max'] = {};
    if (filters.salaryMin) {
      query['salaryRange.max'] = { $gte: parseInt(filters.salaryMin, 10) };
    }
    if (filters.salaryMax) {
      query['salaryRange.min'] = { $lte: parseInt(filters.salaryMax, 10) };
    }
  }

  // Skills filter
  if (filters.skills) {
    const skillsArray = filters.skills.split(',').map((s) => s.trim());
    query.skills = { $in: skillsArray };
  }

  // Company filter
  if (filters.companyId) {
    query.companyId = filters.companyId;
  }

  // Date posted filter
  if (filters.datePosted) {
    const dateMap = {
      '24h': 24 * 60 * 60 * 1000,
      '3d': 3 * 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '14d': 14 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    if (dateMap[filters.datePosted]) {
      query.createdAt = {
        $gte: new Date(Date.now() - dateMap[filters.datePosted]),
      };
    }
  }

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate('companyId', 'companyName logo location industry')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Increment job view count
 * @param {string} jobId - Job ID
 */
const incrementViewCount = async (jobId) => {
  await Job.findByIdAndUpdate(jobId, { $inc: { viewsCount: 1 } });
};

/**
 * Get jobs by IDs (for saved jobs)
 * @param {string[]} jobIds - Array of job IDs
 * @returns {Array} Jobs array
 */
const getJobsByIds = async (jobIds) => {
  const jobs = await Job.find({
    _id: { $in: jobIds },
    isActive: true,
  }).populate('companyId', 'companyName logo location industry');

  return jobs;
};

/**
 * Get all jobs (admin)
 * @param {Object} pagination - Pagination params
 * @returns {Object} Jobs and pagination metadata
 */
const getAllJobs = async (pagination = {}) => {
  const { page, limit, skip } = pagination;

  const [jobs, total] = await Promise.all([
    Job.find({})
      .populate('companyId', 'companyName logo')
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Job.countDocuments({}),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
  getJobsByCompany,
  getRecruiterJobs,
  searchJobs,
  incrementViewCount,
  getJobsByIds,
  getAllJobs,
};
