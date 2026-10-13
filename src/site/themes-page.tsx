import * as React from 'react';
import themesJson from '@/registry/themes.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Progress } from '@/components/ui/progress';
import { Reveal } from '@/components/ui/reveal';

type Tokens = Record<string, string>;
type Preset = { label: string; light: Tokens; dark: Tokens };
const themes = themesJson as unknown as Record<string, Preset>;
const STYLE_ID = 'befui-theme';

/** The CSS a project pastes into index.css for a preset: one block for light, one for dark. */
export function themeCss(name: string): string {
  const preset = themes[name];
  const block = (selector: string, tokens: Tokens) => `${selector} {\n${Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`).join('\n')}\n}`;
  return `${block(':root, .light', preset.light)}\n\n${block('.dark', preset.dark)}\n`;
}

/** Switches the whole docs site by appending a style tag after the stylesheet; null removes it. */
function applyTheme(name: string | null) {
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

function useDark() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  React.useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export function ThemesPage() {
  const dark = useDark();
  const [active, setActive] = React.useState<string | null>(() => document.getElementById(STYLE_ID)?.dataset.theme ?? null);
  const pick = (name: string | null) => { applyTheme(name); setActive(name); };

  return (
    <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6">
      <Reveal>
        <Badge variant="outline" className="mb-4">{Object.keys(themes).length} themes</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Themes</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Ready-made palettes for light and dark. Every one passes WCAG AA for button and accent text. Apply one to recolour this whole site, then copy the CSS or run the init command in your project.
        </p>
        {active && <Button variant="outline" size="sm" className="mt-4" onClick={() => pick(null)}>Reset to default</Button>}
      </Reveal>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(themes).map(([name, preset]) => {
          const t = dark ? preset.dark : preset.light;
          const vars = Object.fromEntries(Object.entries(t).map(([k, v]) => [`--${k}`, v])) as React.CSSProperties;
          const isActive = active === name;
          return (
            <li key={name} className={`grid gap-4 rounded-xl border bg-card p-4 transition-shadow ${isActive ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">{preset.label}</h2>
                <span className="flex gap-1" aria-hidden="true">
                  {[preset.light.primary, preset.light.accent, preset.dark.primary, preset.dark.accent].map((c, i) => (
                    <span key={i} className="size-4 rounded-full border" style={{ background: c }} />
                  ))}
                </span>
              </div>
              <div aria-hidden="true" style={vars} className="grid gap-3 rounded-lg border bg-background p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" tabIndex={-1}>Button</Button>
                  <Badge>Badge</Badge>
                  <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">Accent</span>
                </div>
                <Progress value={62} />
              </div>
              <code className="overflow-x-auto whitespace-nowrap [scrollbar-width:thin] rounded-md bg-muted px-2.5 py-1.5 font-mono text-[12px] text-muted-foreground">npx github:RandomKid24/befui init --theme {name}</code>
              <div className="flex items-center gap-2">
                <Button size="sm" variant={isActive ? 'primary' : 'outline'} aria-pressed={isActive} aria-label={`Apply ${preset.label} theme`} onClick={() => pick(isActive ? null : name)}>
                  {isActive ? 'Applied' : 'Apply'}
                </Button>
                <CopyButton value={themeCss(name)} aria-label={`Copy CSS for ${preset.label}`} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
