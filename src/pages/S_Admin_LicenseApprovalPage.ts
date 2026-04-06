import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

// ─────────────────────────────────────────────────────────────
// LicenseApprovalPage — Page Object Model
// Only: Actions, Flow, Functionality, Logs
// No assertions here
// ─────────────────────────────────────────────────────────────

export class LicenseApprovalPage {
  private page: Page;
  private testName: string;

  // ── Navigation ──
  private licenseApprovalLink: Locator;

  // ── Page Heading ──
  private pageHeading: Locator;

  // ── Table ──
  private licenseTable: Locator;
  private tableHeaderNo: Locator;
  private tableHeaderLogo: Locator;
  private tableHeaderClient: Locator;
  private tableHeaderEmail: Locator;
  private tableHeaderOrganization: Locator;
  private tableHeaderLicenseName: Locator;
  private tableHeaderPendingPermission: Locator;
  private tableHeaderCreated: Locator;
  private tableHeaderAction: Locator;

  // ── Reject Flow ──
  private rejectConfirmationHeading: Locator;
  private rejectConfirmationText: Locator;
  private rejectButton: Locator;
  private rejectCommentInput: Locator;

  // ── Approve Flow ──
  private approveConfirmationHeading: Locator;
  private approveConfirmationText: Locator;
  private approveButton: Locator;

  // ── Success Message ──
  private requestUpdatedMessage: Locator;

  // ── Close Icon on Confirmation Popup ──
  private confirmationCloseIcon: Locator;

  // ── Empty State ──
  private dataNotFoundText: Locator;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;

    // ── Navigation ──
    this.licenseApprovalLink = page.getByRole('link', { name: 'License Approval' });

    // ── Page Heading ──
    this.pageHeading = page.getByRole('paragraph').filter({ hasText: 'License Approval' });

    // ── Table ──
    this.licenseTable = page.locator('table');
    this.tableHeaderNo = page.locator('th').filter({ hasText: 'No.' });
    this.tableHeaderLogo = page.locator('th').filter({ hasText: 'Logo' });
    this.tableHeaderClient = page.locator('th').filter({ hasText: 'Client' });
    this.tableHeaderEmail = page.locator('th').filter({ hasText: 'Email' });
    this.tableHeaderOrganization = page.locator('th').filter({ hasText: 'Organization' });
    this.tableHeaderLicenseName = page.locator('th').filter({ hasText: 'License Name' });
    this.tableHeaderPendingPermission = page
      .locator('th')
      .filter({ hasText: 'Pending Permission' });
    this.tableHeaderCreated = page.locator('th').filter({ hasText: 'Created' });
    this.tableHeaderAction = page.locator('th').filter({ hasText: 'Action' });

    // ── Reject Flow ──
    this.rejectConfirmationHeading = page.getByText('Reject Permission', { exact: true });
    this.rejectConfirmationText = page.getByText('Reject PermissionAre you sure');
    this.rejectButton = page.getByRole('button', { name: 'Reject' });
    this.rejectCommentInput = page.getByRole('textbox', { name: 'Comment' });

    // ── Approve Flow ──
    this.approveConfirmationHeading = page.getByText('Approve Permission', { exact: true });
    this.approveConfirmationText = page.getByText('Approve PermissionAre you');
    this.approveButton = page.getByRole('button', { name: 'Approve' });

    // ── Success Message ──
    this.requestUpdatedMessage = page.getByText('Request has been updated');

    // ── Close Icon ──
    this.confirmationCloseIcon = page.locator(
      '.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-t2twuk',
    );

    // ── Empty State ──
    this.dataNotFoundText = page.getByRole('heading', { name: 'No data found.' });
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

  getLicenseApprovalLink() {
    return this.licenseApprovalLink;
  }
  getPageHeading() {
    return this.pageHeading;
  }
  getLicenseTable() {
    return this.licenseTable;
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
  getTableHeaderLicenseName() {
    return this.tableHeaderLicenseName;
  }
  getTableHeaderPendingPermission() {
    return this.tableHeaderPendingPermission;
  }
  getTableHeaderCreated() {
    return this.tableHeaderCreated;
  }
  getTableHeaderAction() {
    return this.tableHeaderAction;
  }
  getDataNotFoundText() {
    return this.dataNotFoundText;
  }
  getRejectConfirmationHeading() {
    return this.rejectConfirmationHeading;
  }
  getRejectConfirmationText() {
    return this.rejectConfirmationText;
  }
  getRejectButton() {
    return this.rejectButton;
  }
  getRejectCommentInput() {
    return this.rejectCommentInput;
  }
  getApproveConfirmationHeading() {
    return this.approveConfirmationHeading;
  }
  getApproveConfirmationText() {
    return this.approveConfirmationText;
  }
  getApproveButton() {
    return this.approveButton;
  }
  getRequestUpdatedMessage() {
    return this.requestUpdatedMessage;
  }

  // ── Dynamic Getters ──

  // ── Accept icon by row index (1-based data row) ──
  getAcceptIconByRowIndex(rowIndex: number): Locator {
    return this.page
      .getByRole('row')
      .nth(rowIndex)
      .locator('[data-testid="CheckCircleOutlineIcon"], [aria-label*="accept"], button')
      .first();
  }

  // ── Reject icon by row index ──
  getRejectIconByRowIndex(rowIndex: number): Locator {
    return this.page
      .getByRole('row')
      .nth(rowIndex)
      .locator('td') // Action cell
      .last() // last td = Action column
      .locator('button')
      .first(); // first button = Reject
  }

  // ── Accept icon by email ──
  getAcceptIconByEmail(email: string): Locator {
    return this.page
      .getByRole('row', { name: new RegExp(email, 'i') })
      .locator('[data-testid="CheckCircleOutlineIcon"], [aria-label*="accept"], button')
      .first();
  }

  // ── Reject icon by email ──
  getRejectIconByEmail(email: string): Locator {
    return this.page
      .getByRole('row', { name: new RegExp(email, 'i') })
      .locator('[data-testid="CancelOutlinedIcon"], [aria-label*="reject"], button')
      .last();
  }

  // ── Action icons for first row ──
  getFirstRowAcceptIcon(): Locator {
    return this.page.getByRole('row').nth(1).locator('button').first();
  }

  getFirstRowRejectIcon(): Locator {
    return this.page.getByRole('row').nth(1).locator('button').last();
  }

  // ── Approve Icon by row index (fingerprint nth(1) = Approve) ──
  getApproveIconByRowIndex(rowIndex: number): Locator {
    return this.page
      .getByRole('row')
      .nth(rowIndex)
      .getByRole('button', { name: 'fingerprint' })
      .nth(1);
  }

  // ── First available Reject Icon (dynamic — after rows remove) ──
  getFirstAvailableRejectIcon(): Locator {
    return this.page.getByRole('row').nth(1).getByRole('button', { name: 'fingerprint' }).first();
  }

  // ── First available Approve Icon ──
  getFirstAvailableApproveIcon(): Locator {
    return this.page.getByRole('row').nth(1).getByRole('button', { name: 'fingerprint' }).nth(1);
  }

  // ─────────────────────────────────────────────────────────────
  // NAVIGATION — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async clickLicenseApprovalLink(): Promise<void> {
    try {
      // Close configurator if visible
      const closeBtn = this.page.locator('[ref=e31], button:has-text("close")');
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
      }

      await this.licenseApprovalLink.waitFor({ state: 'visible' });

      await this.licenseApprovalLink.click();

      await this.page.waitForURL(/license-approval/i);

      Logger.info(this.testName, 'License Approval link clicked successfully');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `License Approval link click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PAGE LOAD — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForLicenseApprovalPageLoaded(): Promise<void> {
    try {
      await this.page.waitForURL(/license-approval/i, { timeout: 30000 });
      Logger.info(this.testName, 'License Approval page URL verified');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `License Approval page load failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // TABLE — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForTableVisible(): Promise<void> {
    try {
      await this.licenseTable.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'License Approval table is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `License Approval table not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForAllTableHeadersVisible(): Promise<void> {
    try {
      await this.tableHeaderNo.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "No." visible');

      await this.tableHeaderLogo.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "Logo" visible');

      await this.tableHeaderClient.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "Client" visible');

      await this.tableHeaderEmail.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "Email" visible');

      await this.tableHeaderOrganization.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "Organization" visible');

      await this.tableHeaderLicenseName.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "License Name" visible');

      await this.tableHeaderPendingPermission.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "Pending Permission" visible');

      await this.tableHeaderCreated.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "Created" visible');

      await this.tableHeaderAction.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Column Header "Action" visible');

      Logger.info(this.testName, 'All License Approval table headers verified');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Table header verification failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DATA STATE — CHECK (Data available ya nahi)
  // ─────────────────────────────────────────────────────────────

  async isDataAvailable(): Promise<boolean> {
    try {
      // ── "No data found." heading check karo pehle ──
      const noDataHeading = this.page.getByRole('heading', { name: 'No data found.' });
      const noDataVisible = await noDataHeading.isVisible().catch(() => false);

      if (noDataVisible) {
        Logger.info(this.testName, '"No data found." heading detected — empty state');
        return false;
      }

      // ── Data rows check karo ──
      const rows = this.page.getByRole('row');
      const rowCount = await rows.count();

      if (rowCount > 1) {
        Logger.info(this.testName, `Data available — ${rowCount - 1} record(s) found`);
        Logger.info(this.testName, 'Data available — verifying table and action icons');
        return true;
      }

      Logger.info(this.testName, 'No data rows found — empty state');
      return false;
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `isDataAvailable check failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  async getDataRowCount(): Promise<number> {
    try {
      const rows = this.page.getByRole('row');
      const total = await rows.count();
      const dataRows = total > 0 ? total - 1 : 0;
      Logger.info(this.testName, `Current data row count: ${dataRows}`);
      return dataRows;
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `getDataRowCount failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForDataNotFoundVisible(): Promise<void> {
    try {
      await this.dataNotFoundText.waitFor({ state: 'visible', timeout: 10000 });
      Logger.info(this.testName, '"Data Not Found" state visible on License Approval page');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Data Not Found state not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DYNAMIC ROW — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForAcceptIconVisibleByRowIndex(rowIndex: number): Promise<void> {
    try {
      const icon = this.getAcceptIconByRowIndex(rowIndex);
      await icon.waitFor({ state: 'visible' });
      Logger.info(this.testName, `Accept icon visible for row: ${rowIndex}`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Accept icon not visible for row ${rowIndex}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForRejectIconVisibleByRowIndex(rowIndex: number): Promise<void> {
    try {
      const icon = this.getRejectIconByRowIndex(rowIndex);
      await icon.waitFor({ state: 'visible' });
      Logger.info(this.testName, `Reject icon visible for row: ${rowIndex}`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Reject icon not visible for row ${rowIndex}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async logAllRowData(): Promise<void> {
    try {
      const rows = this.page.getByRole('row');
      const rowCount = await rows.count();

      Logger.info(this.testName, `Total rows including header: ${rowCount}`);

      // ── Row data log karo — innerText use karo textContent ki jagah ──
      for (let i = 1; i < rowCount; i++) {
        // ── innerText CSS hidden elements skip karta hai — sahi data milta hai ──
        const rowText = await rows
          .nth(i)
          .evaluate((el) => (el as HTMLElement).innerText?.replace(/\n/g, ' ').trim() ?? '');
        Logger.info(this.testName, `Row ${i} data: "${rowText}"`);
      }

      Logger.info(this.testName, `Total data rows found: ${rowCount - 1}`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Log row data failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async verifyAllRowsHaveActionIcons(): Promise<void> {
    try {
      const hasData = await this.isDataAvailable();

      if (!hasData) {
        Logger.info(this.testName, 'No data available — skipping action icon verification');
        return; // ✅ important: don't fail test
      }

      const rows = this.page.getByRole('row');
      const rowCount = await rows.count();

      Logger.info(
        this.testName,
        `── Verifying Accept and Reject icons for ${rowCount - 1} rows ──`,
      );

      for (let i = 1; i < rowCount; i++) {
        const acceptIcon = this.getAcceptIconByRowIndex(i);
        const rejectIcon = this.getRejectIconByRowIndex(i);

        await acceptIcon.waitFor({ state: 'visible' });
        Logger.info(this.testName, `Accept icon visible for row: ${i}`);

        await rejectIcon.waitFor({ state: 'visible' });
        Logger.info(this.testName, `Reject icon visible for row: ${i}`);
      }

      Logger.info(this.testName, 'All rows verified with Accept and Reject icons');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Action icons verification failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // COMBINED FLOW — Navigate + Verify
  // ─────────────────────────────────────────────────────────────

  async navigateAndVerifyLicenseApprovalPage(): Promise<void> {
    try {
      await this.clickLicenseApprovalLink();
      await this.waitForLicenseApprovalPageLoaded();
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `navigateAndVerifyLicenseApprovalPage failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SUCCESS MESSAGE — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async waitForRequestUpdatedMessage(): Promise<void> {
    try {
      await this.requestUpdatedMessage.waitFor({ state: 'visible', timeout: 15000 });
      Logger.info(this.testName, 'Success message visible: "Request has been updated"');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Request updated message not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // REJECT FLOW — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async clickRejectIconByRowIndex(rowIndex: number): Promise<void> {
    try {
      const hasData = await this.isDataAvailable();

      if (!hasData) {
        Logger.error(this.testName, 'No data available — Reject icon cannot be clicked');
        throw new Error('No data available for Reject action');
      }

      const rows = this.page.getByRole('row');
      const rowCount = await rows.count();

      if (rowIndex >= rowCount) {
        throw new Error(`Invalid rowIndex: ${rowIndex}, total rows: ${rowCount - 1}`);
      }

      const icon = this.getRejectIconByRowIndex(rowIndex);

      await icon.waitFor({ state: 'visible' });
      await icon.click();

      Logger.info(this.testName, `Reject icon clicked for row: ${rowIndex}`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Reject icon click failed for row ${rowIndex}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickFirstAvailableRejectIcon(): Promise<void> {
    try {
      const hasData = await this.isDataAvailable();

      if (!hasData) {
        Logger.error(this.testName, 'No data available — Reject icon cannot be clicked');
        throw new Error('No data available for Reject action');
      }

      const icon = this.getFirstAvailableRejectIcon();
      await icon.waitFor({ state: 'visible' });
      await icon.click();

      Logger.info(this.testName, 'First available Reject icon clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `First available Reject icon click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForRejectConfirmationPopupVisible(): Promise<void> {
    try {
      // ── App me dialog/modal class nahi hai ──
      // ── 'Reject Permission' paragraph directly wait karo ──
      await this.page
        .getByText('Reject Permission', { exact: true })
        .waitFor({ state: 'visible', timeout: 20000 });

      Logger.info(this.testName, 'Reject Permission confirmation popup is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Reject confirmation popup not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async fillRejectComment(comment: string): Promise<void> {
    try {
      const isVisible = await this.rejectCommentInput.isVisible().catch(() => false);
      if (isVisible) {
        await this.rejectCommentInput.fill(comment);
        Logger.info(this.testName, `Reject comment filled: "${comment}"`);
      } else {
        Logger.info(this.testName, 'Comment field not visible — skipping');
      }
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Fill reject comment failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickRejectButton(): Promise<void> {
    try {
      await this.rejectButton.waitFor({ state: 'visible' });
      await this.rejectButton.click();
      Logger.info(this.testName, 'Reject button clicked on confirmation popup');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Reject button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // APPROVE FLOW — ACTIONS
  // ─────────────────────────────────────────────────────────────

  async clickApproveIconByRowIndex(rowIndex: number): Promise<void> {
    try {
      const icon = this.getApproveIconByRowIndex(rowIndex);
      await icon.waitFor({ state: 'visible' });
      await icon.click();
      Logger.info(this.testName, `Approve icon clicked for row: ${rowIndex}`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Approve icon click failed for row ${rowIndex}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickFirstAvailableApproveIcon(): Promise<void> {
    try {
      const icon = this.getFirstAvailableApproveIcon();
      await icon.waitFor({ state: 'visible' });
      await icon.click();
      Logger.info(this.testName, 'First available Approve icon clicked');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `First available Approve icon click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForApproveConfirmationPopupVisible(): Promise<void> {
    try {
      await this.approveConfirmationHeading.waitFor({ state: 'visible' });
      Logger.info(this.testName, 'Approve Permission confirmation popup is visible');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Approve confirmation popup not visible: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async clickApproveButton(): Promise<void> {
    try {
      await this.approveButton.waitFor({ state: 'visible' });
      await this.approveButton.click();
      Logger.info(this.testName, 'Approve button clicked on confirmation popup');
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `Approve button click failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // COMBINED FLOWS
  // ─────────────────────────────────────────────────────────────

  async rejectLicenseRequest(rowIndex: number, comment?: string): Promise<void> {
    try {
      Logger.info(this.testName, `── Reject Flow: Starting for row ${rowIndex} ──`);

      await this.clickRejectIconByRowIndex(rowIndex);
      await this.waitForRejectConfirmationPopupVisible();

      if (comment) {
        await this.fillRejectComment(comment);
      }

      await this.clickRejectButton();
      await this.waitForRequestUpdatedMessage();

      Logger.info(this.testName, `── Reject Flow: Completed for row ${rowIndex} ──`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `rejectLicenseRequest failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async approveLicenseRequest(rowIndex: number): Promise<void> {
    try {
      Logger.info(this.testName, `── Approve Flow: Starting for row ${rowIndex} ──`);

      await this.clickApproveIconByRowIndex(rowIndex);
      await this.waitForApproveConfirmationPopupVisible();
      await this.clickApproveButton();
      await this.waitForRequestUpdatedMessage();

      Logger.info(this.testName, `── Approve Flow: Completed for row ${rowIndex} ──`);
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `approveLicenseRequest failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async waitForRowCountToDecrease(previousCount: number): Promise<number> {
    try {
      Logger.info(
        this.testName,
        `Waiting for table to update after action — previous count: ${previousCount}`,
      );

      // ── networkidle wait karo — API response aane ke baad ──
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });

      // ── Current count lo ──
      const newCount = await this.getDataRowCount();

      if (newCount < previousCount) {
        Logger.info(this.testName, `Row count decreased: ${previousCount} → ${newCount}`);
      } else if (newCount === 0) {
        Logger.info(this.testName, 'No data remaining — "No data found" state');
      } else {
        Logger.info(this.testName, `Row count unchanged: ${previousCount} → ${newCount}`);
      }

      return newCount;
    } catch (error: unknown) {
      Logger.error(
        this.testName,
        `waitForRowCountToDecrease failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
