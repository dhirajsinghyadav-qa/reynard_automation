import { DataFactory } from '../utils/dataGenerator';
import { HomePage } from '../pages/S_Admin_HomePage';
import { SettingsPage } from '../pages/SettingsPage';
import { test, expect } from '@fixtures/baseTest';
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

  test('@smoke 1. Verify direct login URL redirects to login page', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);
    await loginPage.verifyLoginPageLoaded();
    await expect(page).toHaveURL(/sign-in/);
  });
  /*
  test('@regression 2. Verify Remember Me checkbox is clickable', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await expect(loginPage.getRememberCheckbox()).toBeVisible();
    await expect(loginPage.getRememberCheckbox()).toBeEnabled();

    await loginPage.clickRememberMe();
  });*/

  test('@smoke 3. Verify Super Admin can login with valid credentials and is redirected to Home/Companies page', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const homePage = new HomePage(page, testInfo.title);
    const data = DataFactory.validCredentials('SUPER_ADMIN');

    await page.goto(ENV.BASE_URL_QA);

    await loginPage.loginAndValidate(data.email, data.password);

    await homePage.verifyHomePageLoaded();
    await expect(page).toHaveURL(/home/);
  });

  test('@smoke 4. Verify admin can login with valid credentials and is redirected to Settings page', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const settingsPage = new SettingsPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await loginPage.loginAndValidate(ENV.ADMIN_EMAIL, ENV.ADMIN_PASSWORD);

    // Verify user is redirected to Settings page after successful login
    await settingsPage.verifyRedirectToSettings();
    await expect(page).toHaveURL(/setting/);
  });
  /*
  test('@smoke 5. Verify Any Custom User can login with valid credentials and is redirected to Settings page', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const settingsPage = new SettingsPage(page, testInfo.title);

    const data = DataFactory.validCredentials('CUSTOM');

    await page.goto(ENV.BASE_URL_QA);

    await loginPage.loginAndValidate(data.email, data.password);

    await settingsPage.verifyRedirectToSettings();
    await expect(page).toHaveURL(/setting/);
  });

  test('@regression 6. Verify login fails with unregistered email and valid password', async ({
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

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 7. Verify login fails with valid email and incorrect password', async ({
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

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 8. Verify validation for invalid email format', async ({ page }, testInfo) => {
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

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 9. Verify validation message when email field is empty', async ({
    page,
  }, testInfo) => {
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

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 10. Verify validation message when password field is empty', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('emptyPassword');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Empty password',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 11. Verify login fails with leading or trailing spaces in credentials', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('leadingTrailingSpaces');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Email and password with leading and trailing spaces',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 12. Verify password validation when password is less than 8 characters', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('passwordLessThan8');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Password less than 8 characters',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 13. Verify password validation when password exceeds 16 characters', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('passwordMoreThan16');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Password more than 16 characters',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 14. Verify password validation when password has no uppercase letter', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('passwordWithoutUppercase');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Password without uppercase letter',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 15. Verify password validation when password has no special character', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('passwordWithoutSymbol');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Password without special symbol',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 16. Verify password validation when password has no numeric character', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('passwordWithoutNumber');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Password without number',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(loginPage.getSettingsHeading()).not.toBeVisible();
  });

  test('@regression 17. Verify the user can try to login using valid credentials who have access only to the mobile application.', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page, testInfo.title);
    const data = DataFactory.invalidCredentials('ONLY_MOBILE_USER');
    await page.goto(ENV.BASE_URL_QA);

    await loginPage.performInvalidLogin(
      data.email,
      data.password,
      data.description || 'Only mobile access user',
    );

    const errorLocator = await loginPage.getVisibleError();
    expect(errorLocator).not.toBeNull();
    await expect(errorLocator!).toBeVisible();

    // await expect(sig.getSettingsHeading()).not.toBeVisible();
  }); */
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
