// Theme presets feed `befui init --theme`, the docs Themes page and this test. Every preset must stay readable.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import themes from '@/registry/themes.json';

const TOKENS = ['primary', 'primary-foreground', 'accent', 'accent-foreground', 'ring'] as const;
const NAMES = ['blue', 'indigo', 'violet', 'rose', 'red', 'emerald', 'teal', 'amber', 'orange', 'slate'];
type Tokens = Record<(typeof TOKENS)[number], string>;
const presets = themes as unknown as Record<string, { label: string; light: Tokens; dark: Tokens }>;

const channel = (v: number) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('themes.json', () => {
  it('has the ten presets in order, each with a label', () => {
    expect(Object.keys(presets)).toEqual(NAMES);
    for (const name of NAMES) expect(presets[name].label.length).toBeGreaterThan(0);
  });

  it('defines all five tokens as #rrggbb in both modes', () => {
    const bad = NAMES.flatMap((n) => (['light', 'dark'] as const).flatMap((mode) => TOKENS.filter((t) => !/^#[0-9a-f]{6}$/i.test(presets[n][mode][t] ?? '')).map((t) => `${n}.${mode}.${t}`)));
    expect(bad).toEqual([]);
  });

  it.each(NAMES)('%s meets WCAG AA (4.5:1) for button and accent text in light and dark', (name) => {
    for (const mode of ['light', 'dark'] as const) {
      const t = presets[name][mode];
      expect(contrast(t.primary, t['primary-foreground']), `${name} ${mode} primary`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.accent, t['accent-foreground']), `${name} ${mode} accent`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('blue is exactly what src/index.css ships', () => {
    const indexCss = readFileSync('src/index.css', 'utf8');
    const block = (selector: string) => {
      const start = indexCss.indexOf(selector);
      return indexCss.slice(start, indexCss.indexOf('}', start));
    };
    const read = (css: string, token: string) => new RegExp(`--${token}:\\s*(#[0-9a-fA-F]{6})`).exec(css)?.[1].toLowerCase();
    for (const [mode, selector] of [['light', ':root, .light {'], ['dark', '.dark {']] as const)
      for (const t of TOKENS) expect(presets.blue[mode][t].toLowerCase(), `${mode} ${t}`).toBe(read(block(selector), t));
  });
});
