'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * A whole year as a grid of small squares, one per day, columns are weeks (the GitHub contributions graph). Squares are tinted in
 * five steps by `values` (a map of `YYYY-MM-DD` to a number). Hover a day for its value; squares fade in left to right.
 */
export function YearHeatmap({
  year,
  values,
  unit = 'contributions',
  weekStartsOn = 0,
  onSelect,
  className,
}: {
  year: number;
  values: Record<string, number>;
  unit?: string;
  weekStartsOn?: 0 | 1;
  onSelect?: (date: string) => void;
  className?: string;
}) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const first = new Date(year, 0, 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const days = (new Date(year, 11, 31).getTime() - first.getTime()) / 864e5 + 1;
  const cells: (string | null)[] = [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => iso(new Date(year, 0, 1 + i)))];
  while (cells.length % 7) cells.push(null);
  const weeks = cells.length / 7;
  const max = Math.max(...Object.entries(values).filter(([d]) => d.startsWith(String(year))).map(([, v]) => v), 1);
  const level = (v = 0) => (v <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)));
  const shade = ['bg-secondary', 'bg-primary/25', 'bg-primary/50', 'bg-primary/75', 'bg-primary'];
  const total = Object.entries(values).reduce((n, [d, v]) => (d.startsWith(String(year)) ? n + v : n), 0);
  const month = new Intl.DateTimeFormat(undefined, { month: 'short' });
  const dayName = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const full = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  // name a month above the first week that starts it, once
  let seen = -1;
  const labels = Array.from({ length: weeks }, (_, w) => {
    const d = cells.slice(w * 7, w * 7 + 7).find(Boolean);
    const m = d ? Number(d.slice(5, 7)) : -1;
    if (!d || m === seen || (w > 0 && Number(d.slice(8)) > 7)) return '';
    seen = m;
    return month.format(new Date(d));
  });

  return (
    <div ref={ref} className={cn('w-full overflow-x-auto', className)}>
      <p className="mb-2 text-sm"><span className="font-semibold tabular-nums">{total.toLocaleString()}</span> <span className="text-muted-foreground">{unit} in {year}</span></p>
      <div className="grid min-w-[52rem] gap-1" style={{ gridTemplateColumns: `1.75rem repeat(${weeks}, minmax(0, 1fr))`, gridTemplateRows: 'auto repeat(7, 1fr)' }} role="group" aria-label={`${total} ${unit} in ${year}`}>
        <span />
        {labels.map((l, w) => <span key={w} className="overflow-visible whitespace-nowrap text-[10px] text-muted-foreground">{l}</span>)}
        {Array.from({ length: 7 }, (_, r) => (
          <React.Fragment key={r}>
            <span className="self-center text-[10px] leading-none text-muted-foreground">{r % 2 ? dayName.format(new Date(2023, 0, 1 + ((r + weekStartsOn) % 7))).slice(0, 3) : ''}</span>
            {Array.from({ length: weeks }, (_, w) => {
              const d = cells[w * 7 + r];
              if (!d) return <span key={w} />;
              const v = values[d] ?? 0;
              const label = `${v.toLocaleString()} ${unit} on ${full.format(new Date(d))}`;
              const cls = cn('aspect-square w-full rounded-[3px] outline-none transition-opacity duration-(--dur-medium) focus-visible:ring-2 focus-visible:ring-ring', shade[level(v)], on ? 'opacity-100' : 'opacity-0');
              const delay = { transitionDelay: on ? `${w * 8}ms` : '0ms' };
              // clickable only when onSelect is given, so a plain chart has no hundreds of tab stops
              return onSelect ? (
                <button key={w} type="button" title={label} aria-label={label} onClick={() => onSelect(d)} className={cls} style={delay} />
              ) : (
                <span key={w} role="img" title={label} aria-label={label} className={cls} style={delay} />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground" aria-hidden>
        Less {shade.map((s) => <span key={s} className={cn('size-2.5 rounded-[3px]', s)} />)} More
      </div>
    </div>
  );
}
