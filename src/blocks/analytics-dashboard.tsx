'use client';

import * as React from 'react';
import { Segmented } from '@/components/ui/segmented';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.5 0.24 265)', '--primary-foreground': '#fff', '--ring': 'oklch(0.5 0.24 265)' } as React.CSSProperties;

type Range = '7d' | '30d' | '90d';
type Metric = 'views' | 'visitors' | 'clicks' | 'orders';
const LABELS: Record<Range, string[]> = {
  '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  '30d': ['Jan 1', '', '', 'Jan 10', '', '', 'Jan 20', '', '', '', '', 'Jan 30'],
  '90d': ['Nov', '', '', 'Dec', '', '', 'Jan', '', '', 'Feb', '', ''],
};
// A metric explorer: pick one measure on the left and the whole screen becomes that measure. Demo series, swap for your API.
const METRICS: { key: Metric; label: string; prev: Record<Range, number>; series: Record<Range, number[]> }[] = [
  { key: 'views', label: 'Page views', prev: { '7d': 3890, '30d': 6530, '90d': 17230 }, series: { '7d': [540, 610, 575, 640, 720, 560, 565], '30d': [410, 470, 520, 495, 560, 610, 580, 640, 690, 660, 720, 760], '90d': [1200, 1340, 1290, 1480, 1560, 1520, 1700, 1840, 1790, 2010, 2150, 2290] } },
  { key: 'visitors', label: 'Visitors', prev: { '7d': 1710, '30d': 2650, '90d': 6830 }, series: { '7d': [260, 290, 270, 310, 340, 250, 262], '30d': [170, 190, 205, 198, 220, 240, 232, 250, 268, 259, 281, 296], '90d': [480, 520, 505, 560, 600, 590, 640, 690, 670, 740, 790, 850] } },
  { key: 'clicks', label: 'Clicks', prev: { '7d': 640, '30d': 1157, '90d': 3300 }, series: { '7d': [110, 98, 120, 92, 104, 88, 94], '30d': [92, 101, 96, 104, 99, 93, 90, 97, 94, 88, 91, 85], '90d': [260, 270, 255, 280, 265, 262, 270, 258, 250, 244, 252, 240] } },
  { key: 'orders', label: 'Orders', prev: { '7d': 300, '30d': 1172, '90d': 3274 }, series: { '7d': [40, 52, 44, 58, 66, 30, 28], '30d': [88, 96, 92, 101, 108, 104, 112, 118, 115, 124, 128, 136], '90d': [260, 280, 270, 300, 310, 305, 330, 350, 340, 372, 390, 412] } },
];
const SOURCES = [['Search', 41], ['Direct', 27], ['Email', 14], ['Social', 11], ['Referral', 7]] as const;
const PAGES = [['/pricing', 3120, 11.2], ['/products/starter-kit', 2480, 8.4], ['/blog/rebrand-in-a-day', 1904, -3.1], ['/checkout', 1566, 5.7], ['/', 1490, 1.2]] as const;
const W = 720;
const H = 260;
const num = (n: number) => n.toLocaleString('en-US');

export default function AnalyticsDashboard() {
  const [range, setRange] = React.useState<Range>('30d');
  const [key, setKey] = React.useState<Metric>('views');
  const [at, setAt] = React.useState<number | null>(null);
  const m = METRICS.find((x) => x.key === key)!;
  const d = m.series[range];
  const n = d.length;
  const sum = d.reduce((a, b) => a + b, 0);
  const change = ((sum - m.prev[range]) / m.prev[range]) * 100;
  const i = at ?? n - 1;
  const lo = Math.min(...d) * 0.85;
  const hi = Math.max(...d) * 1.05;
  const x = (k: number) => (k / (n - 1)) * W;
  const y = (v: number) => 14 + (1 - (v - lo) / (hi - lo)) * (H - 44);
  const path = d.map((v, k) => (k ? `C${(x(k - 1) + x(k)) / 2} ${y(d[k - 1]!)}, ${(x(k - 1) + x(k)) / 2} ${y(v)}, ${x(k)} ${y(v)}` : `M${x(k)} ${y(v)}`)).join(' ');
  const here = LABELS[range][i] || `Point ${i + 1}`;
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-background text-left" style={THEME}>
      <div className="@container flex h-full flex-col">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
          <div className="flex items-baseline gap-3"><h1 className="font-display text-xl font-semibold tracking-tight">Shopeers</h1><p className="text-xs text-muted-foreground">Traffic and sales, all stores</p></div>
          <Segmented value={range} onValueChange={(v) => { setRange(v); setAt(null); }} options={[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }]} />
        </header>

        <div className="grid min-h-0 flex-1 @3xl:grid-cols-[17rem_minmax(0,1fr)]">
          <nav className="border-b @3xl:border-b-0 @3xl:border-r" aria-label="Metrics">
            <ul className="flex @3xl:block">
              {METRICS.map((x) => {
                const s = x.series[range];
                const tot = s.reduce((a, b) => a + b, 0);
                const dl = ((tot - x.prev[range]) / x.prev[range]) * 100;
                const mn = Math.min(...s);
                const mx = Math.max(...s);
                const mini = s.map((v, k) => `${k ? 'L' : 'M'}${(k / (s.length - 1)) * 60} ${18 - ((v - mn) / (mx - mn || 1)) * 16}`).join(' ');
                return (
                  <li key={x.key} className="min-w-0 flex-1 @3xl:flex-none">
                    <button type="button" aria-current={key === x.key} onClick={() => { setKey(x.key); setAt(null); }} className={cn('relative block w-full border-b px-6 py-5 text-left outline-none transition-colors focus-visible:bg-secondary', key === x.key ? 'bg-accent/50' : 'hover:bg-muted/50')}>
                      {key === x.key && <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />}
                      <span className="block text-xs text-muted-foreground">{x.label}</span>
                      <span className="mt-1 flex items-end justify-between gap-3"><span className="font-display text-3xl font-semibold tabular-nums leading-none">{num(tot)}</span><svg viewBox="0 0 60 20" className="hidden h-5 w-14 shrink-0 @3xl:block" aria-hidden><path d={mini} fill="none" className={dl >= 0 ? 'stroke-success' : 'stroke-destructive'} strokeWidth="1.5" /></svg></span>
                      <span className={cn('mt-1.5 block text-xs font-medium tabular-nums', dl >= 0 ? 'text-success' : 'text-destructive')}>{dl >= 0 ? '+' : ''}{dl.toFixed(1)}% on the period before</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <main className="min-h-0 overflow-y-auto px-6 py-6">
            <p className="text-xs text-muted-foreground">{m.label}, last {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-4"><span className="font-display text-6xl font-semibold tabular-nums leading-none tracking-tight">{num(sum)}</span><span className={cn('text-sm font-semibold tabular-nums', change >= 0 ? 'text-success' : 'text-destructive')}>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span></p>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-auto w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring/40" role="img" tabIndex={0} aria-label={`${m.label}. ${here}: ${num(d[i]!)}. Arrow keys move along the line.`}
              onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setAt(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1))))); }} onPointerLeave={() => setAt(null)}
              onKeyDown={(e) => { if (e.key === 'ArrowRight') setAt(Math.min(n - 1, i + 1)); if (e.key === 'ArrowLeft') setAt(Math.max(0, i - 1)); if (e.key === 'Escape') setAt(null); }} onBlur={() => setAt(null)}>
              <defs><linearGradient id="ax" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity=".2" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
              {[0, 1, 2, 3].map((g) => <line key={g} x1="0" x2={W} y1={14 + (g * (H - 44)) / 3} y2={14 + (g * (H - 44)) / 3} className="stroke-border" strokeDasharray="3 5" />)}
              <path d={`${path} L${W} ${H - 30} L0 ${H - 30} Z`} fill="url(#ax)" />
              <path d={path} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" />
              <line x1={x(i)} x2={x(i)} y1="8" y2={H - 30} className="stroke-primary/40" strokeDasharray="3 3" />
              <circle cx={x(i)} cy={y(d[i]!)} r="5" className="fill-card stroke-primary" strokeWidth="2.5" />
              {LABELS[range].map((l, k) => l && <text key={k} x={x(k)} y={H - 8} textAnchor={k === 0 ? 'start' : k === n - 1 ? 'end' : 'middle'} className="fill-muted-foreground text-[11px]">{l}</text>)}
            </svg>
            <p className="mt-1 text-[13px] tabular-nums"><b>{here}</b> <span className="text-primary">{num(d[i]!)}</span></p>

            <div className="mt-10 grid gap-x-12 gap-y-8 @2xl:grid-cols-2">
              <section aria-labelledby="ax-src"><h2 id="ax-src" className="text-sm font-semibold">Where it comes from</h2>
                <ul className="mt-3 divide-y border-y">{SOURCES.map(([s, p]) => <li key={s} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3 py-2.5 text-[13px]"><span>{s}</span><span className="h-1.5 rounded-full bg-secondary" aria-hidden><span className="block h-full rounded-full bg-primary" style={{ width: `${p * 2.2}%` }} /></span><span className="text-right tabular-nums text-muted-foreground">{p}%</span></li>)}</ul>
              </section>
              <section aria-labelledby="ax-pg"><h2 id="ax-pg" className="text-sm font-semibold">Top pages</h2>
                <ul className="mt-3 divide-y border-y">{PAGES.map(([p, v, c]) => <li key={p} className="flex items-center justify-between gap-3 py-2.5 text-[13px]"><span className="truncate font-mono text-xs">{p}</span><span className="flex shrink-0 gap-4 tabular-nums"><span>{num(v)}</span><span className={cn('w-12 text-right text-xs', c >= 0 ? 'text-success' : 'text-destructive')}>{c >= 0 ? '+' : ''}{c}%</span></span></li>)}</ul>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
