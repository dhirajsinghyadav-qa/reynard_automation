import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

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
  private settingsHeading: Locator;

  private userNotRegisteredMessage: Locator;
  private incorrectUsernameMessage: Locator;
  private invalidEmailMessage: Locator;
  private emptyEmailMessage: Locator;
  private emptyPasswordMessage: Locator;
  private passwordLengthValidationMessage: Locator;
  private passwordFormatValidationMessage: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    this.emailInput = page.getByRole('textbox', { name: 'Enter Your Email Here' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter Password Here' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Your Password?' });
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.rememberCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.settingsHeading = page.getByRole('paragraph').filter({ hasText: 'Settings' });

    this.userNotRegisteredMessage = page.getByText('User is not registered.');
    this.incorrectUsernameMessage = page.getByText('Please enter correct username');

    this.invalidEmailMessage = page.getByText('Enter Valid Email Address');
    this.emptyEmailMessage = page.getByText('Enter the email');
    this.emptyPasswordMessage = page.getByText('Enter the password');

    this.passwordLengthValidationMessage = page.getByText('Password must be between 8-16');
    this.passwordFormatValidationMessage = page.getByText('Password must contain at');
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
  getSettingsHeading() {
    return this.settingsHeading;
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
    return null;
  }

  // ✅ ADD THIS FUNCTION HERE
  async waitForAnyError(timeout: number = 10000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const error = await this.getVisibleError();

      if (error) {
        return error;
      }

      await this.page.waitForTimeout(300);
    }

    return null;
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
    try {
      await this.loginButton.waitFor({ state: 'visible' });
      await this.loginButton.click();
      Logger.info(this.testName, 'Login button clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Click Login failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
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

      await Promise.race([
        this.settingsHeading.waitFor({ state: 'visible', timeout: 5000 }),
        this.userNotRegisteredMessage.waitFor({ state: 'visible', timeout: 5000 }),
      ]);

      // Explicit checks with proper logging
      if (await this.settingsHeading.isVisible()) {
        Logger.info(this.testName, 'User login successful and redirected to Settings page');
      } else if (await this.userNotRegisteredMessage.isVisible()) {
        const errorText =
          (await this.userNotRegisteredMessage.textContent()) || 'Unknown login error';
        Logger.error(this.testName, `Login failed: ${errorText}`);
        throw new Error(`Login failed: ${errorText}`);
      } else {
        Logger.error(this.testName, 'Unknown login state detected after clicking login');
        throw new Error('Unknown login state detected after clicking login');
      }
    } catch (error: unknown) {
      // Catch ensures any async failures also logged as ERROR
      Logger.error(
        this.testName,
        `loginAndValidate error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ---------------- ORGANIZATION REDIRECT VALIDATION ----------------
  async verifyRedirectToSettings() {
    try {
      await this.settingsHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Admin redirected to Settings page successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Settings redirect failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ---------------- INVALID LOGIN FLOW ----------------

  async performInvalidLogin(email: string, password: string, scenario: string) {
    try {
      Logger.info(this.testName, `Executing invalid login scenario: ${scenario}`);

      if (email !== undefined && email !== null) {
        if (email.trim().length === 0) {
          Logger.warn(this.testName, 'Email is empty');
          await this.enterEmail('');
        } else {
          await this.enterEmail(email);
          if (email !== email.trim()) {
            Logger.warn(this.testName, 'Email contains leading or trailing spaces');
          }
        }
      } else {
        Logger.warn(this.testName, 'Email not provided for this scenario');
      }

      if (password !== undefined && password !== null) {
        if (password.trim().length === 0) {
          Logger.warn(this.testName, 'Password is empty');
          await this.enterPassword('');
        } else {
          if (password !== password.trim()) {
            Logger.warn(this.testName, 'Password contains leading or trailing spaces');
          }
          await this.enterPassword(password);
        }
      } else {
        Logger.warn(this.testName, 'Password not provided for this scenario');
      }

      await this.clickLoginButton();
      await this.page.waitForLoadState('networkidle');

      // Wait for any error message to appear
      await Promise.race([
        this.userNotRegisteredMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
        this.incorrectUsernameMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
        this.invalidEmailMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
        this.emptyEmailMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
        this.emptyPasswordMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
        this.passwordLengthValidationMessage
          .waitFor({ state: 'visible', timeout: 10000 })
          .catch(() => {}),
        this.passwordFormatValidationMessage
          .waitFor({ state: 'visible', timeout: 10000 })
          .catch(() => {}),
      ]);

      const errorLocator = await this.getVisibleError();
      if (errorLocator) {
        const errorText = await errorLocator.textContent().catch(() => '');
        Logger.info(this.testName, `Validation detected: ${errorText}`);
      } else {
        Logger.warn(this.testName, 'No validation message detected after invalid login');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Invalid login execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
