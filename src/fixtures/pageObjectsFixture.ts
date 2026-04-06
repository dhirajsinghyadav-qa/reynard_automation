/* eslint-disable @typescript-eslint/no-explicit-any */

import { test as base, TestInfo } from '@playwright/test';
import { HomePage } from '../pages/S_Admin_HomePage';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../utils/logger';

/**
 * Enhanced Fixture that provides:
 * - loginPage: LoginPage instance
 * - dashboardPage: DashboardPage instance
 * - logger: Logger utility for test-level logging
 *
 * Usage in tests:
 * test('test name', async ({ page, loginPage, dashboardPage, logger }) => {
 *   logger.info('Starting test...');
 *   await loginPage.openMainURL();
 * });
 */

type PageObjectsFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  logger: typeof Logger;
};

export const test = base.extend<PageObjectsFixtures>({
  // Provide LoginPage instance
  loginPage: async ({ page }, use: (value: LoginPage) => Promise<void>) => {
    const testInfo = (page as any)._testInfo as TestInfo;
    const loginPage = new LoginPage(page, testInfo.title);
    await use(loginPage);
  },

  // Provide HomePage instance
  homePage: async ({ page }, use: (value: HomePage) => Promise<void>) => {
    const testInfo = (page as any)._testInfo as TestInfo;
    const homePage = new HomePage(page, testInfo.title);
    await use(homePage);
  },

  // Provide Logger utility
  // eslint-disable-next-line no-empty-pattern
  logger: async ({}, use: (value: typeof Logger) => Promise<void>) => {
    await use(Logger);
  },
});

export { expect } from '@playwright/test';
