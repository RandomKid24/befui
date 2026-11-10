import * as React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { Skeleton } from '@/components/ui/skeleton';
import { components } from '@/registry';
import { Link } from './router';

const CMD = 'npx github:RandomKid24/befui add ';
// what the bar plays through until the visitor takes over
const TOUR = ['date-picker', 'area-chart', 'otp-input', 'stat-card', 'tag-input', 'gauge', 'stepper', 'prompt-input'];
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** Components whose name or slug matches what was typed: prefix matches first, then anything containing it. */
function search(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const hit = (c: (typeof components)[number]) => [c.slug, c.name.toLowerCase()];
  const starts = components.filter((c) => hit(c).some((x) => x.startsWith(s)));
  const has = components.filter((c) => !starts.includes(c) && (hit(c).some((x) => x.includes(s)) || c.keywords.some((k) => k.toLowerCase().includes(s))));
  return [...starts, ...has].slice(0, 7);
}

/**
 * The first screen's working part: the install command with the component name left open. Type a name and that
 * component, any of them, runs underneath with what installing it would add. Until someone types, it plays a short tour.
 */
export function TryIt() {
  const still = React.useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver, []);
  const [slug, setSlug] = React.useState(TOUR[0]!);
  const [text, setText] = React.useState(TOUR[0]!);
  const [auto, setAuto] = React.useState(!still);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const id = React.useId();
  // the component on show stays (dimmed) until the next one's code has arrived
  const shown = React.useDeferredValue(slug);
  const entry = components.find((c) => c.slug === shown)!;
  const matches = open ? search(text) : [];

  React.useEffect(() => {
    if (!auto) return;
    let dead = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      for (let i = 1; !dead; i = (i + 1) % TOUR.length) {
        await wait(3400);
        const next = TOUR[i]!;
        for (let n = 0; n <= next.length && !dead; n++) { setText(next.slice(0, n)); await wait(n ? 55 : 220); }
        if (dead) return;
        React.startTransition(() => setSlug(next));
      }
    })();
    return () => { dead = true; };
  }, [auto]);

  const pick = (s: string) => { setAuto(false); setText(s); setOpen(false); React.startTransition(() => setSlug(s)); };

  const [lines, setLines] = React.useState<Record<string, number>>({});
  React.useEffect(() => {
    let live = true;
    if (lines[shown] === undefined) entry.loadSource().then((t) => live && setLines((x) => ({ ...x, [shown]: t.trimEnd().split('\n').length }))).catch(() => {});
    return () => { live = false; };
  }, [shown]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div onPointerDown={() => setAuto(false)}>
      <div className="relative z-20">
        <div className="flex items-center gap-3 rounded-lg border-2 border-foreground bg-background py-2 pe-2 ps-4 shadow-[6px_6px_0_0_var(--primary)] sm:ps-6">
          <label htmlFor={id} className="flex min-w-0 flex-1 items-baseline gap-[1ch] font-mono text-[15px] sm:text-xl">
            <span className="text-primary" aria-hidden>$</span>
            <span className="shrink-0 text-muted-foreground max-md:hidden">{CMD.trim()}</span>
            <span className="shrink-0 text-muted-foreground md:hidden">add</span>
            <span className="sr-only">Component to try</span>
            <input
              id={id} value={text} spellCheck={false} autoComplete="off" autoCapitalize="off"
              role="combobox" aria-expanded={matches.length > 0} aria-controls={`${id}-list`} aria-autocomplete="list"
              aria-activedescendant={matches[active] ? `${id}-${matches[active].slug}` : undefined}
              placeholder="type a component"
              onFocus={(e) => { setAuto(false); e.currentTarget.select(); }}
              onChange={(e) => { setAuto(false); setText(e.target.value); setOpen(true); setActive(0); }}
              onBlur={() => setOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, Math.max(matches.length - 1, 0))); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                else if (e.key === 'Enter' && matches[active]) { e.preventDefault(); pick(matches[active].slug); }
                else if (e.key === 'Escape') setOpen(false);
              }}
              className="min-w-0 flex-1 bg-transparent py-2 font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
          </label>
          <CopyButton value={CMD + slug} className="size-9 shrink-0" />
        </div>
        <ul id={`${id}-list`} role="listbox" aria-label="Matching components" className={matches.length ? 'absolute inset-x-0 top-full mt-3 rounded-lg border bg-popover py-1.5 shadow-lg' : 'hidden'}>
          {matches.map((c, i) => (
            <li
              key={c.slug} id={`${id}-${c.slug}`} role="option" aria-selected={i === active}
              onPointerDown={(e) => { e.preventDefault(); pick(c.slug); }} onPointerEnter={() => setActive(i)}
              className="flex cursor-pointer items-baseline gap-4 px-4 py-2 aria-selected:bg-primary-soft sm:px-6"
            >
              <span className="font-mono text-sm font-medium">{c.slug}</span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">{c.description}</span>
              <span className="font-mono text-[11px] text-muted-foreground max-sm:hidden">{c.category}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid gap-x-12 gap-y-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="min-w-0 lg:pt-1">
          <p className="font-mono text-[11px] text-muted-foreground">running now</p>
          <h2 className="font-display mt-1 text-2xl font-semibold tracking-tight" aria-live="polite">{entry.name}</h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
          <dl className="mt-5 border-t font-mono text-[12px]">
            {([
              ['file', `ui/${entry.slug}.tsx`],
              ['lines', lines[shown] ?? '...'],
              ['also adds', entry.requires.length ? list(entry.requires) : 'nothing else'],
              ['npm', entry.deps.length ? list(entry.deps) : 'no extra packages'],
            ] as const).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 border-b py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="min-w-0 break-words tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <Link to={`/components/${entry.slug}`} className="mt-4 inline-block text-[13px] font-medium underline underline-offset-4">Props, variants and source</Link>
        </div>
        <div className={`min-w-0 rounded-xl border bg-card shadow-xl max-lg:order-first shadow-black/[0.05] dark:shadow-black/40 ${shown === slug ? 'transition-opacity duration-200' : 'opacity-50 transition-opacity delay-150 duration-200'}`} aria-busy={shown !== slug}>
          <div className="grid max-h-[30rem] min-h-[22rem] place-items-center overflow-auto p-5 sm:p-10">
            <React.Suspense fallback={<Skeleton className="h-40 w-full max-w-md" aria-label={`Loading ${entry.name}`} />}>
              <div key={entry.slug} className="try-in w-full max-w-2xl"><entry.Demo /></div>
            </React.Suspense>
          </div>
        </div>
      </div>

      <p className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[13px]">
        <span className="text-muted-foreground">or try</span>
        {TOUR.map((s) => (
          <button key={s} type="button" aria-pressed={s === slug} onClick={() => pick(s)} className="text-muted-foreground underline decoration-border underline-offset-4 outline-none hover:text-foreground hover:decoration-foreground focus-visible:text-foreground focus-visible:decoration-primary aria-pressed:text-foreground aria-pressed:decoration-primary aria-pressed:decoration-2">
            {s}
          </button>
        ))}
      </p>
    </div>
  );
}
