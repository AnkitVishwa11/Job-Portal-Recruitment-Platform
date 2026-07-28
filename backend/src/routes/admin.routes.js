const express = require('express');
const router = express.Router();
const { User, Job, Application, Company } = require('../models');
const { protect, isAdmin } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const paginationMiddleware = require('../middleware/pagination');

// All admin routes are protected and require admin role
router.use(protect, isAdmin);

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
router.get(
  '/dashboard',
  catchAsync(async (req, res) => {
    const [totalUsers, totalRecruiters, totalJobSeekers, totalJobs, totalApplications, totalCompanies] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: 'recruiter' }),
        User.countDocuments({ role: 'jobseeker' }),
        Job.countDocuments({}),
        Application.countDocuments({}),
        Company.countDocuments({}),
      ]);

    const recentJobs = await Job.find({})
      .populate('companyId', 'companyName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find({})
      .populate('jobId', 'title')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5);

    return ApiResponse.success(res, 'Dashboard data retrieved', {
      stats: {
        totalUsers,
        totalRecruiters,
        totalJobSeekers,
        totalJobs,
        totalApplications,
        totalCompanies,
      },
      recentJobs,
      recentApplications,
    });
  })
);

/**
 * @desc    Manage users - get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
router.get(
  '/users',
  paginationMiddleware(),
  catchAsync(async (req, res) => {
    const { page, limit, skip } = req.pagination;
    const filters = {};

    if (req.query.role) {
      filters.role = req.query.role;
    }
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    }
    if (req.query.search) {
      filters.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filters),
    ]);

    return ApiResponse.success(res, 'Users retrieved', {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  })
);

/**
 * @desc    Manage user - get single user
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
router.get(
  '/users/:id',
  catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return ApiResponse.success(res, 'User retrieved', { user });
  })
);

/**
 * @desc    Activate/Deactivate user
 * @route   PUT /api/admin/users/:id/toggle-status
 * @access  Private/Admin
 */
router.put(
  '/users/:id/toggle-status',
  catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.role === 'admin') {
      throw new ApiError(400, 'Cannot deactivate an admin account');
    }

    user.isActive = !user.isActive;
    await user.save();

    return ApiResponse.success(res, `User ${user.isActive ? 'activated' : 'deactivated'}`, { user });
  })
);

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
router.put(
  '/users/:id/role',
  catchAsync(async (req, res) => {
    const { role } = req.body;
    if (!['admin', 'recruiter', 'jobseeker'].includes(role)) {
      throw new ApiError(400, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after', runValidators: true }
    );
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return ApiResponse.success(res, 'User role updated', { user });
  })
);

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
router.delete(
  '/users/:id',
  catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.role === 'admin') {
      throw new ApiError(400, 'Cannot delete an admin account');
    }

    // Delete related data
    if (user.role === 'recruiter') {
      const company = await Company.findOneAndDelete({ userId: user._id });
      if (company) {
        await Job.updateMany(
          { companyId: company._id },
          { isActive: false, status: 'closed' }
        );
      }
    }

    if (user.role === 'jobseeker') {
      await Application.updateMany(
        { userId: user._id },
        { isActive: false, status: 'withdrawn' }
      );
      await SavedJob.updateMany(
        { userId: user._id },
        { isActive: false }
      );
    }

    await User.findByIdAndDelete(user._id);

    return ApiResponse.success(res, 'User deleted successfully');
  })
);

/**
 * @desc    Get reports
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
router.get(
  '/reports',
  catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const [jobsByStatus, applicationsByStatus, usersByRole, jobsByWorkType] = await Promise.all([
      Job.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      User.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$workType', count: { $sum: 1 } } },
      ]),
    ]);

    return ApiResponse.success(res, 'Reports data retrieved', {
      jobsByStatus,
      applicationsByStatus,
      usersByRole,
      jobsByWorkType,
    });
  })
);

module.exports = router;

