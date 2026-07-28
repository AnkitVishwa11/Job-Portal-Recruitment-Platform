// Disable Swagger UI in serverless context
process.env.DISABLE_SWAGGER = 'true';

const serverless = require('serverless-http');
const app = require('../src/app');
const connectDB = require('../src/config/database');

let conn = null;
const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
  // Diagnostic logs to check environment variables in Netlify function
  console.log('--- Netlify Function Invocation ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('DISABLE_SWAGGER:', process.env.DISABLE_SWAGGER);

  context.callbackWaitsForEmptyEventLoop = false;

  // Connect to MongoDB (cached across warm invocations)
  try {
    if (!conn) {
      conn = await connectDB();
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
  }

  // Netlify passes the full function URL path in event.path:
  //   /.netlify/functions/api/auth/login
  // Express is mounted at /api, so we transform:
  //   /.netlify/functions/api/auth/login → /api/auth/login
  const rawPath = event.path || '/';
  if (rawPath.startsWith('/.netlify/functions/api')) {
    const rest = rawPath.slice('/.netlify/functions/api'.length);
    event.path = '/api' + (rest && rest.startsWith('/') ? rest : '/' + (rest || ''));
  }

  return serverlessHandler(event, context);
};
