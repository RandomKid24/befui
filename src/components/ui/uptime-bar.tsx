'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface UptimeDay {
  /** Shown in the tooltip, e.g. "12 Oct". */
  date: string;
  status: 'up' | 'degraded' | 'down';
  /** What happened, shown in the tooltip for degraded and down days. */
  note?: string;
}

const tone = { up: 'bg-success', degraded: 'bg-warning', down: 'bg-destructive' };

/**
 * Status-page bar: one thin tick per day (or hour), green, amber or red, with the uptime percentage on top.
 * Ticks pop in left to right on scroll; hover a tick for its date and incident note. Use one per service.
 */
export function UptimeBar({ name, days, className }: { name: string; days: UptimeDay[]; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const up = days.filter((d) => d.status === 'up').length + days.filter((d) => d.status === 'degraded').length * 0.5;
  const pct = days.length ? (up / days.length) * 100 : 100;
  const now = days[days.length - 1]?.status ?? 'up';
  const d = hover === null ? null : days[hover]!;

  return (
    <div ref={ref} className={cn('grid gap-2', className)}>
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="flex items-center gap-2 font-medium"><span className={cn('size-2 rounded-full', tone[now])} />{name}</span>
        <span className="tabular-nums text-muted-foreground">{pct.toFixed(2)}% uptime</span>
      </div>
      <div className="relative" onMouseLeave={() => setHover(null)}>
        <div className="flex h-8 gap-[2px]" role="img" aria-label={`${name}: ${pct.toFixed(2)} percent uptime over ${days.length} days`}>
          {days.map((x, i) => (
            <span
              key={i}
              onMouseEnter={() => setHover(i)}
              className={cn('h-full min-w-0 flex-1 rounded-[3px] transition-[opacity,transform] hover:scale-y-110', tone[x.status])}
              style={{ opacity: on ? (hover !== null && hover !== i ? 0.5 : 1) : 0, transform: on ? undefined : 'scaleY(0.3)', transitionDuration: '400ms', transitionDelay: on && hover === null ? `${i * 9}ms` : '0ms' }}
            />
          ))}
        </div>
        {d && (
          <div className="pointer-events-none absolute -top-2 z-10 -translate-y-full whitespace-nowrap rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-lg" style={{ left: `${((hover! + 0.5) / days.length) * 100}%`, transform: `translate(${hover! > days.length / 2 ? '-100%' : '0'}, -100%)` }}>
            <p className="font-medium">{d.date}</p>
            <p className="text-muted-foreground">{d.note ?? (d.status === 'up' ? 'No incidents' : d.status)}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground"><span>{days.length} days ago</span><span>Today</span></div>
    </div>
  );
}
