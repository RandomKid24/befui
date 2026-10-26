import { expect, test } from '@playwright/test';

// Baselines are per platform; regenerate with: npx playwright test --update-snapshots
const modes = {
  light: async () => {},
  dark: async (p) => p.evaluate(() => document.documentElement.classList.add('dark')),
  rtl: async (p) => p.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')),
  palette: async (p) =>
    p.evaluate(() => {
      const s = document.documentElement.style;
      s.setProperty('--primary', '#7c3aed');
      s.setProperty('--ring', '#8b5cf6');
      s.setProperty('--accent', '#f5f3ff');
    }),
} as const;

for (const route of ['/', '/components/button']) {
  for (const [name, apply] of Object.entries(modes)) {
    test(`${route} ${name}`, async ({ page }) => {
      await page.goto(`/#${route}`);
      await page.waitForLoadState('networkidle');
      await apply(page);
      await expect(page).toHaveScreenshot(`${route.replace(/\W+/g, '_')}-${name}.png`);
    });
  }
}
