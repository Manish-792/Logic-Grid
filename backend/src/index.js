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

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// IMPORTANT: A dynamic CORS policy to handle all Vercel domains.
const allowedOrigins = [
  'https://logicgrid.vercel.app',
  'https://logic-grid-git-main-manish-792s-projects.vercel.app',
  // Add other Vercel preview domains if they appear in your logs
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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

app.get('/api', (req, res) => {
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

module.exports = async (req, res) => {
  await connectToDatabases();
  app(req, res);
};
