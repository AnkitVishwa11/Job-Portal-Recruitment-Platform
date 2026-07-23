const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Recruiter dashboard
router.get('/recruiter', authorize('recruiter'), dashboardController.getRecruiterDashboard);

// Job seeker dashboard
router.get('/jobseeker', authorize('jobseeker'), dashboardController.getJobSeekerDashboard);

// Admin dashboard
router.get('/admin', authorize('admin'), dashboardController.getAdminDashboard);

// Admin reports
router.get('/reports', authorize('admin'), dashboardController.getMonthlyStats);

module.exports = router;


