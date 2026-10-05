import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const isCI = !!process.env.CI;
export const AUTH_FILE = '.auth/standard-user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI, // fail CI if someone commits test.only
  retries: isCI ? 2 : 0, // retries in CI only; flakes are surfaced in the report
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: isCI
    ? [['blob'], ['github'], ['list']] // blob reports get merged across shards
    : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    testIdAttribute: 'data-test', // the app under test exposes data-test attributes
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      grep: /@smoke/,
    },
  ],
});
