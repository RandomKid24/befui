// Renders every example in jsdom and runs axe on it.
// Known failures live in a11y-baseline.json (slug -> reason). The list may only shrink:
// do not add slugs to it, fix the component. After fixing one, run `UPDATE_BASELINE=1 npm test` to rewrite the file.
import { writeFileSync } from 'node:fs';
import { Suspense, type ComponentType } from 'react';
import { act, render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterAll, describe, expect, it } from 'vitest';
import baseline from './a11y-baseline.json';

const known: Record<string, string> = baseline;
const update = Boolean(process.env.UPDATE_BASELINE);
const loaders = import.meta.glob('/src/examples/*.tsx') as Record<string, () => Promise<{ default: ComponentType }>>;
const slugs = Object.keys(loaders).map((path) => path.slice('/src/examples/'.length, -'.tsx'.length)).sort();
const failing: Record<string, string> = {};

/** null when the example renders and axe finds nothing, else a one-line reason. */
async function check(load: () => Promise<{ default: ComponentType }>): Promise<string | null> {
  try {
    const { default: Demo } = await load();
    const { container } = render(<Suspense fallback={null}><Demo /></Suspense>);
    await act(async () => {});
    const { violations } = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    return violations.length ? `axe: ${[...new Set(violations.map((v) => v.id))].join(', ')}` : null;
  } catch (error) {
    return `render: ${String((error as Error).message).split('\n')[0].slice(0, 120)}`;
  }
}

describe('examples', () => {
  it.each(slugs)('%s', async (slug) => {
    const reason = await check(loaders[`/src/examples/${slug}.tsx`]);
    if (update) {
      if (reason) failing[slug] = reason;
      return;
    }
    if (slug in known) expect(reason, `${slug} now passes, remove it from src/a11y-baseline.json`).not.toBeNull();
    else expect(reason).toBeNull();
  });

  it.skipIf(update)('baseline lists only real examples', () => {
    expect(Object.keys(known).filter((slug) => !slugs.includes(slug))).toEqual([]);
  });

  afterAll(() => {
    if (!update) return;
    const sorted = Object.fromEntries(Object.entries(failing).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync('src/a11y-baseline.json', `${JSON.stringify(sorted, null, 2)}\n`);
  });
});
