// This file is the entry point for your Vercel serverless function.
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import your configuration and routers
const main = require('./config/db');
const redisClient = require('./config/redis');
const authRouter = require('./routes/userAuth');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const aiRouter = require('./routes/aiChatting');
const videoRouter = require('./routes/videoCreator');

// The Vercel environment automatically handles environment variables.
// No need for require('dotenv').config() in the deployment environment.
// It's still a good practice to keep it for local development if you have a separate .env file.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// IMPORTANT: Configure CORS to use the Vercel-provided frontend URL.
// The VERCEL_URL environment variable is automatically provided by Vercel.
// It will be the URL of your deployment (e.g., 'your-project-name.vercel.app').
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Fallback for local dev
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Connect your API routes to the Express app.
app.use('/api/user', authRouter);
app.use('/api/problem', problemRouter);
app.use('/api/submission', submitRouter);
app.use('/api/ai', aiRouter);
app.use('/api/video', videoRouter);

// This is a simple route to check if the server is running.
// You can remove this if you don't need it.
app.get('/api', (req, res) => {
  res.status(200).send('API is running!');
});

// IMPORTANT:
// In a serverless environment, connections to databases and services
// should be managed outside of the request handler to optimize for
// "cold starts" and reuse. We will initialize them when the function is loaded.
// Vercel keeps the function warm for a short period, allowing subsequent
// requests to reuse these connections without needing to re-establish them.

// Initialize database connections once.
let isConnected = false;
async function connectToDatabases() {
  if (isConnected) {
    return; // Already connected, do nothing
  }
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("Databases Connected");
    isConnected = true;
  } catch (err) {
    console.error("Error connecting to databases:", err);
    // You might want to throw an error here to prevent the function from running
    throw err; 
  }
}

// Export the Express app as a serverless function handler.
// Vercel will call this function to handle incoming requests.
module.exports = async (req, res) => {
  // Ensure database connections are established before handling the request.
  await connectToDatabases();
  
  // Vercel will use this Express app to handle routing for the request.
  // The listen() method is removed, as it is not needed here.
  app(req, res);
};
