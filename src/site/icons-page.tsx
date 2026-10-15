import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { EmptyState } from '@/components/ui/empty-state';
import { icons, SearchIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Reveal } from '@/components/ui/reveal';
import { Segmented } from '@/components/ui/segmented';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Command } from './code';

const SIZES = ['16', '24', '32', '48'] as const;
const SPEEDS = [['Slow', 1500], ['Normal', 900], ['Fast', 450]] as const;
const COLORS = [
  ['Default', 'text-foreground'],
  ['Primary', 'text-primary'],
  ['Success', 'text-success'],
  ['Warning', 'text-warning'],
  ['Danger', 'text-destructive'],
] as const;

export function IconsPage() {
  const names = Object.keys(icons) as (keyof typeof icons)[];
  const [q, setQ] = React.useState('');
  const [size, setSize] = React.useState<(typeof SIZES)[number]>('24');
  const [weight, setWeight] = React.useState(1.75);
  const [color, setColor] = React.useState<string>(COLORS[1][1]);
  const [animate, setAnimate] = React.useState(true);
  const [speed, setSpeed] = React.useState<number>(900);
  const [active, setActive] = React.useState<keyof typeof icons>('SearchIcon');

  const shown = names.filter((n) => n.toLowerCase().includes(q.trim().toLowerCase()));
  const px = Number(size);
  const Active = icons[active];
  const usage = `<${active}${px !== 16 ? ` className="size-${px / 4}"` : ''}${weight !== 1.75 ? ` weight={${weight}}` : ''}${animate ? ` draw${speed !== 900 ? ` speed={${speed}}` : ''}` : ''} />`;
  const pick = (n: keyof typeof icons) => {
    setActive(n);
    navigator.clipboard?.writeText(`<${n} />`).then(() => toast.success(`Copied <${n} />`), () => {});
  };

  return (
    <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6">
      <Reveal>
        <Badge variant="outline" className="mb-4">{names.length} icons</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Icons</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Our own set, drawn on one 24px grid with round strokes. No icon package. Click one to copy it. Animation is opt-in per icon, so by default they are static.
        </p>
      </Reveal>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input leftIcon={<SearchIcon />} placeholder="Search icons" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
            <Segmented value={size} onValueChange={setSize} options={SIZES.map((s) => ({ value: s, label: `${s}px` }))} />
            <div className="flex items-center gap-1.5">
              {COLORS.map(([label, cls]) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  aria-pressed={color === cls}
                  onClick={() => setColor(cls)}
                  className={cn('size-5 rounded-full border-2 border-transparent bg-current outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:border-background aria-pressed:ring-2 aria-pressed:ring-current', cls)}
                />
              ))}
            </div>
            <label className="ml-auto flex items-center gap-2 text-[13px] text-muted-foreground">
              Animate on hover <Switch checked={animate} onCheckedChange={setAnimate} />
            </label>
            {animate && <Segmented value={String(speed)} onValueChange={(v) => setSpeed(Number(v))} options={SPEEDS.map(([l, v]) => ({ value: String(v), label: l }))} />}
          </div>

          {shown.length === 0 ? (
            <EmptyState icon={<SearchIcon />} title="No icon by that name" description="Try 'arrow', 'sun' or 'copy'." />
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-6">
              {shown.map((n, i) => {
                const Icon = icons[n];
                return (
                  <Reveal key={n} delay={Math.min(i, 11) * 25} y={8}>
                    <button
                      type="button"
                      onClick={() => pick(n)}
                      className={cn(
                        'group flex h-28 w-full flex-col items-center justify-center gap-3 rounded-xl border bg-card outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50',
                        active === n && 'border-primary bg-accent',
                      )}
                    >
                      <Icon draw={animate} speed={speed} weight={weight} className={color} style={{ width: px, height: px }} />
                      <span className="text-[11px] font-medium text-muted-foreground">{n.replace('Icon', '')}</span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-20">
          <div className="grid place-items-center rounded-xl border bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] py-10">
            <Active key={`${active}${weight}${size}${animate}`} draw={animate} speed={speed} weight={weight} className={cn('animate-pop', color)} style={{ width: Math.max(px, 48), height: Math.max(px, 48) }} />
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-semibold">{active}</p>
            <p className="text-xs text-muted-foreground">Stroke width {weight}</p>
            <Slider value={weight} min={1} max={3} step={0.25} onValueChange={setWeight} />
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/60 py-1.5 pl-3 pr-1.5">
            <code className="overflow-x-auto whitespace-nowrap font-mono text-xs">{usage}</code>
            <CopyButton value={usage} className="size-7 shrink-0 border-transparent bg-transparent" />
          </div>
        </aside>
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Use them</h2>
        <p className="mb-3 text-[13px] text-muted-foreground">One file, no dependencies besides the <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">cn</code> helper. Without <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">draw</code> the icons are plain SVG, so the theme CSS is only needed if you want the animation. It also switches off for people who ask for reduced motion.</p>
        <Command>npx befui add icons</Command>
        <pre className="mt-3 overflow-auto rounded-lg border bg-muted/60 p-4 font-mono text-[12.5px] leading-relaxed">{`import { SearchIcon } from '@/components/ui/icons';\n\n<SearchIcon />                      // 16px, follows text color\n<SearchIcon className="size-6" />      // static, the default\n<SearchIcon draw />                    // redraws on hover\n<SearchIcon draw speed={1500} />       // slower\n<SearchIcon weight={2.5} />            // heavier stroke`}</pre>
      </section>
    </div>
  );
}
