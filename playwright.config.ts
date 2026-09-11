import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  outputDir: '.work/test-results',
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4322',
    browserName: 'chromium',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322/web-traver-studi/es/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
