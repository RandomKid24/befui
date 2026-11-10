import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { STYLE_ID, applyTheme, themeCss, themes } from './theme-apply';

export type Density = 'compact' | 'default' | 'comfortable';
const DENSITIES: { value: Density; label: string; px: string }[] = [
  { value: 'compact', label: 'Compact', px: '2rem' },
  { value: 'default', label: 'Default', px: '2.25rem' },
  { value: 'comfortable', label: 'Roomy', px: '2.5rem' },
];
const DEFAULT_THEME = 'blue';
const DEFAULT_RADIUS = 8;

const root = () => document.documentElement;
const readRadius = () => {
  const v = root().style.getPropertyValue('--radius');
  return v ? Math.round(parseFloat(v) * 16) : DEFAULT_RADIUS;
};

function useDark() {
  const [dark, setDark] = React.useState(() => root().classList.contains('dark'));
  React.useEffect(() => {
    const mo = new MutationObserver(() => setDark(root().classList.contains('dark')));
    mo.observe(root(), { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

/**
 * The three things a project edits to rebrand befui: a palette, `--radius`, and `data-density`. They are applied to <html>,
 * so the whole page (nav, popovers and all) reads them, and put back when the home page unmounts.
 */
export function useBench() {
  const initial = React.useRef({
    theme: document.getElementById(STYLE_ID)?.dataset.theme ?? DEFAULT_THEME,
    radius: readRadius(),
    density: (root().dataset.density as Density | undefined) ?? 'default',
  });
  const [theme, setTheme] = React.useState(initial.current.theme);
  const [radius, setRadius] = React.useState(initial.current.radius);
  const [density, setDensity] = React.useState<Density>(initial.current.density);

  React.useEffect(() => { applyTheme(theme === DEFAULT_THEME ? null : theme); }, [theme]);
  React.useEffect(() => {
    if (radius === DEFAULT_RADIUS) root().style.removeProperty('--radius');
    else root().style.setProperty('--radius', `${radius / 16}rem`);
  }, [radius]);
  React.useEffect(() => {
    if (density === 'default') delete root().dataset.density;
    else root().dataset.density = density;
  }, [density]);
  React.useEffect(() => () => {
    const i = initial.current;
    applyTheme(i.theme === DEFAULT_THEME ? null : i.theme);
    if (i.radius === DEFAULT_RADIUS) root().style.removeProperty('--radius'); else root().style.setProperty('--radius', `${i.radius / 16}rem`);
    if (i.density === 'default') delete root().dataset.density; else root().dataset.density = i.density;
  }, []);

  const changed = theme !== DEFAULT_THEME || radius !== DEFAULT_RADIUS || density !== 'default';
  const reset = () => { setTheme(DEFAULT_THEME); setRadius(DEFAULT_RADIUS); setDensity('default'); };
  return { theme, setTheme, radius, setRadius, density, setDensity, changed, reset };
}
export type Bench = ReturnType<typeof useBench>;

const rem = (px: number) => `${px / 16}rem`;

/** The lines a project would paste, for the mode being shown. */
function readoutLines(b: Bench, dark: boolean) {
  const tokens = themes[b.theme][dark ? 'dark' : 'light'];
  const lines = [dark ? '.dark {' : ':root {', ...Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`)];
  const out = [...lines, '}'];
  const extra = [`:root { --radius: ${rem(b.radius)}; }`, `<html data-density="${b.density}">`];
  return { out, extra };
}

/** Everything the "Copy CSS" button writes: light and dark blocks, the radius, and the density attribute when it is not the default. */
function copyText(b: Bench) {
  const parts = [themeCss(b.theme).trimEnd(), `:root { --radius: ${rem(b.radius)}; }`];
  if (b.density !== 'default') parts.push(`/* on <html>: data-density="${b.density}" */`);
  return parts.join('\n\n') + '\n';
}

/** The live CSS. A line tints once when its value changes. */
export function TokenReadout({ bench, className }: { bench: Bench; className?: string }) {
  const dark = useDark();
  const [copied, setCopied] = React.useState(false);
  const { out, extra } = readoutLines(bench, dark);
  const all = [...out, extra[0]!, ...(bench.density !== 'default' ? [extra[1]!] : [])];
  // a line tints only when its text is new since the last paint, never on the first one
  const seen = React.useRef<Set<string> | null>(null);
  const first = seen.current === null;
  const fresh = (t: string) => !first && !seen.current!.has(t);
  React.useEffect(() => { seen.current = new Set(all); });
  return (
    <div className={className}>
      <div className="flex items-center justify-between pb-2">
        <p className="font-mono text-xs text-muted-foreground">index.css</p>
        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(copyText(bench)).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}>
          {copied ? 'Copied' : 'Copy CSS'}
        </Button>
      </div>
      <pre className="-mx-2 overflow-x-auto font-mono text-[13px] leading-[1.7] text-foreground" aria-label="Theme CSS for the current settings" tabIndex={0}>
        <code>
          {all.map((t) => <span key={t} className={`${fresh(t) ? 'bench-flash ' : ''}block whitespace-pre rounded-sm px-2`}>{t}</span>)}
        </code>
      </pre>
      <p className="font-display mt-3 text-[15px] leading-snug text-muted-foreground">
        Change a control and the line it writes tints here. The nav, the form beside this and the approvals at the top of the page all follow in the same frame.
      </p>
    </div>
  );
}

/** Palette, radius and density. Native radios and a native range, so keyboard and touch work. */
export function TokenControls({ bench }: { bench: Bench }) {
  const dark = useDark();
  const names = Object.keys(themes);
  return (
    <div className="grid gap-x-12 gap-y-6 border-y py-6 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] lg:items-end">
      <fieldset>
        <legend className="mb-3 flex items-baseline gap-2 text-[13px] font-medium">
          Palette <span className="font-normal text-muted-foreground">{themes[bench.theme].label}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {names.map((k) => (
            <label key={k} className="relative cursor-pointer" title={themes[k].label}>
              <input type="radio" name="bench-palette" value={k} checked={bench.theme === k} onChange={() => bench.setTheme(k)} className="peer sr-only" aria-label={themes[k].label} />
              <span
                aria-hidden
                className="block size-7 rounded-md ring-offset-2 ring-offset-background transition-[box-shadow,transform] duration-(--dur-fast) hover:scale-110 peer-checked:ring-2 peer-checked:ring-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                style={{ background: themes[k][dark ? 'dark' : 'light'].primary }}
              />
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="bench-radius" className="flex items-baseline justify-between text-[13px] font-medium">
          Radius <span className="font-normal tabular-nums text-muted-foreground">{bench.radius}px</span>
        </label>
        <Slider id="bench-radius" value={bench.radius} onValueChange={bench.setRadius} min={0} max={16} step={1} showValue={false} className="pt-3" />
      </div>
      <div className="flex items-end gap-6">
        <div>
          <p id="bench-density" className="mb-2 text-[13px] font-medium">Density</p>
          <ToggleGroup type="single" aria-labelledby="bench-density" size="sm" value={bench.density} onValueChange={(v) => v && bench.setDensity(v as Density)} className="gap-0.5">
            {DENSITIES.map((d) => <ToggleGroupItem key={d.value} value={d.value}>{d.label}</ToggleGroupItem>)}
          </ToggleGroup>
        </div>
        <Button variant="ghost" size="sm" onClick={bench.reset} disabled={!bench.changed}>Reset</Button>
      </div>
    </div>
  );
}

/** Two drawn details that follow the controls: the corner at five times its size, and a control's height at twice. */
export function TokenDetails({ bench }: { bench: Bench }) {
  const r = bench.radius * 5;
  const rem = DENSITIES.find((d) => d.value === bench.density)!.px;
  const h = parseFloat(rem) * 32;
  const top = (100 - h) / 2;
  return (
    <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6 border-t pt-6 font-mono text-[11px] leading-relaxed text-muted-foreground">
      <figure className="grid gap-3">
        <svg viewBox="0 0 100 100" className="size-24 shrink-0 text-foreground" role="img" aria-label={`Corner drawn at five times its size, radius ${bench.radius} pixels`}>
          <path d={`M4 98 V${4 + r} A${r} ${r} 0 0 1 ${4 + r} 4 H98`} fill="none" stroke="currentColor" strokeWidth="2" className="transition-[d] duration-200" />
          {r > 0 && <path d={`M${4 + r} ${4 + r} L${4 + r * 0.293} ${4 + r * 0.293}`} stroke="var(--primary)" strokeWidth="1.5" />}
          <circle cx={4 + r} cy={4 + r} r="2.5" fill="var(--primary)" />
        </svg>
        <figcaption>Detail A<br />corner, 5×<br /><span className="text-foreground">r = {bench.radius}px</span></figcaption>
      </figure>
      <figure className="grid gap-3">
        <svg viewBox="0 0 150 100" className="h-24 w-36 shrink-0 text-foreground" role="img" aria-label={`A control drawn at twice its size, height ${rem}`}>
          <path d={`M8 ${top} V${top + h} M3 ${top} H13 M3 ${top + h} H13`} stroke="var(--primary)" strokeWidth="1.5" />
          <rect x="24" y={top} width="122" height={h} rx={Math.min(bench.radius * 2, h / 2)} fill="none" stroke="currentColor" strokeWidth="2" />
          <path d={`M40 50 H96`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        </svg>
        <figcaption>Detail B<br />control, 2×<br /><span className="text-foreground">h = {rem}</span></figcaption>
      </figure>
    </div>
  );
}
