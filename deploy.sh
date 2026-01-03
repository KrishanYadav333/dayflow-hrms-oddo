#!/bin/bash

# Dayflow HRMS - One Command Deployment Script
echo "🚀 Dayflow HRMS - Automated Vercel Deployment"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Install Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Get MongoDB URI
read -p "Enter MongoDB Atlas URI: " MONGODB_URI
read -p "Enter JWT Secret (press Enter for auto-generated): " JWT_SECRET

# Generate JWT secret if empty
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET="dayflow-jwt-$(date +%s)-$(openssl rand -hex 8)"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install-deps

# Build project
echo ""
echo "🔨 Building project..."
npm run build

# Login to Vercel
echo ""
echo "🔐 Logging into Vercel..."
vercel login

# Deploy
echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod \
  -e MONGODB_URI="$MONGODB_URI" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e JWT_EXPIRE="7d" \
  -e NODE_ENV="production"

echo ""
echo "✅ Deployment completed!"
echo "📋 Update CLIENT_URL in Vercel dashboard with your app URL"