import { Page, Locator } from '@playwright/test';
import { ProfileData } from '@/utils/dataGenerator';
import { Logger } from '../utils/logger';

// ─────────────────────────────────────────────────────────────
// EyeIcon & ProfilePage — Page Object Model
// Only: Actions, Flow, Functionality, Logs
// No assertions here
// ─────────────────────────────────────────────────────────────

export class OrgAdminProfilePage {
  private page: Page;
  private testName: string;

  // ── Eye Icon ──
  private eyeIconButton: Locator;

  // ── Profile Info ──
  private profileAdminName: Locator;
  private profileAdminEmail: Locator;

  // ── Tabs ──
  private adminDetailsTab: Locator;
  private organizationProfileTab: Locator;
  private licenseTab: Locator;

  // ── Profile Details Panel ──
  private adminDetailsHeading: Locator;
  private adminProfileDetailsPanel: Locator;

  // ── Organization Profile Section ──
  private organizationProfileHeading: Locator;
  private organizationProfilePanel: Locator;

  // ── License Section ──
  private licenseHeading: Locator;
  private licensePanel: Locator;

  // ── Edit Icon ──
  private editIcon: Locator;

  // ── Update Admin Profile Popup ──
  private updateProfilePopup: Locator;
  private updateButton: Locator;
  private updateAdminProfileCancelIcon: Locator;

  // ── Update Form Fields ──
  private usualFirstNameInput: Locator;
  private firstNamesInput: Locator;
  private lastNamesInput: Locator;
  private emailInput: Locator;
  private phoneInput: Locator;
  private countrySelectButton: Locator;
  private languageInput: Locator;
  private addressInput: Locator;
  private emergencyContactInput: Locator;

  // ── Validation Messages ──
  private invalidEmailMessage: Locator;
  private requiredFieldMessages: Locator;

  // ── Popup Confirmation ──
  private removePermissionHeading: Locator;
  private approvePermissionHeading: Locator;
  private approveButton: Locator;
  private rejectButton: Locator;
  private confirmationCancelIcon: Locator;

  // ── Success Alert ──
  private successAlert: Locator;
  private licenseProvisionedAlert: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    // ── Eye Icon ──
    this.eyeIconButton                = page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorSecondary').first();

    // ── Profile Info ──
    this.profileAdminName             = page.locator('p').filter({ hasText: /^[A-Za-z]/ }).first();
    this.profileAdminEmail            = page.locator('p').filter({ hasText: /@/ }).first();

    // ── Tabs — dynamic by role ──
    this.adminDetailsTab              = page.getByRole('tab', { name: 'Admin Details' });
    this.organizationProfileTab       = page.getByRole('tab', { name: 'Organization Profile' });
    this.licenseTab                   = page.getByRole('tab', { name: 'License' });

    // ── Section headings ──
    this.adminDetailsHeading          = page.getByRole('heading', { name: 'Admin Details' });
    this.adminProfileDetailsPanel     = page.locator('[class*="MuiBox"], [class*="MuiGrid"]').filter({ has: page.getByRole('heading', { name: 'Admin Details' }) }).first();
    this.organizationProfileHeading   = page.getByRole('heading', { name: 'Organization Profile' });
    this.organizationProfilePanel     = page.locator('.MuiBox-root.css-11b450n');
    this.licenseHeading               = page.getByRole('heading', { name: 'License' });
    this.licensePanel                 = page.locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-true');

    // ── Edit Icon — dynamic ──
    this.editIcon                     = page.getByTestId('EditOutlinedIcon');

    // ── Update Profile Popup ──
    this.updateProfilePopup           = page.getByText('Update Admin Profile');
    this.updateButton                 = page.getByRole('button', { name: 'Update' });
    this.updateAdminProfileCancelIcon = page.getByTestId('CancelOutlinedIcon').first();

    // ── Form Fields — dynamic by role ──
    this.usualFirstNameInput          = page.getByRole('textbox', { name: 'Usual First Name' });
    this.firstNamesInput              = page.getByRole('textbox', { name: 'First Names' });
    this.lastNamesInput               = page.getByRole('textbox', { name: 'Last Names' });
    this.emailInput                   = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput                   = page.getByRole('textbox', { name: '1 (702) 123-' }).first();
    this.countrySelectButton          = page.getByRole('button', { name: /^(Select|India|Netherlands|United States|Laos|.*)/i }).filter({ hasText: /Select|India|Netherlands|United|Laos/i }).first();
    this.languageInput                = page.getByRole('textbox', { name: 'Enter Language Name' });
    this.addressInput                 = page.getByRole('textbox', { name: 'Please Enter Address' });
    this.emergencyContactInput        = page.getByRole('textbox', { name: '1 (702) 123-' }).nth(1);

    // ── Validation Messages ──
    this.invalidEmailMessage          = page.getByText('Enter Valid Email Address');
    this.requiredFieldMessages        = page.locator('text=Required.');

    // ── Confirmation Popups ──
    this.removePermissionHeading      = page.getByText('Remove Permission', { exact: true });
    this.approvePermissionHeading     = page.locator('div').filter({ hasText: /^Approve Permission$/ });
    this.approveButton                = page.getByRole('button', { name: 'Approve' });
    this.rejectButton                 = page.getByRole('button', { name: 'Reject' });
    this.confirmationCancelIcon       = page.getByTestId('CancelOutlinedIcon');

    // ── Success Alert ──
    this.successAlert                 = page.getByRole('alert');
    this.licenseProvisionedAlert      = page.getByRole('alert').locator('div').filter({ hasText: 'License provisioned' });

    // ── Profile Info ──
    this.profileAdminName             = page.getByText('Tim Naber');
    this.profileAdminEmail            = page.getByText('tim.naber@reynard.nl');
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

  getEyeIconButton() {
    return this.eyeIconButton;
  }
  getProfileAdminName() {
    return this.profileAdminName;
  }
  getProfileAdminEmail() {
    return this.profileAdminEmail;
  }
  getAdminDetailsTab() {
    return this.adminDetailsTab;
  }
  getOrganizationProfileTab() {
    return this.organizationProfileTab;
  }
  getLicenseTab() {
    return this.licenseTab;
  }
  getAdminDetailsHeading() {
    return this.adminDetailsHeading;
  }
  getAdminProfileDetailsPanel() {
    return this.adminProfileDetailsPanel;
  }
  getOrganizationProfileHeading() {
    return this.organizationProfileHeading;
  }
  getOrganizationProfilePanel() {
    return this.organizationProfilePanel;
  }
  getLicenseHeading() {
    return this.licenseHeading;
  }
  getLicensePanel() {
    return this.licensePanel;
  }
  getEditIcon() {
    return this.editIcon;
  }
  getUpdateProfilePopup() {
    return this.updateProfilePopup;
  }
  getUpdateButton() {
    return this.updateButton;
  }
  getUpdateAdminProfileCancelIcon() {
    return this.updateAdminProfileCancelIcon;
  }
  getUsualFirstNameInput() {
    return this.usualFirstNameInput;
  }
  getFirstNamesInput() {
    return this.firstNamesInput;
  }
  getLastNamesInput() {
    return this.lastNamesInput;
  }
  getEmailInput() {
    return this.emailInput;
  }
  getPhoneInput() {
    return this.phoneInput;
  }
  getCountrySelectButton() {
    return this.countrySelectButton;
  }
  getLanguageInput() {
    return this.languageInput;
  }
  getAddressInput() {
    return this.addressInput;
  }
  getEmergencyContactInput(): Locator {
    return this.emergencyContactInput;
  }
  getInvalidEmailMessage() {
    return this.invalidEmailMessage;
  }
  getRequiredFieldMessages() {
    return this.requiredFieldMessages;
  }
  getRemovePermissionHeading() {
    return this.removePermissionHeading;
  }
  getApprovePermissionHeading() {
    return this.approvePermissionHeading;
  }
  getApproveButton() {
    return this.approveButton;
  }
  getRejectButton() {
    return this.rejectButton;
  }
  getSuccessAlert() {
    return this.successAlert;
  }
  getLicenseProvisionedAlert() {
    return this.licenseProvisionedAlert;
  }
  getConfirmationCancelIcon() {
    return this.confirmationCancelIcon;
  }

  // ── Dynamic — License checkbox by name ──
  getLicenseCheckbox(licenseName: string): Locator {
    return this.page.getByRole('checkbox', { name: licenseName });
  }

  // ── Dynamic — License dropdown button by name ──
  getLicenseDropdownButton(licenseName: string): Locator {
    return this.page.getByRole('button', { name: licenseName });
  }

  // ── Dynamic — Get current field value ──
  async getFieldValue(locator: Locator): Promise<string> {
    return (await locator.inputValue()).trim();
  }

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────
  private async clearInputIfNotEmpty(locator: Locator, fieldName: string) {
    const value = (await locator.inputValue().catch(() => '')).trim();

    if (value !== '') {
      await locator.fill('');
      Logger.info(this.testName, `${fieldName} cleared`);
    } else {
      Logger.info(this.testName, `${fieldName} already empty → skipped`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // TAB NAVIGATION — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForProfilePageLoaded(): Promise<void> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      await this.adminDetailsTab.waitFor({ state: 'visible', timeout: 20000 });
      Logger.info(this.testName, 'Profile page loaded — tabs visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Profile page load failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickAdminDetailsTab(): Promise<void> {
    try {
      await this.adminDetailsTab.waitFor({ state: 'visible' });
      await this.adminDetailsTab.click();
      Logger.info(this.testName, 'Admin Details tab clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Admin Details tab click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickOrganizationProfileTab(): Promise<void> {
    try {
      await this.organizationProfileTab.waitFor({ state: 'visible' });
      await this.organizationProfileTab.click();
      await this.organizationProfileHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Organization Profile tab clicked — content loaded');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Organization Profile tab click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickLicenseTab(): Promise<void> {
    try {
      await this.licenseTab.waitFor({ state: 'visible' });
      await this.licenseTab.click();
      await this.licenseHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'License tab clicked — content loaded');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `License tab click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LICENSE — DROPDOWN ACTIONS
  // ─────────────────────────────────────────────────────────────

  async clickLicenseDropdown(licenseName: string): Promise<void> {
    try {
      const btn = this.getLicenseDropdownButton(licenseName);
      await btn.waitFor({ state: 'visible' });
      await btn.click();
      Logger.info(this.testName, `License dropdown clicked: "${licenseName}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `License dropdown click failed "${licenseName}": ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForLicenseDropdownExpanded(licenseName: string): Promise<void> {
    try {
      // ── Checkbox appear hone se pata chalta hai dropdown expand hua ──
      await this.page.getByRole('checkbox').first().waitFor({ state: 'visible', timeout: 10000 });
      Logger.info(this.testName, `License dropdown expanded: "${licenseName}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `License dropdown expand failed "${licenseName}": ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LICENSE — CHECKBOX ACTIONS
  // ─────────────────────────────────────────────────────────────

  async uncheckLicense(licenseName: string): Promise<void> {
    try {
      const checkbox = this.getLicenseCheckbox(licenseName);
      await checkbox.waitFor({ state: 'visible' });
      await checkbox.click();

      Logger.info(this.testName, `License checkbox clicked (uncheck attempt): "${licenseName}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Uncheck license failed "${licenseName}": ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async checkLicense(licenseName: string): Promise<void> {
    try {
      const checkbox = this.getLicenseCheckbox(licenseName);
      await checkbox.waitFor({ state: 'visible' });
      await checkbox.check();
      Logger.info(this.testName, `License checked: "${licenseName}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Check license failed "${licenseName}": ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async getLicenseCheckboxState(licenseName: string): Promise<boolean> {
    try {
      const checkbox = this.getLicenseCheckbox(licenseName);
      await checkbox.waitFor({ state: 'visible' });
      const isChecked = await checkbox.isChecked();
      Logger.info(
        this.testName,
        `License "${licenseName}" checkbox state: ${isChecked ? 'checked' : 'unchecked'}`,
      );
      return isChecked;
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Get checkbox state failed "${licenseName}": ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // CONFIRMATION POPUP — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForRemovePermissionPopup(): Promise<void> {
    try {
      await this.removePermissionHeading.waitFor({ state: 'visible', timeout: 10000 });
      Logger.info(this.testName, 'Remove Permission popup visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Remove Permission popup not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForApprovePermissionPopup(): Promise<void> {
    try {
      await this.approvePermissionHeading.waitFor({ state: 'visible', timeout: 10000 });
      Logger.info(this.testName, 'Approve Permission popup visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Approve Permission popup not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickApproveButton(): Promise<void> {
    try {
      await this.approveButton.waitFor({ state: 'visible' });
      await this.approveButton.click();
      Logger.info(this.testName, 'Approve button clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Approve button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickRejectButton(): Promise<void> {
    try {
      await this.rejectButton.waitFor({ state: 'visible' });
      await this.rejectButton.click();
      Logger.info(this.testName, 'Reject button clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Reject button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickConfirmationCancelIcon(): Promise<void> {
    try {
      await this.confirmationCancelIcon.waitFor({ state: 'visible' });
      await this.confirmationCancelIcon.click();
      Logger.info(this.testName, 'Confirmation cancel icon clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Confirmation cancel icon click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForSuccessAlert(): Promise<void> {
    try {
      await this.successAlert.waitFor({ state: 'visible', timeout: 10000 });
      Logger.info(this.testName, 'Success alert visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Success alert not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async toggleLicenseAndDetectFlow(licenseName: string): Promise<'remove' | 'approve'> {
    const checkbox = this.getLicenseCheckbox(licenseName);

    await checkbox.waitFor({ state: 'visible' });

    const wasChecked = await checkbox.isChecked();

    await checkbox.click();

    const actionType = wasChecked ? 'remove' : 'approve';

    Logger.info(
      this.testName,
      `License "${licenseName}" toggled. Previous: ${wasChecked}, Action: ${actionType}`,
    );

    return actionType;
  }

  async waitForPermissionPopup(actionType: 'remove' | 'approve'): Promise<void> {
    if (actionType === 'remove') {
      await this.removePermissionHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Remove Permission popup visible');
    } else {
      await this.approvePermissionHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Approve Permission popup visible');
    }
  }

  async cancelPermissionPopup(): Promise<void> {
    await this.clickConfirmationCancelIcon();
    Logger.info(this.testName, 'Popup closed via cancel icon');
  }

  async confirmPermissionFlow(actionType: 'remove' | 'approve'): Promise<void> {
    if (actionType === 'remove') {
      await this.clickRejectButton();
      Logger.info(this.testName, 'Remove permission confirmed');
    } else {
      await this.clickApproveButton();
      Logger.info(this.testName, 'Approve permission confirmed');
    }

    await this.waitForSuccessAlert();
  }

  // ─────────────────────────────────────────────────────────────
  // EDIT ICON — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async clickEditIcon(): Promise<void> {
    try {
      await this.editIcon.waitFor({ state: 'visible' });
      await this.editIcon.click();
      await this.updateProfilePopup.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Edit icon clicked — Update Admin Profile popup opened');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Edit icon click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /* async clickEditIcon(): Promise<void> {
    try {
      // ✅ Strict container (profile header)
      const profileHeader = this.page.locator('div').filter({
        has: this.page.getByText('Org Admin') // stable anchor
      }).first();

      // ✅ Scoped locator (no xpath traversal)
      const editIcon = profileHeader.getByTestId('EditOutlinedIcon');

      // Ensure visible & stable
      await editIcon.waitFor({ state: 'visible' });
      await editIcon.scrollIntoViewIfNeeded();

      // ✅ Clean click (Playwright way)
      await editIcon.click();

      // ✅ Wait for popup (more reliable)
      await this.page.getByText('Update Admin Profile', { exact: false })
        .waitFor({ state: 'visible' });

      Logger.info(this.testName, 'Edit icon clicked — popup opened');

    } catch (error) {
      Logger.error(this.testName, `Edit icon click failed: ${error}`);
      throw error;
    }
  }
 */
  async waitForUpdateProfilePopupVisible(): Promise<void> {
    try {
      await this.updateProfilePopup.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Update Admin Profile popup is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Update popup not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickUpdateAdminProfileCancelIcon(): Promise<void> {
    try {
      await this.updateAdminProfileCancelIcon.waitFor({ state: 'visible' });
      await this.updateAdminProfileCancelIcon.click();
      Logger.info(
        this.testName,
        'Update Admin Profile cancel icon clicked and Update Admin Profile form closed',
      );
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Update Admin Profile cancel icon click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // UPDATE FORM — FIELD ACTIONS
  // ─────────────────────────────────────────────────────────────

  async capturePreFilledValues(): Promise<{
    usualFirstName: string;
    firstNames: string;
    lastNames: string;
    email: string;
    phone: string;
  }> {
    try {
      const usualFirstName = await this.getFieldValue(this.usualFirstNameInput);
      const firstNames = await this.getFieldValue(this.firstNamesInput);
      const lastNames = await this.getFieldValue(this.lastNamesInput);
      const email = await this.getFieldValue(this.emailInput);
      const phone = await this.getFieldValue(this.phoneInput);

      Logger.info(this.testName, `Pre-filled → Usual First Name: "${usualFirstName}"`);
      Logger.info(this.testName, `Pre-filled → First Names: "${firstNames}"`);
      Logger.info(this.testName, `Pre-filled → Last Names: "${lastNames}"`);
      Logger.info(this.testName, `Pre-filled → Email: "${email}"`);
      Logger.info(this.testName, `Pre-filled → Phone: "${phone}"`);

      return { usualFirstName, firstNames, lastNames, email, phone };
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Capture pre-filled values failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clearAllMandatoryFields(): Promise<void> {
    try {
      // ── Text fields ──
      await this.clearInputIfNotEmpty(this.usualFirstNameInput, 'Usual First Name');
      await this.clearInputIfNotEmpty(this.firstNamesInput, 'First Names');
      await this.clearInputIfNotEmpty(this.lastNamesInput, 'Last Names');

      // ── Language (special handling) ──
      await this.clearLanguage();

      // ── Address ──
      await this.clearInputIfNotEmpty(this.addressInput, 'Address');

      // ── Email ──
      await this.clearInputIfNotEmpty(this.emailInput, 'Email');

      // ── Phone fields (masked inputs) ──
      await this.clearPhoneNumber(this.phoneInput, 'Phone');
      await this.clearPhoneNumber(this.emergencyContactInput, 'Emergency Contact');

      // ── Blur to trigger validation ──
      await this.page.keyboard.press('Tab');

      Logger.info(this.testName, 'All mandatory fields cleared successfully');

    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Clear mandatory fields failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  async clearPhoneNumber(locator: Locator, fieldName: string): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });

      const before = await locator.inputValue().catch(() => '');
      Logger.info(this.testName, `${fieldName} BEFORE clear → "${before}"`);

      // ✅ Click + Select All + Delete (fastest way)
      await locator.click();
      await locator.press('ControlOrMeta+A'); // select all
      await locator.press('Delete');          // clear everything

      // ✅ Force clear fallback (for masked input edge cases)
      await locator.fill('');

      // optional tiny wait for UI mask update
      await this.page.waitForTimeout(50);

      const after = await locator.inputValue().catch(() => '');
      Logger.info(this.testName, `${fieldName} AFTER clear → "${after}"`);

      // remove mask chars
      const cleaned = after.replace(/[\s\-\+\(\)]/g, '');

      if (cleaned === '') {
        Logger.info(this.testName, `✅ ${fieldName} cleared successfully`);
      } else {
        Logger.error(
          this.testName,
          `❌ ${fieldName} NOT fully cleared — remaining: "${after}"`,
        );
      }

    } catch (error) {
      Logger.error(this.testName, `Clear ${fieldName} failed: ${error}`);
      throw error;
    }
  }

  async fillUsualFirstName(value: string): Promise<void> {
    try {
      await this.usualFirstNameInput.waitFor({ state: 'visible' });

      const current = await this.usualFirstNameInput.inputValue();

      if (current.trim() !== value.trim()) {
        await this.usualFirstNameInput.fill(value);
        Logger.info(this.testName, `Usual First Name updated: "${value}"`);
      } else {
        Logger.info(this.testName, 'Usual First Name already correct → skipped');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Usual First Name failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillFirstNames(value: string): Promise<void> {
    try {
      await this.firstNamesInput.waitFor({ state: 'visible' });

      const current = await this.firstNamesInput.inputValue();

      if (current.trim() !== value.trim()) {
        await this.firstNamesInput.fill(value);
        Logger.info(this.testName, `First Names updated: "${value}"`);
      } else {
        Logger.info(this.testName, 'First Names already correct → skipped');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill First Names failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillLastNames(value: string): Promise<void> {
    try {
      await this.lastNamesInput.waitFor({ state: 'visible' });

      const current = await this.lastNamesInput.inputValue();

      if (current.trim() !== value.trim()) {
        await this.lastNamesInput.fill(value);
        Logger.info(this.testName, `Last Names updated: "${value}"`);
      } else {
        Logger.info(this.testName, 'Last Names already correct → skipped');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Last Names failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillEmail(value: string): Promise<void> {
    try {
      await this.emailInput.waitFor({ state: 'visible' });

      const current = await this.emailInput.inputValue();

      if (current.trim() !== value.trim()) {
        await this.emailInput.fill(value);
        Logger.info(this.testName, `Email updated: "${value}"`);
      } else {
        Logger.info(this.testName, 'Email already correct → skipped');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Email failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillPhone(value: string): Promise<void> {
    try {
      await this.phoneInput.waitFor({ state: 'visible' });

      const current = await this.phoneInput.inputValue();

      if (current.trim() !== value.trim()) {
        await this.phoneInput.fill(value);
        Logger.info(this.testName, `Phone updated: "${value}"`);
      } else {
        Logger.info(this.testName, 'Phone already correct → skipped');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Phone failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /* async selectCountry(countryName: string): Promise<void> {
    try {
      await this.countrySelectButton.waitFor({ state: 'visible' });
      await this.countrySelectButton.click();
      await this.page.getByRole('option', { name: countryName, exact: true }).click();
      Logger.info(this.testName, `Country selected: "${countryName}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Select Country failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  } */

  async selectCountry(countryName: string): Promise<void> {
    try {
      // ── Country button ko broadly target karo ──
      // Button name dynamic hai — "Select", "India", "Netherlands" etc.
      const countryBtn = this.page
        .locator('.MuiOutlinedInput-root')
        .filter({ has: this.page.getByRole('button') })
        .first()
        .getByRole('button');

      await countryBtn.waitFor({ state: 'visible' });

      // ── Current selected value read karo ──
      const currentText = ((await countryBtn.textContent()) ?? '').trim();
      Logger.info(this.testName, `Country button current value: "${currentText}"`);

      if (currentText.toLowerCase().includes(countryName.toLowerCase())) {
        Logger.info(this.testName, `Country already "${countryName}" — skipping`);
        return;
      }

      // ── Click to open dropdown ──
      await countryBtn.click();

      // ── Wait for options to appear ──
      await this.page
        .getByRole('option', { name: countryName, exact: true })
        .waitFor({ state: 'visible', timeout: 10000 });

      await this.page.getByRole('option', { name: countryName, exact: true }).click();

      Logger.info(this.testName, `Country selected: "${countryName}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Select Country failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /* async selectLanguage(languageName: string): Promise<void> {
    try {
      await this.languageInput.waitFor({ state: 'visible' });

      const current = await this.languageInput.inputValue();

      if (current.trim() !== languageName.trim()) {
        await this.languageInput.click();
        await this.page.getByRole('option', { name: languageName }).click();
        Logger.info(this.testName, `Language selected: "${languageName}"`);
      } else {
        Logger.info(this.testName, `Language already "${languageName}" → skipped`);
      }

    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Select Language failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  } */

  async clearLanguage(): Promise<void> {
    try {
      await this.languageInput.waitFor({ state: 'visible' });

      const current = (await this.languageInput.inputValue()).trim();

      if (!current) {
        Logger.info(this.testName, 'Language already empty → skipped');
        return;
      }

      // Try clear button first
      const clearBtn = this.page.getByRole('button', { name: 'Clear' });

      if (await clearBtn.isVisible().catch(() => false)) {
        await clearBtn.click();
        Logger.info(this.testName, 'Language cleared via Clear button');
      } else {
        // fallback (important)
        await this.languageInput.click();
        await this.languageInput.press('ControlOrMeta+A');
        await this.languageInput.press('Backspace');
        await this.languageInput.fill('');
        Logger.info(this.testName, 'Language cleared via keyboard fallback');
      }

      await this.languageInput.blur();

    } catch (error) {
      Logger.error(this.testName, `Clear language failed: ${error}`);
      throw error;
    }
  }

  async selectLanguage(languageName: string): Promise<void> {
    try {
      await this.languageInput.waitFor({ state: 'visible' });

      const current = (await this.languageInput.inputValue()).trim();
      Logger.info(this.testName, `Language current value: "${current}"`);

      if (current.toLowerCase().includes(languageName.toLowerCase())) {
        Logger.info(this.testName, `Language already "${languageName}" — skipping`);
        return;
      }

      // ── Clear button visible ho to clear karo pehle ──
      const clearBtn = this.page.getByRole('button', { name: 'Clear' });
      const clearVisible = await clearBtn.isVisible().catch(() => false);

      if (clearVisible) {
        await clearBtn.click();
        Logger.info(this.testName, 'Language cleared via Clear button');
        await this.page.waitForTimeout(300);
      }

      // ── Language input me type karke select karo ──
      await this.languageInput.click();

      await this.page
        .getByRole('option', { name: languageName })
        .waitFor({ state: 'visible', timeout: 10000 });

      await this.page.getByRole('option', { name: languageName }).click();

      Logger.info(this.testName, `Language selected: "${languageName}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Select Language failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillAddress(value: string): Promise<void> {
    try {
      await this.addressInput.waitFor({ state: 'visible' });

      const current = await this.addressInput.inputValue();

      if (current.trim() !== value.trim()) {
        await this.addressInput.fill(value);
        Logger.info(this.testName, `Address updated: "${value}"`);
      } else {
        Logger.info(this.testName, 'Address already correct → skipped');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Address failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillEmergencyContactNumber(countryOption: string, value: string): Promise<void> {
    try {
      await this.page.getByRole('button', { name: 'Netherlands: +' }).click();
      await this.page.getByRole('option', { name: countryOption }).click();
      await this.emergencyContactInput.fill(value);
      Logger.info(this.testName, `Emergency Contact Number filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Emergency Contact failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickUpdateButton(): Promise<void> {
    try {
      await this.updateButton.waitFor({ state: 'visible' });
      await this.updateButton.click();
      Logger.info(this.testName, 'Update button clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Update button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForInvalidEmailMessage(): Promise<void> {
    try {
      await this.invalidEmailMessage.waitFor({ state: 'visible' });
      const errorText = (await this.invalidEmailMessage.textContent())?.trim();
      Logger.info(this.testName, `Invalid Email Validation Message: "${errorText}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Invalid email message not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForRequiredFieldMessages(): Promise<void> {
    try {
      await this.requiredFieldMessages.first().waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Required field validation messages visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Required field messages not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async logValidationErrors(): Promise<void> {
    try {
      Logger.info(this.testName, '── Capturing validation messages ──');

      // ── Text field validations ──
      const textValidations = [
        { name: 'Usual First Name', locator: this.usualFirstNameInput },
        { name: 'First Names',      locator: this.firstNamesInput },
        { name: 'Last Names',       locator: this.lastNamesInput },
        { name: 'Language',         locator: this.languageInput },
        { name: 'Address',          locator: this.addressInput },
        { name: 'Email',            locator: this.emailInput },
      ];

      for (const field of textValidations) {
        try {
          const parent = field.locator.locator(
            'xpath=ancestor::div[contains(@class,"MuiFormControl-root")]',
          );
          const errorLocator = parent.locator('[id*="helper-text"]');
          const isVisible    = await errorLocator.isVisible().catch(() => false);

          if (isVisible) {
            const text = (await errorLocator.textContent())?.trim();
            Logger.info(this.testName, `Validation → ${field.name}:-> ${text}`);
          } else {
            Logger.error(
              this.testName,
              `Validation missing → ${field.name}:-> No validation error visible`,
            );
          }
        } catch {
          Logger.error(this.testName, `Validation check error for ${field.name}`);
        }
      }

      // ── Phone validation — span.filter(Required.) se aata hai ──
      // Row script confirmed: page.locator('span').filter({ hasText: 'Required.' })
      try {
        const phoneSpan = this.page
          .locator('span')
          .filter({ hasText: 'Required.' })
          .first();

        const isVisible = await phoneSpan.isVisible().catch(() => false);

        if (isVisible) {
          const text = (await phoneSpan.textContent())?.trim();
          Logger.info(this.testName, `Validation → Phone:-> ${text}`);
        } else {
          Logger.error(
            this.testName,
            'Validation missing → Phone:-> No validation error visible',
          );
        }
      } catch (error) {
        Logger.error(this.testName, `Phone validation check error: ${error}`);
      }

      // ── Emergency Contact — optional ──
      Logger.info(
        this.testName,
        'Emergency Contact — optional field, no validation required',
      );

      Logger.info(this.testName, '── All validation messages captured ──');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Error while capturing validation messages: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // COMBINED FLOW — PROFILE UPDATE
  // ─────────────────────────────────────────────────────────────

  async updateProfile(data: ProfileData): Promise<void> {
    try {
      Logger.info(this.testName, '── Starting Profile Update ──');

      // 🔹 Mandatory Fields (always handled safely inside methods)
      await this.fillUsualFirstName(data.usualFirstName);
      await this.fillFirstNames(data.firstNames);
      await this.fillLastNames(data.lastNames);
      await this.selectCountry(data.country);
      await this.selectLanguage(data.language);
      await this.fillAddress(data.address);
      await this.fillEmail(data.email);
      await this.fillPhone(data.phone);

      // 🔹 Optional Field
      if (data.emergencyContactCountry && data.emergencyContactNumber) {
        await this.fillEmergencyContactNumber(
          data.emergencyContactCountry,
          data.emergencyContactNumber,
        );
        Logger.info(this.testName, 'Emergency Contact filled');
      } else {
        Logger.info(this.testName, 'Emergency Contact skipped');
      }

      Logger.info(this.testName, '── Profile Form Filled Successfully ──');

      // await this.clickUpdateButton();
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Profile update failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async getContactNumberValue(): Promise<string> {
    return await this.phoneInput.inputValue();
  }

  async getEmergencyContactValue(): Promise<string> {
    return await this.emergencyContactInput.inputValue();
  }
}
