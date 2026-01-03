const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building React app...');
execSync('cd ../client && npm install && npm run build', { stdio: 'inherit' });

console.log('Copying build files...');
// Create public directory if it doesn't exist
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

// Copy build files to public directory
try {
  execSync('cp -r ../client/build/* ./public/', { stdio: 'inherit' });
  console.log('Build files copied successfully!');
} catch (error) {
  console.error('Error copying files:', error.message);
  process.exit(1);
}

console.log('Build complete!');