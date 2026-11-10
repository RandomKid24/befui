import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/charts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import avatarSrc from '@/components/ui/avatar.tsx?raw';
import badgeSrc from '@/components/ui/badge.tsx?raw';
import buttonSrc from '@/components/ui/button.tsx?raw';
import chartsSrc from '@/components/ui/charts.tsx?raw';
import cssSrc from '@/index.css?raw';

type Status = 'open' | 'approved' | 'declined';
const REQUESTS = [
  { id: 'diya', name: 'Diya Rao', what: 'Casual leave', when: '27 to 29 Oct', days: 3 },
  { id: 'rohan', name: 'Rohan Das', what: 'Sick leave', when: '30 Oct', days: 1 },
  { id: 'isha', name: 'Isha Nair', what: 'Earned leave', when: '3 to 14 Nov', days: 8 },
];
const MONTHS = [
  { label: 'May', value: 38 }, { label: 'Jun', value: 52 }, { label: 'Jul', value: 47 },
  { label: 'Aug', value: 66 }, { label: 'Sep', value: 58 }, { label: 'Oct', value: 71 },
];

type PartId = 'tokens' | 'avatar' | 'badge' | 'button' | 'charts';
const lines = (s: string) => s.trimEnd().split('\n').length;
// line counts are read from the files themselves; dx and dy are how far each part slides off the plate, each along its own axis
const PARTS: { id: PartId; file: string; lines: number; draws: string; dx: number; dy: number }[] = [
  { id: 'badge', file: 'ui/badge.tsx', lines: lines(badgeSrc), draws: 'the waiting count', dx: 0, dy: -92 },
  { id: 'button', file: 'ui/button.tsx', lines: lines(buttonSrc), draws: 'Approve, Decline, Undo', dx: 184, dy: 0 },
  { id: 'avatar', file: 'ui/avatar.tsx', lines: lines(avatarSrc), draws: 'the three faces', dx: -72, dy: 0 },
  { id: 'tokens', file: 'index.css', lines: lines(cssSrc), draws: 'colour, corners, spacing', dx: 0, dy: 0 },
  { id: 'charts', file: 'ui/charts.tsx', lines: lines(chartsSrc), draws: 'leave days per month', dx: 0, dy: 176 },
];
const BY = Object.fromEntries(PARTS.map((p, i) => [p.id, { ...p, i }])) as Record<PartId, (typeof PARTS)[number] & { i: number }>;

const Hot = React.createContext<PartId | null>(null);

/** One library part inside the screen. It slides out along one axis and leaves a dashed footprint and a centre line behind. */
function Part({ id, children, className = '' }: { id: PartId; children: React.ReactNode; className?: string }) {
  const hot = React.useContext(Hot);
  const { dx, dy, i } = BY[id];
  const vars = { '--dx': `${dx}px`, '--dy': `${dy}px`, '--i': i } as React.CSSProperties;
  return (
    <span className={`xp-slot ${className}`} data-axis={dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down'} style={vars}>
      <span data-part={id} data-hot={hot === id || undefined} data-dim={(hot !== null && hot !== id) || undefined} style={vars}>
        {children}
      </span>
    </span>
  );
}

/**
 * The first screen's drawing: a working approvals screen pulled apart into the files that draw it. Point at a file
 * and its part rises; switch to "Assembled" and it is an ordinary screen again, buttons and all.
 */
export function Exploded() {
  const still = React.useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver, []);
  const [open, setOpen] = React.useState(still);
  const [hot, setHot] = React.useState<PartId | null>(null);
  const wrap = React.useRef<HTMLDivElement>(null);
  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => { if (!still) { const t = setTimeout(() => setOpen(true), 650); return () => clearTimeout(t); } }, [still]);

  // Leader lines from each file to its part. Redrawn while anything moves (open, hover, pointer tilt), and on resize.
  const kickRef = React.useRef(() => {});
  React.useEffect(() => {
    const root = wrap.current, s = svg.current;
    if (!root || !s) return;
    let raf = 0, until = 0;
    const draw = () => {
      const o = root.getBoundingClientRect();
      for (const p of PARTS) {
        const row = root.querySelector<HTMLElement>(`[data-row="${p.id}"]`)?.getBoundingClientRect();
        const el = root.querySelector<HTMLElement>(`[data-part="${p.id}"]`)?.getBoundingClientRect();
        const g = s.querySelector<SVGGElement>(`[data-line="${p.id}"]`);
        if (!row || !el || !g) continue;
        const x1 = row.right - o.left + 6, y1 = row.top + row.height / 2 - o.top;
        const x2 = p.id === 'tokens' ? el.left + el.width * 0.42 - o.left : el.left - o.left - 4, y2 = p.id === 'tokens' ? el.bottom - el.height * 0.3 - o.top : el.top + el.height / 2 - o.top;
        g.querySelector('path')!.setAttribute('d', `M${x1} ${y1} H${x1 + 28} L${x2} ${y2}`);
        g.querySelector('circle')!.setAttribute('cx', `${x2}`);
        g.querySelector('circle')!.setAttribute('cy', `${y2}`);
      }
      if (performance.now() < until) raf = requestAnimationFrame(draw);
    };
    const kick = () => { until = performance.now() + 2200; cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
    kickRef.current = kick;
    kick();
    window.addEventListener('resize', kick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', kick); };
  }, [open, hot]);

  return (
    <div ref={wrap} className="relative grid gap-x-10 gap-y-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-center">
      <div className="relative z-10">
        <ToggleGroup type="single" size="sm" aria-label="View of the screen" value={open ? 'apart' : 'whole'} onValueChange={(v) => v && setOpen(v === 'apart')} className="gap-0.5">
          <ToggleGroupItem value="apart">Taken apart</ToggleGroupItem>
          <ToggleGroupItem value="whole">Assembled</ToggleGroupItem>
        </ToggleGroup>
        <ul className="mt-5 border-t" onPointerLeave={() => setHot(null)}>
          {PARTS.map((p, i) => (
            <li key={p.id} className="border-b">
              <button
                type="button" data-row={p.id} aria-pressed={hot === p.id}
                onPointerEnter={() => setHot(p.id)} onFocus={() => setHot(p.id)} onBlur={() => setHot(null)} onClick={() => { setOpen(true); setHot(p.id); }}
                className="grid w-full grid-cols-[1.5rem_1fr_auto] items-baseline gap-x-2 py-2.5 text-left outline-none transition-colors hover:bg-primary-soft focus-visible:bg-primary-soft aria-pressed:bg-primary-soft"
              >
                <span className="ps-1 font-mono text-[11px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-[13px] font-medium">{p.file}</span>
                <span className="pe-1 font-mono text-[11px] tabular-nums text-muted-foreground">{p.lines} lines</span>
                <span className="col-start-2 col-end-4 text-[13px] text-muted-foreground">{p.draws}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-muted-foreground">Five files draw this whole screen. Point at one to pick out its part.</p>
      </div>

      <svg ref={svg} aria-hidden className={`pointer-events-none absolute inset-0 hidden size-full transition-opacity lg:block ${open ? 'opacity-100 delay-[1500ms] duration-500' : 'opacity-0 duration-150'}`}>
        {PARTS.map((p) => (
          <g key={p.id} data-line={p.id} className={hot === p.id ? 'text-primary' : hot ? 'text-transparent' : 'text-foreground/30'}>
            <path fill="none" stroke="currentColor" strokeWidth={hot === p.id ? 1.5 : 1} />
            <circle r="3" fill="currentColor" />
          </g>
        ))}
      </svg>

      <div
        className="xp-stage grid min-h-[25rem] place-items-center max-lg:order-first sm:min-h-[36rem]"
        onPointerMove={(e) => {
          // the drawing leans a few degrees toward a mouse pointer, so it reads as an object and not a picture
          if (still || !open || e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
          e.currentTarget.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
          kickRef.current();
        }}
        onPointerLeave={(e) => { e.currentTarget.style.removeProperty('--px'); e.currentTarget.style.removeProperty('--py'); kickRef.current(); }}
      >
        <div className="xp-tilt grid w-full place-items-center"><Hot.Provider value={hot}><Screen open={open} /></Hot.Provider></div>
      </div>
    </div>
  );
}

function Screen({ open }: { open: boolean }) {
  const hot = React.useContext(Hot);
  const [status, setStatus] = React.useState<Record<string, Status>>({});
  const waiting = REQUESTS.filter((r) => !status[r.id] || status[r.id] === 'open').length;
  const set = (id: string, s: Status) => setStatus((x) => ({ ...x, [id]: s }));
  return (
    <figure className="xp-screen w-full max-w-[30rem]" data-open={open || undefined}>
      <div data-part="tokens" data-hot={hot === 'tokens' || undefined} className="rounded-xl border bg-card px-5 pb-5 pt-4 shadow-xl shadow-black/[0.07] dark:shadow-black/40">
        <header className="flex items-end justify-between gap-6 border-b pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Approvals</h2>
            <p className="mt-1.5" aria-live="polite">
              <Part id="badge"><Badge variant={waiting ? 'warning' : 'success'} dot>{waiting ? `${waiting} waiting for you` : 'All caught up'}</Badge></Part>
            </p>
          </div>
          <p className="text-right">
            <span className="font-display text-4xl font-semibold tabular-nums leading-none">142</span>
            <span className="mt-1 block text-xs text-muted-foreground">people, 6 away today (demo data)</span>
          </p>
        </header>
        <ul className="divide-y">
          {REQUESTS.map((r) => {
            const s = status[r.id] ?? 'open';
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <Part id="avatar" className="rounded-full"><Avatar name={r.name} size="sm" /></Part>
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-sm font-medium">{r.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{r.what}, {r.when}, {r.days} {r.days === 1 ? 'day' : 'days'}</span>
                </div>
                <Part id="button">
                  {s === 'open' ? (
                    <span className="flex gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => set(r.id, 'declined')} aria-label={`Decline ${r.name}`}>Decline</Button>
                      <Button size="sm" onClick={() => set(r.id, 'approved')} aria-label={`Approve ${r.name}`}>Approve</Button>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-[13px]">
                      <span className={s === 'approved' ? 'font-medium text-success' : 'font-medium text-destructive'}>{s === 'approved' ? 'Approved' : 'Declined'}</span>
                      <Button size="sm" variant="outline" onClick={() => set(r.id, 'open')} aria-label={`Undo for ${r.name}`}>Undo</Button>
                    </span>
                  )}
                </Part>
              </li>
            );
          })}
        </ul>
        <section className="mt-4 border-t pt-4" aria-labelledby="leave-months">
          <h3 id="leave-months" className="mb-3 text-[13px] font-medium">Leave days per month</h3>
          <Part id="charts" className="!block"><BarChart height={120} data={MONTHS} /></Part>
        </section>
      </div>
    </figure>
  );
}
