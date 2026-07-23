/**
 * Sanitize object by removing specified keys
 * @param {Object} obj - Object to sanitize
 * @param {string[]} keys - Keys to remove
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj, keys = ['password', 'refreshToken', '__v']) => {
  const sanitized = { ...obj };
  keys.forEach((key) => delete sanitized[key]);
  return sanitized;
};

/**
 * Generate pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Parse pagination query params
 * @param {Object} query - Express query object
 * @returns {Object} { page, limit, skip }
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build filter object from query params (removes pagination, sort, etc.)
 * @param {Object} query - Express query object
 * @param {string[]} allowedFields - Fields allowed for filtering
 * @returns {Object} Filter object
 */
const buildFilters = (query, allowedFields = []) => {
  const filters = { ...query };
  const excludeFields = ['page', 'limit', 'sort', 'fields', 'search'];

  if (allowedFields.length > 0) {
    Object.keys(filters).forEach((key) => {
      if (!allowedFields.includes(key) && !excludeFields.includes(key)) {
        delete filters[key];
      }
    });
  }

  excludeFields.forEach((field) => delete filters[field]);

  // Convert string numbers/ranges
  Object.keys(filters).forEach((key) => {
    if (typeof filters[key] === 'string') {
      // Handle operators like gte, lte, etc.
      if (filters[key].startsWith('{') || filters[key].startsWith('[')) {
        try {
          filters[key] = JSON.parse(filters[key]);
        } catch (e) {
          // keep as string
        }
      }
    }
  });

  return filters;
};

module.exports = {
  sanitizeObject,
  getPaginationMeta,
  parsePagination,
  buildFilters,
};

