// Photographs every component demo for the index cards: public/thumbs/<slug>-light.webp and -dark.webp.
// Needs the dev server and cwebp. Run: node scripts/gen-thumbs.mjs [url] [slug ...]
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';

const [url = 'http://localhost:3010', ...only] = process.argv.slice(2);
const slugs = only.length ? only : JSON.parse(readFileSync('public/r/index.json', 'utf8')).map((i) => i.name);
mkdirSync('public/thumbs', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 448, height: 280 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await page.goto(`${url}/#/thumb/${slugs[0]}`);
for (const slug of slugs) {
  await page.evaluate((s) => { location.hash = `/thumb/${s}`; }, slug);
  // the registry index also lists blocks; the page marks those as missing and they are skipped
  const el = await page.waitForSelector(`[data-thumb="${slug}"][data-missing], [data-thumb="${slug}"] [data-ready]`, { state: 'attached', timeout: 15000 });
  if (await el.getAttribute('data-missing') !== null) continue;
  for (const mode of ['light', 'dark']) {
    await page.evaluate((d) => document.documentElement.classList.toggle('dark', d), mode === 'dark');
    await page.waitForTimeout(350); // charts and counters settle
    const png = `public/thumbs/${slug}-${mode}.png`;
    await page.screenshot({ path: png });
    execFileSync('cwebp', ['-quiet', '-q', '55', png, '-o', png.replace('.png', '.webp')]);
    rmSync(png);
  }
}
await browser.close();
console.log('thumbs done');
