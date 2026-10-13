'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface BumpSeries {
  name: string;
  /** Rank at each label, 1 is best. */
  ranks: number[];
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info', 'text-destructive'];
const W = 600;
const padX = { l: 90, r: 90 };

/**
 * Bump chart: how rank changes over time (leaderboard by month, search position, product popularity).
 * Smooth lines swap places between columns. Lines draw in one by one on scroll; hover a line or a name to follow it.
 */
export function BumpChart({ series, labels, className }: { series: BumpSeries[]; labels: string[]; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const n = labels.length;
  const rows = series.length;
  const rowH = 38;
  const H = rows * rowH + 34;
  const x = (i: number) => padX.l + (n === 1 ? 0 : (i / (n - 1)) * (W - padX.l - padX.r));
  const y = (r: number) => 14 + (r - 0.5) * rowH;
  const color = (si: number) => series[si]!.color ?? palette[si % palette.length];
  const path = (s: BumpSeries) => s.ranks.map((r, i) => {
    if (!i) return `M${x(0)},${y(r)}`;
    const mx = (x(i - 1) + x(i)) / 2;
    return `C${mx},${y(s.ranks[i - 1]!)} ${mx},${y(r)} ${x(i)},${y(r)}`;
  }).join(' ');

  return (
    <div className={cn('w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label="Rank over time" onMouseLeave={() => setHover(null)}>
        {labels.map((l, i) => <text key={l} x={x(i)} y={H - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{l}</text>)}
        {series.map((s, si) => {
          const dim = hover !== null && hover !== si;
          const first = s.ranks[0]!, last = s.ranks[n - 1]!;
          return (
            <g key={s.name} className={cn(color(si), 'cursor-pointer')} style={{ opacity: dim ? 0.2 : 1, transition: 'opacity 250ms' }} onMouseEnter={() => setHover(si)}>
              <path d={path(s)} fill="none" stroke="currentColor" strokeWidth={hover === si ? 5 : 3.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: `stroke-dashoffset 1300ms cubic-bezier(0.22,1,0.36,1) ${si * 110}ms, stroke-width 200ms` }} />
              {s.ranks.map((r, i) => (
                <g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: on ? 'scale(1)' : 'scale(0)', transition: `transform 450ms cubic-bezier(0.34,1.56,0.64,1) ${si * 110 + i * 120 + 300}ms` }}>
                  <circle cx={x(i)} cy={y(r)} r="10" fill="currentColor" className="stroke-background" strokeWidth="2" />
                  <text x={x(i)} y={y(r)} dy="0.35em" textAnchor="middle" className="fill-background text-[10px] font-semibold">{r}</text>
                </g>
              ))}
              <text x={padX.l - 20} y={y(first)} dy="0.35em" textAnchor="end" className="fill-foreground text-[11px] font-medium">{s.name}</text>
              <text x={W - padX.r + 20} y={y(last)} dy="0.35em" className="fill-foreground text-[11px] font-medium">{s.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
