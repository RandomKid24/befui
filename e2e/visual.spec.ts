import { expect, test } from '@playwright/test';

// Baselines are per platform; regenerate with: npx playwright test --update-snapshots
const modes = {
  light: async () => {},
  dark: async (p) => p.evaluate(() => document.documentElement.classList.add('dark')),
  rtl: async (p) => p.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')),
  // Tab once so :focus-visible applies, then focus the first control in the preview.
  focus: async (p) => {
    await p.keyboard.press('Tab');
    await p.evaluate(() => document.querySelector<HTMLElement>('main button, main input, main [role=combobox]')?.focus());
  },
  palette: async (p) =>
    p.evaluate(() => {
      const s = document.documentElement.style;
      s.setProperty('--primary', '#7c3aed');
      s.setProperty('--ring', '#8b5cf6');
      s.setProperty('--accent', '#f5f3ff');
    }),
} as const;

// One page per family: actions, text fields, pickers, data, overlays, charts.
const routes = ['/', '/components/button', '/components/input', '/components/select', '/components/date-picker', '/components/data-table', '/components/dialog', '/components/area-chart'];
for (const route of routes) {
  for (const [name, apply] of Object.entries(modes)) {
    test(`${route} ${name}`, async ({ page }) => {
      await page.goto(`/#${route}`);
      await page.waitForLoadState('networkidle');
      await apply(page);
      await expect(page).toHaveScreenshot(`${route.replace(/\W+/g, '_')}-${name}.png`);
    });
  }
}
