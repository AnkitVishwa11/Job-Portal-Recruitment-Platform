const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`
====================================
  Job Portal API Server
  Environment: ${config.env}
  Port: ${config.port}
  MongoDB: ${config.mongodb.uri}
====================================
      `);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();


