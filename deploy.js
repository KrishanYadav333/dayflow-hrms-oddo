#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function execCommand(command, options = {}) {
  try {
    console.log(`\n🔄 Executing: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      ...options 
    });
    return result;
  } catch (error) {
    console.error(`❌ Error executing: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Dayflow HRMS - Automated Vercel Deployment\n');

  // Step 1: Collect environment variables
  console.log('📝 Setting up environment variables...\n');
  
  const mongoUri = await question('Enter MongoDB Atlas URI: ');
  const jwtSecret = await question('Enter JWT Secret (or press Enter for auto-generated): ') || 
    `dayflow-jwt-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  // Step 2: Install Vercel CLI if not installed
  console.log('\n📦 Checking Vercel CLI...');
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI already installed');
  } catch {
    console.log('Installing Vercel CLI...');
    execCommand('npm install -g vercel');
  }

  // Step 3: Login to Vercel
  console.log('\n🔐 Logging into Vercel...');
  execCommand('vercel login');

  // Step 4: Install dependencies
  console.log('\n📦 Installing dependencies...');
  execCommand('npm run install-deps');

  // Step 5: Build the project
  console.log('\n🔨 Building project...');
  execCommand('npm run build');

  // Step 6: Deploy to Vercel
  console.log('\n🚀 Deploying to Vercel...');
  
  // Create .vercelignore
  const vercelIgnore = `node_modules
.env
.env.local
*.log
.DS_Store
Thumbs.db`;
  
  fs.writeFileSync('.vercelignore', vercelIgnore);
  
  // Deploy with environment variables
  const deployCommand = `vercel --prod -e MONGODB_URI="${mongoUri}" -e JWT_SECRET="${jwtSecret}" -e JWT_EXPIRE="7d" -e NODE_ENV="production"`;
  
  execCommand(deployCommand);

  console.log('\n✅ Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Your app is now live on Vercel');
  console.log('2. Update CLIENT_URL and REACT_APP_API_URL in Vercel dashboard');
  console.log('3. Test your application');
  
  rl.close();
}

main().catch(console.error);