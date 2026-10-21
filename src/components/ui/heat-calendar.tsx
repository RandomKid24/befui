'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

/**
 * One month as a calendar grid, every day tinted by its value (darker is more). Hover a day for its number. Pass `values` as the amount for
 * each day of the month, index 0 being the 1st; days with no value stay empty. Good for sales, attendance or tickets per day.
 */
export function HeatCalendar({ year, month, values, format = (n) => String(n), weekStartsOn = 1, onSelect, className }: { year: number; month: number; values: (number | undefined)[]; format?: (n: number) => string; weekStartsOn?: 0 | 1; onSelect?: (day: number) => void; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const days = new Date(year, month, 0).getDate(); // month is 1 to 12
  const lead = (new Date(year, month - 1, 1).getDay() - weekStartsOn + 7) % 7;
  const max = Math.max(...values.map((v) => v ?? 0), 1);
  const names = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat('en-US', { weekday: 'narrow' }).format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7))));
  return (
    <div ref={ref} className={cn('w-full max-w-sm', className)}>
      <p className="mb-2 text-sm font-medium">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))}</p>
      <div className="grid grid-cols-7 gap-1.5">
        {names.map((n, i) => <span key={i} className="text-center text-[10px] text-muted-foreground">{n}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`l${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const v = values[i];
          const t = v === undefined ? 0 : v / max;
          return (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}: ${v === undefined ? 'no data' : format(v)}`}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
              onClick={() => onSelect?.(i + 1)}
              className="relative grid aspect-square place-items-center rounded-md border border-transparent bg-secondary text-[11px] outline-none transition-[transform,opacity] focus-visible:ring-2 focus-visible:ring-ring hover:scale-110"
              style={{ background: v === undefined ? undefined : `color-mix(in srgb, var(--primary) ${Math.round(12 + t * 78)}%, var(--secondary))`, color: t > 0.55 ? 'var(--primary-foreground)' : undefined, opacity: on ? 1 : 0, transitionDelay: `${i * 14}ms` }}
            >
              {i + 1}
              {hover === i && v !== undefined && <span className="pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[11px] font-medium text-background">{format(v)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
