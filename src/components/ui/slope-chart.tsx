import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface SlopeRow {
  label: string;
  from: number;
  to: number;
}

const W = 520;

/**
 * Slope chart: each item is one line between two moments (this year and last, before and after a change). Steep lines changed a lot,
 * flat lines did not, and crossing lines swapped places. Green rose, red fell (flip with `higherIsBetter`). Lines draw in on scroll; hover to isolate one.
 */
export function SlopeChart({ rows, fromLabel, toLabel, higherIsBetter = true, format = (n) => String(n), className }: { rows: SlopeRow[]; fromLabel: string; toLabel: string; higherIsBetter?: boolean; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const all = rows.flatMap((r) => [r.from, r.to]);
  const lo = Math.min(...all), hi = Math.max(...all);
  const H = 300;
  const y = (v: number) => 34 + (1 - (v - lo) / (hi - lo || 1)) * (H - 60);
  const xl = 150, xr = W - 150;
  // nudge labels apart so close values do not print on top of each other
  const spread = (key: 'from' | 'to') => {
    const order = rows.map((r, i) => ({ i, y: y(r[key]) })).sort((a, b) => a.y - b.y);
    for (let k = 1; k < order.length; k++) if (order[k]!.y - order[k - 1]!.y < 14) order[k]!.y = order[k - 1]!.y + 14;
    const out: number[] = [];
    order.forEach((o) => (out[o.i] = o.y));
    return out;
  };
  const ly = spread('from'), ry = spread('to');

  return (
    <div className={cn('w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H + 20}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Change from ${fromLabel} to ${toLabel}`} onMouseLeave={() => setHover(null)}>
        <text x={xl} y={12} textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">{fromLabel}</text>
        <text x={xr} y={12} textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">{toLabel}</text>
        <line x1={xl} x2={xl} y1={24} y2={H} className="stroke-border" />
        <line x1={xr} x2={xr} y1={24} y2={H} className="stroke-border" />
        {rows.map((r, i) => {
          const good = higherIsBetter ? r.to >= r.from : r.to <= r.from;
          const dim = hover !== null && hover !== i;
          return (
            <g key={r.label} className={good ? 'text-success' : 'text-destructive'} onMouseEnter={() => setHover(i)} style={{ opacity: dim ? 0.2 : 1, transition: 'opacity 200ms' }}>
              <line x1={xl} y1={y(r.from)} x2={xr} y2={y(r.to)} stroke="currentColor" strokeWidth={hover === i ? 3.5 : 2.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: `stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, stroke-width 150ms` }} />
              <circle cx={xl} cy={y(r.from)} r="4.5" fill="currentColor" style={{ opacity: on ? 1 : 0, transition: `opacity 300ms ease-out ${i * 90}ms` }} />
              <circle cx={xr} cy={y(r.to)} r="4.5" fill="currentColor" style={{ opacity: on ? 1 : 0, transition: `opacity 300ms ease-out ${i * 90 + 600}ms` }} />
              <text x={xl - 12} y={ly[i]} dy="0.35em" textAnchor="end" className="fill-foreground text-[11px]">{r.label}<tspan className="fill-muted-foreground" dx="6">{format(r.from)}</tspan></text>
              <text x={xr + 12} y={ry[i]} dy="0.35em" className="fill-foreground text-[11px]"><tspan className="fill-muted-foreground" dx="0">{format(r.to)}</tspan><tspan dx="6">{r.label}</tspan></text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
