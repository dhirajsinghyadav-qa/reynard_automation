// import { OrgProfilePage } from '@/pages/S_Admin_Org_ProfilePage';
import { HomePage } from '../pages/S_Admin_HomePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { DataFactory } from '@/utils/dataGenerator';
import { test, expect } from '@fixtures/baseTest';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

test.describe('Super Admin Home Page Test Suite', () => {
  // ─────────────────────────────────────────────────────────────
  // Test Start Log
  // ─────────────────────────────────────────────────────────────
  test.beforeEach(async ({ page: _page }, testInfo) => {
    const browserName = testInfo.project.name;

    Logger.setBrowser(browserName);
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

  test( '@smoke @regression TC_H_M_01 - Verify the click event of the "Home" menu', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    // ── Step 1: Verify Home page Loaded and Companies heading ──
    await homePage.verifyHomePageLoaded();
    await expect(page).toHaveURL(/home/);

    // ── Step 2: Verify Home link visible ──
    await homePage.verifyHomeMenuLinkVisible();
    await homePage.clickHomeMenuLink();
    await expect(homePage.getHomeMenuLink()).toBeVisible();

    // ── Step 3: Verify Companies Heading Visible on Home page ──
    await homePage.verifyCompaniesHeadingVisibleOnHomePage();
    await expect(homePage.getCompaniesHeading()).toBeVisible();

    // ── Step 4: Verify Company table ──
    await homePage.waitForCompanyTableVisible();
    await expect(homePage.getCompanyTable()).toBeVisible();

    // ── Step 5: Verify Create Company button ──
    await homePage.waitForCreateCompanyButtonVisible();
    await expect(homePage.getCreateCompanyButton()).toBeVisible();
  });

  test( '@regression TC_H_M_02 - Verify Company table displays correct columns on Home page', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    // ── Step 1: Verify Home page loaded ──
    await homePage.verifyHomePageLoaded();

    // ── Step 2: Wait for table ──
    await homePage.waitForCompanyTableVisible();

    // ── Step 3: Wait for all headers ──
    await homePage.waitForAllTableHeadersVisible();

    // ── Step 4: Assert all column headers ──
    await expect(homePage.getTableHeaderNo()).toBeVisible();

    await expect(homePage.getTableHeaderLogo()).toBeVisible();

    await expect(homePage.getTableHeaderClient()).toBeVisible();

    await expect(homePage.getTableHeaderEmail()).toBeVisible();

    await expect(homePage.getTableHeaderOrganization()).toBeVisible();

    await expect(homePage.getTableHeaderStatus()).toBeVisible();

    await expect(homePage.getTableHeaderEmployed()).toBeVisible();

    await expect(homePage.getTableHeaderAction()).toBeVisible();
  });

  test( '@regression TC_H_M_03 - Verify Home menu active state and Create Company button is enabled',
    async ({ page }, testInfo) => {
      const homePage = new HomePage(page, testInfo.title);

      await page.goto(ENV.BASE_URL_QA);

      // ── Step 1: Verify Home page loaded ──
      await homePage.verifyHomePageLoaded();

      // ── Step 2: Click Home ──
      await homePage.clickHomeMenuLink();

      // ── Step 3: Assert Home link visible (active state) ──
      await expect(homePage.getHomeMenuLink()).toBeVisible();

      // ── Step 4: Assert Create Company button visible ──
      await homePage.waitForCreateCompanyButtonVisible();
      await expect(homePage.getCreateCompanyButton()).toBeVisible();

      // ── Step 5: Assert Create Company button clickable ──
      await homePage.clickCreateCompanyButton();
      await homePage.waitForPopupVisible();
      await expect(homePage.getNewCompanyPopup()).toBeVisible();
    });

  test( '@regression TC_H_M_04 - Verify Home page session persistence on browser refresh', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    // ── Step 1: Verify Home page loaded ──
    await homePage.verifyHomePageLoaded();

    // ── Step 2: Refresh page ──
    await homePage.refreshPage();

    // ── Step 3: Assert still on home URL — not redirected to login ──
    await expect(page).toHaveURL(/home/);
    Logger.info(testInfo.title, 'URL verified after refresh — still on home page');

    // ── Step 4: Assert all elements still visible ──
    await expect(homePage.getCompaniesHeading()).toBeVisible();
    Logger.info(testInfo.title, 'Companies heading visible after refresh');

    await expect(homePage.getCompanyTable()).toBeVisible();
    Logger.info(testInfo.title, 'Company table visible after refresh');

    await expect(homePage.getCreateCompanyButton()).toBeVisible();
    Logger.info(testInfo.title, 'Create Company button visible after refresh');

    // ── Step 6: Assert NOT redirected to login ──
    await expect(page).not.toHaveURL(/sign-in/);
  });

  test( '@smoke @regression TC_H_M_05 - Verify New Company popup opens on clicking Company button', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    await expect(homePage.getNewCompanyPopup()).toBeVisible();
  });

  test( '@regression TC_H_M_06 - Verify all mandatory fields are present in New Company popup', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    await expect(await homePage.verifyFieldVisible(homePage.getUsualFirstNameInput(), 'Usual First Name')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getFirstNamePassportInput(), 'First Name Passport')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getLastNamePassportInput(), 'Last Name Passport')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getEmailInput(), 'Email')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getPasswordInput(), 'Password')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getCountryButton(), 'Country')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getCompanyNameInput(), 'Company Name')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getCompanyLogoButton(), 'Company Logo')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getSelectLicenseButton(), 'Select License')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getAddressInput(), 'Address')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getContactNumberInput(), 'Contact Number')).toBeVisible();
    await expect(await homePage.verifyFieldVisible(homePage.getSubmitButton(), 'Submit Button')).toBeVisible();
  });

  test( '@regression TC_H_M_07 - Verify form fields are empty when popup opens fresh', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    // ✅ Text fields
    await expect(homePage.getUsualFirstNameInput()).toHaveValue('');
    await expect(homePage.getFirstNamePassportInput()).toHaveValue('');
    await expect(homePage.getLastNamePassportInput()).toHaveValue('');
    await expect(homePage.getEmailInput()).toHaveValue('');
    await expect(homePage.getPasswordInput()).toHaveValue('');
    await expect(homePage.getCompanyNameInput()).toHaveValue('');
    await expect(homePage.getAddressInput()).toHaveValue('');

    await expect(homePage.getCountryButton()).toHaveAttribute('aria-expanded', 'false');

    // ✅ File Upload (Logo)
    // check no file selected (depends on UI)
    await expect(homePage.getCompanyLogoButton()).toBeVisible();

    // ✅ Contact Number (masked input case)
    await expect(homePage.getContactNumberInput()).toHaveValue('+31');
    await expect(homePage.getEmergencyContactInput()).toHaveValue('+31');
    Logger.info(testInfo.title, 'All form fields empty on fresh popup open — verified');
  });

  /* test( '@smoke @regression TC_H_M_08 - Verify admin can create company with all valid mandatory and optional fields', async ({ page }, testInfo) => {
      const homePage = new HomePage(page, testInfo.title);
      const data = DataFactory.companyData('validWithAllFields');

      await page.goto(ENV.BASE_URL_QA);

      await homePage.verifyHomePageLoaded();
      await homePage.clickCreateCompanyButton();
      await homePage.waitForPopupVisible();

      await homePage.fillCompanyForm(data);
      await homePage.clickSubmitButton();
      await homePage.waitForSuccessMessage();

      await expect(homePage.getSuccessMessage()).toBeVisible();
    });

  test( '@smoke @regression TC_H_M_09 - Verify admin can create company with only mandatory fields', async ({ page }, testInfo) => {
      const homePage = new HomePage(page, testInfo.title);
      const data = DataFactory.companyData('validMandatoryOnly');

      await page.goto(ENV.BASE_URL_QA);

      await homePage.verifyHomePageLoaded();
      await homePage.clickCreateCompanyButton();
      await homePage.waitForPopupVisible();

      await homePage.fillCompanyForm(data);
      await homePage.clickSubmitButton();
      await homePage.waitForSuccessMessage();

      await expect(homePage.getSuccessMessage()).toBeVisible();
    }); */

  test( '@regression TC_H_M_10 Verify Create Company popup can be closed without submitting', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    await homePage.clickCancelButton();
    await homePage.waitForPopupClosed();

    await expect(homePage.getNewCompanyPopup()).not.toBeVisible();
    // Logger.info(testInfo.title, 'Popup closed on cancel — no data saved');
  });

  test( '@regression TC_H_M_11 - Verify company creation fails when all mandatory fields are empty', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    await homePage.clickSubmitButton();

    await expect(homePage.getValidationUsualFirstName()).toBeVisible();
    await expect(homePage.getValidationFirstName()).toBeVisible();
    await expect(homePage.getValidationLastName()).toBeVisible();
    await expect(homePage.getValidationEmail()).toBeVisible();
    await expect(homePage.getValidationPassword()).toBeVisible();
    await expect(homePage.getValidationCountry()).toBeVisible();
    await expect(homePage.getValidationCompanyName()).toBeVisible();
    await expect(homePage.getValidationLicense()).toBeVisible();
    await expect(homePage.getValidationAddress()).toBeVisible();
    await expect(homePage.getValidationContactNumber()).toBeVisible();

    await homePage.logMandatoryFieldValidationMessages();
  });

  test( '@regression TC_H_M_12 - Verify validation error for invalid Email format', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    const data = DataFactory.companyData('invalidEmailFormat');

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    // ✅ Single line clean flow
    await homePage.fillCompanyForm(data);

    await homePage.clickSubmitButton();

    await expect(homePage.getValidationInvalidEmail()).toBeVisible();

    Logger.info(testInfo.title, `Validation shown for invalid email: ${data.email}`);
  });

  test( '@regression TC_H_M_13 - Verify Contact Number does not accept alphabets', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    const data = DataFactory.companyData('invalidContactAlpha');

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    await homePage.fillCompanyForm(data);

    await homePage.clickSubmitButton();

    const value = await homePage.getContactNumberValue();

    // ✅ Assertion: no alphabets should exist
    expect(value).not.toMatch(/[a-zA-Z]/);

    Logger.info(testInfo.title, `Validation shown for invalid contact: ${data.description}`);
  });

  /* test( '@regression TC_H_M_14 - Verify Emergency Contact Number does not accept alphabets', async ({ page }, testInfo) => {
      const homePage = new HomePage(page, testInfo.title);

      const data = DataFactory.companyData('invalidEmergencyAlpha');

      await page.goto(ENV.BASE_URL_QA);

      await homePage.verifyHomePageLoaded();
      await homePage.clickCreateCompanyButton();
      await homePage.waitForPopupVisible();

      await homePage.fillCompanyForm(data);

      await homePage.clickSubmitButton();

      const value = await homePage.getEmergencyContactValue();

      // ✅ Assertion: no alphabets should exist
      expect(value).not.toMatch(/[a-zA-Z]/);
    }); */

  test( '@regression TC_H_M_15 - Verify Company Logo field rejects invalid file format', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    const data = DataFactory.companyData('invalidLogoFormat');

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.clickCreateCompanyButton();
    await homePage.waitForPopupVisible();

    await homePage.fillCompanyForm(data);
    await homePage.clickSubmitButton();

    const logoError = page.getByText(/invalid.*file|file.*format|only.*image/i);
    await expect(logoError).toBeVisible();
    Logger.info(testInfo.title, `Invalid logo format rejected: ${data.description}`);
  });

  test( '@regression TC_H_M_16 - Verify Eye icon visible for each company row in table', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();

    await homePage.verifyEyeIconVisible();

    await expect(homePage.getEyeIconButton()).toBeVisible();
  });

  test( '@smoke @regression TC_H_M_17 - Verify click event of Eye icon and profile details page loads after Eye icon click', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();

    await homePage.verifyEyeIconVisible();
    await homePage.waitForEyeIconEnabled();

    // Step 2: Click action
    await homePage.clickEyeIcon();

    // Step 3: Verify profile panel
    await homePage.waitForProfilePanelVisible();

    // Step 4: Strong assertion (recommended)
    await expect(homePage.getProfilePanel()).toBeVisible();
    await expect(homePage.getAdminDetailsHeading()).toBeVisible();
  });

  test( '@regression TC_H_M_18 - Verify Admin Details heading visible on profile page', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();

    await homePage.clickEyeIcon();
    await homePage.waitForAdminDetailsHeadingVisible();

    await expect(homePage.getAdminDetailsHeading()).toBeVisible();
  });

  test( '@regression TC_H_M_19 - Verify profile details panel shows correct admin information', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();

    await homePage.clickEyeIconAndVerifyProfileDetails();
    await homePage.waitForProfileAdminNameVisible();
    await homePage.waitForProfileAdminEmailVisible();

    await expect(homePage.getProfilePanel()).toBeVisible();
    await expect(homePage.getProfileAdminName()).toBeVisible();
    await expect(homePage.getProfileAdminEmail()).toBeVisible();
    Logger.info(testInfo.title, 'Profile panel shows correct admin name and email');
  });

  test( '@regression TC_H_M_20 - Verify Switch User icon is visible in company table row', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();
    await homePage.waitForCompanyTableVisible();

    await homePage.waitForSwitchUserIconVisible();

    await expect(homePage.getSwitchUserIconByRow('Tim Naber')).toBeVisible();
  });

  test( '@smoke @regression TC_H_M_21 - Verify click event of Switch User icon and admin is redirected to Settings page after Switch User', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);
    const settingPage = new SettingsPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    // ── Step 2: Verify Home Page ──
    await homePage.verifyHomePageLoaded();

    // ── Step 3: Switch User action ──
    await homePage.waitForSwitchUserIconVisible();
    await homePage.clickSwitchUserIcon();

    // ── Step 4: Verify navigation ──
    await settingPage.verifyRedirectToSettings();
    await expect(page).toHaveURL(/setting/i);

    // ── Step 5: Verify UI on Settings page ──
    await expect(settingPage.getSettingsHeading()).toBeVisible();
  });

  test( '@regression TC_H_M_22 - Verify switched user can access settings and sidebar', async ({ page }, testInfo) => {

    const homePage       = new HomePage(page, testInfo.title);
    const settingPage = new SettingsPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();

    await homePage.clickSwitchUserAndWaitForSettings();

    await settingPage.verifySettingsPageWithLogs();

    // SETTINGS PAGE ASSERTIONS
    await expect(settingPage.getOrganizationSection()).toBeVisible();
    await expect(settingPage.getProjectManagementSection()).toBeVisible();
    await expect(settingPage.getActionsSection()).toBeVisible();
    await expect(settingPage.getUserManagementSection()).toBeVisible();
    await expect(settingPage.getQHSESection()).toBeVisible();
    await expect(settingPage.getEquipmentSection()).toBeVisible();
    await expect(settingPage.getPersonalSettingSection()).toBeVisible();

    // SIDEBAR ASSERTIONS
    await expect(settingPage.getProjectManagementMenu()).toBeVisible();
    await expect(settingPage.getSettingsMenu()).toBeVisible();
  });

  test( '@smoke @regression TC_H_M_23 - Verify click event of Switch To Super Admin icon and redirection to Home/Companies page', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();

    await homePage.clickSwitchUserAndWaitForSettings();
    await expect(page).toHaveURL(/setting/i);

    await homePage.clickSwitchToSuperAdminAndWaitForHome();

    await expect(homePage.getCompaniesHeading()).toBeVisible();
    await expect(page).toHaveURL(/home|company/i);
  });

  test( '@smoke @regression TC_H_M_24 - Verify Super Admin can access all modules after switch back', async ({ page }, testInfo) => {
    const homePage = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();

    await homePage.clickSwitchUserAndWaitForSettings();
    await homePage.clickSwitchToSuperAdminAndWaitForHome();

    await homePage.verifyHomeMenuLinkVisible();
    await homePage.waitForLicenseApprovalLinkVisible();

    await expect(homePage.getHomeMenuLink()).toBeVisible();
    await expect(homePage.getLicenseApprovalLink()).toBeVisible();
  });

  test( '@regression TC_H_M_25 - Verify Super Admin session is correctly restored', async ({ page }, testInfo) => {
    const homePage       = new HomePage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await homePage.verifyHomePageLoaded();

    await homePage.clickSwitchUserAndWaitForSettings();
    await expect(page).toHaveURL(/setting/i);

    await homePage.clickSwitchToSuperAdminAndWaitForHome();

    await expect(page).toHaveURL(/home/i);
    await expect(homePage.getCompaniesHeading()).toBeVisible();
    await expect(page).not.toHaveURL(/setting/i);
  });
});
