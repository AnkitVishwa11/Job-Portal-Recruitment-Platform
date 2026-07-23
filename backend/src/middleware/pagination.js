/**
 * Middleware factory to parse pagination and filter query parameters
 * Usage: router.get('/', paginationMiddleware(), controller.method)
 * Or:    router.get('/', paginationMiddleware, controller.method) - direct use
 */
const paginationMiddleware = () => {
  return (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    req.pagination = { page, limit, skip };

    // Build filters object excluding pagination and sort params
    const filters = { ...req.query };
    const excludeFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludeFields.forEach((field) => delete filters[field]);
    req.filters = filters;

    next();
  };
};

module.exports = paginationMiddleware;

