# Single Service Deployment on Render

## Deploy Both Frontend & Backend Together

### 1. Push to GitHub
```bash
git add .
git commit -m "Single service deployment setup"
git push origin main
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `dayflow-hrms`
   - **Environment**: `Node`
   - **Region**: `Oregon`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && cd ../client && npm install && cd ../server && npm run build`
   - **Start Command**: `npm start`

### 3. Environment Variables
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://kondawaranuj2_db_user:anuj_password@cluster0.pqtuz0c.mongodb.net/dayflow-hrms?retryWrites=true&w=majority
JWT_SECRET=9kX2mP5nQ8rT4vY7wZ0bN3cF6hJ1lM4pS8uA6dG9jK2xR5vC8eH3yW7qL0zB4nM
JWT_EXPIRE=7d
CLIENT_URL=https://dayflow-hrms.onrender.com
RESEND_API_KEY=re_Xpddby9t_8op5mdn5cKwJTccBewmdmhcX
FROM_EMAIL=noreply@dayflow-hrms.com
```

### 4. Deploy
Click **"Create Web Service"** and wait for deployment.

Your app will be available at: `https://dayflow-hrms.onrender.com`

- Frontend: `https://dayflow-hrms.onrender.com`
- API: `https://dayflow-hrms.onrender.com/api`