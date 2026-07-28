const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../../src/middleware/auth');
const ApiError = require('../../src/utils/ApiError');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {},
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  describe('protect', () => {
    it('should throw error if no token provided', async () => {
      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
      expect(mockNext.mock.calls[0][0].message).toBe(
        'You are not logged in. Please log in to access this resource.'
      );
    });

    it('should throw error if token is invalid', async () => {
      mockReq.headers.authorization = 'Bearer invalidtoken';

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should throw error if user not found', async () => {
      const token = jwt.sign({ id: 'nonexistent' }, process.env.JWT_SECRET || 'fallback_jwt_secret');
      mockReq.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(null);

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
      expect(mockNext.mock.calls[0][0].message).toBe(
        'The user belonging to this token no longer exists.'
      );
    });

    it('should set req.user and call next for valid token', async () => {
      const user = {
        _id: 'validId',
        role: 'jobseeker',
        isActive: true,
        changedPasswordAfter: jest.fn().mockReturnValue(false),
      };
      const token = jwt.sign({ id: user._id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET || 'fallback_jwt_secret');
      mockReq.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(user);

      await protect(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBe(user);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('authorize', () => {
    it('should call next if user has required role', () => {
      mockReq.user = { role: 'admin' };
      const middleware = authorize('admin');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should throw error if user does not have required role', () => {
      mockReq.user = { role: 'jobseeker' };
      const middleware = authorize('admin');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(403);
    });
  });
});
