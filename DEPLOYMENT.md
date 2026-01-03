# Dayflow HRMS - Deployment Guide

## Deployment Overview

This guide covers deploying Dayflow HRMS to Render platform using their free tier services:
- Backend: Web Service on Render
- Database: MongoDB Atlas (Free Tier)
- Frontend: Static Site on Render

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **GitHub Repository**: Code pushed to GitHub
4. **Domain** (Optional): Custom domain for production

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Cluster
1. Log in to MongoDB Atlas
2. Click "Create a New Cluster"
3. Choose "Shared" (Free Tier)
4. Select cloud provider and region
5. Choose "M0 Sandbox" (Free)
6. Name your cluster (e.g., "dayflow-hrms")
7. Click "Create Cluster"

### 1.2 Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with "dayflow-hrms"

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dayflow-hrms?retryWrites=true&w=majority
```

## Step 2: Backend Deployment on Render

### 2.1 Prepare Backend for Deployment
1. Ensure your `server/package.json` has a start script:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

2. Create `server/render.yaml` (optional):
```yaml
services:
  - type: web
    name: dayflow-hrms-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### 2.2 Deploy Backend
1. Log in to Render Dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: dayflow-hrms-backend
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.3 Configure Environment Variables
In Render dashboard, go to Environment tab and add:

| Key           | Value                                         |
|---------------|-----------------------------------------------|
| `NODE_ENV`    | production                                    |
| `PORT`        | 10000                                         |
| `MONGODB_URI` | Your MongoDB Atlas connection string          |
| `JWT_SECRET`  | Strong random string (use password generator) |

Example:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dayflow-hrms?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://dayflow-hrms-backend.onrender.com`)

## Step 3: Frontend Deployment on Render

### 3.1 Prepare Frontend for Deployment
1. Update `client/src/config.js` or create it:
```javascript
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://dayflow-hrms-backend.onrender.com/api'
    : 'http://localhost:5000/api'
};

export default config;
```

2. Update API calls to use the config:
```javascript
import config from './config';

// Instead of hardcoded localhost
const response = await fetch(`${config.API_BASE_URL}/auth/signin`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(credentials),
});
```

3. Ensure `client/package.json` has build script:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

### 3.2 Deploy Frontend
1. In Render Dashboard, click "New +" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: dayflow-hrms-frontend
   - **Branch**: main
   - **Root Directory**: client
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build

### 3.3 Configure Environment Variables (if needed)
Add any frontend environment variables:

| Key                 | Value            |
|---------------------|------------------|
| `REACT_APP_API_URL` | Your backend URL |

### 3.4 Deploy
1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://dayflow-hrms.onrender.com`)

## Step 4: Configure CORS

Update your backend `server/index.js` to allow your frontend domain:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000', // Development
    'https://dayflow-hrms.onrender.com' // Production frontend URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Redeploy your backend after this change.

## Step 5: Testing Deployment

### 5.1 Backend Testing
Test your backend API endpoints:
```bash
# Health check
curl https://dayflow-hrms-backend.onrender.com/

# Test signup
curl -X POST https://dayflow-hrms-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "TEST001",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 5.2 Frontend Testing
1. Visit your frontend URL
2. Test user registration and login
3. Test all major features
4. Check browser console for errors

## Step 6: Custom Domain (Optional)

### 6.1 Configure Custom Domain
1. In Render Dashboard, go to your service
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Click "Add Custom Domain"
5. Enter your domain name
6. Follow DNS configuration instructions

### 6.2 SSL Certificate
Render automatically provides SSL certificates for custom domains.

## Step 7: Monitoring and Maintenance

### 7.1 Monitoring
- Use Render's built-in logs and metrics
- Set up uptime monitoring (e.g., UptimeRobot)
- Monitor MongoDB Atlas metrics

### 7.2 Backup Strategy
- MongoDB Atlas provides automatic backups
- Export important data regularly
- Keep environment variables backed up securely

### 7.3 Updates and Maintenance
- Use GitHub for version control
- Render auto-deploys on git push to main branch
- Test changes in development before deploying

## Troubleshooting

### Common Issues

#### 1. Backend Won't Start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check Render logs for specific errors

#### 2. Database Connection Failed
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database user has proper permissions

#### 3. CORS Errors
- Verify frontend URL is in CORS configuration
- Check that both HTTP and HTTPS URLs are included
- Redeploy backend after CORS changes

#### 4. Frontend Build Fails
- Check all dependencies are in package.json
- Verify build command is correct
- Check for any TypeScript or linting errors

#### 5. API Calls Failing
- Verify API base URL configuration
- Check network tab in browser dev tools
- Ensure backend is running and accessible

### Performance Optimization

#### Backend Optimization
- Enable gzip compression
- Implement caching for static data
- Optimize database queries with indexes
- Use connection pooling

#### Frontend Optimization
- Implement code splitting
- Optimize images and assets
- Use React.memo for expensive components
- Implement lazy loading

### Security Checklist

- [ ] Environment variables are not exposed in frontend
- [ ] JWT secrets are strong and unique
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Database access is restricted
- [ ] Input validation is implemented
- [ ] Rate limiting is configured
- [ ] Error messages don't expose sensitive information

## Cost Considerations

### Free Tier Limitations
- **Render Web Service**: 750 hours/month (enough for 1 service)
- **Render Static Site**: Unlimited
- **MongoDB Atlas**: 512MB storage, shared RAM and CPU

### Scaling Options
- Upgrade to paid Render plans for better performance
- Use MongoDB Atlas paid tiers for more storage
- Implement CDN for static assets
- Consider load balancing for high traffic

## Backup and Recovery

### Database Backup
1. MongoDB Atlas provides automatic backups
2. Download manual backups regularly
3. Test restore procedures

### Application Backup
1. Keep code in version control (GitHub)
2. Document environment variables securely
3. Maintain deployment documentation

### Disaster Recovery Plan
1. Have rollback procedures ready
2. Keep previous working versions tagged
3. Document recovery steps
4. Test recovery procedures regularly