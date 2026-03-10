import { test as base, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import fs from 'fs';

export const test = base.extend({});

test.beforeEach(async ({ page: _page }, testInfo) => {
  Logger.info(testInfo.title, '===== TEST STARTED =====');
});

test.afterEach(async ({ page }, testInfo) => {
  const cleanError = testInfo.error?.message?.split('\n')[0] || 'No Error Message';

  // ✅ PASS CASE
  if (testInfo.status === testInfo.expectedStatus) {
    // Flaky Detection
    if (testInfo.retry > 0) {
      Logger.warn(
        testInfo.title,
        `Flaky Test: Test Passed After Retry (${testInfo.retry}) → Marked as Flaky`,
      );
    } else {
      Logger.info(testInfo.title, 'Test Passed Successfully');
    }
  }

  // ❌ FAIL CASE
  else {
    Logger.error(testInfo.title, `Failure Reason: ${cleanError}`);

    // 📸 Attach Screenshot to Allure
    const screenshotPath = testInfo.outputPath('failure.png');

    await page.screenshot({ path: screenshotPath, fullPage: true });

    await testInfo.attach('Failure Screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });

    // 📊 Attach Trace
    const tracePath = testInfo.outputPath('trace.zip');

    if (fs.existsSync(tracePath)) {
      await testInfo.attach('Trace File', {
        path: tracePath,
        contentType: 'application/zip',
      });
    }
  }

  Logger.info(testInfo.title, `Test Duration: ${testInfo.duration} ms`);
});

export { expect };
