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

// Only load dotenv in development environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Enhanced CORS configuration for Vercel deployment
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);

    // Allow all Vercel domains
    const allowedDomains = [
      'vercel.app',
      'localhost:3000',
      'localhost:5173',
      '127.0.0.1:3000',
      '127.0.0.1:5173'
    ];

    // Check if the origin matches any of the allowed domains
    const isAllowed = allowedDomains.some(domain => {
      if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
        return origin.includes(domain);
      }
      return origin.endsWith(domain);
    });

    // Also allow local network IPs for development
    const isLocalNetwork = origin.startsWith('http://192.168.') || origin.startsWith('http://10.') || origin.startsWith('http://172.');

    if (isAllowed || isLocalNetwork) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());
app.use(cookieParser());

// Add OPTIONS handler for preflight requests
app.options('*', cors());

// Test endpoint to verify API is working
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Connect your API routes to the Express app.
// Vercel's vercel.json rewrite rule handles the '/api' prefix for us.
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);

// This route will now respond to 'https://yoursite.com/api'
app.get('/', (req, res) => {
  res.status(200).send('API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl
  });
});

let isConnected = false;
async function connectToDatabases() {
  if (isConnected) {
    return;
  }
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("Databases Connected");
    isConnected = true;
  } catch (err) {
    console.error("Error connecting to databases:", err);
    throw err;
  }
}

// The Vercel serverless function entry point
module.exports = async (req, res) => {
  try {
    await connectToDatabases();
    app(req, res);
  } catch (err) {
    console.error("Failed to handle request:", err);
    res.status(500).send('Internal Server Error');
  }
};
