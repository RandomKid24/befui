import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface ButterflyRow {
  label: string;
  left: number;
  right: number;
}

/**
 * Butterfly (pyramid) chart: two bar sets back to back around a shared list of rows, so two groups compare row by row
 * (population by age for men and women, hires and exits by team, desktop and mobile by page). Bars grow outward from the middle on scroll;
 * hover a row to read both values.
 */
export function ButterflyChart({ rows, leftLabel, rightLabel, format = (n) => n.toLocaleString('en-IN'), className }: { rows: ButterflyRow[]; leftLabel: string; rightLabel: string; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const max = Math.max(...rows.flatMap((r) => [r.left, r.right]), 1);
  return (
    <div ref={ref} className={cn('grid gap-1', className)} onMouseLeave={() => setHover(null)}>
      <div className="grid grid-cols-[1fr_5.5rem_1fr] text-xs font-medium text-muted-foreground"><span className="text-right">{leftLabel}</span><span /><span>{rightLabel}</span></div>
      {rows.map((r, i) => (
        <div key={r.label} className={cn('grid grid-cols-[1fr_5.5rem_1fr] items-center transition-opacity', hover !== null && hover !== i && 'opacity-40')} onMouseEnter={() => setHover(i)}>
          <div className="flex items-center justify-end gap-2">
            <span className={cn('text-[11px] tabular-nums text-muted-foreground transition-opacity', hover === i ? 'opacity-100' : 'opacity-0')}>{format(r.left)}</span>
            <span className="h-5 rounded-l-md bg-primary" style={{ width: on ? `${(r.left / max) * 100}%` : 0, minWidth: on ? 2 : 0, transition: `width 800ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms` }} />
          </div>
          <span className="text-center text-[11px] text-muted-foreground">{r.label}</span>
          <div className="flex items-center gap-2">
            <span className="h-5 rounded-r-md bg-success" style={{ width: on ? `${(r.right / max) * 100}%` : 0, minWidth: on ? 2 : 0, transition: `width 800ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms` }} />
            <span className={cn('text-[11px] tabular-nums text-muted-foreground transition-opacity', hover === i ? 'opacity-100' : 'opacity-0')}>{format(r.right)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
