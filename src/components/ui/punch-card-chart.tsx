'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

/**
 * Punch card: a grid of dots where the size of each dot is the value (commits by weekday and hour, tickets by day and shift, orders by slot).
 * Easier to compare sizes than shades, so it suits a small grid. Dots pop in on a diagonal wave on scroll; hover one for its row, column and value.
 * `values[row][col]`. Colored with a text-* class (default primary).
 */
export function PunchCardChart({ rows, cols, values, color = 'text-primary', format = (n) => String(n), className }: { rows: string[]; cols: string[]; values: number[][]; color?: string; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<[number, number] | null>(null);
  const max = Math.max(...values.flat(), 1);
  return (
    <div ref={ref} className={cn('grid gap-2', className)}>
      <div className="grid gap-y-1" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(0, 1fr))` }} role="img" aria-label={`Punch card of ${rows.length} rows by ${cols.length} columns`} onMouseLeave={() => setHover(null)}>
        <span />
        {cols.map((c, ci) => <span key={c} className={cn('text-center text-[10px] text-muted-foreground transition-colors', hover?.[1] === ci && 'text-foreground')}>{c}</span>)}
        {rows.map((r, ri) => (
          <React.Fragment key={r}>
            <span className={cn('flex items-center pr-3 text-[11px] text-muted-foreground transition-colors', hover?.[0] === ri && 'text-foreground')}>{r}</span>
            {cols.map((c, ci) => {
              const v = values[ri]![ci]!;
              const size = v ? 4 + Math.sqrt(v / max) * 20 : 0;
              return (
                <span key={c} className="grid aspect-square min-h-6 place-items-center border-t border-border/40" onMouseEnter={() => setHover([ri, ci])}>
                  <span className={cn('rounded-full bg-current', color)} style={{ width: size, height: size, opacity: hover && (hover[0] !== ri || hover[1] !== ci) ? 0.4 : 0.9, transform: on ? 'scale(1)' : 'scale(0)', transition: `transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${(ri + ci) * 30}ms, opacity 150ms` }} />
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground" aria-live="polite">{hover ? `${rows[hover[0]]}, ${cols[hover[1]]}: ${format(values[hover[0]]![hover[1]]!)}` : 'Bigger dot, bigger value. Hover a dot.'}</p>
    </div>
  );
}
