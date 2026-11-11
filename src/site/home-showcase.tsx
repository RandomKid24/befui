import * as React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { Skeleton } from '@/components/ui/skeleton';
import { components } from '@/registry';
import { cn } from '@/lib/utils';
import { Link } from './router';

const CMD = 'npx github:RandomKid24/befui add ';
const TOUR = ['date-picker', 'area-chart', 'otp-input', 'stat-card', 'tag-input', 'gauge', 'stepper', 'prompt-input'];
const STEP = 5200; // ms each component stays on stage before the next one runs
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/**
 * The hero's working part. A strip of real components runs one after another on a stage; click one, or search all of
 * them, and that one runs instead. Beside it the install command always names whatever is on stage.
 */
export function Showcase({ intro }: { intro: React.ReactNode }) {
  const still = React.useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver, []);
  const [slug, setSlug] = React.useState(TOUR[0]!);
  const [auto, setAuto] = React.useState(!still);
  const [held, setHeld] = React.useState(false);
  const shown = React.useDeferredValue(slug); // the one on stage stays (dimmed) until the next one's code has arrived
  const entry = components.find((c) => c.slug === shown)!;
  const id = React.useId();

  const pick = (s: string) => { setAuto(false); React.startTransition(() => setSlug(s)); };

  React.useEffect(() => {
    if (!auto || held) return;
    const t = setTimeout(() => React.startTransition(() => setSlug((s) => TOUR[(TOUR.indexOf(s) + 1) % TOUR.length]!)), STEP);
    return () => clearTimeout(t);
  }, [auto, held, slug]);

  const [lines, setLines] = React.useState<Record<string, number>>({});
  React.useEffect(() => {
    let live = true;
    if (lines[shown] === undefined) entry.loadSource().then((t) => live && setLines((x) => ({ ...x, [shown]: t.trimEnd().split('\n').length }))).catch(() => {});
    return () => { live = false; };
  }, [shown]); // eslint-disable-line react-hooks/exhaustive-deps

  const cmd = CMD + slug;
  return (
    <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-center">
      <div className="min-w-0">
        {intro}
        <div className="mt-8">
          <p className="mb-2 font-mono text-[11px] text-muted-foreground">One command copies the one on stage</p>
          <div className="flex items-center gap-2 rounded-md border-2 border-foreground bg-background py-1.5 pe-1.5 ps-3.5 shadow-[4px_4px_0_0_var(--primary)]">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px]"><span className="text-primary">$</span> {CMD}<span key={slug} className="try-in inline-block font-semibold">{slug}</span></code>
            <CopyButton value={cmd} className="size-8 shrink-0" />
          </div>
        </div>
      </div>

      <div className="min-w-0" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
        <div className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/[0.05] dark:shadow-black/40">
          <div className="flex items-stretch border-b bg-muted/40">
            <div role="tablist" aria-label="Components to try" className="flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TOUR.map((s) => (
                <button
                  key={s} role="tab" type="button" aria-selected={s === slug} onClick={() => pick(s)}
                  className={cn('relative shrink-0 px-3.5 py-2.5 font-mono text-[12px] outline-none transition-colors duration-(--dur-fast) focus-visible:bg-secondary', s === slug ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  {s}
                  {s === slug && (
                    <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-primary/20">
                      <span className={cn('block h-full origin-left bg-primary', auto && !held && 'show-bar')} style={{ animationDuration: `${STEP}ms` }} />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <label className="flex shrink-0 items-center border-s px-3 font-mono text-[12px] text-muted-foreground max-sm:hidden">
              <span className="sr-only">Search all {components.length} components</span>
              <input
                list={`${id}-all`} placeholder={`or any of ${components.length}`} spellCheck={false} autoComplete="off"
                onChange={(e) => { const v = e.target.value.trim().toLowerCase(); const hit = components.find((c) => c.slug === v || c.name.toLowerCase() === v); if (hit) { pick(hit.slug); e.target.value = ''; } }}
                className="w-32 bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground"
              />
              <datalist id={`${id}-all`}>{components.map((c) => <option key={c.slug} value={c.slug} label={c.name} />)}</datalist>
            </label>
          </div>
          <div className={cn('grid max-h-[26rem] min-h-[20rem] place-items-center overflow-auto p-5 sm:p-8', shown === slug ? 'transition-opacity duration-(--dur-base)' : 'opacity-50 transition-opacity delay-150 duration-(--dur-base)')} aria-busy={shown !== slug}>
            <React.Suspense fallback={<Skeleton className="h-40 w-full max-w-md" aria-label={`Loading ${entry.name}`} />}>
              <div key={entry.slug} className="try-in w-full max-w-xl"><entry.Demo /></div>
            </React.Suspense>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t bg-muted/40 px-4 py-3 text-[13px]">
            <p className="min-w-0" aria-live="polite"><span className="font-semibold">{entry.name}</span> <span className="text-muted-foreground">· ui/{entry.slug}.tsx · {lines[shown] ?? '...'} lines · adds {entry.requires.length ? list(entry.requires) : 'nothing else'}</span></p>
            <Link to={`/components/${entry.slug}`} className="font-medium underline underline-offset-4">Open the page</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
