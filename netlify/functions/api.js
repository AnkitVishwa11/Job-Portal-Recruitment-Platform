// Disable Swagger UI in serverless context to avoid bundling issues
process.env.DISABLE_SWAGGER = 'true';

const serverless = require('serverless-http');
const app = require('../../backend/src/app');
const connectDB = require('../../backend/src/config/database');

let conn = null;
const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for Node event loop to empty
  context.callbackWaitsForEmptyEventLoop = false;

  // Connect to DB (cached across warm invocations)
  try {
    if (!conn) {
      conn = await connectDB();
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }

  // Netlify passes event.path as the FULL function URL path:
  // e.g. /.netlify/functions/api/auth/login
  // Express is mounted at app.use('/api', ...) so we need to
  // transform: /.netlify/functions/api/auth/login → /api/auth/login
  const rawPath = event.path || '/';
  if (rawPath.startsWith('/.netlify/functions/api')) {
    const rest = rawPath.slice('/.netlify/functions/api'.length);
    event.path = '/api' + (rest.startsWith('/') ? rest : '/' + rest);
    if (event.path === '/api') event.path = '/api/';
  }
  // If path already starts with /api (direct call via redirect), leave as-is

  return serverlessHandler(event, context);
};
