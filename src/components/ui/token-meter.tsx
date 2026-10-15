'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/**
 * How much of a model's context window is used: a bar that turns amber past 70% and red past 90%, the counts, and an optional cost.
 * Pass `segments` (prompt, files, reply) to split the bar by what the tokens are.
 */
export function TokenMeter({
  used,
  limit,
  cost,
  segments,
  className,
}: {
  used: number;
  limit: number;
  /** Already formatted, e.g. "$0.04". */
  cost?: string;
  segments?: { label: string; tokens: number }[];
  className?: string;
}) {
  const pct = Math.min(100, (used / limit) * 100);
  const tone = pct > 90 ? 'bg-destructive' : pct > 70 ? 'bg-warning' : 'bg-primary';
  const shades = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning'];
  return (
    <div className={cn('grid gap-2 text-xs', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-foreground">Context</span>
        <span className="tabular-nums text-muted-foreground">{compact(used)} of {compact(limit)} tokens{cost ? ` · ${cost}` : ''}</span>
      </div>
      <div role="meter" aria-label="Context used" aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit} className="flex h-2 overflow-hidden rounded-full bg-secondary">
        {segments ? (
          segments.map((s, i) => <span key={s.label} className={cn('h-full transition-[width] duration-700 ease-out', shades[i % shades.length])} style={{ width: `${(s.tokens / limit) * 100}%` }} title={`${s.label}: ${compact(s.tokens)}`} />)
        ) : (
          <span className={cn('h-full rounded-full transition-[width,background-color] duration-700 ease-out', tone)} style={{ width: `${pct}%` }} />
        )}
      </div>
      {segments && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
          {segments.map((s, i) => <li key={s.label} className="flex items-center gap-1.5"><span className={cn('size-2 rounded-full', shades[i % shades.length])} />{s.label} {compact(s.tokens)}</li>)}
        </ul>
      )}
    </div>
  );
}
