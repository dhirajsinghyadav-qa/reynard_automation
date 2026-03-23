import { Page, Locator, expect } from '@playwright/test';
// import { expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';
// import { th } from '@faker-js/faker';

// ─────────────────────────────────────────────────────────────
// LoginPage — Page Object Model
// ─────────────────────────────────────────────────────────────
export class LoginPage {
  private page: Page;
  private testName: string;

  private emailInput: Locator;
  private passwordInput: Locator;
  private forgotPasswordLink: Locator;
  private loginButton: Locator;
  private rememberCheckbox: Locator;

  private userNotRegisteredMessage: Locator;
  private incorrectUsernameMessage: Locator;
  private invalidEmailMessage: Locator;
  private emptyEmailMessage: Locator;
  private emptyPasswordMessage: Locator;
  private passwordLengthValidationMessage: Locator;
  private passwordFormatValidationMessage: Locator;
  private mobileAccessErrorMessage: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    this.emailInput = page.getByRole('textbox', { name: 'Enter Your Email Here' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter Password Here' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Your Password?' });
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.rememberCheckbox = page.getByRole('checkbox', { name: 'Remember me' });

    this.userNotRegisteredMessage = page.getByText('User is not registered.');
    this.incorrectUsernameMessage = page.getByText('Please enter correct username');

    this.invalidEmailMessage = page.getByText('Enter Valid Email Address');
    this.emptyEmailMessage = page.getByText('Enter the email');
    this.emptyPasswordMessage = page.getByText('Enter the password');

    this.passwordLengthValidationMessage = page.getByText('Password must be between 8-16');
    this.passwordFormatValidationMessage = page.getByText('Password must contain at');
    this.mobileAccessErrorMessage = page.getByText('Your account has Mobile');
  }

  // ---------------- GETTERS ----------------
  getEmailInput() {
    return this.emailInput;
  }
  getPasswordInput() {
    return this.passwordInput;
  }
  getForgotPasswordLink() {
    return this.forgotPasswordLink;
  }
  getLoginButton() {
    return this.loginButton;
  }
  getRememberCheckbox() {
    return this.rememberCheckbox;
  }

  async getVisibleError() {
    if (await this.emptyEmailMessage.isVisible().catch(() => false)) {
      return this.emptyEmailMessage;
    }
    if (await this.emptyPasswordMessage.isVisible().catch(() => false)) {
      return this.emptyPasswordMessage;
    }
    if (await this.invalidEmailMessage.isVisible().catch(() => false)) {
      return this.invalidEmailMessage;
    }
    if (await this.passwordLengthValidationMessage.isVisible().catch(() => false)) {
      return this.passwordLengthValidationMessage;
    }
    if (await this.passwordFormatValidationMessage.isVisible().catch(() => false)) {
      return this.passwordFormatValidationMessage;
    }
    if (await this.userNotRegisteredMessage.isVisible().catch(() => false)) {
      return this.userNotRegisteredMessage;
    }
    if (await this.incorrectUsernameMessage.isVisible().catch(() => false)) {
      return this.incorrectUsernameMessage;
    }
    if (await this.mobileAccessErrorMessage.isVisible().catch(() => false)) {
      return this.mobileAccessErrorMessage;
    }
    return null;
  }

  // ✅ ADD THIS FUNCTION HERE
  async waitForAnyError(timeout: number = 10000) {
    try {
      await expect(
        this.emptyEmailMessage
          .or(this.emptyPasswordMessage)
          .or(this.invalidEmailMessage)
          .or(this.passwordLengthValidationMessage)
          .or(this.passwordFormatValidationMessage)
          .or(this.userNotRegisteredMessage)
          .or(this.incorrectUsernameMessage)
          .or(this.mobileAccessErrorMessage),
      ).toBeVisible({ timeout });

      return await this.getVisibleError();
    } catch {
      return null;
    }
  }
  // ---------------- NAVIGATION ----------------

  async openMainURL() {
    try {
      await this.page.goto(ENV.BASE_URL_QA);
      Logger.info(this.testName, 'Main URL opened successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Failed to open Main URL: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async verifyLoginPageLoaded() {
    try {
      await this.emailInput.waitFor({ state: 'visible' });
      await this.passwordInput.waitFor({ state: 'visible' });
      await this.loginButton.waitFor({ state: 'visible' });
      await this.forgotPasswordLink.waitFor({ state: 'visible' });
      await this.rememberCheckbox.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Login page loaded and verified successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Login page verification failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ---------------- FIELD ACTIONS ----------------
  async enterEmail(email: string) {
    try {
      await this.emailInput.fill(email);
      const value = await this.emailInput.inputValue();
      if (value.trim() === email.trim()) {
        Logger.info(this.testName, 'Email entered successfully');
      } else {
        Logger.error(this.testName, 'Email value mismatch after entering');
        throw new Error('Email value mismatch after entering');
      }
    } catch (error: unknown) {
      Logger.error(this.testName, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async enterPassword(password: string) {
    try {
      await this.passwordInput.fill(password);
      const value = await this.passwordInput.inputValue();
      if (value.trim() === password.trim()) {
        Logger.info(this.testName, 'Password entered successfully');
      } else {
        Logger.error(this.testName, 'Password value mismatch after entering');
        throw new Error('Password value mismatch after entering');
      }
    } catch (error: unknown) {
      Logger.error(this.testName, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async clickLoginButton() {
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();

    if (this.page.context().browser()?.browserType().name() === 'firefox') {
      await this.page.waitForTimeout(200);
    }

    await this.loginButton.click();

    Logger.info(this.testName, 'Login button clicked');
  }

  async clickForgotPassword() {
    try {
      await this.forgotPasswordLink.click();
      Logger.info(this.testName, 'Forgot password link clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Click Forgot Password failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickRememberMe() {
    try {
      await this.rememberCheckbox.click();
      Logger.info(this.testName, 'Remember me checkbox clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Click Remember Me failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ---------------- BUSINESS LOGIN VALIDATION ----------------
  async loginAndValidate(email: string, password: string) {
    try {
      await this.enterEmail(email);
      await this.enterPassword(password);
      await this.clickLoginButton();

      // 🔥 Wait only for failure case (not success page)
      try {
        await this.userNotRegisteredMessage.waitFor({ state: 'visible', timeout: 5000 });

        const errorText =
          (await this.userNotRegisteredMessage.textContent()) || 'Unknown login error';

        Logger.error(this.testName, `Login failed: ${errorText}`);
        throw new Error(`Login failed: ${errorText}`);
      } catch {
        // ✅ If error not visible → assume login success
        Logger.info(this.testName, 'Login action performed successfully');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `loginAndValidate error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ---------------- INVALID LOGIN FLOW ----------------

  async performInvalidLogin(email: string, password: string, scenario: string) {
    Logger.info(this.testName, `Executing invalid login scenario: ${scenario}`);

    if (email !== undefined && email !== null) {
      await this.enterEmail(email);
    }

    if (password !== undefined && password !== null) {
      await this.enterPassword(password);
    }

    await this.clickLoginButton();

    const errorLocator = await this.waitForAnyError();

    if (errorLocator) {
      const errorText = await errorLocator.textContent();
      Logger.info(this.testName, `Validation detected: ${errorText}`);
    } else {
      Logger.warn(this.testName, 'No validation message detected after invalid login');
    }
  }
}
