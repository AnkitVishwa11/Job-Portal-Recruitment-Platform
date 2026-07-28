const ApiResponse = require('../../src/utils/ApiResponse');

describe('ApiResponse', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('success', () => {
    it('should send a success response with data', () => {
      const data = { user: { id: '123', name: 'Test' } };
      ApiResponse.success(mockRes, 200, 'Success message', data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success message',
        data,
      });
    });

    it('should send success without data', () => {
      ApiResponse.success(mockRes, 201, 'Created');

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created',
        data: null,
      });
    });
  });

  describe('error', () => {
    it('should send an error response', () => {
      ApiResponse.error(mockRes, 400, 'Bad request');

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bad request',
      });
    });

    it('should send error with validation errors', () => {
      const errors = [{ field: 'email', message: 'Email is required' }];
      ApiResponse.error(mockRes, 422, 'Validation failed', errors);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors,
      });
    });
  });

  describe('paginated', () => {
    it('should send paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      ApiResponse.paginated(mockRes, 200, 'List', data, 1, 10, 50);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'List',
        data: {
          items: data,
          pagination: {
            page: 1,
            limit: 10,
            total: 50,
            totalPages: 5,
            hasNextPage: true,
            hasPrevPage: false,
          },
        },
      });
    });
  });
});
