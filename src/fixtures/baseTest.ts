import { STORAGE_STATE_PATH } from '../../global-setup';
import { test as base } from '@playwright/test';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

// ✅ Custom fixture — storageState aware context
export const test = base.extend({
  page: async ({ browser }, use, testInfo) => {
    const testNameSanitized = testInfo.title.replace(/[^a-z0-9]/gi, '_');

    const flakyFilePath = path.join(
      process.cwd(),
      'test-results',
      `flaky-${testNameSanitized}.json`,
    );

    const isLoginTest = testInfo.file.includes('login.spec');

    const contextOptions: any = {
      permissions: [],
      /* recordVideo: {
        dir: 'test-results/videos',
        size: { width: 1280, height: 720 },
      }, */
    };

    if (!isLoginTest && fs.existsSync(STORAGE_STATE_PATH)) {
      contextOptions.storageState = STORAGE_STATE_PATH;
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    Logger.setBrowser(testInfo.project.name);
    Logger.setSpecFile(testInfo.file);

    // ─────────────────────────────────────────────────────────
    // ✅ Page crash
    // ─────────────────────────────────────────────────────────
    page.on('crash', () => {
      Logger.error(testInfo.title, '[PAGE CRASH] Page crashed unexpectedly');
    });

    await use(page);

    // ✅ Flush logs
    Logger.flushAll();

    // ─────────────────────────────────────────────────────────
    // ✅ After test — failure + FLAKY info capture
    // ─────────────────────────────────────────────────────────
    const isFailed = testInfo.status === 'failed';
    const isTimedOut = testInfo.status === 'timedOut';
    const isPassed = testInfo.status === 'passed';
    const isFlaky = isPassed && testInfo.retry > 0;

    // ── Retry attempt log ──
    if ((isFailed || isTimedOut) && testInfo.retry === 0) {
      try {
        const data = {
          title: testInfo.title,
          error: testInfo.error?.message || 'No error message',
          stack: testInfo.error?.stack || '',
        };

        const dir = path.dirname(flakyFilePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(flakyFilePath, JSON.stringify(data, null, 2));
      } catch {
        // silent
      }
    }

    // ─────────────────────────────────────────────
    // ✅ FIRST FAILURE SAVE
    // ─────────────────────────────────────────────
    if ((isFailed || isTimedOut) && testInfo.retry === 0) {
      try {
        const data = {
          title: testInfo.title,
          error: testInfo.error?.message || '',
          stack: testInfo.error?.stack || '',
        };

        fs.writeFileSync(flakyFilePath, JSON.stringify(data, null, 2));
      } catch {
        // silent
      }
    }

    // ─────────────────────────────────────────────
    // ✅ FLAKY LOGGING
    // ─────────────────────────────────────────────
    if (isFlaky) {
      try {
        if (fs.existsSync(flakyFilePath)) {
          const data = JSON.parse(fs.readFileSync(flakyFilePath, 'utf-8'));

          Logger.error(testInfo.title, `🔁 FLAKY TEST (retry ${testInfo.retry})`);
          Logger.error(testInfo.title, `❌ FIRST ERROR: ${data.error}`);

          if (data.stack) {
            Logger.error(testInfo.title, `📌 [STACK TRACE]\n${data.stack}`);
          }

          // cleanup after use
          fs.unlinkSync(flakyFilePath);
        } else {
          Logger.error(testInfo.title, '⚠️ Flaky detected but no first failure data found');
        }
      } catch {
        Logger.error(testInfo.title, '⚠️ Error reading flaky log file');
      }
    }

    await context.close();
  },
});

export const expect = test.expect;
