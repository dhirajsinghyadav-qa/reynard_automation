import { Page, Locator, expect } from '@playwright/test';
import { CompanyData } from '@/utils/dataGenerator';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

export class HomePage {
  private page: Page;
  private testName: string;

  // Locators

  // Navigation
  private homeMenuLink: Locator;
  private homeText: Locator;
  private licenseApprovalLink: Locator;

  // ── Page Title ──
  private companiesHeading: Locator;

  // ── Create Company Button ──
  private createCompanyButton: Locator;

  // ── Company Table ──
  private companyTable: Locator;
  private tableHeaderNo: Locator;
  private tableHeaderLogo: Locator;
  private tableHeaderClient: Locator;
  private tableHeaderEmail: Locator;
  private tableHeaderOrganization: Locator;
  private tableHeaderStatus: Locator;
  private tableHeaderEmployed: Locator;
  private tableHeaderAction: Locator;

  // ── Popup ──
  private newCompanyPopup: Locator;
  private cancelButton: Locator;
  private submitButton: Locator;

  // ── Fields ──
  private usualFirstNameInput: Locator;
  private firstNamePassportInput: Locator;
  private lastNamePassportInput: Locator;
  private emailInput: Locator;
  private passwordInput: Locator;
  private countryButton: Locator;
  private companyNameInput: Locator;
  private companyLogoButton: Locator;
  private companyLogoInput: Locator;
  private selectLicenseButton: Locator;
  private addressInput: Locator;
  private contactNumberInput: Locator;
  private emergencyContactInput: Locator;

  // ── License Checkboxes ──
  private licenseProjectManagement: Locator;
  private licenseQhseManagement: Locator;
  private licenseEquipmentManagement: Locator;
  private licensePersonnelManagement: Locator;
  private licenseCloseButton: Locator;

  // ── Validation Messages ──
  private validationUsualFirstName: Locator;
  private validationFirstName: Locator;
  private validationLastName: Locator;
  private validationEmail: Locator;
  private validationPassword: Locator;
  private validationCountry: Locator;
  private validationCompanyName: Locator;
  private validationLicense: Locator;
  private validationAddress: Locator;
  private validationContactNumber: Locator;
  private validationInvalidEmail: Locator;
  private ValidationContactNumberRequired: Locator;
  private validationInvalidEmergencyContact: Locator;

  // ── Success Message ──
  private successMessage: Locator;

  // Eye Icon (Profile View Button)
  private eyeIconButton: Locator;
  // ─────────────────────────────────────────
  // DYNAMIC ROW LOCATORS
  // ─────────────────────────────────────────
  // NOTE: These are dynamic (no constructor init needed)
  // (Methods will use page directly)

  // Profile Details Panel/Page
  private profileDetailsPanel: Locator;
  private adminDetailsHeading: Locator;

  // ── Profile Info ──
  private profileAdminName: Locator;
  private profileAdminEmail: Locator;
  private adminDetailsText: Locator;

  // ── Switch User Icon ──
  private switchUserIcon: Locator;

  // ── Switch To Super Admin Icon ──
  private switchToSuperAdminIcon: Locator;
  private confirmYesButton: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    // Navigation
    this.homeMenuLink = page.getByRole('link', { name: 'Home' });
    this.homeText = page.locator('a[href*="/admin/home"]');
    this.licenseApprovalLink = page.getByRole('link', { name: 'License Approval' });

    // ── Page Title ──
    this.companiesHeading = page.getByText('Companies');

    // ── Create Company Button ──
    this.createCompanyButton = page.getByRole('button', { name: 'Company' });

    // ── Company Table ──
    this.companyTable = page.locator('table');
    this.tableHeaderNo = page.locator('th').filter({ hasText: 'No.' });
    this.tableHeaderLogo = page.locator('th').filter({ hasText: 'Logo' });
    this.tableHeaderClient = page.locator('th').filter({ hasText: 'Client' });
    this.tableHeaderEmail = page.locator('th').filter({ hasText: 'Email' });
    this.tableHeaderOrganization = page.locator('th').filter({ hasText: 'Organization' });
    this.tableHeaderStatus = page.locator('th').filter({ hasText: 'Status' });
    this.tableHeaderEmployed = page.locator('th').filter({ hasText: 'Employed' });
    this.tableHeaderAction = page.locator('th').filter({ hasText: 'Action' });

    // ── Popup ──
    this.newCompanyPopup = page.getByText('New CompanyUsual First Name*');
    this.cancelButton = page.getByTestId('CancelOutlinedIcon').locator('path');
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    // ── Fields ──
    this.usualFirstNameInput = page.getByRole('textbox', { name: 'Usual First Name*' });
    this.firstNamePassportInput = page.getByRole('textbox', {
      name: 'First Name (as per Passport)*',
    });
    this.lastNamePassportInput = page.getByRole('textbox', {
      name: 'Last Name (as per Passport)*',
    });
    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.countryButton = page.getByRole('button', { name: 'Country*' });
    this.companyNameInput = page.getByRole('textbox', { name: 'Company Name*' });
    this.companyLogoButton = page.getByRole('button', { name: 'Choose file' });
    this.companyLogoInput = page.locator('input[type="file"]');
    this.selectLicenseButton = page.getByRole('button', { name: 'Select License' });
    this.addressInput = page.getByRole('textbox', { name: 'Address*' });
    // this.contactNumberInput       = page.getByRole('textbox', { name: '1 (702) 123-' }).first();
    this.contactNumberInput = page.locator('input[placeholder="1 (702) 123-4567"]').first();
    this.emergencyContactInput = page.getByRole('textbox', { name: '1 (702) 123-' }).nth(1);
    // this.emergencyContactInput    = page.locator('input[placeholder=1 1 (702) 123-4567]"').nth(1);

    // ── License Checkboxes ──
    this.licenseProjectManagement = page.getByRole('checkbox', { name: 'PROJECT MANAGEMENT' });
    this.licenseQhseManagement = page.getByRole('checkbox', { name: 'QHSE MANAGEMENT' });
    this.licenseEquipmentManagement = page.getByRole('checkbox', { name: 'EQUIPMENT MANAGEMENT' });
    this.licensePersonnelManagement = page.getByRole('checkbox', { name: 'PERSONNEL MANAGEMENT' });
    this.licenseCloseButton = page.getByRole('button', { name: 'Close' });

    // ── Validation Messages ──
    this.validationUsualFirstName = page.getByText('Usual First Name is required');
    this.validationFirstName = page.getByText('First name is required', { exact: true });
    this.validationLastName = page.getByText('Last name is required');
    this.validationEmail = page.getByText('Email is required');
    this.validationPassword = page.getByText('Password is required');
    this.validationCountry = page.getByText('Nationality is required');
    this.validationCompanyName = page.getByText('Company name is required');
    this.validationLicense = page.getByText('Required.');
    this.validationAddress = page.getByText('Address is required');
    this.validationContactNumber = page.getByText('Contact number is required');
    this.validationInvalidEmail = page.getByText('Enter Valid Email Address');
    this.ValidationContactNumberRequired = page.getByText('Enter valid contact number');
    this.validationInvalidEmergencyContact = page.getByText('Enter valid emergency contact');

    // ── Success Message ──
    this.successMessage = page.getByText('Account has been created successfully');

    // Eye Icon Button
    this.eyeIconButton = page
      .locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorSecondary')
      .first();

    // Profile Details Panel
    this.profileDetailsPanel = page.locator('[class*="MuiBox"], [class*="MuiGrid"]')
      .filter({ has: page.getByRole('heading', { name: 'Admin Details' }) })
      .first();
    this.adminDetailsHeading = page.getByRole('heading', { name: 'Admin Details' });
    this.adminDetailsText = page.locator('.MuiBox-root.css-11b450n');

    // ── Profile Info ──
    this.profileAdminName = page.locator('p').filter({ hasText: /^[A-Za-z]/ }).first()
    this.profileAdminEmail = page.locator('p').filter({ hasText: /@/ }).first();

    this.switchUserIcon = page.getByRole('button', { name: 'edit report type' });

    // ── Switch To Super Admin Icon ──
    this.switchToSuperAdminIcon = this.page
      .locator('.MuiTypography-root')
      .filter({ hasText: 'Switch To Super Admin' });

    this.confirmYesButton = page.getByRole('button', { name: 'Yes' });
  }

  // ---------------- GETTERS ----------------
  getHomeMenuLink() {
    return this.homeMenuLink;
  }
  getLicenseApprovalLink() {
    return this.licenseApprovalLink;
  }
  getHomeText() {
    return this.homeText;
  }
  getCompaniesHeading() {
    return this.companiesHeading;
  }
  getCreateCompanyButton() {
    return this.createCompanyButton;
  }
  getCompanyTable() {
    return this.companyTable;
  }
  getTableHeaderNo() {
    return this.tableHeaderNo;
  }
  getTableHeaderLogo() {
    return this.tableHeaderLogo;
  }
  getTableHeaderClient() {
    return this.tableHeaderClient;
  }
  getTableHeaderEmail() {
    return this.tableHeaderEmail;
  }
  getTableHeaderOrganization() {
    return this.tableHeaderOrganization;
  }
  getTableHeaderStatus() {
    return this.tableHeaderStatus;
  }
  getTableHeaderEmployed() {
    return this.tableHeaderEmployed;
  }
  getTableHeaderAction() {
    return this.tableHeaderAction;
  }
  getNewCompanyPopup() {
    return this.newCompanyPopup;
  }
  getCancelButton() {
    return this.cancelButton;
  }
  getSubmitButton() {
    return this.submitButton;
  }
  getUsualFirstNameInput() {
    return this.usualFirstNameInput;
  }
  getFirstNamePassportInput() {
    return this.firstNamePassportInput;
  }
  getLastNamePassportInput() {
    return this.lastNamePassportInput;
  }
  getEmailInput() {
    return this.emailInput;
  }
  getPasswordInput() {
    return this.passwordInput;
  }
  getCountryButton() {
    return this.countryButton;
  }
  getCompanyNameInput() {
    return this.companyNameInput;
  }
  getCompanyLogoButton() {
    return this.companyLogoButton;
  }
  getCompanyLogoInput() {
    return this.companyLogoInput;
  }
  getSelectLicenseButton() {
    return this.selectLicenseButton;
  }
  getAddressInput() {
    return this.addressInput;
  }
  getContactNumberInput() {
    return this.contactNumberInput;
  }
  getEmergencyContactInput() {
    return this.emergencyContactInput;
  }
  getSuccessMessage() {
    return this.successMessage;
  }
  getValidationUsualFirstName() {
    return this.validationUsualFirstName;
  }
  getValidationFirstName() {
    return this.validationFirstName;
  }
  getValidationLastName() {
    return this.validationLastName;
  }
  getValidationEmail() {
    return this.validationEmail;
  }
  getValidationPassword() {
    return this.validationPassword;
  }
  getValidationCountry() {
    return this.validationCountry;
  }
  getValidationCompanyName() {
    return this.validationCompanyName;
  }
  getValidationLicense() {
    return this.validationLicense;
  }
  getValidationAddress() {
    return this.validationAddress;
  }
  getValidationContactNumber() {
    return this.validationContactNumber;
  }
  getValidationInvalidEmail() {
    return this.validationInvalidEmail;
  }
  getValidationContactNumberRequired() {
    return this.ValidationContactNumberRequired;
  }
  getValidationInvalidEmergencyContact() {
    return this.validationInvalidEmergencyContact;
  }
  getEyeIconButton() {
    return this.eyeIconButton;
  }
  getProfilePanel() {
    return this.profileDetailsPanel;
  }
  getAdminDetailsHeading() {
    return this.adminDetailsHeading;
  }
  getAdminDetailsText() {
    return this.adminDetailsText;
  }
  getProfileAdminName() {
    return this.profileAdminName;
  }
  getProfileAdminEmail() {
    return this.profileAdminEmail;
  }
  getSwitchUserIconByRow(rowText: string): Locator {
    return this.page
      .getByRole('row', { name: rowText })
      .getByRole('button', { name: 'edit report type' });
  }
  /* getSwitchToSuperAdminIcon(): Locator {
    return this.page
      .getByText('Switch To Super Admin')
      .last();
  } */
  // ─────────────────────────────────────────
  // DYNAMIC ROW BASED LOCATORS
  // ─────────────────────────────────────────

  // Eye Icon by row index (1-based: 1 = first data row)
  getEyeIconByRowIndex(rowIndex: number): Locator {
    return this.page
      .getByRole('row')
      .nth(rowIndex)
      .locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorSecondary');
  }

  // Eye Icon by email
  getEyeIconByEmail(email: string): Locator {
    return this.page
      .getByRole('row', { name: new RegExp(email, 'i') })
      .locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorSecondary');
  }

  // First row eye icon
  getFirstRowEyeIcon(): Locator {
    return this.page
      .getByRole('row')
      .nth(1)
      .locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorSecondary');
  }

  // Switch User by row index
  getSwitchUserIconByRowIndex(rowIndex: number): Locator {
    return this.page.getByRole('row').nth(rowIndex).getByLabel('edit report type');
  }

  // Switch User by email
  getSwitchUserIconByEmail(email: string): Locator {
    return this.page
      .getByRole('row', { name: new RegExp(email, 'i') })
      .getByLabel('edit report type');
  }

  // First row switch user
  getFirstRowSwitchUserIcon(): Locator {
    return this.page.getByRole('row').nth(1).getByLabel('edit report type');
  }

  // ─────────────────────────────────────────────────────────────
  // PAGE LOAD VERIFICATION
  // ─────────────────────────────────────────────────────────────

  async verifyHomePageLoaded(): Promise<void> {
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

  // ─────────────────────────────────────────────────────────────
  // HOME MENU — NAVIGATION ACTIONS
  // ─────────────────────────────────────────────────────────────

  async clickHomeMenuLink(): Promise<void> {
    try {
      await this.homeMenuLink.waitFor({ state: 'visible' });
      await this.homeMenuLink.click();
      Logger.info(this.testName, 'Home menu link clicked successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Home link click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForLicenseApprovalLinkVisible(): Promise<void> {
    try {
      await this.licenseApprovalLink.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'License Approval module link is accessible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `License Approval link not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickHomeText(): Promise<void> {
    try {
      await this.homeText.waitFor({ state: 'visible' });
      await this.homeText.click();
      Logger.info(this.testName, 'Clicked on "home" text in navigation');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Click on home text failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async verifyHomeMenuLinkVisible(): Promise<void> {
    try {
      await this.homeMenuLink.waitFor({ state: 'visible', timeout: 20000 });
      Logger.info(this.testName, 'Home Menu link is visible in navigation');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Home link not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async verifyCompaniesHeadingVisibleOnHomePage(): Promise<void> {
    try {
      await this.companiesHeading.waitFor({ state: 'visible', timeout: 20000 });
      Logger.info(this.testName, 'Companies Heading is visible on the Home Page');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Companies Heading not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // COMPANY TABLE — VISIBILITY ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForCompanyTableVisible(): Promise<void> {
    try {
      await this.companyTable.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Company table is visible on Home page');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Company table not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForAllTableHeadersVisible(): Promise<void> {
    try {
      await this.tableHeaderNo.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "No." visible');

      await this.tableHeaderLogo.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "Logo" visible');

      await this.tableHeaderClient.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "Client" visible');

      await this.tableHeaderEmail.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "Email" visible');

      await this.tableHeaderOrganization.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "Organization" visible');

      await this.tableHeaderStatus.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "Status" visible');

      await this.tableHeaderEmployed.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "Employed" visible');

      await this.tableHeaderAction.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Table Column Header "Action" visible');

      Logger.info(this.testName, 'All table Column Header verified successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Table Column Header verification failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // CREATE COMPANY BUTTON — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForCreateCompanyButtonVisible(): Promise<void> {
    try {
      await this.createCompanyButton.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Create Company button is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Create Company button not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickCreateCompanyButton(): Promise<void> {
    try {
      await this.createCompanyButton.waitFor({ state: 'visible' });
      await this.createCompanyButton.click();
      Logger.info(this.testName, 'Create Company button clicked successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Create Company button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // HOME PAGE REFRESH — SESSION CHECK
  // ─────────────────────────────────────────────────────────────

  async refreshPage(): Promise<void> {
    try {
      await this.page.reload();
      await this.page.waitForLoadState('networkidle');
      Logger.info(this.testName, 'Page refreshed successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Page refresh failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POPUP — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForPopupVisible(): Promise<void> {
    try {
      await this.newCompanyPopup.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'New Company popup is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `New Company popup not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async verifyFieldVisible(field: Locator, fieldName: string): Promise<Locator> {
    try {
      await field.waitFor({ state: 'visible' });
      Logger.info(this.testName, `${fieldName} is visible`);
      return field;
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `${fieldName} not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForPopupClosed(): Promise<void> {
    try {
      await this.newCompanyPopup.waitFor({ state: 'hidden' });
      Logger.info(this.testName, 'New Company popup closed successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `New Company popup did not close: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickCancelButton(): Promise<void> {
    try {
      await this.cancelButton.waitFor({ state: 'visible' });
      await this.cancelButton.click();
      Logger.info(this.testName, 'Cancel button clicked — popup closed');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Cancel button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickSubmitButton(): Promise<void> {
    try {
      await this.submitButton.waitFor({ state: 'visible' });
      await this.submitButton.click();
      Logger.info(this.testName, 'Submit button clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Submit button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // FIELD ACTIONS
  // ─────────────────────────────────────────────────────────────

  async fillUsualFirstName(value: string): Promise<void> {
    try {
      await this.usualFirstNameInput.waitFor({ state: 'visible' });
      await this.usualFirstNameInput.fill(value);
      Logger.info(this.testName, `Usual First Name filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Usual First Name failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillFirstNamePassport(value: string): Promise<void> {
    try {
      await this.firstNamePassportInput.waitFor({ state: 'visible' });
      await this.firstNamePassportInput.fill(value);
      Logger.info(this.testName, `First Name (Passport) filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill First Name Passport failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillLastNamePassport(value: string): Promise<void> {
    try {
      await this.lastNamePassportInput.waitFor({ state: 'visible' });
      await this.lastNamePassportInput.fill(value);
      Logger.info(this.testName, `Last Name (Passport) filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Last Name Passport failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillEmail(value: string): Promise<void> {
    try {
      await this.emailInput.waitFor({ state: 'visible' });
      await this.emailInput.fill(value);
      Logger.info(this.testName, `Email filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Email failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillPassword(value: string): Promise<void> {
    try {
      await this.passwordInput.waitFor({ state: 'visible' });
      await this.passwordInput.fill(value);
      Logger.info(this.testName, 'Password filled');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Password failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async selectCountry(countryName: string): Promise<void> {
    try {
      await this.countryButton.waitFor({ state: 'visible' });
      await this.countryButton.click();
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

  async fillCompanyName(value: string): Promise<void> {
    try {
      await this.companyNameInput.waitFor({ state: 'visible' });
      await this.companyNameInput.fill(value);
      Logger.info(this.testName, `Company Name filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Company Name failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async uploadCompanyLogo(filePath: string): Promise<void> {
    try {
      const resolvedPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File not found at path: ${resolvedPath}`);
      }

      // ✅ Correct element
      await this.companyLogoInput.setInputFiles(resolvedPath);

      Logger.info(this.testName, `Company Logo uploaded: "${resolvedPath}"`);
    } catch (error) {
      Logger.error(this.testName, `Upload failed: ${error}`);
      throw error;
    }
  }

  async selectAllLicenses(): Promise<void> {
    try {
      await this.selectLicenseButton.waitFor({ state: 'visible' });
      await this.selectLicenseButton.click();
      Logger.info(this.testName, 'License dropdown opened');

      await this.licenseProjectManagement.check();
      Logger.info(this.testName, 'License: PROJECT MANAGEMENT selected');

      await this.licenseQhseManagement.check();
      Logger.info(this.testName, 'License: QHSE MANAGEMENT selected');

      await this.licenseEquipmentManagement.check();
      Logger.info(this.testName, 'License: EQUIPMENT MANAGEMENT selected');

      await this.licensePersonnelManagement.check();
      Logger.info(this.testName, 'License: PERSONNEL MANAGEMENT selected');

      await this.licenseCloseButton.click();
      Logger.info(this.testName, 'License dropdown closed');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Select Licenses failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillAddress(value: string): Promise<void> {
    try {
      await this.addressInput.waitFor({ state: 'visible' });
      await this.addressInput.fill(value);
      Logger.info(this.testName, `Address filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Address failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillContactNumber(countryOption: string, value: string): Promise<void> {
    try {
      await this.page.getByRole('button', { name: 'Netherlands: +' }).first().click();
      await this.page.getByRole('listbox').getByText(countryOption, { exact: true }).click();
      await this.contactNumberInput.fill(value);
      Logger.info(this.testName, `Contact Number filled: "${value}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill Contact Number failed: ${error instanceof Error ? error.message : String(error)}`,
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

  async logMandatoryFieldValidationMessages(): Promise<void> {
    try {
      Logger.info(this.testName, '── Capturing validation messages ──');

      const validations = [
        { name: 'Usual First Name', locator: this.validationUsualFirstName },
        { name: 'First Name', locator: this.validationFirstName },
        { name: 'Last Name', locator: this.validationLastName },
        { name: 'Email', locator: this.validationEmail },
        { name: 'Password', locator: this.validationPassword },
        { name: 'Country', locator: this.validationCountry },
        { name: 'Company Name', locator: this.validationCompanyName },
        { name: 'License', locator: this.validationLicense },
        { name: 'Address', locator: this.validationAddress },
        { name: 'Contact Number', locator: this.validationContactNumber },
      ];

      for (const field of validations) {
        if (await field.locator.isVisible()) {
          const text = await field.locator.textContent();
          Logger.info(this.testName, `Validation → ${field.name}: "${text?.trim()}"`);
        } else {
          Logger.error(this.testName, `Validation missing → ${field.name}`);
        }
      }

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

  async waitForSuccessMessage(): Promise<void> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
      Logger.info(this.testName, 'Success message visible: Account has been created successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Success message not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // COMBINED FLOWS
  // ─────────────────────────────────────────────────────────────
  async fillCompanyForm(data: CompanyData): Promise<void> {
    try {
      Logger.info(this.testName, '── Starting Company Form Fill ──');

      // 🔹 Mandatory Fields
      await this.fillUsualFirstName(data.usualFirstName);
      await this.fillFirstNamePassport(data.firstNamePassport);
      await this.fillLastNamePassport(data.lastNamePassport);
      await this.fillEmail(data.email);
      await this.fillPassword(data.password);
      await this.selectCountry(data.country);
      await this.fillCompanyName(data.companyName);
      await this.uploadCompanyLogo(data.logoPath);
      await this.selectAllLicenses();
      await this.fillAddress(data.address);
      await this.fillContactNumber(data.contactCountry, data.contactNumber);

      // OPTIONAL FIELDS (SAFE)
      if (data.emergencyContactCountry && data.emergencyContactNumber) {
        await this.fillEmergencyContactNumber(
          data.emergencyContactCountry,
          data.emergencyContactNumber,
        );
        Logger.info(this.testName, 'Emergency Contact filled');
      } else {
        Logger.info(this.testName, 'Emergency Contact skipped');
      }

      Logger.info(this.testName, '── Form Filled Successfully ──');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Form filling failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async getContactNumberValue(): Promise<string> {
    return await this.contactNumberInput.inputValue();
  }

  async getEmergencyContactValue(): Promise<string> {
    return await this.emergencyContactInput.inputValue();
  }

  // ─────────────────────────────────────────────────────────────
  // EYE ICON — Visibility + Click
  // ─────────────────────────────────────────────────────────────

  async verifyEyeIconVisible(): Promise<void> {
    try {
      await this.eyeIconButton.waitFor({ state: 'visible' });
      // await expect(this.eyeIconButton).toBeVisible();
      Logger.info(this.testName, 'Eye icon visible in company table row');
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

  async verifyEyeIconEnabled(): Promise<void> {
    try {
      await expect(this.eyeIconButton).toBeEnabled();
      Logger.info(this.testName, 'Eye icon is enabled and clickable');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Eye icon is not enabled: ${error instanceof Error ? error.message : String(error)}`,
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

  // ─────────────────────────────────────────
  // DYNAMIC EYE ICON ACTIONS
  // ─────────────────────────────────────────

  async clickEyeIconByRowIndex(rowIndex: number): Promise<void> {
    const eyeIcon = this.getEyeIconByRowIndex(rowIndex);
    await eyeIcon.waitFor({ state: 'visible' });
    await eyeIcon.click();
    Logger.info(this.testName, `Eye icon clicked for row index: ${rowIndex}`);
  }

  async clickEyeIconByEmail(email: string): Promise<void> {
    const eyeIcon = this.getEyeIconByEmail(email);
    await eyeIcon.waitFor({ state: 'visible' });
    await eyeIcon.click();
    Logger.info(this.testName, `Eye icon clicked for email: ${email}`);
  }

  async clickFirstRowEyeIcon(): Promise<void> {
    const eyeIcon = this.getFirstRowEyeIcon();
    await eyeIcon.waitFor({ state: 'visible' });
    await eyeIcon.click();
    Logger.info(this.testName, 'Eye icon clicked for first row');
  }

  // ─────────────────────────────────────────────────────────────
  // PROFILE DETAILS — Verify Visibility
  // ─────────────────────────────────────────────────────────────

  async waitForProfilePanelVisible(): Promise<void> {
    try {
      // ── Profile page load hone ka wait karo ──
      await this.page.waitForURL(/profile/i, { timeout: 20000 });

      // ── Admin Details heading visible hone ka wait karo ──
      await this.adminDetailsHeading.waitFor({ state: 'visible', timeout: 20000 });

      Logger.info(this.testName, 'Profile page loaded — Admin Details visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Profile page not loaded: ${error instanceof Error ? error.message : String(error)}`,
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

  async verifyAdminDetailsTextVisible(): Promise<void> {
    try {
      // ── Profile panel visible hone ka wait karo ──
      await this.profileDetailsPanel.waitFor({ state: 'visible' });

      // ── Panel me kuch bhi content ho — empty na ho ──
      const panelText = await this.profileDetailsPanel.textContent();

      if (!panelText || panelText.trim().length === 0) {
        throw new Error('Profile details panel is visible but has no content');
      }

      Logger.info(
        this.testName,
        `Admin details text content is visible — content: "${panelText.trim().substring(0, 80)}..."`,
      );
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Admin details text not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForProfileAdminNameVisible(): Promise<void> {
    try {
      // ── Profile page pe name paragraph me hota hai ──
      const nameLocator = this.page
        .locator('p')
        .filter({ hasText: /^[A-Za-z]/ })
        .first();

      await nameLocator.waitFor({ state: 'visible', timeout: 20000 });
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
      // ── Profile page pe email paragraph me hoti hai ──
      const emailLocator = this.page
        .locator('p')
        .filter({ hasText: /@/ })
        .first();

      await emailLocator.waitFor({ state: 'visible', timeout: 20000 });
      Logger.info(this.testName, 'Profile admin email is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Profile admin email not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PROFILE DETAILS — Log Data
  // ─────────────────────────────────────────────────────────────
  async logProfileDetailsData(): Promise<void> {
    try {
      // ── Admin Details Heading ──
      const headingText = await this.adminDetailsHeading.textContent();
      Logger.info(this.testName, `Profile → Admin Details Heading: "${headingText?.trim()}"`);

      // ── Profile Panel Full Text — dynamic ──
      const panelText = await this.profileDetailsPanel.textContent();
      Logger.info(this.testName, `Profile → Panel Full Data: "${panelText?.trim()}"`);

      // ── Email extract karo dynamically ──
      const allTexts  = await this.profileDetailsPanel.locator('p, span, div').allTextContents();
      const emailText = allTexts.find(t => t.includes('@')) ?? 'email not found';
      Logger.info(this.testName, `Profile → Admin Email: "${emailText.trim()}"`);

    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Failed to log profile details: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────
  // DYNAMIC PROFILE DATA CAPTURE
  // ─────────────────────────────────────────

  async captureProfileDetailsDynamic(): Promise<{
    name: string;
    email: string;
    panelText: string;
  }> {
    try {
      // ── Profile page load wait ──
      await this.page.waitForURL(/profile/i, { timeout: 20000 });
      await this.adminDetailsHeading.waitFor({ state: 'visible' });

      // ── Name — first paragraph ──
      const nameLocator = this.page.locator('p').filter({ hasText: /^[A-Za-z]/ }).first();
      const name        = ((await nameLocator.textContent()) ?? '').trim();

      // ── Email — paragraph with @ ──
      const emailLocator = this.page.locator('p').filter({ hasText: /@/ }).first();
      const email        = ((await emailLocator.textContent()) ?? '').trim();

      // ── Full page text ──
      const panelText = ((await this.page.locator('body').textContent()) ?? '').trim();

      Logger.info(this.testName, `Dynamic Profile Name : ${name}`);
      Logger.info(this.testName, `Dynamic Profile Email: ${email}`);

      return { name, email, panelText };
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `captureProfileDetailsDynamic failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // COMBINED ACTION — Eye Icon Click → Profile Verify + Log
  // ─────────────────────────────────────────────────────────────

  async clickEyeIconAndVerifyProfileDetails(): Promise<void> {
    try {
      Logger.info(this.testName, '── Eye Icon Test: Starting ──────────────────');

      // Step 1 — Eye icon visible check
      await this.verifyEyeIconVisible();

      // Step 2 — Eye icon enabled check
      await this.waitForEyeIconEnabled();

      // Step 3 — Click eye icon
      await this.clickEyeIcon();

      // Step 4 — Profile panel visible check
      await this.waitForProfilePanelVisible();

      // Step 5 — Admin Details heading visible check
      await this.waitForAdminDetailsHeadingVisible();

      // Step 6 — Admin Details text visible check
      await this.verifyAdminDetailsTextVisible();

      // Step 7 — Log all profile data
      await this.logProfileDetailsData();

      Logger.info(this.testName, '── Eye Icon Test: Completed Successfully ────');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `clickEyeIconAndVerifyProfileDetails failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SWITCH USER — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForSwitchUserIconVisible(): Promise<void> {
    try {
      await this.switchUserIcon.first().waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Switch User icon is visible in company table row');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Switch User icon not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickSwitchUserIcon(): Promise<void> {
    try {
      await this.switchUserIcon.first().waitFor({ state: 'visible' });
      await this.switchUserIcon.first().click();
      Logger.info(this.testName, 'Switch User icon clicked successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Switch User icon click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────
  // DYNAMIC SWITCH USER ACTIONS
  // ─────────────────────────────────────────

  async clickSwitchUserIconByRowIndex(rowIndex: number): Promise<void> {
    const icon = this.getSwitchUserIconByRowIndex(rowIndex);
    await icon.waitFor({ state: 'visible' });
    await icon.click();
    Logger.info(this.testName, `Switch user clicked for row: ${rowIndex}`);
  }

  async clickSwitchUserIconByEmail(email: string): Promise<void> {
    const icon = this.getSwitchUserIconByEmail(email);
    await icon.waitFor({ state: 'visible' });
    await icon.click();
    Logger.info(this.testName, `Switch user clicked for email: ${email}`);
  }

  async clickFirstRowSwitchUserIcon(): Promise<void> {
    const icon = this.getFirstRowSwitchUserIcon();
    await icon.waitFor({ state: 'visible' });
    await icon.click();
    Logger.info(this.testName, 'Switch user clicked for first row');
  }

  // ─────────────────────────────────────────────────────────────
  // SWITCH TO SUPER ADMIN — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForSwitchToSuperAdminIconVisible(): Promise<void> {
    try {
      // ── JavaScript se force scroll karo ──
      // CSS overflow:hidden containers me browser scroll kaam nahi karta
      // JS evaluate se directly element visible karo
      await this.page.evaluate(() => {
        const allSpans = Array.from(document.querySelectorAll('span, li, div'));
        const target = allSpans.find((el) => el.textContent?.trim() === 'Switch To Super Admin');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      // ── Small wait for scroll animation ──
      await this.page.waitForTimeout(800);

      // ── toBeVisible nahi — isVisible check karo ──
      // Element overflow hidden container me ho sakta hai
      // force: true se visibility bypass karke check karo
      const switchAdmin = this.page
        .locator('.MuiTypography-root')
        .filter({ hasText: 'Switch To Super Admin' });

      await switchAdmin.waitFor({ state: 'attached', timeout: 20000 });

      Logger.info(this.testName, 'Switch To Super Admin element found in DOM');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Switch To Super Admin not found: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickSwitchToSuperAdminIcon(): Promise<void> {
    try {
      // ── JS evaluate se directly parent clickable element click karo ──
      // force:true viewport visibility bypass karta hai
      await this.page.evaluate(() => {
        const allElements = Array.from(document.querySelectorAll('li, div, span, a'));
        const target = allElements.find(
          (el) => el.textContent?.trim() === 'Switch To Super Admin',
        ) as HTMLElement | undefined;

        if (target) {
          // ── Parent generic/li pe click karo ──
          const clickable = target.closest('li') ?? target.parentElement ?? target;
          (clickable as HTMLElement).click();
        }
      });

      Logger.info(this.testName, 'Switch To Super Admin clicked via JS evaluate');

      // ── Confirmation popup handle karo ──
      const yesButton = this.page.getByRole('button', { name: 'Yes' });

      await yesButton.waitFor({ state: 'visible', timeout: 10000 });
      await yesButton.click();

      Logger.info(this.testName, 'Confirmation Yes button clicked');

      // ── Home page load ka wait ──
      await this.page.waitForURL(/home/i, { timeout: 30000 });

      Logger.info(this.testName, 'Redirected to Home page after Switch To Super Admin');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Switch To Super Admin click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async ensureSidebarExpanded(): Promise<void> {
    try {
      // ── keyboard_double_arrow_right = collapsed state ──
      // keyboard_double_arrow_left = expanded state
      const collapseBtn = this.page.locator('button').filter({
        has: this.page.locator('text=keyboard_double_arrow_right'),
      });

      const isCollapsed = await collapseBtn.isVisible().catch(() => false);

      if (isCollapsed) {
        await collapseBtn.click();
        await this.page.waitForTimeout(600);
        Logger.info(this.testName, 'Sidebar expanded successfully');
      } else {
        Logger.info(this.testName, 'Sidebar already expanded');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `ensureSidebarExpanded failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getSwitchToSuperAdminIcon() {
    return this.page.locator('.MuiTypography-root').filter({ hasText: 'Switch To Super Admin' });
  }

  async clickSwitchToSuperAdminAndWaitForHome(): Promise<void> {
    try {
      Logger.info(this.testName, '── Switch To Super Admin Flow: Starting ──');

      // ── Step 1: Sidebar expand karo ──
      await this.ensureSidebarExpanded();

      // ── Step 2: JS scroll karo ──
      await this.waitForSwitchToSuperAdminIconVisible();

      // ── Step 3: JS click karo ──
      await this.clickSwitchToSuperAdminIcon();

      // ── Step 4: Home page verify karo ──
      await this.verifyCompaniesHeadingVisibleOnHomePage();

      Logger.info(this.testName, '── Switch To Super Admin Flow: Completed ──');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Switch To Super Admin flow failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickSwitchUserAndWaitForSettings(): Promise<void> {
    try {
      Logger.info(this.testName, '── Switch User Flow: Starting ──');
      await this.waitForSwitchUserIconVisible();
      await this.clickSwitchUserIcon();
      // await this.verifyRedirectToSettings();
      Logger.info(this.testName, '── Switch User Flow: Completed ──');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Switch User flow failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
