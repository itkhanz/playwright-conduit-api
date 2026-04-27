import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', {open: 'never'}], ['list']],
  use: {
    trace: 'retain-on-failure'
  },
  
  projects: [
    {
      name: 'api-practice',
      testMatch: 'practice*',
      dependencies: ['api-framework']
    },
    {
      name: 'api-framework',
      testDir: './tests/api/framework'
    },
    {
      name: 'ui-tests',
      testDir: './tests/ui',
      use: {
        defaultBrowserType: 'chromium'
      }
    }
  ],
});
