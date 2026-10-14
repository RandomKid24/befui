import { waitFor } from '@testing-library/dom';
import { describe, expect, it } from 'vitest';
import './entry';

// Components download their code the first time their tag shows up, so wait until the tags have been replaced by real markup.
const mount = async (html: string) => {
  document.body.innerHTML = html;
  await waitFor(() => {
    const hosts = [...document.body.querySelectorAll('[data-bef]')];
    expect(hosts.length).toBeGreaterThan(0);
    for (const h of hosts) {
      const view = h.querySelector(':scope > [data-bef-view]');
      expect(view?.firstElementChild).not.toBeNull();
      expect([...view!.querySelectorAll('*')].some((e) => e.localName.startsWith('bef-'))).toBe(false); // the hidden [data-bef-source] still holds the original tags
    }
  }, { timeout: 5000 });
  return document.body;
};

describe('html custom elements', () => {
  it('renders a component from attributes and text', async () => {
    const b = await mount('<bef-button variant="soft" disabled>Save</bef-button>');
    const btn = b.querySelector('button')!;
    expect(btn.textContent).toBe('Save');
    expect(btn).toBeDisabled();
  });

  it('maps nested tags to compound components and :json props', async () => {
    const b = await mount('<bef-tabs default-value="b"><bef-tabs-list><bef-tabs-trigger value="b">B</bef-tabs-trigger></bef-tabs-list><bef-tabs-content value="b">Body</bef-tabs-content></bef-tabs><bef-progress :value="40"></bef-progress>');
    expect(b.querySelector('[role=tabpanel]')?.textContent).toBe('Body');
    expect(b.querySelector('[role=progressbar]')).toHaveAttribute('aria-valuenow', '40');
  });
});

describe('slots and html in json props', () => {
  it('slot="x" becomes prop x', async () => {
    const b = await mount('<bef-banner><bef-button slot="action">Undo</bef-button>Saved</bef-banner>');
    expect(b.textContent).toContain('Saved');
    expect(b.textContent).toContain('Undo');
  });

  it('turns tag strings inside :json props into content', async () => {
    const b = await mount(`<bef-bottom-nav value="a" :items='[{"id":"a","label":"Home","icon":"<bef-home-icon></bef-home-icon>"}]'></bef-bottom-nav>`);
    expect(b.querySelector('svg')).not.toBeNull();
  });
});

describe('manifest', () => {
  it('is up to date with src/components/ui (run: node scripts/html-manifest.mjs)', async () => {
    // @ts-expect-error plain .mjs script, no types
    const { manifestSource } = await import('../../scripts/html-manifest.mjs');
    const { readFileSync } = await import('node:fs');
    expect(readFileSync('src/html/manifest.ts', 'utf8')).toBe(manifestSource());
  });
});
