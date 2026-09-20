import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  outputDir: '../.work/landing-test-results',
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4325',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node landing/preview.mjs',
    url: 'http://127.0.0.1:4325',
    reuseExistingServer: !process.env.CI,
  },
});
