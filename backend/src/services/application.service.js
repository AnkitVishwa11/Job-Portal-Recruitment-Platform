const { Application, Job, Company, User } = require('../models');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notification.service');

/**
 * Apply for a job
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID (job seeker)
 * @param {Object} applicationData - Application data
 * @returns {Object} Created application
 */
const applyForJob = async (jobId, userId, applicationData) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (job.status !== 'open') {
    throw new ApiError(400, 'This job is no longer accepting applications');
  }

  // Check if user already applied
  const existingApplication = await Application.findOne({ jobId, userId });
  if (existingApplication) {
    throw new ApiError(400, 'You have already applied for this job');
  }

  const application = await Application.create({
    jobId,
    userId,
    companyId: job.companyId,
    resume: applicationData.resume,
    coverLetter: applicationData.coverLetter || '',
    statusHistory: [
      {
        status: 'pending',
        changedAt: new Date(),
        note: 'Application submitted',
      },
    ],
  });

  // Increment applications count on job
  await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

  // Populate job and company for notification
  const populatedJob = await Job.findById(jobId).populate('companyId', 'companyName');
  const applicant = await User.findById(userId);

  // Notify recruiter about new application
  if (populatedJob && populatedJob.userId) {
    await notificationService.createNewApplicationNotification(populatedJob.userId, {
      jobTitle: populatedJob.title,
      applicantName: `${applicant.firstName} ${applicant.lastName}`,
      applicationId: application._id,
    }).catch(() => {}); // Fire and forget
  }

  return application;
};

/**
 * Get application by ID
 * @param {string} applicationId - Application ID
 * @returns {Object} Application object
 */
const getApplicationById = async (applicationId) => {
  const application = await Application.findById(applicationId)
    .populate({
      path: 'jobId',
      select: 'title location workType employmentType salaryRange',
    })
    .populate({
      path: 'userId',
      select: 'firstName lastName email phone avatar',
    })
    .populate({
      path: 'companyId',
      select: 'companyName logo location',
    });

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  return application;
};

/**
 * Get all applications for a job (recruiter)
 * @param {string} jobId - Job ID
 * @param {string} companyId - Company ID
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination params
 * @returns {Object} Applications and pagination metadata
 */
const getJobApplications = async (jobId, companyId, filters = {}, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = { jobId, companyId };

  if (filters.status) {
    query.status = filters.status;
  }

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate({
        path: 'userId',
        select: 'firstName lastName email phone avatar',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Application.countDocuments(query),
  ]);

  return {
    applications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get user's applications (job seeker)
 * @param {string} userId - User ID
 * @param {Object} pagination - Pagination params
 * @returns {Object} Applications and pagination metadata
 */
const getUserApplications = async (userId, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = { userId };

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate({
        path: 'jobId',
        select: 'title location workType employmentType salaryRange status',
      })
      .populate({
        path: 'companyId',
        select: 'companyName logo location',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Application.countDocuments(query),
  ]);

  return {
    applications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Update application status (recruiter)
 * @param {string} applicationId - Application ID
 * @param {string} userId - User ID (recruiter)
 * @param {string} status - New status
 * @param {string} note - Optional note
 * @returns {Object} Updated application
 */
const updateApplicationStatus = async (applicationId, userId, status, note = '') => {
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  const job = await Job.findOne({ _id: application.jobId, userId });
  if (!job) {
    throw new ApiError(403, 'You are not authorized to update this application');
  }

  application.status = status;
  application.statusHistory.push({
    status,
    changedBy: userId,
    changedAt: new Date(),
    note: note || `Status changed to ${status}`,
  });

  if (status === 'hired') {
    application.hiredAt = new Date();
    await Job.findByIdAndUpdate(application.jobId, { status: 'filled' });
  }

  await application.save();

  // Notify applicant about status change
  const populatedJob = await Job.findById(application.jobId).populate('companyId', 'companyName');
  try {
    await notificationService.createApplicationStatusNotification(application.userId, {
      status,
      jobTitle: populatedJob ? populatedJob.title : 'Job',
      companyName: populatedJob && populatedJob.companyId ? populatedJob.companyId.companyName : 'Company',
      applicationId: application._id,
    });
  } catch (e) {
    // Fire and forget
  }

  return application;
};

/**
 * Shortlist an application
 * @param {string} applicationId - Application ID
 * @param {string} userId - User ID (recruiter)
 * @returns {Object} Updated application
 */
const shortlistApplication = async (applicationId, userId) => {
  return updateApplicationStatus(applicationId, userId, 'shortlisted', 'Application shortlisted');
};

/**
 * Reject an application
 * @param {string} applicationId - Application ID
 * @param {string} userId - User ID (recruiter)
 * @param {string} reason - Rejection reason
 * @returns {Object} Updated application
 */
const rejectApplication = async (applicationId, userId, reason = '') => {
  return updateApplicationStatus(applicationId, userId, 'rejected', reason || 'Application rejected');
};

/**
 * Hire an applicant
 * @param {string} applicationId - Application ID
 * @param {string} userId - User ID (recruiter)
 * @returns {Object} Updated application
 */
const hireApplicant = async (applicationId, userId) => {
  return updateApplicationStatus(applicationId, userId, 'hired', 'Applicant hired');
};

/**
 * Withdraw application (job seeker)
 * @param {string} applicationId - Application ID
 * @param {string} userId - User ID
 */
const withdrawApplication = async (applicationId, userId) => {
  const application = await Application.findOneAndUpdate(
    { _id: applicationId, userId },
    {
      status: 'withdrawn',
      isActive: false,
      withdrawnAt: new Date(),
      $push: {
        statusHistory: {
          status: 'withdrawn',
          changedBy: userId,
          changedAt: new Date(),
          note: 'Application withdrawn by candidate',
        },
      },
    },
    { returnDocument: 'after' }
  );

  if (!application) {
    throw new ApiError(404, 'Application not found or unauthorized');
  }

  // Decrement applications count on job
  await Job.findByIdAndUpdate(application.jobId, { $inc: { applicationsCount: -1 } });
};

/**
 * Get applications count for a job
 * @param {string} jobId - Job ID
 * @returns {number} Applications count
 */
const getApplicationsCount = async (jobId) => {
  return Application.countDocuments({ jobId, isActive: true });
};

/**
 * Get all applications (admin)
 * @param {Object} pagination - Pagination params
 * @returns {Object} Applications and pagination metadata
 */
const getAllApplications = async (pagination = {}) => {
  const { page, limit, skip } = pagination;

  const [applications, total] = await Promise.all([
    Application.find({})
      .populate({
        path: 'jobId',
        select: 'title',
      })
      .populate({
        path: 'userId',
        select: 'firstName lastName email',
      })
      .populate({
        path: 'companyId',
        select: 'companyName',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Application.countDocuments({}),
  ]);

  return {
    applications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  applyForJob,
  getApplicationById,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
  shortlistApplication,
  rejectApplication,
  hireApplicant,
  withdrawApplication,
  getApplicationsCount,
  getAllApplications,
};

