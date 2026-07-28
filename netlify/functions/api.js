const serverless = require('serverless-http');
const app = require('../../backend/src/app');
const connectDB = require('../../backend/src/config/database');

let conn = null;

const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for Node event loop to empty
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!conn) {
      conn = await connectDB();
    }
  } catch (error) {
    console.error('Database connection error in Netlify function handler:', error);
  }

  // Normalize event.path so Express router receives /api/... routes correctly
  if (event.path && event.path.startsWith('/.netlify/functions/api')) {
    event.path = event.path.replace('/.netlify/functions/api', '/api');
    if (!event.path || event.path === '') {
      event.path = '/api';
    }
  }

  return serverlessHandler(event, context);
};
