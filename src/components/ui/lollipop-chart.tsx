'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

/**
 * Lollipop chart: a bar chart drawn as a thin stick with a dot on the end. Same job as bars but lighter, so it reads better with many items
 * (tickets per customer, bugs per module). Sorted largest first unless you pass `sort={false}`. Sticks grow, then the dots land; hover a row for its value.
 */
export function LollipopChart({ items, sort = true, format = (n) => n.toLocaleString('en-IN'), className }: { items: { label: string; value: number }[]; sort?: boolean; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const list = sort ? [...items].sort((a, b) => b.value - a.value) : items;
  const max = Math.max(...list.map((d) => d.value), 1);
  return (
    <div ref={ref} className={cn('grid gap-0.5', className)} onMouseLeave={() => setHover(null)}>
      {list.map((d, i) => (
        <div key={d.label} className={cn('grid grid-cols-[8rem_1fr_3.5rem] items-center gap-3 rounded-md px-1 py-1.5 transition-opacity', hover !== null && hover !== i && 'opacity-40')} onMouseEnter={() => setHover(i)}>
          <span className="truncate text-[13px]">{d.label}</span>
          <div className="relative h-4">
            <span className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-primary/50" style={{ width: on ? `${(d.value / max) * 96}%` : 0, transition: `width 800ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms` }} />
            <span className={cn('absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-primary transition-transform duration-(--dur-base)', hover === i && 'scale-125')} style={{ left: `${on ? (d.value / max) * 96 : 0}%`, marginLeft: '-0.1rem', transition: `left 800ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms, transform 200ms` }} />
          </div>
          <span className="text-right text-xs font-medium tabular-nums">{format(d.value)}</span>
        </div>
      ))}
    </div>
  );
}
