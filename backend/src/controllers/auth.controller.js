const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { isDbConnected, MOCK_USER } = require('../utils/mockFallback');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    const mockAccessToken = 'mock-access-token-' + Date.now();
    const mockRefreshToken = 'mock-refresh-token-' + Date.now();
    res.cookie('refreshToken', mockRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return ApiResponse.created(res, 'Registration successful (Demo Mode)', {
      user: { ...MOCK_USER, email: req.body.email || MOCK_USER.email, role: req.body.role || MOCK_USER.role },
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  }
  const result = await authService.register(req.body);

  // Set refresh token as cookie
  res.cookie('refreshToken', result.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return ApiResponse.created(res, 'Registration successful', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    const mockAccessToken = 'mock-access-token-' + Date.now();
    const mockRefreshToken = 'mock-refresh-token-' + Date.now();
    res.cookie('refreshToken', mockRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userRole = req.body.email?.includes('recruiter') ? 'recruiter' : (req.body.email?.includes('admin') ? 'admin' : 'jobseeker');
    return ApiResponse.success(res, 'Login successful (Demo Mode)', {
      user: { ...MOCK_USER, email: req.body.email || MOCK_USER.email, role: userRole },
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  }
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.cookie('refreshToken', result.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, 'Login successful', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    const mockAccessToken = 'mock-access-token-' + Date.now();
    return ApiResponse.success(res, 'Token refreshed (Demo Mode)', {
      accessToken: mockAccessToken,
    });
  }
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const result = await authService.refreshToken(token);

  res.cookie('refreshToken', result.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, 'Token refreshed', {
    accessToken: result.accessToken,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res) => {
  if (isDbConnected()) {
    await authService.logout(req.user._id);
  }
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  return ApiResponse.success(res, 'Logout successful');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Profile retrieved successfully (Demo Mode)', { user: req.user || MOCK_USER });
  }
  const user = await authService.getProfile(req.user._id);
  return ApiResponse.success(res, 'Profile retrieved successfully', { user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Profile updated successfully (Demo Mode)', { user: { ...(req.user || MOCK_USER), ...req.body } });
  }
  const user = await authService.updateProfile(req.user._id, req.body);
  return ApiResponse.success(res, 'Profile updated successfully', { user });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Password changed successfully (Demo Mode). Please log in again.');
  }
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  return ApiResponse.success(res, 'Password changed successfully. Please log in again.');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Password reset token sent to email (Demo Mode)', { resetToken: 'demo-reset-token' });
  }
  const resetToken = await authService.forgotPassword(req.body.email);
  return ApiResponse.success(res, 'Password reset token sent to email', {
    resetToken,
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Password reset successful (Demo Mode). Please log in with your new password.');
  }
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  return ApiResponse.success(res, 'Password reset successful. Please log in with your new password.');
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

