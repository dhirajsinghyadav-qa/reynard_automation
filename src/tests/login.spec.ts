import { test, expect } from '@fixtures/pageObjectsFixture';
// import { DataFactory } from '../utils/dataGenerator';
import { LoginPage } from '../pages/LoginPage';
// import { Helpers } from '../utils/helpers';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

test.describe('Login Valid Scenarios Suite', () => {
  // 🔥 Test Start Log
  test.beforeEach(async ({ page: _page }, testInfo) => {
    Logger.info(testInfo.title, '===== TEST STARTED =====');
  });

  // 🔥 Test End Status Log
  test.afterEach(async ({ page: _page }, testInfo) => {
    if (testInfo.status === 'passed') {
      Logger.info(testInfo.title, '===== TEST PASSED =====');
    } else {
      Logger.error(testInfo.title, '===== TEST FAILED =====');
    }
  });

  // 🔥 Flush All Logs in Numeric Order (VERY IMPORTANT)
  test.afterAll(async () => {
    Logger.flushAll();
  });

  test('1. Verify direct login URL redirects to login page', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);
    await loginPage.verifyLoginPageLoaded();
    await expect(page).toHaveURL(/sign-in/);
  });

  test('2. Verify Forgot Password link clickable', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await expect(loginPage.getForgotPasswordLink()).toBeVisible();
    await expect(loginPage.getForgotPasswordLink()).toBeEnabled();

    await loginPage.clickForgotPassword();
  });

  test('3. Verify Login button is clickable', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await expect(loginPage.getLoginButton()).toBeVisible();
    await expect(loginPage.getLoginButton()).toBeEnabled();

    await loginPage.clickLoginButton();
  });

  test('4. Verify Remember Me  checkbox is clickable', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await expect(loginPage.getRememberCheckbox()).toBeVisible();
    await expect(loginPage.getRememberCheckbox()).toBeEnabled();

    await loginPage.clickRememberMe();
  });

  test('5. Verify user can enter email', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await loginPage.enterEmail(ENV.ADMIN_EMAIL);

    // Assertion
    await expect(loginPage.getEmailInput()).toHaveValue(ENV.ADMIN_EMAIL);
  });

  test('6. Verify user can enter password', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await loginPage.enterPassword(ENV.ADMIN_PASSWORD);

    // Assertion
    await expect(loginPage.getPasswordInput()).toHaveValue(ENV.ADMIN_PASSWORD);
  });
});
