/**
 * Wraps an async function to catch errors and forward to error middleware
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;

