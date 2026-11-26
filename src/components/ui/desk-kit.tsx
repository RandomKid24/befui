'use client';

import * as React from 'react';
import { Sparkline, useChartIn } from './charts';
import { glass } from './floating-shell';
import { CountText } from './number-ticker';
import { cn } from '@/lib/utils';

/** Large page greeting with a one-line summary, a short accent rule that draws in, and actions on the right. */
export function DeskHeader({ title, summary, actions, className }: { title: string; summary?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  return (
    <div ref={ref} className={cn('flex flex-wrap items-end justify-between gap-3 px-1 pt-2', className)}>
      <div className="min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight">
          {/* each word rises out of its own mask; keyed on the title so a page change plays it again */}
          {title.split(' ').map((word, i) => (
            <React.Fragment key={`${title}${i}`}>
              {i > 0 && ' '}
              <span className="-mb-1 inline-block overflow-hidden pb-1 align-bottom"><span className="inline-block motion-safe:animate-title" style={{ animationDelay: `${i * 70}ms` }}>{word}</span></span>
            </React.Fragment>
          ))}
        </h1>
        <span aria-hidden className={cn('mt-1 block h-1 w-16 origin-left rounded-sm bg-primary transition-transform duration-(--dur-slow) motion-reduce:transition-none', on ? 'scale-x-100' : 'scale-x-0')} />
        {summary && <p className="mt-2 text-sm text-muted-foreground">{summary}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** One headline number. `hero` fills it with the primary colour; give the first tile of a row that. */
export function StatTile({ label, value, note, trend, hero, className }: { label: string; value: React.ReactNode; note?: React.ReactNode; trend?: number[]; hero?: boolean; className?: string }) {
  return (
    <div className={cn(glass, 'flex min-w-0 flex-col justify-between gap-3 p-4', hero && 'border-transparent bg-primary text-primary-foreground', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className={cn('text-xs font-medium', !hero && 'text-muted-foreground')}>{label}</p>
        {/* beside the label, so a long number never has to share its line */}
        {trend && <Sparkline data={trend} className={cn('h-7 w-16 shrink-0', hero ? 'text-primary-foreground' : 'text-primary')} />}
      </div>
      <div>
        <p className="break-words text-2xl font-semibold tracking-tight tabular-nums xl:text-3xl">{typeof value === 'string' || typeof value === 'number' ? <CountText>{value}</CountText> : value}</p>
        {note && <p className={cn('mt-0.5 text-xs', !hero && 'text-muted-foreground')}>{note}</p>}
      </div>
    </div>
  );
}

/** Rounded bars on faint tracks. One is filled and labelled; point at or focus another to move the label to it. */
export function CapsuleBars({ data, label, highlight = data.reduce((last, d, i) => (d.pending ? last : i), 0), format = String, height = 220, className }: {
  /** Mark a bar `pending` when there is nothing to show for it yet (a day still to come): it is drawn hatched. */
  data: { label: string; value: number; pending?: boolean }[];
  /** What the chart shows, for screen readers. */
  label: string;
  highlight?: number;
  format?: (n: number) => string;
  height?: number;
  className?: string;
}) {
  const [ref, on] = useChartIn<HTMLUListElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const active = hover ?? highlight;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul ref={ref} aria-label={label} className={cn('flex items-stretch justify-between gap-1.5 pt-8', className)} style={{ height }} onMouseLeave={() => setHover(null)}>
      {data.map((d, i) => (
        <li key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          {d.pending ? (
            <span role="img" aria-label={`${d.label}: no data yet`} className="w-full max-w-9 flex-1 rounded-lg border border-foreground/10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, color-mix(in srgb, var(--foreground) 14%, transparent) 0 2px, transparent 2px 7px)' }} />
          ) : (
            <button type="button" aria-label={`${d.label}: ${format(d.value)}`} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} className="relative w-full max-w-9 flex-1 rounded-lg bg-foreground/5 outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span aria-hidden className={cn('absolute inset-x-0 bottom-0 rounded-lg transition-[height,background-color] duration-(--dur-slow) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none', i === active ? 'bg-primary' : 'bg-primary/35')} style={{ height: on ? `${(d.value / max) * 100}%` : 0, transitionDelay: hover === null ? `${i * 40}ms` : '0ms' }} />
              {i === active && <span aria-hidden className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-semibold tabular-nums text-background shadow-md" style={{ bottom: `calc(${(d.value / max) * 100}% + 6px)` }}>{format(d.value)}</span>}
            </button>
          )}
          <span aria-hidden className="max-w-full truncate text-[11px] text-muted-foreground">{d.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** A dial made of short ticks that light up to the value, with the number in the middle. */
export function TickDial({ value, min = 0, max = 100, label, display, ticks = 48, size = 200, className }: { value: number; min?: number; max?: number; label: string; display?: React.ReactNode; ticks?: number; size?: number; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const share = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const lit = on ? Math.round(share * ticks) : 0;
  return (
    <div ref={ref} role="meter" aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={Math.min(max, Math.max(min, value))} className={cn('relative mx-auto', className)} style={{ width: size, height: size }}>
      <svg aria-hidden viewBox="0 0 200 200" className="size-full">
        {Array.from({ length: ticks }, (_, i) => (
          // a 270 degree sweep, open at the bottom
          <line key={i} x1="100" y1="12" x2="100" y2="32" strokeWidth="4" strokeLinecap="round" transform={`rotate(${-135 + (i / (ticks - 1)) * 270} 100 100)`} className={cn('transition-[stroke] motion-reduce:transition-none', i < lit ? 'stroke-primary' : 'stroke-foreground/15')} style={{ transitionDelay: `${i * 12}ms` }} />
        ))}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="text-4xl font-semibold tracking-tight tabular-nums">{display ?? value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
