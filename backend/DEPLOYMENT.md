# Backend Deployment Guide for Render

## Prerequisites
- MongoDB Atlas account (for database)
- Redis Cloud account (for caching)
- Cloudinary account (for file uploads)
- Google AI API key

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Database Configuration
- `DB_CONNECT_STRING`: Your MongoDB Atlas connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

### Redis Configuration
- `REDIS_PASS`: Your Redis Cloud password

### JWT Configuration
- `JWT_SECRET`: A secure random string for JWT token signing

### Cloudinary Configuration (for file uploads)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Google AI Configuration
- `GOOGLE_API_KEY`: Your Google AI API key

### Environment
- `NODE_ENV`: Set to `production`

## Deployment Steps

1. **Connect your GitHub repository to Render**
   - Go to Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: backend-api (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or choose your preferred plan)

3. **Set Environment Variables**
   - In the Render dashboard, go to your service
   - Navigate to "Environment" tab
   - Add all the environment variables listed above

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## API Endpoints

Once deployed, your API will be available at:
- Base URL: `https://your-service-name.onrender.com`
- Test endpoint: `https://your-service-name.onrender.com/test`
- User routes: `https://your-service-name.onrender.com/user/*`
- Problem routes: `https://your-service-name.onrender.com/problem/*`
- Submission routes: `https://your-service-name.onrender.com/submission/*`
- AI routes: `https://your-service-name.onrender.com/ai/*`
- Video routes: `https://your-service-name.onrender.com/video/*`

## Troubleshooting

1. **Database Connection Issues**
   - Ensure your MongoDB Atlas cluster is accessible from all IPs (0.0.0.0/0)
   - Check that your connection string is correct

2. **Redis Connection Issues**
   - Verify your Redis Cloud credentials
   - Ensure Redis is accessible from Render's IP ranges

3. **CORS Issues**
   - Update your frontend to use the new Render URL
   - Check that your frontend domain is allowed in the CORS configuration

4. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Ensure no extra spaces or quotes in the values

## Local Development

For local development, create a `.env` file in the backend directory with the same environment variables.
