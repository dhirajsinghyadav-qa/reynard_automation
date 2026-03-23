import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

export class SettingsPage {
  private page: Page;
  private testName: string;

  private settingsHeading: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    this.settingsHeading = page.getByRole('paragraph').filter({ hasText: 'Settings' });
  }

  // ---------------- GETTERS ----------------
  getSettingsHeading() {
    return this.settingsHeading;
  }

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
