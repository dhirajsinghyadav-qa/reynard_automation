/* import { DataFactory } from '../utils/dataGenerator';
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

// ─────────────────────────────────────────────────────────────
// LoginFixture — Solution 4 me bhi available
// Agar storageState expire ho ya kisi reason se session na mile
// to fallback ke taur pe use kar sakte ho
// ─────────────────────────────────────────────────────────────

type LoginFixtures = {
  loginAsAdmin: () => Promise<void>;
};

export const test = base.extend<LoginFixtures>({

  loginAsAdmin: async ({ page }, use, testInfo) => {

    const loginFn = async (): Promise<void> => {
      const loginPage = new LoginPage(page, testInfo.title);
      const data = DataFactory.validCredentials('SUPER_ADMIN');

      Logger.info(testInfo.title, '── Global Login: Starting Super Admin login ──');

      await page.goto(ENV.BASE_URL_QA);
      await loginPage.verifyLoginPageLoaded();
      await loginPage.loginAndValidate(data.email, data.password);
      await page.waitForURL(/home/i, { timeout: 30000 });

      Logger.info(testInfo.title, '── Global Login: Super Admin login successful ✅ ──');
    };

    await use(loginFn);
  },

});

export { expect } from '@playwright/test'; */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DataFactory } from '../utils/dataGenerator';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

// ─────────────────────────────────────────────────────────────
// LoginFixture — Global Login Flow
// Kisi bhi module ke test me directly call karo:
// await loginAsAdmin()  → login complete ✅
// ─────────────────────────────────────────────────────────────

type LoginFixtures = {
  loginAsAdmin: () => Promise<void>;
};

export const test = base.extend<LoginFixtures>({
  loginAsAdmin: async ({ page }, use, testInfo) => {
    const loginFn = async (): Promise<void> => {
      const loginPage = new LoginPage(page, testInfo.title);
      const data = DataFactory.validCredentials('SUPER_ADMIN');

      Logger.info(testInfo.title, '── Global Login: Starting Super Admin login ──');

      await page.goto(ENV.BASE_URL_QA);
      await loginPage.verifyLoginPageLoaded();
      await loginPage.loginAndValidate(data.email, data.password);

      Logger.info(testInfo.title, '── Global Login: Super Admin login successful ✅ ──');
    };

    await use(loginFn);
  },
});

export { expect } from '@playwright/test';
