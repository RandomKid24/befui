'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AgendaEvent {
  id: string;
  title: string;
  /** 24-hour "HH:MM". */
  start: string;
  end: string;
  location?: string;
  /** Any text color class for the accent bar. Defaults to primary. */
  color?: string;
}

const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return h! * 60 + (m ?? 0); };
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/**
 * One day as a time grid: events sit at their start time with height for their length, and overlapping events share the width side by side
 * (a calendar day view, a doctor's or room schedule). Pass `now` ("HH:MM") for a red now-line. Events slide in on first render;
 * `onSelect` makes them clickable. Scroll the frame by giving it a `height`.
 */
export function DayAgenda({ events, startHour = 8, endHour = 19, hourHeight = 56, now, onSelect, height, className }: { events: AgendaEvent[]; startHour?: number; endHour?: number; hourHeight?: number; now?: string; onSelect?: (e: AgendaEvent) => void; height?: number | string; className?: string }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const top = (m: number) => ((m - startHour * 60) / 60) * hourHeight;

  // give overlapping events their own column
  const laid = React.useMemo(() => {
    const sorted = [...events].sort((a, b) => mins(a.start) - mins(b.start) || mins(b.end) - mins(a.end));
    const cols: number[] = [];
    const out = sorted.map((e) => {
      let c = cols.findIndex((end) => end <= mins(e.start));
      if (c < 0) c = cols.length;
      cols[c] = mins(e.end);
      return { e, c };
    });
    // each event spreads over the columns used by the events it overlaps
    return out.map(({ e, c }) => ({ e, c, n: Math.max(...out.filter((o) => mins(o.e.start) < mins(e.end) && mins(o.e.end) > mins(e.start)).map((o) => o.c)) + 1 }));
  }, [events]);

  return (
    <div className={cn('overflow-y-auto rounded-xl border bg-card', className)} style={{ height }}>
      <div className="relative ml-12 mr-2 mt-3 mb-3" style={{ height: (endHour - startHour) * hourHeight }}>
        {hours.map((h) => (
          <div key={h} className="absolute inset-x-0 border-t border-border/70" style={{ top: top(h * 60) }}>
            <span className="absolute -left-11 -top-2 w-9 text-right text-[11px] tabular-nums text-muted-foreground">{fmt(h * 60)}</span>
          </div>
        ))}
        {laid.map(({ e, c, n }, i) => {
          const s = mins(e.start), end = mins(e.end);
          const short = (end - s) / 60 * hourHeight < 44;
          return (
            <button
              key={e.id}
              type="button"
              disabled={!onSelect}
              onClick={() => onSelect?.(e)}
              className={cn('absolute overflow-hidden rounded-lg border bg-card p-0 text-left outline-none transition-[opacity,transform,box-shadow] duration-500 focus-visible:ring-2 focus-visible:ring-ring/50', onSelect ? 'cursor-pointer hover:shadow-md' : 'cursor-default', e.color ?? 'text-primary')}
              style={{ top: top(s) + 1, height: Math.max(top(end) - top(s) - 2, 20), left: `calc(${(c / n) * 100}% + 2px)`, width: `calc(${100 / n}% - 4px)`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transitionDelay: `${i * 60}ms` }}
            >
              <span aria-hidden className="absolute inset-0 bg-current opacity-10" />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-current" />
              <span className={cn('relative flex h-full gap-x-2 pl-3 pr-2 text-foreground', short ? 'items-center' : 'flex-col justify-start py-1.5')}>
                <span className="truncate text-[13px] font-medium">{e.title}</span>
                <span className="truncate text-[11px] text-muted-foreground">{e.start} to {e.end}{e.location && !short ? ` · ${e.location}` : ''}</span>
              </span>
            </button>
          );
        })}
        {now && mins(now) >= startHour * 60 && mins(now) <= endHour * 60 && (
          <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: top(mins(now)) }} role="img" aria-label={`Now, ${now}`}>
            <span className="-ml-1 size-2 rounded-full bg-destructive" />
            <span className="h-px flex-1 bg-destructive" />
          </div>
        )}
      </div>
    </div>
  );
}
