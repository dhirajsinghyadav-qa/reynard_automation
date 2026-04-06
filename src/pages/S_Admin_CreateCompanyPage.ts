import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

// ─────────────────────────────────────────────────────────────
// CreateCompanyPage — Page Object Model
// Only: Actions, Flow, Functionality, Logs
// No assertions here
// ─────────────────────────────────────────────────────────────

export class CreateCompanyPage {
  private page: Page;
  private testName: string;

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
  private validationInvalidContact: Locator;
  private validationInvalidEmergencyContact: Locator;

  // ── Success Message ──
  private successMessage: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

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
    this.selectLicenseButton = page.getByRole('button', { name: 'Select License' });
    this.addressInput = page.getByRole('textbox', { name: 'Address*' });
    this.contactNumberInput = page.getByRole('textbox', { name: '1 (702) 123-' }).first();
    this.emergencyContactInput = page.getByRole('textbox', { name: '1 (702) 123-' }).nth(1);

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
    this.validationInvalidContact = page.getByText('Enter valid contact number');
    this.validationInvalidEmergencyContact = page.getByText('Enter valid emergency contact');

    // ── Success Message ──
    this.successMessage = page.getByText('Account has been created successfully');
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

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
  getValidationInvalidContact() {
    return this.validationInvalidContact;
  }
  getValidationInvalidEmergencyContact() {
    return this.validationInvalidEmergencyContact;
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
      await this.companyLogoButton.waitFor({ state: 'visible' });
      await this.companyLogoButton.setInputFiles(filePath);
      Logger.info(this.testName, `Company Logo uploaded: "${filePath}"`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Upload Company Logo failed: ${error instanceof Error ? error.message : String(error)}`,
      );
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

  async fillAllMandatoryFields(data: {
    usualFirstName: string;
    firstNamePassport: string;
    lastNamePassport: string;
    email: string;
    password: string;
    country: string;
    companyName: string;
    logoPath: string;
    address: string;
    contactCountry: string;
    contactNumber: string;
  }): Promise<void> {
    Logger.info(this.testName, '── Filling all mandatory fields ──');
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
    Logger.info(this.testName, '── All mandatory fields filled successfully ──');
  }

  async fillAllFieldsIncludingOptional(data: {
    usualFirstName: string;
    firstNamePassport: string;
    lastNamePassport: string;
    email: string;
    password: string;
    country: string;
    companyName: string;
    logoPath: string;
    address: string;
    contactCountry: string;
    contactNumber: string;
    emergencyContactCountry: string;
    emergencyContactNumber: string;
  }): Promise<void> {
    Logger.info(this.testName, '── Filling all fields including optional ──');
    await this.fillAllMandatoryFields(data);
    await this.fillEmergencyContactNumber(
      data.emergencyContactCountry,
      data.emergencyContactNumber,
    );
    Logger.info(this.testName, '── All fields including optional filled successfully ──');
  }
}
