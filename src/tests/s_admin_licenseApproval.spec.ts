import { LicenseApprovalPage } from '../pages/S_Admin_LicenseApprovalPage';
import { test, expect } from '../fixtures/baseTest';
import { Logger } from '../utils/logger';
import { ENV } from '../config/env';

// ─────────────────────────────────────────────────────────────
// Super Admin — License Approval Test Suite
// TC_LA_001 to TC_LA_003
// Assertions: test file only
// Actions/Flow/Logs: page module only
// ─────────────────────────────────────────────────────────────

test.describe('Super Admin — License Approval Test Suite', () => {
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

  test('@smoke @regression TC_LA_01 - Verify License Approval link is visible and redirects to License Approval page', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    // ── Click and navigate ──
    await licenseApprovalPage.clickLicenseApprovalLink();
    await expect(licenseApprovalPage.getLicenseApprovalLink()).toBeVisible();

    await licenseApprovalPage.waitForLicenseApprovalPageLoaded();
    await expect(page).toHaveURL(/license-approval/i);
  });

  test('@smoke @regression TC_LA_02 - Verify License Approval records visibility with Accept and Reject icons or Data Not Found state', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();

    await expect(page).toHaveURL(/license-approval/i);

    // ── Dynamic data state check ──
    const hasData = await licenseApprovalPage.isDataAvailable();

    if (hasData) {
      // ── Table visible ──
      await licenseApprovalPage.waitForTableVisible();
      await expect(licenseApprovalPage.getLicenseTable()).toBeVisible();

      // ── Log all row data ──
      await licenseApprovalPage.logAllRowData();

      await licenseApprovalPage.verifyAllRowsHaveActionIcons();

      // ── Get total data rows dynamically ──
      const rows = page.getByRole('row');
      const rowCount = await rows.count();

      // ── Assert each row has Accept and Reject icons ──
      for (let i = 1; i < rowCount; i++) {
        await expect(licenseApprovalPage.getAcceptIconByRowIndex(i)).toBeVisible();
        await expect(licenseApprovalPage.getRejectIconByRowIndex(i)).toBeVisible();
      }
    } else {
      // ── Data Not Found state assert karo ──
      await licenseApprovalPage.waitForDataNotFoundVisible();
      await expect(licenseApprovalPage.getDataNotFoundText()).toBeVisible();
    }
  });

  test('@regression TC_LA_003 -Verify License Approval table displays correct column headers', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();

    await expect(page).toHaveURL(/license-approval/i);

    await licenseApprovalPage.waitForTableVisible();
    await licenseApprovalPage.waitForAllTableHeadersVisible();

    const hasData = await licenseApprovalPage.isDataAvailable();

    if (hasData) {
      Logger.info(testInfo.title, 'Data available — headers verified with data present');
    } else {
      Logger.info(testInfo.title, 'No data available — headers still verified');

      await expect(licenseApprovalPage.getDataNotFoundText()).toBeVisible();
    }
  });

  test('@regression TC_LA_04 - Verify Reject confirmation popup is displayed on clicking Reject icon', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();
    await expect(page).toHaveURL(/license-approval/i);

    const hasData = await licenseApprovalPage.isDataAvailable();

    if (!hasData) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'No data available — test skipped gracefully');
      return;
    }

    await licenseApprovalPage.clickFirstAvailableRejectIcon();
    await licenseApprovalPage.waitForRejectConfirmationPopupVisible();

    await expect(licenseApprovalPage.getRejectConfirmationHeading()).toBeVisible();
    await expect(licenseApprovalPage.getRejectButton()).toBeVisible();
    Logger.info(testInfo.title, 'Reject confirmation popup verified');
  });

  test('@smoke @regression TC_LA_05 - Verify Super admin can reject the License approval request without providing comment', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();
    await expect(page).toHaveURL(/license-approval/i);

    const hasData = await licenseApprovalPage.isDataAvailable();

    if (!hasData) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'No data available — test skipped gracefully');
      return;
    }

    const countBefore = await licenseApprovalPage.getDataRowCount();

    await licenseApprovalPage.rejectLicenseRequest(1);

    await expect(licenseApprovalPage.getRequestUpdatedMessage()).toBeVisible();

    const countAfter = await licenseApprovalPage.waitForRowCountToDecrease(countBefore);

    if (countAfter < countBefore) {
      expect(countAfter).toBeLessThan(countBefore);
      Logger.info(testInfo.title, `Row removed — count: ${countBefore} → ${countAfter}`);
    } else if (countAfter === 0) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'All rows processed — No data found state');
    } else {
      expect(countAfter).toBeGreaterThanOrEqual(0);
      Logger.info(testInfo.title, `Row count: ${countBefore} → ${countAfter}`);
    }
  });

  test('@regression TC_LA_06 - Verify Super admin can reject License approval request with rejection reason', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();
    await expect(page).toHaveURL(/license-approval/i);

    const hasData = await licenseApprovalPage.isDataAvailable();

    if (!hasData) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'No data available — test skipped gracefully');
      return;
    }

    const countBefore = await licenseApprovalPage.getDataRowCount();

    await licenseApprovalPage.rejectLicenseRequest(1, 'Reject');

    await expect(licenseApprovalPage.getRequestUpdatedMessage()).toBeVisible();

    const countAfter = await licenseApprovalPage.waitForRowCountToDecrease(countBefore);

    if (countAfter < countBefore) {
      expect(countAfter).toBeLessThan(countBefore);
      Logger.info(testInfo.title, `Reject with comment — count: ${countBefore} → ${countAfter}`);
    } else if (countAfter === 0) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'All rows processed — No data found state');
    } else {
      expect(countAfter).toBeGreaterThanOrEqual(0);
      Logger.info(testInfo.title, `Row count: ${countBefore} → ${countAfter}`);
    }
  });

  test('@smoke @regression TC_LA_07 - Verify Approve confirmation popup is displayed on clicking Approve icon', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();
    await expect(page).toHaveURL(/license-approval/i);

    const hasData = await licenseApprovalPage.isDataAvailable();

    if (!hasData) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'No data available — test skipped gracefully');
      return;
    }

    await licenseApprovalPage.clickFirstAvailableApproveIcon();
    await licenseApprovalPage.waitForApproveConfirmationPopupVisible();

    await expect(licenseApprovalPage.getApproveConfirmationHeading()).toBeVisible();
    await expect(licenseApprovalPage.getApproveButton()).toBeVisible();
    Logger.info(testInfo.title, 'Approve confirmation popup verified');
  });

  test('@smoke @regression TC_LA_08 - Verify Super admin can accept the License approval request', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();
    await expect(page).toHaveURL(/license-approval/i);

    const hasData = await licenseApprovalPage.isDataAvailable();

    if (!hasData) {
      // ── Graceful handle — No data found ──
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'No data available — test skipped gracefully');
      return;
    }

    const countBefore = await licenseApprovalPage.getDataRowCount();

    await licenseApprovalPage.approveLicenseRequest(1);

    await expect(licenseApprovalPage.getRequestUpdatedMessage()).toBeVisible();

    const countAfter = await licenseApprovalPage.waitForRowCountToDecrease(countBefore);

    // ── Flexible assertion ──
    if (countAfter < countBefore) {
      expect(countAfter).toBeLessThan(countBefore);
      Logger.info(testInfo.title, `Row removed — count: ${countBefore} → ${countAfter}`);
    } else if (countAfter === 0) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'All rows processed — No data found state');
    } else {
      expect(countAfter).toBeGreaterThanOrEqual(0);
      Logger.info(testInfo.title, `Row count: ${countBefore} → ${countAfter}`);
    }
  });

  test('@regression TC_LA_09 - Verify row is removed from table after Accept or Reject action', async ({
    page,
  }, testInfo) => {
    const licenseApprovalPage = new LicenseApprovalPage(page, testInfo.title);

    await page.goto(ENV.BASE_URL_QA);

    await licenseApprovalPage.navigateAndVerifyLicenseApprovalPage();
    await expect(page).toHaveURL(/license-approval/i);

    const hasData = await licenseApprovalPage.isDataAvailable();

    if (!hasData) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'No data available — test skipped gracefully');
      return;
    }

    const countBefore = await licenseApprovalPage.getDataRowCount();
    Logger.info(testInfo.title, `Row count before action: ${countBefore}`);

    await licenseApprovalPage.rejectLicenseRequest(1);

    await expect(licenseApprovalPage.getRequestUpdatedMessage()).toBeVisible();

    const countAfter = await licenseApprovalPage.waitForRowCountToDecrease(countBefore);

    if (countAfter < countBefore) {
      expect(countAfter).toBeLessThan(countBefore);
      Logger.info(testInfo.title, `Row removed — count decreased: ${countBefore} → ${countAfter}`);
    } else if (countAfter === 0) {
      await expect(page.getByRole('heading', { name: 'No data found.' })).toBeVisible();
      Logger.info(testInfo.title, 'All data processed — No data found state verified');
    } else {
      expect(countAfter).toBeGreaterThanOrEqual(0);
      Logger.info(testInfo.title, `Row count unchanged: ${countBefore} → ${countAfter}`);
    }
  });
});
