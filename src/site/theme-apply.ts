import themesJson from '@/registry/themes.json';

export type Tokens = Record<string, string>;
export type Preset = { label: string; light: Tokens; dark: Tokens };
export const themes = themesJson as unknown as Record<string, Preset>;
export const STYLE_ID = 'befui-theme';

/** The CSS a project pastes into index.css for a preset: one block for light, one for dark. */
export function themeCss(name: string): string {
  const preset = themes[name];
  const block = (selector: string, tokens: Tokens) => `${selector} {\n${Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`).join('\n')}\n}`;
  return `${block(':root, .light', preset.light)}\n\n${block('.dark', preset.dark)}\n`;
}

/** Switches the whole docs site by appending a style tag after the stylesheet; null removes it. */
export function applyTheme(name: string | null) {
  let tag = document.getElementById(STYLE_ID);
  if (!name) { tag?.remove(); return; }
  if (!tag) {
    tag = document.createElement('style');
    tag.id = STYLE_ID;
    document.head.appendChild(tag);
  }
  tag.dataset.theme = name;
  tag.textContent = themeCss(name);
}
