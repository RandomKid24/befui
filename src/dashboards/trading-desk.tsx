'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// A trading terminal: hairline panes on one grid, monospace figures, square corners, a tape across the top and no sidebar.
const THEME = { '--primary': 'oklch(0.72 0.17 150)', '--primary-foreground': '#04130a', '--ring': 'oklch(0.72 0.17 150)', '--radius': '2px' } as React.CSSProperties;

const SYMBOLS = [
  { s: 'NVRA', n: 'Nevora Systems', base: 214.3, seed: 7 },
  { s: 'KSTL', n: 'Kestrel Labs', base: 88.15, seed: 19 },
  { s: 'HRBR', n: 'Harbor Freight Co', base: 41.72, seed: 31 },
  { s: 'ORDO', n: 'Ordo Finance', base: 132.9, seed: 43 },
  { s: 'LUMN', n: 'Lumen Grid', base: 17.46, seed: 5 },
  { s: 'BLPK', n: 'Bluepeak Retail', base: 63.08, seed: 61 },
];
const FRAMES = { '1D': 48, '1W': 70, '1M': 90 } as const;
type Frame = keyof typeof FRAMES;
type Candle = { o: number; h: number; l: number; c: number };

// Same symbol and frame always give the same candles, so the screen is stable between renders.
function candles(base: number, seed: number, n: number): Candle[] {
  let r = seed * 9301 + 49297;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  let p = base * 0.94;
  return Array.from({ length: n }, () => {
    const o = p;
    const c = o + (rnd() - 0.46) * base * 0.018;
    const h = Math.max(o, c) + rnd() * base * 0.006;
    const l = Math.min(o, c) - rnd() * base * 0.006;
    p = c;
    return { o, h, l, c };
  });
}
const POS = [
  { s: 'NVRA', q: 120, avg: 198.4 },
  { s: 'KSTL', q: 300, avg: 91.2 },
  { s: 'ORDO', q: 80, avg: 121.55 },
];
const W = 760;
const H = 300;
const f2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TradingDesk() {
  const [sym, setSym] = React.useState(0);
  const [frame, setFrame] = React.useState<Frame>('1W');
  const [hover, setHover] = React.useState<number | null>(null);
  const [qty, setQty] = React.useState('50');
  const [side, setSide] = React.useState<'Buy' | 'Sell'>('Buy');
  const [log, setLog] = React.useState<string[]>([]);
  const cur = SYMBOLS[sym]!;
  const data = React.useMemo(() => candles(cur.base, cur.seed, FRAMES[frame]), [cur, frame]);
  const lo = Math.min(...data.map((d) => d.l));
  const hi = Math.max(...data.map((d) => d.h));
  const x = (i: number) => 8 + (i + 0.5) * ((W - 70) / data.length);
  const y = (v: number) => 10 + (1 - (v - lo) / (hi - lo)) * (H - 36);
  const i = hover ?? data.length - 1;
  const last = data[data.length - 1]!.c;
  const first = data[0]!.o;
  const chg = ((last - first) / first) * 100;
  const book = Array.from({ length: 7 }, (_, k) => ({ ask: last + (k + 1) * last * 0.0007, bid: last - (k + 1) * last * 0.0007, sz: 40 + ((k * 37 + cur.seed) % 160) }));
  const maxSz = Math.max(...book.map((b) => b.sz));
  const pnl = POS.reduce((a, p) => a + (candles(SYMBOLS.find((s) => s.s === p.s)!.base, SYMBOLS.find((s) => s.s === p.s)!.seed, 70).at(-1)!.c - p.avg) * p.q, 0);
  const order = () => Number(qty) > 0 && setLog((l) => [`${new Date(0).toISOString().slice(11, 19)}  ${side.toUpperCase()} ${qty} ${cur.s} @ ${f2(last)}  QUEUED`, ...l].slice(0, 5));

  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden border bg-background font-mono text-[11px] text-foreground" style={THEME}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-4 overflow-hidden border-b bg-muted/60 px-3 py-1.5" aria-label="Market tape">
          <span className="shrink-0 font-bold text-primary">MKT OPEN</span>
          <div className="min-w-0 flex-1 overflow-hidden"><div className="flex w-max gap-6 whitespace-nowrap motion-safe:animate-[tape_40s_linear_infinite]">
            <style>{`@keyframes tape{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
            {[...SYMBOLS, ...SYMBOLS].map((t, k) => { const c = candles(t.base, t.seed, 70); const l = c.at(-1)!.c; const d = ((l - c[0]!.o) / c[0]!.o) * 100; return <span key={k} className="flex gap-1.5"><b>{t.s}</b><span className="tabular-nums">{f2(l)}</span><span className={cn('tabular-nums', d >= 0 ? 'text-success' : 'text-destructive')}>{d >= 0 ? '+' : ''}{d.toFixed(2)}%</span></span>; })}
          </div></div>
        </div>

        <div className="grid min-h-0 flex-1 gap-px bg-border @container [grid-template-columns:minmax(0,12rem)_minmax(0,1fr)_minmax(0,14rem)] max-lg:grid-cols-1 max-lg:overflow-y-auto">
          <section className="bg-background p-2" aria-label="Watchlist">
            <h2 className="mb-1.5 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Watchlist</h2>
            <ul>
              {SYMBOLS.map((t, k) => { const c = candles(t.base, t.seed, 70); const l = c.at(-1)!.c; const d = ((l - c[0]!.o) / c[0]!.o) * 100; return (
                <li key={t.s}><button type="button" aria-pressed={sym === k} onClick={() => { setSym(k); setHover(null); }} className={cn('flex w-full items-center justify-between px-1.5 py-1.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring', sym === k ? 'bg-primary/15' : 'hover:bg-muted')}><span><b className="block">{t.s}</b><span className="text-[10px] text-muted-foreground">{t.n}</span></span><span className="text-right tabular-nums"><span className="block">{f2(l)}</span><span className={d >= 0 ? 'text-success' : 'text-destructive'}>{d >= 0 ? '+' : ''}{d.toFixed(2)}%</span></span></button></li>
              ); })}
            </ul>
          </section>

          <section className="grid min-h-0 grid-rows-[auto_1fr_auto] bg-background" aria-label={`${cur.s} chart`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b px-3 py-2">
              <p><b className="text-sm">{cur.s}</b> <span className="text-muted-foreground">{cur.n}</span></p>
              <p className="tabular-nums"><b className="text-base">{f2(last)}</b> <span className={chg >= 0 ? 'text-success' : 'text-destructive'}>{chg >= 0 ? '+' : ''}{chg.toFixed(2)}%</span></p>
              <div className="flex" role="group" aria-label="Timeframe">{(Object.keys(FRAMES) as Frame[]).map((f) => <button key={f} type="button" aria-pressed={frame === f} onClick={() => { setFrame(f); setHover(null); }} className={cn('px-2 py-0.5 outline-none focus-visible:ring-1 focus-visible:ring-ring', frame === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>{f}</button>)}</div>
            </div>
            <div className="min-h-0 p-2">
              <svg viewBox={`0 0 ${W} ${H}`} className="h-full max-h-[22rem] w-full touch-pan-y outline-none focus-visible:ring-1 focus-visible:ring-ring" role="img" tabIndex={0} aria-label={`${cur.s} candles. Selected: open ${f2(data[i]!.o)}, high ${f2(data[i]!.h)}, low ${f2(data[i]!.l)}, close ${f2(data[i]!.c)}.`}
                onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHover(Math.max(0, Math.min(data.length - 1, Math.floor(((((e.clientX - r.left) / r.width) * W) - 8) / ((W - 70) / data.length))))); }} onPointerLeave={() => setHover(null)}
                onKeyDown={(e) => { if (e.key === 'ArrowRight') setHover(Math.min(data.length - 1, i + 1)); if (e.key === 'ArrowLeft') setHover(Math.max(0, i - 1)); }} onBlur={() => setHover(null)} preserveAspectRatio="none">
                {[0, 1, 2, 3, 4].map((g) => { const v = lo + ((hi - lo) * g) / 4; return <g key={g}><line x1="0" x2={W - 62} y1={y(v)} y2={y(v)} className="stroke-border" /><text x={W - 58} y={y(v) + 3} className="fill-muted-foreground text-[10px]">{f2(v)}</text></g>; })}
                {data.map((d, k) => { const up = d.c >= d.o; const cls = up ? 'stroke-success fill-success' : 'stroke-destructive fill-destructive'; const bw = Math.max(2, ((W - 70) / data.length) * 0.62); return <g key={k} className={cls}><line x1={x(k)} x2={x(k)} y1={y(d.h)} y2={y(d.l)} strokeWidth="1" /><rect x={x(k) - bw / 2} y={Math.min(y(d.o), y(d.c))} width={bw} height={Math.max(1, Math.abs(y(d.o) - y(d.c)))} stroke="none" /></g>; })}
                <line x1={x(i)} x2={x(i)} y1="4" y2={H - 24} className="stroke-foreground/40" strokeDasharray="2 3" />
                <line x1="0" x2={W - 62} y1={y(data[i]!.c)} y2={y(data[i]!.c)} className="stroke-primary" strokeDasharray="2 3" />
              </svg>
            </div>
            <p className="flex flex-wrap gap-x-4 border-t px-3 py-1.5 tabular-nums text-muted-foreground"><span>O <b className="text-foreground">{f2(data[i]!.o)}</b></span><span>H <b className="text-foreground">{f2(data[i]!.h)}</b></span><span>L <b className="text-foreground">{f2(data[i]!.l)}</b></span><span>C <b className="text-foreground">{f2(data[i]!.c)}</b></span></p>
          </section>

          <section className="grid min-h-0 grid-rows-[1fr_auto] gap-px bg-border" aria-label="Order book and ticket">
            <div className="bg-background p-2">
              <h2 className="mb-1.5 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Order book</h2>
              <ul className="grid gap-px" aria-label="Asks">{[...book].reverse().map((b, k) => <li key={k} className="relative flex justify-between px-1.5 py-0.5 tabular-nums"><span aria-hidden className="absolute inset-y-0 right-0 bg-destructive/15" style={{ width: `${(b.sz / maxSz) * 100}%` }} /><span className="relative text-destructive">{f2(b.ask)}</span><span className="relative">{b.sz}</span></li>)}</ul>
              <p className="my-1 border-y py-1 text-center tabular-nums"><b>{f2(last)}</b></p>
              <ul className="grid gap-px" aria-label="Bids">{book.map((b, k) => <li key={k} className="relative flex justify-between px-1.5 py-0.5 tabular-nums"><span aria-hidden className="absolute inset-y-0 right-0 bg-success/15" style={{ width: `${(b.sz / maxSz) * 100}%` }} /><span className="relative text-success">{f2(b.bid)}</span><span className="relative">{b.sz}</span></li>)}</ul>
            </div>
            <form className="grid gap-1.5 bg-background p-2" onSubmit={(e) => { e.preventDefault(); order(); }}>
              <div className="grid grid-cols-2" role="group" aria-label="Side">{(['Buy', 'Sell'] as const).map((s) => <button key={s} type="button" aria-pressed={side === s} onClick={() => setSide(s)} className={cn('py-1 outline-none focus-visible:ring-1 focus-visible:ring-ring', side === s ? (s === 'Buy' ? 'bg-success text-white' : 'bg-destructive text-white') : 'bg-muted text-muted-foreground')}>{s}</button>)}</div>
              <label className="flex items-center justify-between gap-2">Qty<input inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} className="w-20 border bg-background px-1.5 py-1 text-right tabular-nums outline-none focus-visible:ring-1 focus-visible:ring-ring" /></label>
              <p className="flex justify-between tabular-nums text-muted-foreground"><span>Est. value</span><b className="text-foreground">{f2(Number(qty || 0) * last)}</b></p>
              <button type="submit" disabled={!Number(qty)} className="bg-primary py-1.5 font-bold text-primary-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40">{side} {cur.s}</button>
            </form>
          </section>
        </div>

        <div className="grid shrink-0 gap-px border-t bg-border [grid-template-columns:minmax(0,1fr)_minmax(0,18rem)] max-lg:grid-cols-1">
          <section className="bg-background p-2" aria-label="Positions">
            <table className="w-full tabular-nums">
              <caption className="sr-only">Open positions</caption>
              <thead><tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th scope="col" className="px-1.5 font-normal">Position</th><th scope="col" className="font-normal">Qty</th><th scope="col" className="font-normal">Avg</th><th scope="col" className="font-normal">Last</th><th scope="col" className="px-1.5 text-right font-normal">P/L</th></tr></thead>
              <tbody>{POS.map((p) => { const t = SYMBOLS.find((s) => s.s === p.s)!; const l = candles(t.base, t.seed, 70).at(-1)!.c; const v = (l - p.avg) * p.q; return <tr key={p.s} className="border-t"><th scope="row" className="px-1.5 py-1 text-left">{p.s}</th><td>{p.q}</td><td>{f2(p.avg)}</td><td>{f2(l)}</td><td className={cn('px-1.5 text-right', v >= 0 ? 'text-success' : 'text-destructive')}>{v >= 0 ? '+' : ''}{f2(v)}</td></tr>; })}<tr className="border-t font-bold"><td className="px-1.5 py-1" colSpan={4}>Total unrealised</td><td className={cn('px-1.5 text-right', pnl >= 0 ? 'text-success' : 'text-destructive')}>{pnl >= 0 ? '+' : ''}{f2(pnl)}</td></tr></tbody>
            </table>
          </section>
          <section className="bg-background p-2" aria-label="Order log" aria-live="polite"><h2 className="mb-1 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">Order log</h2>{log.length === 0 ? <p className="px-1 text-muted-foreground">No orders this session.</p> : <ul className="grid gap-0.5">{log.map((l, k) => <li key={k} className="truncate px-1 tabular-nums">{l}</li>)}</ul>}</section>
        </div>
      </div>
    </div>
  );
}
