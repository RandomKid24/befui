'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

/**
 * Grid heatmap: rows by columns, each cell shaded by its value (traffic by hour and weekday, cohort retention, error counts).
 * Cells fade in on a diagonal wave when scrolled into view. Hover a cell to light up its row and column and read the value.
 * `values[row][col]`. Set `showValues` to print numbers in the cells. Colored with a text-* class (default primary).
 */
export function MatrixHeatmap({
  rows,
  cols,
  values,
  showValues = false,
  format = (n) => String(n),
  color = 'text-primary',
  className,
}: {
  rows: string[];
  cols: string[];
  values: number[][];
  showValues?: boolean;
  format?: (n: number) => string;
  color?: string;
  className?: string;
}) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<[number, number] | null>(null);
  const flat = values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const t = (v: number) => (max === min ? 1 : (v - min) / (max - min));
  const readout = hover ? `${rows[hover[0]]}, ${cols[hover[1]]}: ${format(values[hover[0]]![hover[1]]!)}` : 'Hover a cell';

  return (
    <div ref={ref} className={cn('grid gap-2', className)}>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(0, 1fr))` }} role="img" aria-label={`Heatmap of ${rows.length} rows by ${cols.length} columns`} onMouseLeave={() => setHover(null)}>
        <span />
        {cols.map((c, ci) => <span key={c} className={cn('pb-1 text-center text-[10px] text-muted-foreground transition-colors', hover?.[1] === ci && 'text-foreground')}>{c}</span>)}
        {rows.map((r, ri) => (
          <React.Fragment key={r}>
            <span className={cn('flex items-center pr-2 text-[11px] text-muted-foreground transition-colors', hover?.[0] === ri && 'text-foreground')}>{r}</span>
            {cols.map((c, ci) => {
              const v = values[ri]![ci]!;
              const dim = hover && hover[0] !== ri && hover[1] !== ci;
              return (
                <span key={c} onMouseEnter={() => setHover([ri, ci])} className="relative grid aspect-[1.4] min-h-5 place-items-center text-[10px] font-medium tabular-nums text-foreground">
                  <span aria-hidden className={cn('absolute inset-0 rounded-[4px] bg-current', color)} style={{ opacity: on ? (dim ? 0.3 : 0.08 + t(v) * 0.92) : 0, transform: on ? 'scale(1)' : 'scale(0.6)', transition: `opacity 500ms ease-out ${(ri + ci) * 28}ms, transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${(ri + ci) * 28}ms` }} />
                  {showValues && <span className="relative" style={{ opacity: on ? 1 : 0, transition: `opacity 500ms ease-out ${(ri + ci) * 28 + 150}ms` }}>{format(v)}</span>}
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span aria-live="polite">{readout}</span>
        <span className={cn('flex items-center gap-1', color)}>
          <span className="text-muted-foreground">Low</span>
          {[0.1, 0.35, 0.6, 0.8, 1].map((o) => <span key={o} className="size-2.5 rounded-[2px] bg-current" style={{ opacity: o }} />)}
          <span className="text-muted-foreground">High</span>
        </span>
      </div>
    </div>
  );
}
