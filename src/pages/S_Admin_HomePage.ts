import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

export class HomePage {
  private page: Page;
  private testName: string;

  private companiesHeading: Locator;
  private homeLink: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    this.companiesHeading = page.getByText('Companies');
    this.homeLink = page.getByRole('link', { name: 'Home' });
  }

  // ---------------- GETTERS ----------------
  getCompaniesHeading() {
    return this.companiesHeading;
  }
  getHomeLink() {
    return this.homeLink;
  }

  async verifyHomePageLoaded() {
    try {
      await this.companiesHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Super Admin landed on Home/Companies page successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Home page validation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
