const mongoose = require('mongoose');

const uri = 'mongodb+srv://sivay12:ankit2654@cluster0.kk6v5tk.mongodb.net/jobportal?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB...');
mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to database successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR: Failed to connect to database:', err.message);
    process.exit(1);
  });
