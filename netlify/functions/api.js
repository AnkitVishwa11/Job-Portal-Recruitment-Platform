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

  // When Netlify redirects /api/* to /.netlify/functions/api/:splat,
  // event.path is the ORIGINAL path from the client (e.g. /api/auth/login).
  // Express is mounted at app.use('/api', ...) so this is already correct.
  // No path normalization needed.

  return serverlessHandler(event, context);
};
