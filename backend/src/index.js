// This file is the entry point for your Render server.
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

// Validate environment variables
const requiredEnvVars = [
  'DB_CONNECT_STRING',
  'REDIS_PASS',
  'JWT_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GEMINI_KEY',
  'JUDGE0_KEY'
];

function validateEnvironment() {
  console.log('🔍 Checking environment variables...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  const missing = [];
  const available = [];
  
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      available.push(envVar);
    } else {
      missing.push(envVar);
    }
  });
  
  console.log('✅ Available environment variables:', available);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\nPlease set these environment variables before starting the server.');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
}

// Run validation
// validateEnvironment(); // Temporarily disabled for debugging

// Enhanced CORS configuration for Render deployment
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);

    // Allow all Render domains and common frontend domains
    const allowedDomains = [
      'render.com',
      'onrender.com',
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

// Test route with parameter to check path-to-regexp
app.get('/test/:id', (req, res) => {
  res.status(200).json({
    message: 'Parameter route working!',
    id: req.params.id,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Connect your API routes to the Express app.
app.use('/user', authRouter);
// app.use('/problem', problemRouter); // Temporarily disabled for debugging
// app.use('/submission', submitRouter); // Temporarily disabled for debugging
// app.use('/ai', aiRouter); // Temporarily disabled for debugging
// app.use('/video', videoRouter); // Temporarily disabled for debugging

// This route will now respond to the root URL
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

// For Render deployment - start the server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDatabases();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export for testing purposes
module.exports = app;
