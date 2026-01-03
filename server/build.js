const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building React app...');
execSync('cd ../client && npm install && npm run build', { stdio: 'inherit' });

console.log('Copying build files...');
// Create public directory if it doesn't exist
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

// Copy build files to public directory
if (process.platform === 'win32') {
  execSync('xcopy /E /I /Y "..\\client\\build\\*" "public"', { stdio: 'inherit' });
} else {
  execSync('cp -r ../client/build/* ./public/', { stdio: 'inherit' });
}

console.log('Build complete!');