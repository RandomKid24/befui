'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from './icons';
export type Tone = 'ok' | 'warn' | 'bad' | 'info';
const tone: Record<Tone, string> = { ok: 'text-success', warn: 'text-warning', bad: 'text-destructive', info: 'text-info' };
const fill: Record<Tone, string> = { ok: 'bg-success', warn: 'bg-warning', bad: 'bg-destructive', info: 'bg-info' };

export interface MetricRow {
  label: string;
  value: string;
  /** Percent change. Positive is up. */
  change?: number;
  /** Set when a drop is the good direction (errors, cost). */
  lowerIsBetter?: boolean;
}
export interface MetricsReportProps {
  title: string;
  period?: string;
  status?: { text: string; tone: Tone };
  rows: MetricRow[];
  className?: string;
}

/** Values with their change since last period, coloured by whether the move is good. */
export function MetricsReport({ rows, ...frame }: MetricsReportProps) {
  return (
    <Frame label="Metrics report" {...frame}>
      <ul className="divide-y">
        {rows.map((r) => {
          const good = r.change === undefined ? undefined : (r.change >= 0) !== !!r.lowerIsBetter;
          const Arrow = (r.change ?? 0) >= 0 ? ArrowUpIcon : ArrowDownIcon;
          return (
            <li key={r.label} className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-base font-semibold tabular-nums">{r.value}</span>
                {r.change !== undefined && (
                  <span className={cn('flex w-16 items-center justify-end gap-0.5 text-xs tabular-nums', good ? 'text-success' : 'text-destructive')}>
                    <Arrow className="size-3" />{Math.abs(r.change)}%
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}

function Frame({ label, title, period, status, className, children }: { label: string; title: string; period?: string; status?: { text: string; tone: Tone }; className?: string; children: React.ReactNode }) {
  return (
    <article className={cn('rounded-xl border bg-card text-card-foreground', className)}>
      <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <h3 className="mt-0.5 text-base font-semibold">{title}</h3>
          {period && <p className="text-xs text-muted-foreground">{period}</p>}
        </div>
        {status && <p className={cn('flex shrink-0 items-center gap-1.5 text-sm font-medium', tone[status.tone])}><span aria-hidden className={cn('size-2 rounded-full', fill[status.tone])} />{status.text}</p>}
      </header>
      <div className="px-5 py-4 text-sm">{children}</div>
    </article>
  );
}
