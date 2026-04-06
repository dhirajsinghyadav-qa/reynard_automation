/* import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const logsDir = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  process.env.EXECUTION_RUN_TIMESTAMP = timestamp;

  const logFilePath = path.join(logsDir, `test-run-${timestamp}.log`);

  // 👇 Save file path globally
  process.env.LOG_FILE_PATH = logFilePath;

  console.log(`🕒 Execution Timestamp: ${timestamp}`);
}

export default globalSetup;
 */

import { validCredentialsFactory } from './src/utils/dataGenerator';
import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// ── storageState ka path — playwright.config.ts me bhi use hoga ──
export const STORAGE_STATE_PATH = path.resolve(
  process.cwd(),
  'test-results',
  'auth',
  'storageState.json',
);

async function globalSetup() {
  // ─────────────────────────────────────────────────────────────
  // ✅ Logs Directory Setup
  // ─────────────────────────────────────────────────────────────
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  process.env.EXECUTION_RUN_TIMESTAMP = timestamp;

  const logFilePath = path.join(logsDir, `test-run-${timestamp}.log`);
  process.env.LOG_FILE_PATH = logFilePath;

  console.log(`🕒 Execution Timestamp: ${timestamp}`);

  // ─────────────────────────────────────────────────────────────
  // ✅ Auth Directory Setup
  // ─────────────────────────────────────────────────────────────
  const authDir = path.dirname(STORAGE_STATE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const credentials = validCredentialsFactory('SUPER_ADMIN');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔐 Global Setup: Performing Super Admin login...');

    await page.goto(process.env.BASE_URL_QA ?? process.env.BASE_URL ?? '');

    await page.getByRole('textbox', { name: 'Enter Your Email Here' }).fill(credentials.email);

    await page.getByRole('textbox', { name: 'Enter Password Here' }).fill(credentials.password);

    await page.getByRole('button', { name: 'Log In' }).click();

    // ── Post-login page load ka wait ──
    await page.waitForURL(/dashboard|home|companies/i, { timeout: 30000 });

    // ── storageState save karo ──
    await context.storageState({ path: STORAGE_STATE_PATH });

    console.log(`✅ Global Setup: Auth state saved → ${STORAGE_STATE_PATH}`);
  } catch (error: unknown) {
    console.error(
      `❌ Global Setup Login Failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
