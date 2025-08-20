# Render Deployment Checklist

## Pre-Deployment Checklist

### ✅ Backend Configuration
- [ ] Updated `src/index.js` for Render (removed Vercel-specific code)
- [ ] Added proper server startup with `app.listen()`
- [ ] Updated CORS configuration for Render domains
- [ ] Added health check endpoint at `/health`
- [ ] Enhanced database connection with error handling
- [ ] Enhanced Redis connection with error handling
- [ ] Created environment validation script
- [ ] Updated package.json with validation in start script

### ✅ Deployment Files
- [ ] Created `render.yaml` configuration
- [ ] Created `backend/Procfile`
- [ ] Created `backend/DEPLOYMENT.md` with instructions
- [ ] Created `backend/scripts/validate-env.js`

### ✅ Environment Variables (Set in Render Dashboard)
- [ ] `DB_CONNECT_STRING` - MongoDB Atlas connection string
- [ ] `REDIS_PASS` - Redis Cloud password
- [ ] `JWT_SECRET` - Secure random string for JWT
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `GEMINI_KEY` - Google AI API key
- [ ] `JUDGE0_KEY` - Judge0 API key
- [ ] `NODE_ENV` - Set to "production"

### ✅ External Services
- [ ] MongoDB Atlas cluster configured and accessible
- [ ] Redis Cloud instance configured and accessible
- [ ] Cloudinary account set up
- [ ] Google AI API key obtained

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure service:
     - Name: `backend-api`
     - Environment: `Node`
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
     - Plan: `Free`
   - Add all environment variables listed above
   - Click "Create Web Service"

3. **Verify Deployment**
   - Check build logs for any errors
   - Test health endpoint: `https://your-service.onrender.com/health`
   - Test API endpoint: `https://your-service.onrender.com/test`

## Post-Deployment

- [ ] Update frontend to use new API URL
- [ ] Test all API endpoints
- [ ] Monitor logs for any issues
- [ ] Set up custom domain if needed

## Troubleshooting

If deployment fails:
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Test database and Redis connections
4. Check CORS configuration
5. Review error logs in Render dashboard
