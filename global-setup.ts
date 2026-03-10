/* import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { Logger } from './src/utils/logger';

const logger = Logger.getInstance();

async function globalSetup(config: FullConfig): Promise<void> {
  // Load env
  const ENV = process.env.ENV || 'uat';
  dotenv.config({ path: path.resolve(__dirname, `env/${ENV}.env`) });
  dotenv.config({ path: path.resolve(__dirname, '.env') });

  logger.info('='.repeat(60));
  logger.info(`🚀 Global Setup Started`);
  logger.info(`📌 Environment  : ${ENV.toUpperCase()}`);
  logger.info(`🌐 Base URL     : ${process.env.BASE_URL}`);
  logger.info(`🖥️  Headless     : ${process.env.HEADLESS !== 'false'}`);
  logger.info(`⚙️  Workers      : ${config.workers}`);
  logger.info('='.repeat(60));

  // Optional: Pre-authentication / token setup
  // Example: generate auth state file to reuse across tests
  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await page.goto(process.env.BASE_URL!);
  // ... login steps ...
  // await page.context().storageState({ path: 'auth/user.json' });
  // await browser.close();
}

export default globalSetup;
 */

import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const logsDir = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logFilePath = path.join(logsDir, `test-run-${timestamp}.log`);

  // 👇 Save file path globally
  process.env.LOG_FILE_PATH = logFilePath;
}

export default globalSetup;
