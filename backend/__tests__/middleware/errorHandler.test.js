const errorHandler = require('../../src/middleware/errorHandler');
const ApiError = require('../../src/utils/ApiError');

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should handle ApiError', () => {
    const error = new ApiError(400, 'Validation error');
    errorHandler(error, mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation error',
    });
  });

  it('should handle mongoose ValidationError', () => {
    const error = {
      name: 'ValidationError',
      message: 'Validation failed',
      errors: {
        email: { message: 'Email is required' },
        name: { message: 'Name is required' },
      },
    };
    errorHandler(error, mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email is required, Name is required',
    });
  });

  it('should handle CastError (invalid ObjectId)', () => {
    const error = {
      name: 'CastError',
      message: 'Cast to ObjectId failed',
      value: 'invalid-id',
    };
    errorHandler(error, mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Resource not found with id: invalid-id',
    });
  });

  it('should handle duplicate key error (code 11000)', () => {
    const error = {
      code: 11000,
      keyValue: { email: 'test@test.com' },
      message: 'Duplicate key',
    };
    errorHandler(error, mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Duplicate value for email. This email already exists.',
    });
  });

  it('should handle JWT errors', () => {
    const error = {
      name: 'JsonWebTokenError',
      message: 'jwt malformed',
    };
    errorHandler(error, mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token. Please log in again.',
    });
  });

  it('should handle TokenExpiredError', () => {
    const error = {
      name: 'TokenExpiredError',
      message: 'jwt expired',
    };
    errorHandler(error, mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Your token has expired. Please log in again.',
    });
  });

  it('should handle unknown errors with 500', () => {
    const error = new Error('Something went wrong');
    errorHandler(error, mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  });
});
