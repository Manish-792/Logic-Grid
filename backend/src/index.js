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

// IMPORTANT: A dynamic CORS policy to handle all Vercel domains.
const vercelDomains = [
  'vercel.app', // Allows all Vercel subdomains
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);

    // Check if the origin matches any of the allowed Vercel domains
    const isVercelOrigin = vercelDomains.some(domain => origin.endsWith(domain));

    if (isVercelOrigin || origin === 'http://localhost:3000' || origin.startsWith('http://192.168.')) {
        return callback(null, true);
    } else {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
        return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

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
