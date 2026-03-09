import { test as base, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import fs from 'fs';

export const test = base.extend({});

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
    const screenshotPath = `test-results/${testInfo.title}-failure.png`;

    await page.screenshot({ path: screenshotPath, fullPage: true });

    await testInfo.attach('Failure Screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });

    // 📊 Attach Trace
    if (fs.existsSync(testInfo.outputPath('trace.zip'))) {
      await testInfo.attach('Trace File', {
        path: testInfo.outputPath('trace.zip'),
        contentType: 'application/zip',
      });
    }
  }
});

export { expect };
