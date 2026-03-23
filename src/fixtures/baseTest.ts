import { test as base } from '@playwright/test';

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
