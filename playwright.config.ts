import type {PlaywrightTestConfig} from '@playwright/test';
import {devices} from '@playwright/test';


/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 3 * 60 * 1000,
  reportSlowTests: null,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 20 * 1000,
  },

  retries:  0,
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    // ['json', {outputFile: './test-results/test-results.json'}],
    ['html', {open: 'on-failure'}],
    // ['junit', {outputFile: './test-results/results.xml'}]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    ...devices['Desktop Chrome'],
    viewport: {width: 1680, height: 946},
    headless: true,
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 30 * 1000,
    navigationTimeout: 30 * 1000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'home',
      testDir: './tests/home',
    },
  ],
};

export default config;
