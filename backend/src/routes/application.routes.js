const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { protect, isJobSeeker, isRecruiter, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const paginationMiddleware = require('../middleware/pagination');
const { uploadResume } = require('../middleware/upload');
const {
  createApplicationValidator,
  updateApplicationStatusValidator,
} = require('../validators/application.validator');

// Protected job seeker routes
router.post(
  '/',
  protect,
  isJobSeeker,
  uploadResume.single('resume'),
  createApplicationValidator,
  validate,
  applicationController.applyForJob
);
router.get('/mine', protect, isJobSeeker, paginationMiddleware(), applicationController.getUserApplications);
router.put('/:id/withdraw', protect, isJobSeeker, applicationController.withdrawApplication);

// Protected recruiter routes
router.get('/:id', protect, applicationController.getApplicationById);
router.get('/:id/resume', protect, isRecruiter, applicationController.downloadResume);
router.put(
  '/:id/status',
  protect,
  isRecruiter,
  updateApplicationStatusValidator,
  validate,
  applicationController.updateApplicationStatus
);
router.put('/:id/shortlist', protect, isRecruiter, applicationController.shortlistApplication);
router.put('/:id/reject', protect, isRecruiter, applicationController.rejectApplication);
router.put('/:id/hire', protect, isRecruiter, applicationController.hireApplicant);

// Admin routes
router.get('/admin/all', protect, isAdmin, paginationMiddleware(), applicationController.getAllApplications);

module.exports = router;

