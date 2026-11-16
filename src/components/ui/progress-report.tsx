'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'ok' | 'warn' | 'bad' | 'info';
const tone: Record<Tone, string> = { ok: 'text-success', warn: 'text-warning', bad: 'text-destructive', info: 'text-info' };
const fill: Record<Tone, string> = { ok: 'bg-success', warn: 'bg-warning', bad: 'bg-destructive', info: 'bg-info' };

export interface ProgressRow { label: string; percent: number; note?: string; tone?: Tone }
export interface ProgressReportProps {
  title: string;
  period?: string;
  status?: { text: string; tone: Tone };
  rows: ProgressRow[];
  className?: string;
}

/** Bars toward done. A finished row turns green; set tone to flag one at risk. */
export function ProgressReport({ rows, ...frame }: ProgressReportProps) {
  return (
    <Frame label="Progress report" {...frame}>
      <ul className="grid gap-4">
        {rows.map((r) => {
          const p = Math.min(Math.max(r.percent, 0), 100);
          return (
            <li key={r.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-medium">{r.label}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{p}%</span>
              </div>
              <div role="progressbar" aria-label={r.label} aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={cn('h-full rounded-full', fill[r.tone ?? (p === 100 ? 'ok' : 'info')])} style={{ width: `${p}%` }} />
              </div>
              {r.note && <p className="mt-1 text-xs text-muted-foreground">{r.note}</p>}
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
