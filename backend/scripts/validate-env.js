#!/usr/bin/env node

const requiredEnvVars = [
  'DB_CONNECT_STRING',
  'REDIS_PASS',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GOOGLE_API_KEY'
];

function validateEnvironment() {
  const missing = [];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });
  
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
