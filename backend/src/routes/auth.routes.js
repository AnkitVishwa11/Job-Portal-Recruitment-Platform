const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, changePasswordValidator, validate, authController.changePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;

