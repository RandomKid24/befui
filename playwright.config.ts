import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  webServer: { command: 'npm run dev -- --port 5199', url: 'http://localhost:5199', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:5199', viewport: { width: 1100, height: 800 }, reducedMotion: 'reduce' },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
});
