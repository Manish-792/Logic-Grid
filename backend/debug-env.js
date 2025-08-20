#!/usr/bin/env node

console.log('🔍 Debugging environment variables...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All environment variables:');
console.log(JSON.stringify(process.env, null, 2));

console.log('\n🔍 Checking specific variables:');
const varsToCheck = [
  'DB_CONNECT_STRING',
  'REDIS_PASS', 
  'JWT_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GEMINI_KEY',
  'JUDGE0_KEY'
];

varsToCheck.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});
