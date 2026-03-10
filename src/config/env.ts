/* eslint-disable no-console */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Determine environment
const environment = process.env.TEST_ENV || 'qa'; // Default to 'qa' if not set
const envFilePath = path.resolve(`env/${environment}.env`);

// Load environment variables from file
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
}

// Always try to load from .env as fallback (for local development)
dotenv.config();

// In CI, environment variables are set directly via workflow
// In local development, they should be in .env or env files

// Validate that required environment variables are set and not empty
const requiredEnvVars = ['BASE_URL_QA', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName] || process.env[varName]?.trim() === '',
);

if (missingVars.length > 0) {
  console.warn(`⚠️  Warning: Missing environment variables: ${missingVars.join(', ')}`);
  console.warn(`   Environment file: ${envFilePath}`);
  console.warn(`   File exists: ${fs.existsSync(envFilePath) ? 'YES' : 'NO'}`);

  // In CI, fail immediately if required vars are missing
  if (process.env.CI) {
    console.error('❌ CRITICAL: Required environment variables are missing in CI!');
    console.error('   Please check that GitHub Secrets are properly configured.');
    console.error('   Go to: GitHub → Settings → Secrets and variables → Actions');
    process.exit(1);
  }
}

export const ENV = {
  ENV_NAME: environment,
  BASE_URL_QA: process.env.BASE_URL_QA || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
};

// Debug logging (comment out in production)
if (process.env.DEBUG_ENV) {
  console.log('📋 Loaded Environment:', {
    ENV_NAME: ENV.ENV_NAME,
    BASE_URL_QA: ENV.BASE_URL_QA ? `✅ Set (${ENV.BASE_URL_QA.length} chars)` : '❌ Missing',
    ADMIN_EMAIL: ENV.ADMIN_EMAIL ? `✅ Set (${ENV.ADMIN_EMAIL.length} chars)` : '❌ Missing',
    ADMIN_PASSWORD: ENV.ADMIN_PASSWORD
      ? `✅ Set (${ENV.ADMIN_PASSWORD.length} chars)`
      : '❌ Missing',
  });
  console.log(`   Environment file: ${envFilePath}`);
  console.log(`   File exists: ${fs.existsSync(envFilePath) ? 'YES' : 'NO'}`);
}
