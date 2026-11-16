'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const BARS = 36;

/**
 * Updater card: app name and target version, a large monospace percent, a status line, a segmented bar, and a step row
 * (fetch, apply, reopen) where finished steps are filled and the current one is outlined. You drive it with `step` and `value`.
 * Pass `onHide` to show the Hide button under the card.
 */
export function UpdateProgress({ name, version, steps = ['fetch', 'apply', 'reopen'], step, value, message, onHide, className }: {
  name: string;
  version: string;
  steps?: string[];
  /** Index of the current step. */
  step: number;
  /** Progress of the current step, 0 to 100. */
  value: number;
  message?: string;
  onHide?: () => void;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  const lit = Math.round((pct / 100) * BARS);
  return (
    <div role="status" aria-live="polite" aria-label={`${name} update, ${steps[step] ?? ''} ${pct}%`} className={cn('relative w-[27rem] max-w-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      <span aria-hidden className="absolute inset-y-4 left-0 w-0.5 bg-primary" />
      <div className="grid gap-5 px-6 pb-5 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-lg text-muted-foreground">{name} <span aria-hidden>→</span> <span className="text-primary">{version}</span></p>
          <span className="font-mono text-sm text-muted-foreground">{steps[step]}</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <p className="font-mono leading-none"><span className="text-6xl tabular-nums">{String(pct).padStart(2, '0')}</span><span className="ml-2 text-sm text-muted-foreground">%</span></p>
          <p className="pb-1 text-right text-sm text-muted-foreground">{message}</p>
        </div>
        <div aria-hidden className="flex h-8 items-end justify-between gap-[3px]">
          {Array.from({ length: BARS }, (_, i) => (
            <span key={i} style={{ height: `${55 + ((i * 7) % 5) * 11}%` }} className={cn('flex-1 rounded-[1px] motion-safe:transition-colors motion-safe:duration-(--dur-base)', i < lit ? 'bg-primary' : 'bg-foreground/10')} />
          ))}
        </div>
        <ol className="flex justify-between font-mono text-sm">
          {steps.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined} className={cn('flex items-center gap-2.5', i === step ? 'text-foreground' : 'text-muted-foreground')}>
              <span aria-hidden className={cn('grid size-4 place-content-center', i === step && 'rounded-[2px] border border-primary')}>
                <span className={cn('size-2', i <= step ? 'bg-foreground' : 'bg-foreground/30')} />
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      {onHide && (
        <button type="button" onClick={onHide} className="w-full border-t py-3.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">Hide</button>
      )}
    </div>
  );
}
