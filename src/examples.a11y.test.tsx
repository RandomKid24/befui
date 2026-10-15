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
type Loader = () => Promise<{ default: ComponentType }>;
const name = (path: string, dir: string) => path.slice(dir.length, -'.tsx'.length);
// Examples are keyed by slug, blocks as `block:<slug>`, recipe steps as `recipe:<recipe>/step-N`.
const loaders: Record<string, Loader> = {
  ...Object.fromEntries(Object.entries(import.meta.glob('/src/examples/*.tsx') as Record<string, Loader>).map(([path, load]) => [name(path, '/src/examples/'), load])),
  ...Object.fromEntries(Object.entries(import.meta.glob('/src/recipes/*/step-*.tsx') as Record<string, Loader>).map(([path, load]) => [`recipe:${path.slice('/src/recipes/'.length, -'.tsx'.length)}`, load])),
  ...Object.fromEntries(Object.entries(import.meta.glob('/src/blocks/*.tsx') as Record<string, Loader>).map(([path, load]) => [`block:${name(path, '/src/blocks/')}`, load])),
};
const slugs = Object.keys(loaders).sort();
const failing: Record<string, string> = {};

/** null when the example renders and axe finds nothing, else a one-line reason. */
async function check(load: () => Promise<{ default: ComponentType }>, block = false): Promise<string | null> {
  try {
    const { default: Demo } = await load();
    const { container } = render(<Suspense fallback={null}><Demo /></Suspense>);
    await act(async () => {});
    if (container.childNodes.length === 0) return 'render: example rendered nothing';
    // heading-order needs the whole page: a block sits under its page's own heading, so it is not judged in isolation.
    const { violations } = await axe(container, { rules: { 'color-contrast': { enabled: false }, 'heading-order': { enabled: !block } } });
    return violations.length ? `axe: ${[...new Set(violations.map((v) => v.id))].join(', ')}` : null;
  } catch (error) {
    return `render: ${String((error as Error).message).split('\n')[0].slice(0, 120)}`;
  }
}

describe('examples', () => {
  it.each(slugs)('%s', async (slug) => {
    const reason = await check(loaders[slug], slug.startsWith('block:'));
    if (update) {
      if (reason) failing[slug] = reason;
      return;
    }
    if (slug in known) expect(reason, `${slug}: baseline says "${known[slug]}" but got ${reason === null ? 'a pass' : `"${reason}"`}. If it improved, run UPDATE_BASELINE=1 npm test`).toBe(known[slug]);
    else expect(reason).toBeNull();
  });

  it.skipIf(update)('baseline never holds a component or block added since 1.7.0', () => {
    const added = [
      'button-group', 'input-group', 'hover-card', 'toggle-group', 'navigation-menu', 'menubar', 'tour', 'brand-icons',
      ...['otp-verify', 'onboarding-wizard', 'notifications-page', 'server-error-page', 'team-page', 'contact-page', 'kanban-board-page', 'chat-app', 'calendar-app', 'finance-dashboard'].map((b) => `block:${b}`),
    ];
    expect(Object.keys(known).filter((slug) => added.includes(slug))).toEqual([]);
  });

  it.skipIf(update)('baseline lists only real examples and blocks', () => {
    expect(Object.keys(known).filter((slug) => !slugs.includes(slug))).toEqual([]);
  });

  afterAll(() => {
    if (!update) return;
    const sorted = Object.fromEntries(Object.entries(failing).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync('src/a11y-baseline.json', `${JSON.stringify(sorted, null, 2)}\n`);
  });
});
