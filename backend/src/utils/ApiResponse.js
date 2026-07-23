class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, message, data = null) {
    return ApiResponse.success(res, message, data, 201);
  }

  static noContent(res) {
    return res.status(204).json({ success: true, message: 'No content' });
  }
}

module.exports = ApiResponse;

