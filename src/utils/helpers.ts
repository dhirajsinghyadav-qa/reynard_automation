/* import { Page, Locator, expect } from '@playwright/test';
import { logger } from './logger';

// ─────────────────────────────────────────────────────────────
// Generic Helpers — reusable across all page objects & tests
// ─────────────────────────────────────────────────────────────


Wait for element to be visible and stable before interacting

export async function waitAndClick(page: Page, locator: Locator, timeout = 10000): Promise<void> {
  logger.debug(`Waiting to click: ${locator}`);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.click();
}


 * Clear a field and type text

export async function clearAndFill(locator: Locator, text: string): Promise<void> {
  await locator.clear();
  await locator.fill(text);
}


 * Wait for page URL to contain a string

export async function waitForUrl(page: Page, urlPart: string, timeout = 15000): Promise<void> {
  logger.debug(`Waiting for URL to contain: ${urlPart}`);
  await page.waitForURL(`**${urlPart}**`, { timeout });
}


 * Take a named screenshot and attach it

export async function takeScreenshot(page: Page, name: string): Promise<Buffer> {
  const screenshot = await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
  logger.info(`📸 Screenshot taken: ${name}`);
  return screenshot;
}


 * Wait for network idle (no pending requests)

export async function waitForNetworkIdle(page: Page, timeout = 10000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}


 * Retry a function N times before failing

export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      logger.warn(`Retry attempt ${attempt}/${retries} failed. Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Max retries exceeded');
}


 * Format date to readable string

export function formatDate(date: Date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}


 * Sleep for given milliseconds

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}


 * Assert element text contains expected value

export async function assertTextContains(locator: Locator, expected: string): Promise<void> {
  await expect(locator).toContainText(expected);
  logger.debug(`✅ Text assertion passed: "${expected}"`);
}


 * Scroll to element

export async function scrollToElement(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
}


 * Get text of all matching elements

export async function getAllTexts(locator: Locator): Promise<string[]> {
  return await locator.allTextContents();
}
 */

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
