import { Page, expect } from '@playwright/test';
import path from 'path';

export class Helpers {
  /**
   * Wait for element to appear
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * Click element
   */
  static async clickElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).click();
  }

  /**
   * Type text into input
   */
  static async typeText(page: Page, selector: string, text: string): Promise<void> {
    await page.locator(selector).fill(text);
  }

  /**
   * Verify element text
   */
  static async verifyText(page: Page, selector: string, expectedText: string): Promise<void> {
    const text = await page.locator(selector).textContent();

    expect(text).toContain(expectedText);
  }

  /**
   * Highlight element (useful for debugging)
   */
  static async highlightElement(page: Page, selector: string): Promise<void> {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);

      if (element) {
        (element as HTMLElement).style.border = '3px solid red';
      }
    }, selector);
  }

  /**
   * Custom wait
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // =============================
  // 2️⃣ Random Data / Format Helpers
  // =============================
  static randomString(length: number) {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  static randomEmail(domain = 'example.com') {
    const localPart = this.randomString(8);
    return `${localPart}@${domain}`;
  }

  static randomPassword(length = 12) {
    return this.randomString(length) + 'A1!'; // Add complexity
  }

  // =============================
  // 3️⃣ File Upload / Download
  // =============================
  static async uploadFile(page: Page, selector: string, fileName: string) {
    const filePath = path.resolve(__dirname, '../fixtures', fileName);
    await page.setInputFiles(selector, filePath);
  }

  // =============================
  // 4️⃣ Date / Time Helpers
  // =============================
  static getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  // =============================
  // 5️⃣ Retry / Utility
  // =============================
  static async retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (e) {
        lastError = e;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw lastError;
  }
}
