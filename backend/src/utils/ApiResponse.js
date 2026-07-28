class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success(res, messageOrStatus, dataOrMessage = null, extraData = null) {
    let statusCode = 200;
    let message = 'Success';
    let data;

    if (typeof messageOrStatus === 'number') {
      statusCode = messageOrStatus;
      message = dataOrMessage || 'Success';
      data = extraData;
    } else {
      message = messageOrStatus;
      data = dataOrMessage;
      if (typeof extraData === 'number') {
        statusCode = extraData;
      }
    }

    const payload = {
      success: true,
      message,
    };
    if (data !== undefined) {
      payload.data = data;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, message, data = null) {
    return ApiResponse.success(res, message, data, 201);
  }

  static noContent(res) {
    return res.status(204).json({ success: true, message: 'No content' });
  }

  static error(res, statusCode = 400, message = 'Error', errors = null) {
    const payload = {
      success: false,
      message,
    };
    if (errors) {
      payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
  }

  static paginated(res, statusCode = 200, message = 'Success', items = [], page = 1, limit = 10, total = 0) {
    const totalPages = Math.ceil(total / limit) || 1;
    return res.status(statusCode).json({
      success: true,
      message,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  }
}

module.exports = ApiResponse;
