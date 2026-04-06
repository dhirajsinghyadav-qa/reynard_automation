import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

export class SettingsPage {
  private page: Page;
  private testName: string;

  private settingsHeading: Locator;

  // Settings Sections
  private organizationSection: Locator;
  private projectManagementSection: Locator;
  private actionsSection: Locator;
  private userManagementSection: Locator;
  private qhseSection: Locator;
  private equipmentSection: Locator;
  private personalSettingSection: Locator;

  // Sidebar
  private projectManagementMenu: Locator;
  private settingsMenu: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    this.settingsHeading = page.getByRole('paragraph').filter({ hasText: 'Settings' });

    // ─────────────────────────────
    // SETTINGS PAGE (RIGHT SIDE)
    // ─────────────────────────────

    this.organizationSection = page.getByRole('heading', { name: 'Organization' });
    this.projectManagementSection = page.getByRole('heading', { name: 'Project Management' });
    this.actionsSection = page.getByRole('heading', { name: 'Actions' });
    this.userManagementSection = page.getByRole('heading', { name: 'User Management' });
    this.qhseSection = page.getByRole('heading', { name: 'Quality, Health & Safety' });
    this.equipmentSection = page.getByRole('heading', { name: 'Equipment' });
    this.personalSettingSection = page.getByRole('heading', { name: 'Personal Setting' });

    // ─────────────────────────────
    // SIDEBAR MENU (LEFT SIDE)
    // ─────────────────────────────

    this.projectManagementMenu = page.getByRole('link', { name: 'Project Management' });
    this.settingsMenu = page.getByRole('link', { name: 'Settings' });
  }

  // ---------------- GETTERS ----------------
  getSettingsHeading() {
    return this.settingsHeading;
  }
  getOrganizationSection(): Locator {
    return this.organizationSection;
  }

  getProjectManagementSection(): Locator {
    return this.projectManagementSection;
  }

  getActionsSection(): Locator {
    return this.actionsSection;
  }

  getUserManagementSection(): Locator {
    return this.userManagementSection;
  }

  getQHSESection(): Locator {
    return this.qhseSection;
  }

  getEquipmentSection(): Locator {
    return this.equipmentSection;
  }

  getPersonalSettingSection(): Locator {
    return this.personalSettingSection;
  }

  getProjectManagementMenu(): Locator {
    return this.projectManagementMenu;
  }

  getSettingsMenu(): Locator {
    return this.settingsMenu;
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

  async verifySettingsPageWithLogs(): Promise<void> {
    const checks: Array<{ name: string; locator: Locator }> = [
      { name: 'Organization Section', locator: this.getOrganizationSection() },
      { name: 'Project Management Section', locator: this.getProjectManagementSection() },
      { name: 'Actions Section', locator: this.getActionsSection() },
      { name: 'User Management Section', locator: this.getUserManagementSection() },
      { name: 'QHSE Section', locator: this.getQHSESection() },
      { name: 'Equipment Section', locator: this.getEquipmentSection() },
      { name: 'Personal Setting Section', locator: this.getPersonalSettingSection() },
    ];

    for (const check of checks) {
      await expect(check.locator).toBeVisible();
      Logger.info(this.testName || 'TEST', `Visible: ${check.name}`);
    }
  }
}
