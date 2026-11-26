'use client';

import * as React from 'react';
import { Button } from './button';
import { formatCurrency } from './format';
import { CheckIcon, XIcon } from './icons';
import { cn } from '@/lib/utils';

export type ChallengeDay = 'kept' | 'missed';

/** Current run ending today (or yesterday, if today is not checked in yet), the longest run, and days kept. */
export function challengeStats(days: (ChallengeDay | undefined)[], today: number) {
  let best = 0, run = 0;
  for (const d of days.slice(0, today)) {
    run = d === 'kept' ? run + 1 : 0;
    best = Math.max(best, run);
  }
  let streak = 0;
  for (let i = days[today - 1] ? today - 1 : today - 2; i >= 0 && days[i] === 'kept'; i--) streak++;
  return { streak, best, kept: days.slice(0, today).filter((d) => d === 'kept').length };
}

/** A day-by-day challenge: a numbered grid, streaks, money saved and a check-in for today. */
export function ChallengeTracker({ title, days, today, onCheckIn, savedPerDay, currency, locale, className }: {
  title: string;
  /** One entry per day of the challenge; leave undefined until checked in. */
  days: (ChallengeDay | undefined)[];
  /** Today's day number, starting at 1. */
  today: number;
  /** Called with undefined to undo today's check-in. */
  onCheckIn: (result: ChallengeDay | undefined) => void;
  /** Shows money saved: this much for every day kept. */
  savedPerDay?: number;
  currency?: string;
  locale?: string;
  className?: string;
}) {
  const { streak, best, kept } = challengeStats(days, today);
  const done = days[today - 1];
  const stats: [string, string][] = [
    ['Current streak', `${streak} ${streak === 1 ? 'day' : 'days'}`],
    ['Best streak', `${best} ${best === 1 ? 'day' : 'days'}`],
    ...(savedPerDay === undefined ? [] : [['Saved', formatCurrency(kept * savedPerDay, { currency, locale })] as [string, string]]),
  ];
  return (
    <section aria-label={title} className={cn('w-full max-w-md rounded-xl border bg-card p-5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm tabular-nums text-muted-foreground">Day <span className="text-2xl font-semibold text-foreground">{today}</span> of {days.length}</p>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 border-y py-3">
        {stats.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="text-lg font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <ol className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const n = i + 1;
          const state = d ?? (n > today ? 'ahead' : n === today ? 'today' : 'not checked in');
          return (
            <li key={n} aria-label={`Day ${n}: ${state}`} aria-current={n === today ? 'date' : undefined} className={cn('grid aspect-square place-items-center rounded-md border text-xs tabular-nums', d === 'kept' && 'border-success bg-success text-background', d === 'missed' && 'border-destructive text-destructive', !d && n > today && 'border-dashed text-muted-foreground', n === today && 'ring-2 ring-ring ring-offset-2 ring-offset-card')}>
              <span aria-hidden>{d === 'kept' ? <CheckIcon className="size-3.5 motion-safe:animate-pop" /> : d === 'missed' ? <XIcon className="size-3.5" /> : n}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {done ? (
          <>
            <p role="status" className="me-auto text-sm">{done === 'kept' ? 'Today is checked in.' : 'Today is marked as missed.'}</p>
            <Button variant="ghost" size="sm" onClick={() => onCheckIn(undefined)}>Undo</Button>
          </>
        ) : (
          <>
            <Button onClick={() => onCheckIn('kept')}><CheckIcon /> I kept it today</Button>
            <Button variant="outline" onClick={() => onCheckIn('missed')}>I missed it</Button>
          </>
        )}
      </div>
    </section>
  );
}
