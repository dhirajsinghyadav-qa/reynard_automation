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

    // ─────────────────────────────────────────────────────────
    // ✅ After test — failure + FLAKY info capture
    // ─────────────────────────────────────────────────────────
    const isFailed = testInfo.status === 'failed';
    const isTimedOut = testInfo.status === 'timedOut';
    const isPassed = testInfo.status === 'passed';
    const isFlaky = isPassed && testInfo.retry > 0;

    // ─────────────────────────────────────────────────────────
    // ✅ Failure — annotated screenshot with error indicator
    // ─────────────────────────────────────────────────────────
    if (isFailed || isTimedOut) {
      Logger.error(
        testInfo.title,
        `[TEST ${testInfo.status?.toUpperCase()}] Retry: ${testInfo.retry}/${testInfo.project.retries}`,
      );

      if (testInfo.error) {
        Logger.error(
          testInfo.title,
          `[FAILURE REASON] ${testInfo.error.message ?? 'No error message'}`,
        );

        if (testInfo.error.stack) {
          Logger.error(testInfo.title, `[STACK TRACE]\n${testInfo.error.stack}`);
        }

        if ((testInfo.error as any).snippet) {
          Logger.error(testInfo.title, `[FAILING CODE]\n${(testInfo.error as any).snippet}`);
        }
      }

      try {
        const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const screenshotPath = path.join(
          screenshotDir,
          `${testNameSanitized}__${testInfo.project.name}__retry${testInfo.retry}__FAILED.png`,
        );

        const errorMessage = testInfo.error?.message ?? 'Unknown error';
        const errorSnippet = (testInfo.error as any)?.snippet ?? '';

        await page.evaluate(
          ({ msg, snippet, retryNum }) => {
            const overlay = document.createElement('div');
            overlay.id = 'pw-error-overlay';
            overlay.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              z-index: 999999;
              background: rgba(220, 38, 38, 0.95);
              color: #ffffff;
              font-family: monospace;
              font-size: 13px;
              padding: 12px 16px;
              border-bottom: 3px solid #991b1b;
            `;

            const title = document.createElement('div');
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '6px';
            title.textContent = `❌ TEST FAILED — Retry: ${retryNum}`;

            const errorDiv = document.createElement('div');
            errorDiv.textContent = `REASON: ${msg}`;

            overlay.appendChild(title);
            overlay.appendChild(errorDiv);

            if (snippet) {
              const snippetDiv = document.createElement('div');
              snippetDiv.textContent = `CODE: ${snippet.substring(0, 200)}`;
              overlay.appendChild(snippetDiv);
            }

            document.body.appendChild(overlay);

            const el = document.activeElement;
            if (el && el !== document.body) {
              (el as HTMLElement).style.outline = '4px solid red';
              (el as HTMLElement).style.boxShadow = '0 0 10px red';
            }
          },
          {
            msg: errorMessage.substring(0, 300),
            snippet: errorSnippet.substring(0, 200),
            retryNum: testInfo.retry,
          },
        );

        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });

        Logger.error(testInfo.title, `[ANNOTATED SCREENSHOT] ${screenshotPath}`);

        const buffer = fs.readFileSync(screenshotPath);
        await testInfo.attach('failure-screenshot', {
          body: buffer,
          contentType: 'image/png',
        });

        await page.evaluate(() => {
          const el = document.getElementById('pw-error-overlay');
          if (el) el.remove();
        });
      } catch (e) {
        Logger.error(testInfo.title, `[SCREENSHOT FAILED] ${e instanceof Error ? e.message : e}`);
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

          fs.unlinkSync(flakyFilePath);
        }
      } catch {
        // silent
      }
    }

    // ✅ Capture video BEFORE context close
    // ─────────────────────────────────────────────
    let videoPath: string | undefined;

    try {
      const video = page.video();
      if (video) {
        videoPath = await video.path(); // temp path
      }
    } catch {
      // silent
    }

    // ✅ Flush logs
    Logger.flushAll();

    await context.close();

    if (videoPath) {
      Logger.info(testInfo.title, `🎥 Video saved: ${videoPath}`);
    }
  },
});

export const expect = test.expect;
