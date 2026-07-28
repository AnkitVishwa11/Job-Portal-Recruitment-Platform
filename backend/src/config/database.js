const mongoose = require('mongoose');
const config = require('./index');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(config.mongodb.uri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test' && !process.env.NETLIFY && !process.env.LAMBDA_TASK_ROOT) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;

