const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect, isRecruiter, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const paginationMiddleware = require('../middleware/pagination');
const { attachCompany } = require('../middleware/companyAccess');
const {
  createJobValidator,
  updateJobValidator,
} = require('../validators/job.validator');

// Public routes
router.get('/', paginationMiddleware(), jobController.searchJobs);
router.get('/:id', jobController.getJobById);

// Protected recruiter routes
router.post('/', protect, isRecruiter, attachCompany, createJobValidator, validate, jobController.createJob);
router.get('/recruiter/mine', protect, isRecruiter, paginationMiddleware(), jobController.getRecruiterJobs);
router.put('/:id', protect, isRecruiter, updateJobValidator, validate, jobController.updateJob);
router.delete('/:id', protect, isRecruiter, jobController.deleteJob);
router.put('/:id/close', protect, isRecruiter, jobController.closeJob);

// Admin routes
router.get('/admin/all', protect, isAdmin, paginationMiddleware(), jobController.getAllJobs);

module.exports = router;

