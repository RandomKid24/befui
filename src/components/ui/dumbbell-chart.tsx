'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface DumbbellRow {
  label: string;
  from: number;
  to: number;
}

/**
 * Dumbbell chart: the change per item as two dots joined by a line (score before and after, price last year and this year, plan vs actual).
 * The line stretches from the first dot to the second on scroll. Green when the change is good, red when it is bad.
 * `higherIsBetter` decides which direction is good.
 */
export function DumbbellChart({ rows, fromLabel = 'Before', toLabel = 'After', higherIsBetter = true, format = (n) => String(n), className }: { rows: DumbbellRow[]; fromLabel?: string; toLabel?: string; higherIsBetter?: boolean; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const all = rows.flatMap((r) => [r.from, r.to]);
  const lo = Math.min(...all), hi = Math.max(...all);
  const span = hi - lo || 1;
  const pos = (v: number) => 4 + ((v - lo) / span) * 92; // keep dots inside the track
  return (
    <div ref={ref} className={cn('grid gap-1', className)} onMouseLeave={() => setHover(null)}>
      <div className="mb-1 flex justify-end gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full border-2 border-muted-foreground bg-background" />{fromLabel}</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-foreground" />{toLabel}</span>
      </div>
      {rows.map((r, i) => {
        const good = higherIsBetter ? r.to >= r.from : r.to <= r.from;
        const a = pos(r.from), b = pos(r.to);
        return (
          <div key={r.label} className={cn('grid grid-cols-[7rem_1fr] items-center gap-3 rounded-md px-1 py-1.5 transition-opacity', hover !== null && hover !== i && 'opacity-40')} onMouseEnter={() => setHover(i)}>
            <span className="truncate text-[13px]">{r.label}</span>
            <div className="relative h-5">
              <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
              <span className={cn('absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full', good ? 'bg-success/60' : 'bg-destructive/60')} style={{ left: `${Math.min(a, b)}%`, width: on ? `${Math.abs(b - a)}%` : 0, transition: `width 900ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms` }} />
              <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-muted-foreground bg-background" style={{ left: `${a}%` }} />
              <span className={cn('absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full', good ? 'bg-success' : 'bg-destructive')} style={{ left: `${on ? b : a}%`, marginLeft: '-0.4375rem', transition: `left 900ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms` }} />
              {hover === i && <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tabular-nums">{format(r.from)} to {format(r.to)}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
