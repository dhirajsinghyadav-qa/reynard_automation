import { test, expect } from '@fixtures/pageObjectsFixture';
import { DataFactory } from '../utils/dataGenerator';
import { LoginPage } from '../pages/LoginPage';
// import loginData from '@data/loginData.json';
// import { Helpers } from '../utils/helpers';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

test.describe('Login Valid and Invalid Scenarios Suite', () => {
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

  test('7. Verify admin can login with valid credentials and is redirected to Settings page', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await loginPage.loginAndValidate(ENV.ADMIN_EMAIL, ENV.ADMIN_PASSWORD);

    // Verify user is redirected to Settings page after successful login
    await loginPage.verifyRedirectToSettings();
    await expect(page).toHaveURL(/setting/);
  });

  test('8. Verify login fails with unregistered email and valid password', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('unregisteredEmail');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Unregistered email with valid password',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('9. Verify login fails with valid email and incorrect password', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('wrongPassword');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Valid email with invalid password',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('10. Verify validation for invalid email format', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('invalidEmailFormat');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Invalid email format',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('11. Verify validation message when email field is empty', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('emptyEmail');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Empty email',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });
});

/*
test.describe('Invalid Login Scenarios', () => {

  loginData.invalidLogin.forEach((data) => {

    test(`Verify invalid login: ${data.scenario}`, async ({ page }, testInfo) => {

      const loginPage = new LoginPage(page, testInfo.title);

      await page.goto('/authentication/sign-in');

      await loginPage.getEmailInput().fill(data.email);
      await loginPage.getPasswordInput().fill(data.password);
      await loginPage.getLoginButton().click();

      const error = await loginPage.getVisibleError();

      await expect(error).toBeVisible();
      await expect(error).toContainText(data.expectedError);

    });

  });

}); */
