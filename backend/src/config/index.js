const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_jwt_secret',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  cookie: {
    secret: process.env.COOKIE_SECRET || 'fallback_cookie_secret',
  },
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
    path: process.env.UPLOAD_PATH || 'uploads',
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};

module.exports = config;

