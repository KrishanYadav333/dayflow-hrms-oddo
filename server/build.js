const { execSync } = require('child_process');
const path = require('path');

console.log('Building React app...');
execSync('cd ../client && npm install && npm run build', { stdio: 'inherit' });

console.log('Copying build files...');
execSync('cp -r ../client/build ./public', { stdio: 'inherit' });

console.log('Build complete!');