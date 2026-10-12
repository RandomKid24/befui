import * as React from 'react';
import { cn } from '@/lib/utils';
import { smoothPath } from './area-chart';
import { useChartIn } from './charts';

const W = 600;
const H = 260;
const pad = { l: 44, r: 12, t: 14, b: 28 };

/**
 * Forecast chart: what happened (solid line) and what we expect next (dashed line inside a shaded band). The band is the likely range, wider means less certain.
 * `actual` covers the first labels; `forecast`, `low` and `high` cover the labels after them. The solid line draws first, then the dashed line and band fade in; hover for a readout.
 */
export function ForecastChart({ labels, actual, forecast, low, high, format = (n) => String(n), className }: { labels: string[]; actual: number[]; forecast: number[]; low: number[]; high: number[]; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const k = actual.length;
  const n = labels.length;
  const max = Math.max(...actual, ...high) * 1.08;
  const min = Math.min(0, Math.min(...actual, ...low));
  const x = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  const hist = actual.map((v, i) => [x(i), y(v)] as [number, number]);
  const fc: [number, number][] = [[x(k - 1), y(actual[k - 1]!)], ...forecast.map((v, i) => [x(k + i), y(v)] as [number, number])];
  const hi: [number, number][] = [[x(k - 1), y(actual[k - 1]!)], ...high.map((v, i) => [x(k + i), y(v)] as [number, number])];
  const lo: [number, number][] = [[x(k - 1), y(actual[k - 1]!)], ...low.map((v, i) => [x(k + i), y(v)] as [number, number])];
  const band = `${smoothPath(hi)} L${lo[lo.length - 1]![0]},${lo[lo.length - 1]![1]} ${smoothPath([...lo].reverse()).replace(/^M/, 'L')} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + t * (max - min));
  const val = (i: number) => (i < k ? actual[i]! : forecast[i - k]!);

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1)))));
  };

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-pan-y overflow-visible text-primary" role="img" aria-label="Forecast chart" onPointerMove={move} onPointerLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray={t ? '3 4' : undefined} />
            <text x={pad.l - 8} y={y(t) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{format(Math.round(t))}</text>
          </g>
        ))}
        {labels.map((l, i) => (n <= 10 || i % Math.ceil(n / 10) === 0) && <text key={l + i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">{l}</text>)}
        <line x1={x(k - 1)} x2={x(k - 1)} y1={pad.t} y2={H - pad.b} className="stroke-muted-foreground/50" strokeDasharray="2 3" />
        <text x={x(k - 1) + 6} y={pad.t + 8} className="fill-muted-foreground text-[10px]">Forecast</text>
        <path d={band} fill="currentColor" fillOpacity="0.16" style={{ opacity: on ? 1 : 0, transition: 'opacity 900ms ease-out 1100ms' }} />
        <path d={smoothPath(hist)} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: 'stroke-dashoffset 1300ms cubic-bezier(0.22,1,0.36,1)' }} />
        <path d={smoothPath(fc)} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" style={{ opacity: on ? 1 : 0, transition: 'opacity 700ms ease-out 1200ms' }} />
        {hover !== null && <><line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="stroke-muted-foreground/40" /><circle cx={x(hover)} cy={y(val(hover))} r="4" fill="currentColor" className="stroke-background" strokeWidth="2" /></>}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-2 z-10 min-w-28 rounded-lg border bg-popover px-2.5 py-2 text-xs shadow-lg" style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? '-105%' : '8%'})` }}>
          <p className="mb-0.5 font-medium">{labels[hover]} {hover >= k && <span className="font-normal text-muted-foreground">(forecast)</span>}</p>
          <p className="flex justify-between gap-4 text-muted-foreground">Value<span className="font-medium tabular-nums text-foreground">{format(val(hover))}</span></p>
          {hover >= k && <p className="flex justify-between gap-4 text-muted-foreground">Range<span className="tabular-nums text-foreground">{format(low[hover - k]!)} to {format(high[hover - k]!)}</span></p>}
        </div>
      )}
    </div>
  );
}
