const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const LOG_LEVEL = config.env === 'production' ? 'info' : 'debug';
const CURRENT_LEVEL = LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.info;

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} [meta] - Optional metadata
 * @returns {string} Formatted log message
 */
const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  if (meta) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
};

/**
 * Write log to console and optionally to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} [meta] - Optional metadata
 */
const log = (level, message, meta) => {
  if (CURRENT_LEVEL < LOG_LEVELS[level]) return;

  const formatted = formatMessage(level, message, meta);

  // Console output
  switch (level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'info':
      console.log(formatted);
      break;
    case 'debug':
      console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }

  // File output for errors in production
  if (config.env === 'production' && level === 'error') {
    const logFile = path.join(logDir, 'error.log');
    fs.appendFileSync(logFile, formatted + '\n');
  }
};

const logger = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),

  /**
   * Express middleware for request logging
   */
  requestLogger: (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  },
};

module.exports = logger;


