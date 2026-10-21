'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface OutcomeSegment {
  label: string;
  value: number;
  /** Any text color class, e.g. 'text-success'. Defaults: first green, second red, then primary and warning. */
  color?: string;
}

const palette = ['text-success', 'text-destructive', 'text-primary', 'text-warning'];

/**
 * One thick rounded bar split in proportion (won and lost). `ghost` adds a pale piece for what is still open and is not counted in the headline.
 * The headline is the first segment's share of the counted segments (4 won, 17 lost = 19%) unless you pass your own. Every part keeps a minimum
 * width, so a tiny value is still a real chunk, and its count sits under it. The bar fills the card width and the text never gets cut.
 */
export function OutcomeBar({ segments, ghost, headline, headlineLabel, className }: { segments: OutcomeSegment[]; ghost?: { label: string; value: number }; headline?: React.ReactNode; headlineLabel?: string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const total = segments.reduce((a, s) => a + s.value, 0);
  const share = total ? Math.round(((segments[0]?.value ?? 0) / total) * 100) : 0;
  const parts = [...segments.map((s, i) => ({ ...s, color: s.color ?? palette[i % palette.length], ghost: false })), ...(ghost ? [{ ...ghost, color: 'text-muted-foreground', ghost: true }] : [])];
  return (
    <div ref={ref} className={cn('w-full', className)}>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight tabular-nums">{headline ?? `${share}%`}</span>
        {headlineLabel ? <span className="text-sm text-muted-foreground">{headlineLabel}</span> : null}
      </div>
      <div className="flex gap-1" role="img" aria-label={parts.map((p) => `${p.value} ${p.label}`).join(', ')}>
        {parts.map((p, i) => (
          <div key={p.label} className="min-w-[18%]" style={{ flex: `${p.value} 1 0` }}>
            <div className={cn('h-4 origin-left rounded-[3px]', p.color, i === 0 && 'rounded-l-full', i === parts.length - 1 && 'rounded-r-full')} style={{ background: p.ghost ? 'color-mix(in srgb, currentColor 18%, transparent)' : 'currentColor', transform: on ? 'scaleX(1)' : 'scaleX(0)', transition: `transform 800ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms` }} />
            <p className="mt-2 text-lg font-semibold leading-none tabular-nums">{p.value}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{p.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
