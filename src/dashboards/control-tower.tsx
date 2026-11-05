'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// A logistics control tower: the map is the screen, and the shipment list, detail and totals float over it.
const THEME = { '--primary': 'oklch(0.7 0.14 70)', '--primary-foreground': '#1b1204', '--ring': 'oklch(0.7 0.14 70)' } as React.CSSProperties;

const CITIES: Record<string, [number, number]> = {
  Mumbai: [250, 330], Delhi: [330, 150], Chennai: [390, 470], Kolkata: [560, 260], Bengaluru: [330, 440], Hyderabad: [380, 360], Ahmedabad: [215, 250], Pune: [270, 360],
};
type Ship = { id: string; from: string; to: string; via?: string; carrier: string; cargo: string; eta: string; status: 'On time' | 'Delayed' | 'Held'; t: number; speed: number };
const SEED: Ship[] = [
  { id: 'SH-4821', from: 'Mumbai', to: 'Delhi', via: 'Ahmedabad', carrier: 'Northwind', cargo: 'Pharma, 12 pallets', eta: 'Today 18:40', status: 'On time', t: 0.42, speed: 0.004 },
  { id: 'SH-4822', from: 'Chennai', to: 'Kolkata', via: 'Hyderabad', carrier: 'Kestrel', cargo: 'Textiles, 30 rolls', eta: 'Tomorrow 06:10', status: 'Delayed', t: 0.3, speed: 0.0025 },
  { id: 'SH-4823', from: 'Bengaluru', to: 'Pune', carrier: 'Bluepeak', cargo: 'Electronics, 8 crates', eta: 'Today 21:15', status: 'On time', t: 0.6, speed: 0.005 },
  { id: 'SH-4824', from: 'Delhi', to: 'Kolkata', carrier: 'Ordo', cargo: 'Packaging, 40 bales', eta: 'Tomorrow 14:00', status: 'Held', t: 0.18, speed: 0 },
  { id: 'SH-4825', from: 'Pune', to: 'Chennai', via: 'Bengaluru', carrier: 'Lumen', cargo: 'Auto parts, 22 pallets', eta: 'Tomorrow 09:30', status: 'On time', t: 0.5, speed: 0.0035 },
];
const route = (s: Ship) => [s.from, ...(s.via ? [s.via] : []), s.to].map((c) => CITIES[c]!);
function at(points: [number, number][], t: number): [number, number] {
  const seg = points.length - 1;
  const k = Math.min(seg - 1, Math.floor(t * seg));
  const u = t * seg - k;
  const a = points[k]!;
  const b = points[k + 1]!;
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
}
const TONE = { 'On time': 'text-success', Delayed: 'text-warning', Held: 'text-destructive' } as const;
const DOT = { 'On time': 'bg-success', Delayed: 'bg-warning', Held: 'bg-destructive' } as const;

export default function ControlTower() {
  const [ships, setShips] = React.useState(SEED);
  const [sel, setSel] = React.useState('SH-4821');
  const [note, setNote] = React.useState('');
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setShips((ss) => ss.map((s) => (s.status === 'Held' ? s : { ...s, t: s.t + s.speed > 1 ? 0.02 : s.t + s.speed }))), 1000);
    return () => clearInterval(id);
  }, []);
  const s = ships.find((x) => x.id === sel)!;
  const counts = { 'On time': 0, Delayed: 0, Held: 0 } as Record<Ship['status'], number>;
  ships.forEach((x) => counts[x.status]++);
  const update = (patch: Partial<Ship>, msg: string) => { setShips((ss) => ss.map((x) => (x.id === sel ? { ...x, ...patch } : x))); setNote(msg); };

  return (
    <div className="relative h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-[oklch(0.2_0.02_250)] text-left text-white" style={THEME}>
      <svg viewBox="-150 -20 1000 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" role="img" aria-label="Map of India with shipment routes">
        <defs><pattern id="ct-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="white" strokeOpacity=".05" /></pattern></defs>
        <rect x="-150" y="-20" width="1000" height="600" fill="url(#ct-grid)" />
        <path d="M300 70 L380 90 L420 130 L520 170 L610 230 L590 290 L540 300 L480 330 L460 400 L420 470 L380 520 L340 500 L300 440 L250 400 L205 330 L180 270 L215 210 L250 150 Z" fill="white" fillOpacity=".06" stroke="white" strokeOpacity=".18" />
        {SEED.map((x) => <polyline key={x.id} points={route(x).map((p) => p.join(',')).join(' ')} fill="none" stroke="white" strokeOpacity={x.id === sel ? 0.95 : 0.22} strokeWidth={x.id === sel ? 2 : 1} strokeDasharray={x.id === sel ? undefined : '3 5'} strokeLinejoin="round" />)}
        {Object.entries(CITIES).map(([n, [cx, cy]]) => <g key={n}><circle cx={cx} cy={cy} r="3.5" fill="oklch(0.2 0.02 250)" stroke="white" strokeWidth="1.5" /><text x={cx + 8} y={cy + 4} fill="white" fillOpacity=".7" fontSize="10">{n}</text></g>)}
        {ships.map((x) => { const [px, py] = at(route(x), x.t); return <g key={x.id} transform={`translate(${px} ${py})`}>{x.id === sel && <circle r="12" className="fill-primary/25" />}<circle r="5" className={cn(x.status === 'On time' ? 'fill-success' : x.status === 'Delayed' ? 'fill-warning' : 'fill-destructive')} stroke="oklch(0.2 0.02 250)" strokeWidth="2" /></g>; })}
      </svg>

      <header className="absolute left-4 top-4 flex items-center gap-3 rounded-xl bg-black/55 px-4 py-2.5 backdrop-blur-sm">
        <span className="size-2 rounded-full bg-success motion-safe:animate-pulse" aria-hidden />
        <p className="text-sm font-semibold">Control tower</p>
        <p className="text-xs text-white/60">{ships.length} shipments live</p>
      </header>

      <dl className="absolute right-4 top-4 flex divide-x divide-white/15 rounded-xl bg-black/55 py-2 backdrop-blur-sm">
        {(Object.keys(counts) as Ship['status'][]).map((k) => <div key={k} className="px-4 text-center"><dd className={cn('font-display text-xl font-semibold tabular-nums', TONE[k])}>{counts[k]}</dd><dt className="text-[11px] text-white/60">{k}</dt></div>)}
      </dl>

      <section className="absolute bottom-4 left-4 top-20 flex w-72 max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl bg-black/60 backdrop-blur-sm max-md:top-auto max-md:h-56" aria-label="Shipments">
        <ul className="min-h-0 flex-1 divide-y divide-white/10 overflow-y-auto">
          {ships.map((x) => (
            <li key={x.id}>
              <button type="button" aria-current={x.id === sel} onClick={() => { setSel(x.id); setNote(''); }} className={cn('block w-full px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary', x.id === sel ? 'bg-white/12' : 'hover:bg-white/6')}>
                <span className="flex items-center justify-between text-xs"><b className="font-mono">{x.id}</b><span className="flex items-center gap-1.5"><span className={cn('size-1.5 rounded-full', DOT[x.status])} />{x.status}</span></span>
                <span className="mt-1 block text-[13px] font-medium">{x.from} to {x.to}</span>
                <span className="block text-xs text-white/55">{x.carrier}, ETA {x.eta}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="absolute bottom-4 right-4 w-80 max-w-[calc(100%-2rem)] rounded-2xl bg-black/65 p-4 backdrop-blur-sm max-md:hidden" aria-label={`Details for ${s.id}`}>
        <p className="font-mono text-xs text-white/60">{s.id}</p>
        <p className="mt-0.5 font-display text-xl font-semibold tracking-tight">{s.from} to {s.to}</p>
        <p className="mt-1 text-xs text-white/65">{s.cargo}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15" aria-label={`${Math.round(s.t * 100)} percent of the route`} role="img"><div className="h-full rounded-full bg-primary" style={{ width: `${s.t * 100}%` }} /></div>
        <ol className="mt-3 grid gap-1.5 text-xs">
          {route(s).map((_, k, a) => { const names = [s.from, ...(s.via ? [s.via] : []), s.to]; const passed = s.t >= k / (a.length - 1) - 0.001; return <li key={k} className="flex items-center gap-2"><span className={cn('size-2 rounded-full', passed ? 'bg-primary' : 'border border-white/40')} /><span className={passed ? '' : 'text-white/50'}>{names[k]}</span></li>; })}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={s.status === 'On time'} onClick={() => update({ status: 'On time', speed: 0.004 }, `${s.id} rerouted. ETA recalculated.`)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-35">Reroute</button>
          <button type="button" disabled={s.status === 'Held'} onClick={() => update({ status: 'Held', speed: 0 }, `${s.id} is on hold.`)} className="rounded-lg bg-white/12 px-3 py-1.5 text-xs font-medium outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white disabled:opacity-35">Hold</button>
          <button type="button" onClick={() => setNote(`Customer for ${s.id} notified of ETA ${s.eta}.`)} className="rounded-lg bg-white/12 px-3 py-1.5 text-xs font-medium outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white">Notify</button>
        </div>
        <p className="mt-2 min-h-4 text-xs text-white/70" aria-live="polite">{note}</p>
      </aside>
    </div>
  );
}
