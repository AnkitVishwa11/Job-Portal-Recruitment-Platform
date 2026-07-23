const compression = require('compression');

/**
 * Compression middleware configuration
 * Compresses HTTP responses for better performance
 */
const compressionMiddleware = compression({
  // Filter function - compress JSON, text, etc.
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  // Compression level (1-9, higher = more compression but slower)
  level: 6,
  // Only compress responses above 1KB
  threshold: 1024,
  // Cache compression result
  cache: true,
});

module.exports = compressionMiddleware;


