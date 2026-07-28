const applicationService = require('../services/application.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private/JobSeeker
 */
const applyForJob = catchAsync(async (req, res) => {
  let resumeValue = req.body.resume;
  if (req.file) {
    const base64Data = req.file.buffer.toString('base64');
    resumeValue = `data:${req.file.mimetype};base64,${base64Data}`;
  }

  const application = await applicationService.applyForJob(
    req.body.jobId,
    req.user._id,
    {
      resume: resumeValue,
      coverLetter: req.body.coverLetter,
    }
  );
  return ApiResponse.created(res, 'Application submitted successfully', { application });
});

/**
 * @desc    Get application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
const getApplicationById = catchAsync(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id);
  return ApiResponse.success(res, 'Application retrieved successfully', { application });
});

/**
 * @desc    Get applications for a job (recruiter)
 * @route   GET /api/jobs/:jobId/applications
 * @access  Private/Recruiter
 */
const getJobApplications = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const result = await applicationService.getJobApplications(
    req.params.jobId,
    req.userCompany._id,
    { status: req.query.status },
    { page, limit, skip }
  );
  return ApiResponse.success(res, 'Applications retrieved successfully', result);
});

/**
 * @desc    Get user's applications (job seeker)
 * @route   GET /api/applications/mine
 * @access  Private/JobSeeker
 */
const getUserApplications = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const result = await applicationService.getUserApplications(req.user._id, { page, limit, skip });
  return ApiResponse.success(res, 'Applications retrieved successfully', result);
});

/**
 * @desc    Update application status (recruiter)
 * @route   PUT /api/applications/:id/status
 * @access  Private/Recruiter
 */
const updateApplicationStatus = catchAsync(async (req, res) => {
  const { status, note } = req.body;
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.user._id,
    status,
    note
  );
  return ApiResponse.success(res, 'Application status updated successfully', { application });
});

/**
 * @desc    Shortlist application
 * @route   PUT /api/applications/:id/shortlist
 * @access  Private/Recruiter
 */
const shortlistApplication = catchAsync(async (req, res) => {
  const application = await applicationService.shortlistApplication(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Application shortlisted successfully', { application });
});

/**
 * @desc    Reject application
 * @route   PUT /api/applications/:id/reject
 * @access  Private/Recruiter
 */
const rejectApplication = catchAsync(async (req, res) => {
  const application = await applicationService.rejectApplication(
    req.params.id,
    req.user._id,
    req.body.reason
  );
  return ApiResponse.success(res, 'Application rejected', { application });
});

/**
 * @desc    Hire applicant
 * @route   PUT /api/applications/:id/hire
 * @access  Private/Recruiter
 */
const hireApplicant = catchAsync(async (req, res) => {
  const application = await applicationService.hireApplicant(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Applicant hired successfully', { application });
});

/**
 * @desc    Withdraw application (job seeker)
 * @route   PUT /api/applications/:id/withdraw
 * @access  Private/JobSeeker
 */
const withdrawApplication = catchAsync(async (req, res) => {
  await applicationService.withdrawApplication(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Application withdrawn successfully');
});

/**
 * @desc    Get all applications (admin)
 * @route   GET /api/applications/admin/all
 * @access  Private/Admin
 */
const getAllApplications = catchAsync(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const result = await applicationService.getAllApplications({ page, limit, skip });
  return ApiResponse.success(res, 'All applications retrieved successfully', result);
});

/**
 * @desc    Download resume file
 * @route   GET /api/applications/:id/resume
 * @access  Private/Recruiter
 */
const downloadResume = catchAsync(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id);
  if (!application.resume) {
    throw new ApiError(404, 'No resume found for this application');
  }

  const resumeValue = application.resume;

  if (resumeValue.startsWith('data:')) {
    const matches = resumeValue.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new ApiError(400, 'Invalid resume file format');
    }
    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Guess extension from contentType
    let ext = '.pdf';
    if (contentType.includes('word') || contentType.includes('msword')) {
      ext = contentType.includes('officedocument') ? '.docx' : '.doc';
    }

    const filename = `resume_${application.userId?.firstName || 'candidate'}_${application.userId?.lastName || ''}${ext}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } else {
    const path = require('path');
    const fs = require('fs');
    const resumePath = resumeValue;

    // Check if file exists
    if (!fs.existsSync(resumePath)) {
      throw new ApiError(404, 'Resume file not found on server');
    }

    const ext = path.extname(resumePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    const filename = `resume_${application.userId?.firstName || 'candidate'}_${application.userId?.lastName || ''}${ext}`;

    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(path.resolve(resumePath));
  }
});

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
  getAllApplications,
  downloadResume,
};

