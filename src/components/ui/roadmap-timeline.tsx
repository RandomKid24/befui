'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface RoadmapItem {
  label: string;
  /** Start and end as dates or ISO strings. */
  start: Date | string;
  end: Date | string;
  /** Group name, shown as a small caption and used for the colour. */
  group?: string;
  /** 0 to 100, filled darker inside the bar. */
  progress?: number;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info', 'text-destructive'];
const DAY = 86400000;

/**
 * A light roadmap: one bar per item along a month axis, coloured by group, with optional progress filled inside and a line for today.
 * Lighter than the Gantt (no dependencies, no dragging): use it to show what is planned when. Bars slide in on scroll.
 */
export function RoadmapTimeline({ items, today = new Date(), className }: { items: RoadmapItem[]; today?: Date; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const rows = items.map((i) => ({ ...i, s: +new Date(i.start), e: +new Date(i.end) }));
  const lo = Math.min(...rows.map((r) => r.s)), hi = Math.max(...rows.map((r) => r.e));
  const first = new Date(lo); first.setDate(1); first.setHours(0, 0, 0, 0);
  const start = +first, span = Math.max(hi - start, DAY);
  const months: { at: number; label: string }[] = [];
  for (let d = new Date(first); +d <= hi; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) months.push({ at: ((+d - start) / span) * 100, label: d.toLocaleString('en-US', { month: 'short' }) });
  const groups = [...new Set(rows.map((r) => r.group ?? ''))];
  const t = ((+today - start) / span) * 100;
  return (
    <div ref={ref} className={cn('w-full', className)}>
      <div className="relative ml-36 h-6 border-b text-[11px] text-muted-foreground">
        {months.map((m) => <span key={m.label + m.at} className="absolute top-0 -translate-x-0 pl-1" style={{ left: `${m.at}%` }}>{m.label}</span>)}
      </div>
      <ul className="relative">
        {t >= 0 && t <= 100 && <li aria-hidden className="pointer-events-none absolute inset-y-0 z-10 ml-36 w-px bg-destructive/60" style={{ left: `calc((100% - 9rem) * ${t / 100})` }} />}
        {rows.map((r, i) => {
          const left = ((r.s - start) / span) * 100, width = Math.max(((r.e - r.s) / span) * 100, 1.5);
          return (
            <li key={r.label} className="flex items-center border-b border-dashed last:border-0">
              <span className="w-36 shrink-0 truncate py-2.5 pr-3 text-[13px]" title={r.label}>{r.label}</span>
              <div className="relative h-9 flex-1">
                <div
                  className={cn('absolute top-1.5 h-6 overflow-hidden rounded-md bg-current/20', palette[groups.indexOf(r.group ?? '') % palette.length])}
                  style={{ left: `${left}%`, width: `${width}%`, background: 'color-mix(in srgb, currentColor 22%, transparent)', clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', transition: `clip-path 700ms cubic-bezier(0.22,1,0.36,1) ${i * 70}ms` }}
                  role="img" aria-label={`${r.label}: ${new Date(r.s).toDateString()} to ${new Date(r.e).toDateString()}${r.progress !== undefined ? `, ${r.progress}% done` : ''}`}
                >
                  {r.progress !== undefined && <div className="absolute inset-y-0 left-0 bg-current opacity-70" style={{ width: `${r.progress}%` }} />}
                  <span className="relative px-2 text-[11px] font-medium leading-6 text-foreground">{r.group}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
