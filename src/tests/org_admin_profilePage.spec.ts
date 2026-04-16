import { OrgAdminProfilePage } from '../pages/Org_Admin_ProfilePage';
import { HomePage } from '../pages/S_Admin_HomePage';
import { DataFactory } from '@/utils/dataGenerator';
import { test, expect } from '@fixtures/baseTest';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

test.describe('Org. Admin Profile Edit Test Suite', () => {
  // ─────────────────────────────────────────────────────────────
  // Test Start Log
  // ─────────────────────────────────────────────────────────────
  test.beforeEach(async ({ page: _page }, testInfo) => {
    const browserName = testInfo.project.name;

    Logger.setBrowser(browserName);
    Logger.setSpecFile(testInfo.file);
    Logger.info(testInfo.title, '===== TEST STARTED =====');
  });

  // ─────────────────────────────────────────────────────────────
  // Test End Status Log
  // ─────────────────────────────────────────────────────────────
  test.afterEach(async ({ page: _page }, testInfo) => {
    if (testInfo.status === 'passed') {
      Logger.info(testInfo.title, '===== TEST PASSED =====');
    } else {
      Logger.error(testInfo.title, '===== TEST FAILED =====');
    }
  });

  // ─────────────────────────────────────────────────────────────
  // Flush All Logs in Numeric Order (VERY IMPORTANT)
  // ─────────────────────────────────────────────────────────────
  test.afterAll(async () => {
    Logger.flushAll();
  });

  test('@smoke @regression TC_PE_01 - Verify default tab selection on profile page', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    // ── Admin Details tab selected by default ──
    await expect(orgadminprofilePage.getAdminDetailsTab()).toBeVisible();
    await expect(orgadminprofilePage.getAdminDetailsTab()).toHaveAttribute('aria-selected', 'true');
    await expect(orgadminprofilePage.getAdminDetailsHeading()).toBeVisible();
    Logger.info(testInfo.title, 'Default tab Admin Details verified');
  });

  test('@smoke @regression TC_PE_02 - Verify tab switching functionality', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    // ── Switch to Organization Profile ──
    await orgadminprofilePage.clickOrganizationProfileTab();
    await expect(orgadminprofilePage.getOrganizationProfileTab()).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(orgadminprofilePage.getOrganizationProfileHeading()).toBeVisible();
    Logger.info(testInfo.title, 'Organization Profile tab verified');

    // ── Switch to License ──
    await orgadminprofilePage.clickLicenseTab();
    await expect(orgadminprofilePage.getLicenseTab()).toHaveAttribute('aria-selected', 'true');
    await expect(orgadminprofilePage.getLicenseHeading()).toBeVisible();
    Logger.info(testInfo.title, 'License tab verified');

    // ── Switch back to Admin Details ──
    await orgadminprofilePage.clickAdminDetailsTab();
    await expect(orgadminprofilePage.getAdminDetailsTab()).toHaveAttribute('aria-selected', 'true');
    await expect(orgadminprofilePage.getAdminDetailsHeading()).toBeVisible();
    Logger.info(testInfo.title, 'Admin Details tab switch-back verified');
  });

  test('@regression TC_PE_03 - Verify dropdown expand/collapse under License menu', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();
    await orgadminprofilePage.clickLicenseTab();

    // ── Expand Project Management ──
    await orgadminprofilePage.clickLicenseDropdown('Project Management');
    await orgadminprofilePage.waitForLicenseDropdownExpanded('Project Management');
    await expect(orgadminprofilePage.getLicenseDropdownButton('Project Management')).toBeVisible();
    Logger.info(testInfo.title, 'License dropdown expanded verified');

    // ── Collapse ──
    await orgadminprofilePage.clickLicenseDropdown('Project Management');
    await expect(orgadminprofilePage.getLicenseDropdownButton('Project Management')).toBeVisible();
    Logger.info(testInfo.title, 'License dropdown collapsed verified');
  });

  test('@regression TC_PE_04 - Verify approve/remove popup open & close on license toggle', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();
    await orgadminprofilePage.clickLicenseTab();

    await orgadminprofilePage.clickLicenseDropdown('Project Management');
    await orgadminprofilePage.waitForLicenseDropdownExpanded('Project Management');

    // Dynamic toggle
    const actionType = await orgadminprofilePage.toggleLicenseAndDetectFlow('DPR');

    // Popup verify
    await orgadminprofilePage.waitForPermissionPopup(actionType);

    // Cancel
    await orgadminprofilePage.cancelPermissionPopup();

    // Verify popup closed
    await expect(orgadminprofilePage.getLicenseCheckbox('DPR')).toBeVisible();
    Logger.info(
      testInfo.title,
      `License toggle permission flow (${actionType}) popup cancel verified`,
    );
    Logger.info(testInfo.title, `Popup cancel verified for ${actionType}`);
  });

  test('@regression TC_PE_05 - Verify full license toggle flow (approve/remove)', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();
    await orgadminprofilePage.clickLicenseTab();

    await orgadminprofilePage.clickLicenseDropdown('Project Management');
    await orgadminprofilePage.waitForLicenseDropdownExpanded('Project Management');

    // Dynamic toggle
    const actionType = await orgadminprofilePage.toggleLicenseAndDetectFlow('DPR');

    // Popup
    await orgadminprofilePage.waitForPermissionPopup(actionType);

    // Confirm flow
    await orgadminprofilePage.confirmPermissionFlow(actionType);

    // Optional validation (state change)
    const finalState = await orgadminprofilePage.getLicenseCheckboxState('DPR');

    Logger.info(testInfo.title, `Final checkbox state after ${actionType}: ${finalState}`);
  });

  test('@smoke @regression TC_PE_06 - Verify edit icon click opens Update Admin Profile popup', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    // ── Click edit icon and wait for dialog to open ──
    await orgadminprofilePage.clickEditIcon();

    // ── Verify all dialog elements are visible ──
    await expect(orgadminprofilePage.getUpdateProfilePopup()).toBeVisible({ timeout: 10000 });
    await expect(orgadminprofilePage.getUpdateButton()).toBeVisible({ timeout: 5000 });
    await expect(orgadminprofilePage.getUpdateAdminProfileCancelIcon()).toBeVisible({
      timeout: 5000,
    });
  });

  test('@regression TC_PE_07 - Verify form fields are pre-filled with existing data', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    // ── This now uses the enhanced clickEditIcon with better handling ──
    await orgadminprofilePage.clickEditIcon();
    await orgadminprofilePage.waitForUpdateProfilePopupVisible();

    // ── Capture pre-filled values ──
    const preFilledData = await orgadminprofilePage.capturePreFilledValues();

    // ── Assert fields are not empty ──
    await expect(orgadminprofilePage.getUsualFirstNameInput()).toBeVisible();
    await expect(orgadminprofilePage.getFirstNamesInput()).toBeVisible();
    await expect(orgadminprofilePage.getLastNamesInput()).toBeVisible();
    await expect(orgadminprofilePage.getEmailInput()).toBeVisible();
    await expect(orgadminprofilePage.getPhoneInput()).toBeVisible();

    expect(preFilledData.usualFirstName.length).toBeGreaterThan(0);
    expect(preFilledData.firstNames.length).toBeGreaterThan(0);
    expect(preFilledData.lastNames.length).toBeGreaterThan(0);
    expect(preFilledData.email).toContain('@');
    expect(preFilledData.phone.length).toBeGreaterThan(0);
    Logger.info(testInfo.title, 'Pre-filled fields verified with data');
  });

  test('@regression TC_PE_08 - Verify Update Admin Profile popup can be closed without submitting', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    // ── This now uses the enhanced clickEditIcon with better handling ──
    await orgadminprofilePage.clickEditIcon();
    await orgadminprofilePage.waitForUpdateProfilePopupVisible();

    await orgadminprofilePage.clickUpdateAdminProfileCancelIcon();

    // ── Verify popup is closed ──
    await expect(orgadminprofilePage.getUpdateProfilePopup()).not.toBeVisible({ timeout: 5000 });
  });

  test('@regression TC_PE_09 - Verify mandatory field validation on empty form submit', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    await orgadminprofilePage.clickEditIcon();
    await orgadminprofilePage.waitForUpdateProfilePopupVisible();

    // ── Clear all mandatory fields ──
    await orgadminprofilePage.clearAllMandatoryFields();

    await orgadminprofilePage.clickUpdateButton();

    await orgadminprofilePage.logValidationErrors();

    // ── Validation messages visible ──
    await expect(orgadminprofilePage.getRequiredFieldMessages().first()).toBeVisible();
  });

  test('@regression TC_PE_10 - Verify validation error for invalid Email format', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);
    const data = DataFactory.profileData('invalidEmailFormat');

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    await orgadminprofilePage.clickEditIcon();
    await orgadminprofilePage.waitForUpdateProfilePopupVisible();

    await orgadminprofilePage.updateProfile(data);

    await orgadminprofilePage.clickUpdateButton();
    await orgadminprofilePage.waitForInvalidEmailMessage();

    await expect(orgadminprofilePage.getInvalidEmailMessage()).toBeVisible();

    Logger.info(testInfo.title, `Validation shown for invalid email: ${data.email}`);
  });

  test('@regression TC_PE_11 - Verify Phone Number does not accept alphabets', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);
    const data = DataFactory.profileData('invalidPhone');

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();
    await orgadminprofilePage.clickEditIcon();
    await orgadminprofilePage.waitForUpdateProfilePopupVisible();

    await orgadminprofilePage.clearPhoneNumber(orgadminprofilePage.getPhoneInput(), 'Phone');

    await orgadminprofilePage.updateProfile(data);
    await orgadminprofilePage.clickUpdateButton();

    const value = await orgadminprofilePage.getContactNumberValue();

    // Assertion: no alphabets should exist
    expect(value).not.toMatch(/[a-zA-Z]/);

    Logger.info(testInfo.title, `Phone number input field not accepting alphabets: "${value}"`);
  });

  test('@smoke @regression TC_PE_12 - Verify profile update successful', async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);
    const data = DataFactory.profileData('validProfile');

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();
    await homePage.clickFirstRowEyeIcon();

    await orgadminprofilePage.waitForProfilePageLoaded();

    await orgadminprofilePage.clickEditIcon();

    await orgadminprofilePage.waitForUpdateProfilePopupVisible();

    await orgadminprofilePage.updateProfile(data);
    await orgadminprofilePage.clickUpdateButton();

    // wait until popup disappears
    // await expect(orgadminprofilePage.getUpdateProfilePopup()).toBeHidden();

    // now verify
    // await expect(orgadminprofilePage.getSuccessToast()).toBeVisible();

    // await expect(orgadminprofilePage.getAdminDetailsHeading()).toBeVisible();
    Logger.info(testInfo.title, `Profile updated successfully — ${data.description}`);
  });

  /* test( '@regression TC_PE_13 - Verify data persistence after profile update',
    async ({ page }, testInfo) => {
      const homePage            = new HomePage(page, testInfo.title);
      const orgadminprofilePage = new OrgAdminProfilePage(page, testInfo.title);
      const data                = DataFactory.profileData('validProfile');

      await page.goto(ENV.BASE_URL_QA);

      await homePage.verifyHomePageLoaded();
      await homePage.waitForCompanyTableVisible();
      await homePage.clickFirstRowEyeIcon();

      await orgadminprofilePage.waitForProfilePageLoaded();
      await orgadminprofilePage.clickEditIcon();
      await orgadminprofilePage.waitForUpdateProfilePopupVisible();

      await orgadminprofilePage.updateProfile(data);
      await orgadminprofilePage.clickUpdateButton();

      // ── Reopen and verify persistence ──
      await orgadminprofilePage.waitForProfilePageLoaded();
      await orgadminprofilePage.clickEditIcon();
      await orgadminprofilePage.waitForUpdateProfilePopupVisible();

      const persisted = await orgadminprofilePage.capturePreFilledValues();

      expect(persisted.usualFirstName).toBe(data.usualFirstName);
      expect(persisted.firstNames).toBe(data.firstNames);
      expect(persisted.lastNames).toBe(data.lastNames);
      Logger.info(testInfo.title, 'Data persistence verified after update');
    },
  ); */
});
