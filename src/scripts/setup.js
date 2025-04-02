// setup.js - Run this script during deployment to set up required directories
const fs = require('fs');
const path = require('path');

// Define directories to create
const directories = [
  path.join(process.cwd(), 'public/uploads/profiles')
];

// Create directories if they don't exist
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Setup completed successfully!'); 