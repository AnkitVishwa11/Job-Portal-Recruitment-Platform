const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');
const jobRoutes = require('./job.routes');
const applicationRoutes = require('./application.routes');
const savedJobRoutes = require('./savedJob.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');
const dashboardRoutes = require('./dashboard.routes');

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Portal API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;

