import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/index.css', 'utf8');
const block = (sel: string) => css.split(sel)[1].split('}')[0];
const tok = (b: string, name: string) => b.match(new RegExp(`--${name}: (#[0-9a-f]{6})`, 'i'))![1];
const lum = (h: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

describe('muted-foreground contrast', () => {
  for (const [mode, sel] of [['light', ':root, .light {'], ['dark', '.dark {']] as const) {
    it(`${mode}: >= 4.5 on background, card, muted, secondary`, () => {
      const b = block(sel);
      for (const bg of ['background', 'card', 'muted', 'secondary']) {
        expect(ratio(tok(b, 'muted-foreground'), tok(b, bg)), bg).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});
