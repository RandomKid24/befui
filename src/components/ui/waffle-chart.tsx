import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface WaffleItem {
  label: string;
  value: number;
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];

/**
 * Waffle chart: 100 squares, each one percent of the whole (survey answers, budget split, completion by status).
 * Squares pop in a wave from the top left on scroll; hover a legend row to light up its squares.
 */
export function WaffleChart({ data, columns = 10, cell = 22, className }: { data: WaffleItem[]; columns?: number; cell?: number; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cells = columns * columns;
  // largest remainder so the squares always add up to exactly `cells`
  const raw = data.map((d) => (d.value / total) * cells);
  const counts = raw.map(Math.floor);
  let left = cells - counts.reduce((a, b) => a + b, 0);
  [...raw.keys()].sort((a, b) => (raw[b]! % 1) - (raw[a]! % 1)).forEach((k) => { if (left-- > 0) counts[k]!++; });
  const owner: number[] = counts.flatMap((c, i) => Array(c).fill(i));

  return (
    <div ref={ref} className={cn('flex flex-wrap items-center gap-x-8 gap-y-4', className)}>
      <div className="grid shrink-0 gap-[3px]" style={{ gridTemplateColumns: `repeat(${columns}, ${cell}px)` }} role="img" aria-label={data.map((d) => `${d.label} ${Math.round((d.value / total) * 100)}%`).join(', ')}>
        {owner.map((o, k) => (
          <span
            key={k}
            className={cn('rounded-[5px] bg-current', data[o]!.color ?? palette[o % palette.length])}
            style={{ height: cell, opacity: on ? (hover === null || hover === o ? 1 : 0.15) : 0, transform: on ? 'scale(1)' : 'scale(0.3)', transition: `transform 450ms cubic-bezier(0.34,1.56,0.64,1) ${((k % columns) + Math.floor(k / columns)) * 28}ms, opacity 300ms ease-out ${on && hover === null ? ((k % columns) + Math.floor(k / columns)) * 28 : 0}ms` }}
          />
        ))}
      </div>
      <ul className="grid min-w-36 flex-1 gap-2 text-[13px]">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className={cn('size-2.5 rounded-[3px] bg-current', d.color ?? palette[i % palette.length])} />
            <span className="text-muted-foreground">{d.label}</span>
            <span className="ml-auto font-medium tabular-nums">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
