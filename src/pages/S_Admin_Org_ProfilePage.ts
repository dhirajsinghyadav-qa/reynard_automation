import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

// ─────────────────────────────────────────────────────────────
// EyeIcon & ProfilePage — Page Object Model
// Only: Actions, Flow, Functionality, Logs
// No assertions here
// ─────────────────────────────────────────────────────────────

export class OrgProfilePage {
  private page: Page;
  private testName: string;

  // ── Eye Icon ──
  private eyeIconButton: Locator;

  // ── Profile Details Panel ──
  private profileDetailsPanel: Locator;
  private adminDetailsHeading: Locator;

  // ── Profile Info ──
  private profileAdminName: Locator;
  private profileAdminEmail: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    // ── Eye Icon ──
    this.eyeIconButton = page
      .locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorSecondary')
      .first();

    // ── Profile Details Panel ──
    this.profileDetailsPanel = page.locator('.MuiBox-root.css-11b450n');
    this.adminDetailsHeading = page.getByRole('heading', { name: 'Admin Details' });

    // ── Profile Info ──
    this.profileAdminName = page.getByText('Tim Naber');
    this.profileAdminEmail = page.getByText('tim.naber@reynard.nl');
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

  getEyeIconButton() {
    return this.eyeIconButton;
  }
  getProfileDetailsPanel() {
    return this.profileDetailsPanel;
  }
  getAdminDetailsHeading() {
    return this.adminDetailsHeading;
  }
  getProfileAdminName() {
    return this.profileAdminName;
  }
  getProfileAdminEmail() {
    return this.profileAdminEmail;
  }

  // ─────────────────────────────────────────────────────────────
  // EYE ICON — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForEyeIconVisible(): Promise<void> {
    try {
      await this.eyeIconButton.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Eye icon is visible on Home page');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Eye icon not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForEyeIconEnabled(): Promise<void> {
    try {
      await expect(this.eyeIconButton).toBeEnabled();
      Logger.info(this.testName, 'Eye icon is enabled and clickable');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Eye icon not enabled: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickEyeIcon(): Promise<void> {
    try {
      await this.eyeIconButton.waitFor({ state: 'visible' });
      await this.eyeIconButton.click();
      Logger.info(this.testName, 'Eye icon clicked successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Eye icon click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PROFILE DETAILS — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForProfilePanelVisible(): Promise<void> {
    try {
      await this.profileDetailsPanel.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Profile details panel is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Profile details panel not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForAdminDetailsHeadingVisible(): Promise<void> {
    try {
      await this.adminDetailsHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Admin Details heading is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Admin Details heading not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForProfileAdminNameVisible(): Promise<void> {
    try {
      await this.profileAdminName.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Profile admin name is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Profile admin name not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForProfileAdminEmailVisible(): Promise<void> {
    try {
      await this.profileAdminEmail.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Profile admin email is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Profile admin email not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async logProfileData(): Promise<void> {
    try {
      const panelText = await this.profileDetailsPanel.textContent();
      const headingText = await this.adminDetailsHeading.textContent();
      Logger.info(this.testName, `Profile Panel Data  : "${panelText?.trim()}"`);
      Logger.info(this.testName, `Admin Details Heading: "${headingText?.trim()}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Failed to log profile data: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // COMBINED FLOW — Eye Icon Click → Profile Verify
  // ─────────────────────────────────────────────────────────────

  async clickEyeIconAndWaitForProfile(): Promise<void> {
    try {
      Logger.info(this.testName, '── Eye Icon Flow: Starting ──');
      await this.waitForEyeIconVisible();
      await this.waitForEyeIconEnabled();
      await this.clickEyeIcon();
      await this.waitForProfilePanelVisible();
      await this.waitForAdminDetailsHeadingVisible();
      await this.logProfileData();
      Logger.info(this.testName, '── Eye Icon Flow: Completed ──');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Eye icon flow failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
