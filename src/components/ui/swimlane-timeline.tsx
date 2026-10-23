'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface SwimlaneItem {
  label: string;
  /** Anything `new Date()` reads, such as `2026-10-05`. */
  start: string;
  end: string;
  /** Index into `tones`. */
  tone?: number;
}
export interface Swimlane { name: string; items: SwimlaneItem[] }

const tones = ['bg-primary/85', 'bg-success/85', 'bg-warning/85', 'bg-info/85'];
const DAY = 86400000;

/**
 * Rows for people, teams or machines with bars along a shared day axis: who is doing what, and when. Bars inside a row that
 * overlap are stacked so none hides another. A line marks today. Bars slide open from their start on scroll.
 */
export function SwimlaneTimeline({
  lanes,
  today = new Date(),
  className,
}: {
  lanes: Swimlane[];
  /** Where to draw the today line. Pass `null` to hide it. */
  today?: Date | null;
  className?: string;
}) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const all = lanes.flatMap((l) => l.items);
  if (!all.length) return null;
  const t0 = Math.min(...all.map((i) => +new Date(i.start)));
  const t1 = Math.max(...all.map((i) => +new Date(i.end))) + DAY;
  const span = t1 - t0 || DAY;
  const pct = (t: number) => ((t - t0) / span) * 100;

  // greedy stacking: put each bar on the first sub-row that is free at its start
  const packed = lanes.map((l) => {
    const rows: number[] = [];
    const placed = [...l.items].sort((a, b) => +new Date(a.start) - +new Date(b.start)).map((it) => {
      const s = +new Date(it.start), e = +new Date(it.end) + DAY;
      let r = rows.findIndex((end) => end <= s);
      if (r < 0) r = rows.length;
      rows[r] = e;
      return { it, row: r, s, e };
    });
    return { name: l.name, placed, rows: Math.max(rows.length, 1) };
  });

  const ticks: number[] = [];
  const step = span / DAY > 60 ? 14 : span / DAY > 21 ? 7 : 1;
  for (let t = t0; t < t1; t += step * DAY) ticks.push(t);
  const fmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
  const now = today ? +today : null;

  return (
    <div ref={ref} className={cn('w-full overflow-x-auto rounded-xl border bg-card', className)}>
      <div className="min-w-[36rem]">
        <div className="relative ms-28 h-7 border-b text-[10px] text-muted-foreground">
          {ticks.map((t) => <span key={t} className="absolute top-2 -translate-x-1/2 tabular-nums rtl:translate-x-1/2" style={{ insetInlineStart: `${pct(t)}%` }}>{fmt.format(t)}</span>)}
        </div>
        {packed.map((l) => (
          <div key={l.name} className="flex border-b last:border-b-0">
            <div className="w-28 shrink-0 truncate border-e px-3 py-2.5 text-[13px] font-medium">{l.name}</div>
            <div className="relative flex-1" style={{ height: l.rows * 28 + 12 }}>
              {ticks.map((t) => <span key={t} className="absolute inset-y-0 w-px bg-border/60" style={{ insetInlineStart: `${pct(t)}%` }} />)}
              {l.placed.map(({ it, row, s, e }, i) => (
                <div
                  key={i}
                  title={`${it.label}: ${fmt.format(s)} to ${fmt.format(e - DAY)}`}
                  className={cn('absolute flex h-6 items-center overflow-hidden rounded-md px-2 text-[11px] font-medium text-primary-foreground', tones[(it.tone ?? 0) % tones.length])}
                  style={{ top: row * 28 + 6, insetInlineStart: `${pct(s)}%`, width: `${((e - s) / span) * 100}%`, transformOrigin: 'left', transform: on ? 'scaleX(1)' : 'scaleX(0)', transition: `transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms` }}
                >
                  <span className="truncate">{it.label}</span>
                </div>
              ))}
              {now !== null && now >= t0 && now <= t1 && <span role="img" aria-label="Today" className="absolute inset-y-0 w-0.5 bg-destructive" style={{ insetInlineStart: `${pct(now)}%` }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
