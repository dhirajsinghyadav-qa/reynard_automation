/* import { test as base } from '@playwright/test';

// ✅ Custom fixture (ONLY context control)
export const test = base.extend({
  page: async ({ browser }, use) => {
    const context = await browser.newContext({
      permissions: [], // 🔥 block notification popup
    });

    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});

export const expect = test.expect;
 */

import { STORAGE_STATE_PATH } from '../../global-setup';
import { test as base } from '@playwright/test';
import fs from 'fs';

// ✅ Custom fixture — storageState aware context
export const test = base.extend({
  page: async ({ browser }, use, testInfo) => {
    // ── Login tests ke liye → fresh context (no storageState) ──
    const isLoginTest = testInfo.file.includes('login.spec');

    const contextOptions = isLoginTest
      ? {
          permissions: [], // 🔥 block notification popup
        }
      : {
          permissions: [],
          // ✅ storageState inject — agar file exist kare to
          ...(fs.existsSync(STORAGE_STATE_PATH) && {
            storageState: STORAGE_STATE_PATH,
          }),
        };

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});

export const expect = test.expect;
