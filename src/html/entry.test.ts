import { describe, expect, it } from 'vitest';
import './entry';

const mount = async (html: string) => {
  document.body.innerHTML = html;
  await new Promise((r) => setTimeout(r, 20));
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
