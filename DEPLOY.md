# 🚀 Automated Vercel Deployment

## One-Command Deployment

### Prerequisites
- Node.js installed
- MongoDB Atlas URI ready

### Deploy Now (Windows)
```bash
npm run deploy-win
```

### Deploy Now (Mac/Linux)
```bash
npm run deploy
```

### Manual CLI Deployment
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy with environment variables
vercel --prod -e MONGODB_URI="your-mongo-uri" -e JWT_SECRET="your-jwt-secret"
```

### What the script does:
1. ✅ Checks/installs Vercel CLI
2. ✅ Installs project dependencies  
3. ✅ Builds the React app
4. ✅ Logs into Vercel
5. ✅ Deploys with environment variables
6. ✅ Sets up production configuration

### After deployment:
1. Copy your Vercel app URL
2. Go to Vercel dashboard → Settings → Environment Variables
3. Add: `CLIENT_URL` = your-app-url
4. Add: `REACT_APP_API_URL` = your-app-url/api
5. Redeploy

That's it! Your HRMS is live! 🎉