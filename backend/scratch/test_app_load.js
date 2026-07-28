try {
  console.log('Attempting to require backend/src/app.js...');
  const app = require('../src/app.js');
  console.log('SUCCESS: backend/src/app.js was loaded successfully without errors!');
  process.exit(0);
} catch (err) {
  console.error('ERROR: Failed to load backend/src/app.js:', err);
  process.exit(1);
}
