import * as React from 'react';
import { components, type Category } from '@/registry';
import { flutterSlugs, hasFlutter } from './platform-lists';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from './router';

const SHELF: Record<Category, string[]> = {
  Inputs: ['date-picker', 'otp-input', 'range-slider', 'tag-input', 'segmented', 'rating'],
  Data: ['stat-card', 'gauge', 'radar-chart', 'kpi-strip', 'leaderboard', 'uptime-bar'],
  Display: ['pricing-card', 'timeline', 'activity-feed', 'credit-card', 'profile-card', 'empty-state'],
  Navigation: ['tabs', 'stepper', 'breadcrumb', 'pagination', 'order-tracker', 'menubar'],
  AI: ['prompt-input', 'thinking', 'tool-call', 'model-picker', 'token-meter', 'prompt-suggestions'],
  Feedback: ['alert', 'banner', 'nps-survey', 'skeleton', 'loader', 'error-state'],
  Overlays: ['popover', 'hover-card', 'tooltip', 'popconfirm', 'dropdown-menu', 'coachmark'],
  Time: ['analog-clock', 'world-clock', 'week-strip', 'stopwatch', 'timer', 'relative-time'],
  Layout: ['split-pane', 'resizable-panels', 'sidebar', 'settings-layout'],
};
const ORDER: Category[] = ['Inputs', 'Data', 'Display', 'Navigation', 'AI', 'Feedback', 'Overlays', 'Time', 'Layout'];

/** Mounts its children when it nears the viewport so a family's demos load as it is opened, not all at once. */
function WhenNear({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  return (
    <div ref={ref} className="min-h-24">
      {near ? <React.Suspense fallback={<Skeleton className="h-24 w-full max-w-sm" aria-label={`Loading ${label}`} />}>{children}</React.Suspense> : null}
    </div>
  );
}

/**
 * The library as a shelf: the nine families run down the left as type with their real counts, and the chosen family
 * lays out live components on the right, set like a specimen sheet with a rule and a name over each one.
 */
export function Shelf() {
  const [cat, setCat] = React.useState<Category>('Inputs');
  const picks = SHELF[cat].map((s) => components.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => !!c);
  const count = components.filter((c) => c.category === cat).length;
  return (
    <section className="mx-auto max-w-[88rem] border-t px-4 py-20 sm:px-6" aria-labelledby="shelf">
      <h2 id="shelf" className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
        {components.length} components, running
      </h2>
      <p className="font-display mt-3 max-w-xl text-pretty text-lg text-muted-foreground">
        These are the real components, not screenshots. Pick a family and use them. {flutterSlugs.length} of them also exist as Flutter widgets.
      </p>
      <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <ul className="grid max-lg:grid-flow-col max-lg:overflow-x-auto max-lg:border-b lg:content-start lg:border-t" aria-label="Component families">
          {ORDER.map((c) => {
            const n = components.filter((x) => x.category === c).length;
            return (
              <li key={c} className="max-lg:shrink-0">
                <button
                  type="button"
                  aria-pressed={c === cat}
                  onClick={() => setCat(c)}
                  className="relative flex w-full items-baseline justify-between gap-4 whitespace-nowrap px-1 py-2.5 text-start text-sm text-muted-foreground outline-none transition-[color,padding] duration-(--dur-fast) before:absolute before:start-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:bg-primary before:opacity-0 before:transition-opacity hover:text-foreground focus-visible:bg-muted aria-pressed:font-semibold aria-pressed:text-foreground aria-pressed:before:opacity-100 max-lg:px-3 max-lg:before:hidden lg:border-b lg:aria-pressed:ps-3"
                >
                  <span>{c}</span>
                  <span className="text-xs font-normal tabular-nums text-muted-foreground">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b pb-3">
            <p className="text-[13px] text-muted-foreground">
              <span className="font-medium text-foreground">{cat}.</span> {picks.length} of {count} shown, {components.filter((c) => c.category === cat && hasFlutter(c.slug)).length} with a Flutter widget.
            </p>
            <Link to="/components" className="text-[13px] font-medium underline underline-offset-4">All {components.length} components</Link>
          </div>
          <div key={cat} className="gap-x-12 pt-2 md:columns-2" data-stage>
            {picks.map((p) => (
              <figure key={p.slug} className="mb-8 break-inside-avoid border-t pt-3">
                <figcaption className="mb-4 flex items-baseline justify-between gap-4">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <Link to={`/components/${p.slug}`} className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{p.slug}</Link>
                </figcaption>
                <div className="lg:max-h-[22rem] lg:overflow-auto">
                  <WhenNear label={p.name}><p.Demo /></WhenNear>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
