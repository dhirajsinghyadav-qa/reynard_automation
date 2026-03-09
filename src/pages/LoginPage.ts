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
  // private loginSuccessfull: Locator;
  private settingsHeading: Locator;
  private loginErrorMessage: Locator;
  /* private invalidEmailMessage: Locator;
  private emptyEmailMessage: Locator;
  private emptyPasswordMessage: Locator;
  private passwordValidationMessage: Locator; */

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    this.emailInput = page.getByRole('textbox', { name: 'Enter Your Email Here' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter Password Here' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Your Password?' });
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.rememberCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    // this.loginSuccessfull = page.getByText('Login Successfully!');
    this.settingsHeading = page.getByRole('paragraph').filter({ hasText: 'Settings' });
    this.loginErrorMessage = page.locator('text=Invalid'); // adjust if your app has different text
    /* this.invalidEmailMessage = page.getByText('Please enter a valid email');
    this.emptyEmailMessage = page.getByText('Please enter your email!');
    this.emptyPasswordMessage = page.getByText('Please enter your password!');
    this.passwordValidationMessage = page.getByText('Password must contain'); */
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

  /* async getVisibleError() {
    if (await this.emptyEmailMessage.isVisible().catch(() => false)) {
      return this.emptyEmailMessage;
    }
    if (await this.emptyPasswordMessage.isVisible().catch(() => false)) {
      return this.emptyPasswordMessage;
    }
    if (await this.invalidEmailMessage.isVisible().catch(() => false)) {
      return this.invalidEmailMessage;
    }
    if (await this.passwordValidationMessage.isVisible().catch(() => false)) {
      return this.passwordValidationMessage;
    }
    if (await this.loginErrorMessage.isVisible().catch(() => false)) {
      return this.loginErrorMessage;
    }
    return null;
  } */

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
      if (value === email) {
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
      if (value === password) {
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
        // this.loginErrorMessage.waitFor({ state: 'visible', timeout: 5000 }),
      ]);

      // Explicit checks with proper logging
      if (await this.settingsHeading.isVisible()) {
        Logger.info(this.testName, 'User login successful and redirected to Settings page');
      } else if (await this.loginErrorMessage.isVisible()) {
        const errorText = (await this.loginErrorMessage.textContent()) || 'Unknown login error';
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
}