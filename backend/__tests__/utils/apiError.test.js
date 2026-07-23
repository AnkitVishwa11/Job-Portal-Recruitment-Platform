const ApiError = require('../../src/utils/ApiError');

describe('ApiError', () => {
  it('should create an error with status code and message', () => {
    const error = new ApiError(404, 'Not found');

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.isOperational).toBe(true);
  });

  it('should preserve stack trace', () => {
    const error = new ApiError(500, 'Server error');

    expect(error.stack).toBeDefined();
  });

  it('should have the correct name', () => {
    const error = new ApiError(400, 'Bad request');

    expect(error.name).toBe('ApiError');
  });

  describe('static methods', () => {
    it('should create bad request error', () => {
      const error = ApiError.badRequest('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
    });

    it('should create unauthorized error', () => {
      const error = ApiError.unauthorized('Please login');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Please login');
    });

    it('should create forbidden error', () => {
      const error = ApiError.forbidden('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
    });

    it('should create not found error', () => {
      const error = ApiError.notFound('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should create conflict error', () => {
      const error = ApiError.conflict('Already exists');
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Already exists');
    });

    it('should create internal error', () => {
      const error = ApiError.internal('Something went wrong');
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Something went wrong');
    });
  });
});


