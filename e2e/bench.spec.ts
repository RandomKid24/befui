import { expect, test } from '@playwright/test';

// The home page's theme bench: a keyboard-only pass over palette, radius and density, and the CSS it prints.
test('the bench re-skins the page from the keyboard and prints matching CSS', async ({ page }) => {
  await page.goto('/#/');
  const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim());
  expect(await primary()).toBe('#2563eb');

  // Tab until the checked palette radio has focus, then arrow to the next palette.
  const blue = page.getByRole('radio', { name: 'Blue' });
  await blue.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Indigo' })).toBeChecked();
  expect(await primary()).toBe('#4f46e5');
  await expect(page.getByLabel('Theme CSS for the current settings')).toContainText('--primary: #4f46e5;');

  // Radius is a native range: End goes to 16px.
  await page.getByRole('slider').first().focus();
  await page.keyboard.press('End');
  expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--radius'))).toBe('1rem');
  await expect(page.getByLabel('Theme CSS for the current settings')).toContainText('--radius: 1rem;');

  // Density toggles with the keyboard and shows in the readout.
  await page.getByRole('radio', { name: 'Compact' }).or(page.getByRole('button', { name: 'Compact' })).first().focus();
  await page.keyboard.press('Space');
  expect(await page.evaluate(() => document.documentElement.dataset.density)).toBe('compact');
  await expect(page.getByLabel('Theme CSS for the current settings')).toContainText('data-density="compact"');

  // Reset puts everything back.
  await page.getByRole('button', { name: 'Reset' }).click();
  expect(await primary()).toBe('#2563eb');
  expect(await page.evaluate(() => document.documentElement.dataset.density ?? '')).toBe('');
});

test('leaving the home page restores the site theme', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('radio', { name: 'Rose' }).check({ force: true });
  await page.goto('/#/docs');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim())).toBe('#2563eb');
});
