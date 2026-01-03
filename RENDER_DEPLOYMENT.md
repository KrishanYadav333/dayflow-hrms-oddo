# Dayflow HRMS - Render Deployment Instructions

## Quick Deployment Steps

### 1. Push to GitHub (if not already done)
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `dayflow-hrms-backend`
   - **Environment**: Node
   - **Region**: Oregon (or closest to you)
   - **Branch**: main
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://kondawaranuj2_db_user:anuj_password@cluster0.pqtuz0c.mongodb.net/dayflow-hrms?retryWrites=true&w=majority
   JWT_SECRET=9kX2mP5nQ8rT4vY7wZ0bN3cF6hJ1lM4pS8uA6dG9jK2xR5vC8eH3yW7qL0zB4nM
   JWT_EXPIRE=7d
   CLIENT_URL=https://dayflow-hrms-frontend.onrender.com
   RESEND_API_KEY=re_Xpddby9t_8op5mdn5cKwJTccBewmdmhcX
   FROM_EMAIL=noreply@dayflow-hrms.com
   ```

6. Click "Create Web Service"
7. Wait for deployment (note the backend URL)

### 3. Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `dayflow-hrms-frontend`
   - **Branch**: main
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://dayflow-hrms-backend.onrender.com/api
   ```

5. Click "Create Static Site"
6. Wait for deployment

### 4. Update CORS Configuration

After getting your frontend URL, update the backend CORS configuration:
1. Go to your backend service on Render
2. Update the `CLIENT_URL` environment variable with your frontend URL
3. The service will automatically redeploy

### 5. Test Your Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test all major features
4. Check for any console errors

## Important URLs to Save

- **Backend API**: https://dayflow-hrms-backend.onrender.com
- **Frontend**: https://dayflow-hrms-frontend.onrender.com
- **MongoDB Atlas**: https://cloud.mongodb.com

## Troubleshooting

### Common Issues:
1. **Build fails**: Check package.json scripts and dependencies
2. **CORS errors**: Verify CLIENT_URL environment variable
3. **Database connection**: Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
4. **API calls fail**: Verify REACT_APP_API_URL points to correct backend

### Logs:
- Check Render service logs for detailed error messages
- Use browser dev tools to debug frontend issues

## Free Tier Limitations

- **Render**: 750 hours/month for web services (enough for 1 service)
- **MongoDB Atlas**: 512MB storage
- Services may sleep after 15 minutes of inactivity (first request may be slow)

## Next Steps After Deployment

1. Test all functionality thoroughly
2. Set up monitoring (optional)
3. Configure custom domain (optional)
4. Set up automated backups
5. Document your live URLs for team access