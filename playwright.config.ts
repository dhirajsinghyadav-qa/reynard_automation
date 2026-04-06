import { defineConfig, devices } from '@playwright/test';
import { STORAGE_STATE_PATH } from './global-setup';
// Import ENV after environment variables are set by workflow
import { ENV } from './src/config/env';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 60000,
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  outputDir: 'test-results',
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: true }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    baseURL: ENV.BASE_URL_QA,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'retain-on-failure',
    actionTimeout: 20000,
    navigationTimeout: 30000,
  },

  globalSetup: require.resolve('./global-setup'),

  /* Configure projects for major browsers */
  projects: [
    /* {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          slowMo: 200, // Slow down actions by 200ms to improve stability in Firefox
          firefoxUserPrefs: {
            'toolkit.cosmeticAnimations.enabled': false,
          },
        },
      },
      workers: 1, // Limit Firefox to 1 worker due to potential instability in parallel execution
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */

    // ✅ LOGIN TESTS — Fresh context (NO storageState)

    {
      name: 'chromium',
      testMatch: '**/login.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined,
      },
    },

    {
      name: 'Firefox',
      testMatch: '**/login.spec.ts',
      fullyParallel: false,
      use: {
        ...devices['Desktop Firefox'],
        storageState: undefined,
        launchOptions: {
          slowMo: 300,
          firefoxUserPrefs: {
            'toolkit.cosmeticAnimations.enabled': false,
          },
        },
      },
      workers: 1,
    },

    {
      name: 'webkit',
      testMatch: '**/login.spec.ts',
      use: {
        ...devices['Desktop Safari'],
        storageState: undefined,
      },
    },

    // ✅ AUTHENTICATED TESTS — storageState inject (All Modules)

    {
      name: 'chromium-auth',
      testIgnore: '**/login.spec.ts', // login.spec skip here
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE_PATH, // 🔑 Auto logged-in
        launchOptions: {
          slowMo: 500,
        },
      },
    },

    {
      name: 'firefox-auth',
      testIgnore: '**/login.spec.ts',
      fullyParallel: false,
      use: {
        ...devices['Desktop Firefox'],
        storageState: STORAGE_STATE_PATH,
        launchOptions: {
          slowMo: 500,
        },
      },
      workers: 1,
    },

    {
      name: 'webkit-auth',
      testIgnore: '**/login.spec.ts',
      use: {
        ...devices['Desktop Safari'],
        storageState: STORAGE_STATE_PATH,
        launchOptions: {
          slowMo: 500,
        },
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
