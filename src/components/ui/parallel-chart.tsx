'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface ParallelRow {
  name: string;
  /** One value per axis, in the same order as `axes`. */
  values: number[];
  color?: string;
}

const palette = ['text-primary', 'text-warning', 'text-success', 'text-info', 'text-destructive'];
const W = 560, H = 300, PX = 40, TOP = 34, BOT = 270;

/**
 * Parallel coordinates: many values per item in one chart. Each vertical axis is one measure (scaled to its own min and max),
 * each line is one item crossing every axis. Lines that run together are alike; a line that jumps is an outlier.
 * Lines draw in on scroll; hover a line or its name to isolate it.
 */
export function ParallelChart({ axes, rows, format = (n) => String(n), className }: { axes: string[]; rows: ParallelRow[]; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const x = (a: number) => PX + (a / (axes.length - 1 || 1)) * (W - PX * 2);
  const ext = axes.map((_, a) => {
    const v = rows.map((r) => r.values[a] ?? 0);
    return [Math.min(...v), Math.max(...v)] as const;
  });
  const y = (a: number, v: number) => BOT - ((v - ext[a]![0]) / (ext[a]![1] - ext[a]![0] || 1)) * (BOT - TOP);
  const cls = (r: ParallelRow, i: number) => r.color ?? palette[i % palette.length];

  return (
    <div className={cn('w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H + 10}`} className="h-auto w-full overflow-visible" role="img" aria-label={`${rows.length} items compared across ${axes.join(', ')}`} onMouseLeave={() => setHover(null)}>
        {axes.map((name, a) => (
          <g key={name}>
            <line x1={x(a)} x2={x(a)} y1={TOP} y2={BOT} className="stroke-border" />
            <text x={x(a)} y={14} textAnchor="middle" className="fill-foreground text-[11px] font-medium">{name}</text>
            <text x={x(a)} y={TOP - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{format(ext[a]![1])}</text>
            <text x={x(a)} y={BOT + 14} textAnchor="middle" className="fill-muted-foreground text-[10px]">{format(ext[a]![0])}</text>
          </g>
        ))}
        {rows.map((r, i) => {
          const d = axes.map((_, a) => `${a ? 'L' : 'M'}${x(a)},${y(a, r.values[a] ?? 0)}`).join(' ');
          return (
            <g key={r.name} className={cls(r, i)} style={{ opacity: hover !== null && hover !== i ? 0.12 : 1, transition: 'opacity 200ms' }} onMouseEnter={() => setHover(i)}>
              <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
              <path d={d} fill="none" stroke="currentColor" strokeWidth={hover === i ? 3.5 : 2} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: `stroke-dashoffset 1000ms cubic-bezier(0.22,1,0.36,1) ${i * 100}ms, stroke-width 150ms` }} />
              {hover === i && axes.map((_, a) => (
                <g key={a}>
                  <circle cx={x(a)} cy={y(a, r.values[a] ?? 0)} r="4" fill="currentColor" />
                  <text x={x(a)} y={y(a, r.values[a] ?? 0) - 9} textAnchor="middle" className="fill-foreground text-[10px] font-medium">{format(r.values[a] ?? 0)}</text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {rows.map((r, i) => (
          <span key={r.name} className={cn('flex cursor-default items-center gap-1.5', hover !== null && hover !== i && 'opacity-40')} onMouseEnter={() => setHover(i)}>
            <span className={cn('size-2 rounded-full bg-current', cls(r, i))} />{r.name}
          </span>
        ))}
      </div>
    </div>
  );
}
