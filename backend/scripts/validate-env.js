#!/usr/bin/env node

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

if (require.main === module) {
  validateEnvironment();
}

module.exports = validateEnvironment;
