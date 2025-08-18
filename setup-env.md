# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following content:

```env
# Replace with your actual Vercel backend URL
VITE_PUBLIC_BUILDER_KEY=https://logic-grid.vercel.app
```

## Backend Environment Variables

Make sure your backend has the following environment variables set in Vercel:

1. Go to your Vercel dashboard
2. Select your backend project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `REDIS_URL` - Your Redis connection URL (if using Redis)

## Deployment Steps

1. **Redeploy your backend** to Vercel with the updated configuration
2. **Redeploy your frontend** to Vercel with the correct environment variable
3. **Test the API** by visiting: `https://logic-grid.vercel.app/api/test`

## Troubleshooting

If you're still having CORS issues:

1. Check that both frontend and backend are deployed to the same Vercel account
2. Verify the environment variable `VITE_PUBLIC_BUILDER_KEY` is set correctly
3. Make sure there are no trailing slashes in the URL
4. Check the browser console for specific error messages

## Testing

You can test if the API is working by:

1. Opening your browser
2. Going to: `https://logic-grid.vercel.app/api/test`
3. You should see: `{"message":"API is working!","timestamp":"...","cors":"enabled"}`

If this works, your API is properly configured and the CORS issue should be resolved.
