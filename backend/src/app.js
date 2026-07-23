const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');
const compression = require('./utils/compression');

const app = express();

// =====================================================
// Security & Performance Middleware
// =====================================================

// Compress HTTP responses
app.use(compression);

// Set security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.client.url,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// =====================================================
// Body Parsing Middleware
// =====================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookie.secret));

// =====================================================
// Logging Middleware
// =====================================================

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// =====================================================
// API Documentation (Swagger)
// =====================================================

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Job Portal API Docs',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Serve raw swagger JSON
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// =====================================================
// Static Files
// =====================================================

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// =====================================================
// API Routes
// =====================================================

app.use('/api', require('./routes'));

// =====================================================
// 404 Handler
// =====================================================

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// =====================================================
// Global Error Handler
// =====================================================

app.use(errorHandler);

module.exports = app;


