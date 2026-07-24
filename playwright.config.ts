import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL,
    headless: true,
    video: 'on',
    trace: 'on',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
    launchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] },
  },
  outputDir: './test-results',
  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
      use: { actionTimeout: 60_000 },
      timeout: 60_000,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: '**/auth.spec.ts',
    },
    {
      name: 'auth-tests',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/auth.spec.ts',
    },
  ],
});
