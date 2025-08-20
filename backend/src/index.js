// This file is the entry point for your Render server.
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import your configuration
const main = require('./config/db');
const redisClient = require('./config/redis');

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
      console.log(`✅ ${envVar}: ${envVar.includes('PASS') || envVar.includes('KEY') || envVar.includes('SECRET') ? '[HIDDEN]' : process.env[envVar].substring(0, 10) + '...'}`);
    } else {
      missing.push(envVar);
    }
  });
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\nPlease set these environment variables in your Render dashboard.');
    console.error('Go to: Dashboard > Your Service > Environment');
    // Don't exit in production, just log the error
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️ Server will continue but may not work properly without these variables.');
    } else {
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables are set');
  }
}

// Run validation
validateEnvironment();

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

// This route will now respond to the root URL
app.get('/', (req, res) => {
  res.status(200).send('API is running!');
});

// ENHANCED DEBUGGING: Monkey patch Express to catch route registration errors
const originalUse = app.use.bind(app);
app.use = function(...args) {
  console.log('🔍 ATTEMPTING TO REGISTER ROUTE:', args[0]);
  
  // If second argument is a router, let's inspect it
  if (args[1] && args[1].stack) {
    console.log('📋 Router has', args[1].stack.length, 'routes');
    
    // Try to inspect each route in the stack
    args[1].stack.forEach((layer, index) => {
      console.log(`  Route ${index + 1}:`);
      console.log(`    Path: ${layer.route ? layer.route.path : 'middleware'}`);
      console.log(`    Methods: ${layer.route ? Object.keys(layer.route.methods).join(', ') : 'N/A'}`);
    });
  }
  
  try {
    return originalUse(...args);
  } catch (error) {
    console.error('❌ ERROR DURING ROUTE REGISTRATION:');
    console.error('Path:', args[0]);
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
};

// Let's also try to load the auth router with detailed error catching
console.log('🔍 ATTEMPTING TO LOAD AUTH ROUTER...');
let authRouter;
try {
  authRouter = require('./routes/userAuth');
  console.log('✅ Auth router loaded successfully');
  
  // Let's inspect the router structure
  if (authRouter && authRouter.stack) {
    console.log('📋 Auth router has', authRouter.stack.length, 'routes:');
    authRouter.stack.forEach((layer, index) => {
      console.log(`  Route ${index + 1}:`);
      if (layer.route) {
        console.log(`    Path: "${layer.route.path}"`);
        console.log(`    Methods: ${Object.keys(layer.route.methods).join(', ')}`);
        
        // Check for suspicious characters in the path
        if (layer.route.path.includes(':') && !layer.route.path.match(/:[\w]+/)) {
          console.error(`🚨 SUSPICIOUS PATH DETECTED: "${layer.route.path}"`);
        }
      } else {
        console.log(`    Middleware function`);
      }
    });
  }
} catch (error) {
  console.error('❌ ERROR LOADING AUTH ROUTER:');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  
  // Don't exit, just set authRouter to null
  authRouter = null;
}

// Error handling middleware for route registration
function safeRouteRegistration(path, router, routerName) {
  console.log(`⏳ Attempting to register ${routerName} at path ${path}`);
  
  if (!router) {
    console.error(`❌ ${routerName} is null or undefined, skipping registration`);
    return;
  }
  
  try {
    app.use(path, router);
    console.log(`✅ Successfully registered ${routerName} at ${path}`);
  } catch (error) {
    console.error(`❌ Failed to register ${routerName} at ${path}:`, error.message);
    console.error(`Stack trace:`, error.stack);
    
    // Additional debugging for path-to-regexp errors
    if (error.message.includes('Missing parameter name')) {
      console.error('🔍 This is a path-to-regexp error. Checking router for malformed paths...');
      
      if (router.stack) {
        router.stack.forEach((layer, index) => {
          if (layer.route && layer.route.path) {
            const path = layer.route.path;
            console.log(`  Checking route ${index + 1}: "${path}"`);
            
            // Check for common malformed patterns
            if (path.includes('::')) {
              console.error(`    🚨 FOUND DOUBLE COLON: "${path}"`);
            }
            if (path.includes(':/') || path.includes(':?') || path.includes(':#')) {
              console.error(`    🚨 FOUND SUSPICIOUS PATTERN: "${path}"`);
            }
            if (path.match(/:[^a-zA-Z_$]/)) {
              console.error(`    🚨 FOUND INVALID PARAMETER NAME: "${path}"`);
            }
            if (path.match(/:[\s]/)) {
              console.error(`    🚨 FOUND SPACE AFTER COLON: "${path}"`);
            }
          }
        });
      }
    }
  }
}

// Connect your API routes to the Express app with error handling
console.log('🔗 Registering routes...');

// Only register auth router for now to isolate the problem
if (authRouter) {
  safeRouteRegistration('/user', authRouter, 'authRouter');
} else {
  console.log('⚠️ Auth router not available, skipping registration');
}

console.log('✅ Route registration completed');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error('Stack trace:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /test',
      'GET /test/:id',
      '/user/* (auth routes)'
    ]
  });
});

let isConnected = false;
async function connectToDatabases() {
  if (isConnected) {
    return;
  }
  try {
    console.log('🔌 Connecting to databases...');
    await Promise.all([main(), redisClient.connect()]);
    console.log("✅ Databases Connected Successfully");
    isConnected = true;
  } catch (err) {
    console.error("❌ Error connecting to databases:", err.message);
    throw err;
  }
}

// For Render deployment - start the server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🚀 Starting server...');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Port: ${PORT}`);
    
    await connectToDatabases();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎉 Server is running successfully!`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    console.error("Stack trace:", err.stack);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export for testing purposes
module.exports = app;