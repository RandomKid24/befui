'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from './icons';

type Tone = 'ok' | 'warn' | 'bad' | 'info';
const tone: Record<Tone, string> = { ok: 'text-success', warn: 'text-warning', bad: 'text-destructive', info: 'text-info' };
const fill: Record<Tone, string> = { ok: 'bg-success', warn: 'bg-warning', bad: 'bg-destructive', info: 'bg-info' };

export type ReportBody =
  | { kind: 'incident'; impact: string; cause?: string; timeline: { time: string; text: string }[] }
  | { kind: 'metrics'; rows: { label: string; value: string; /** Percent change. Positive is up. */ change?: number; /** Set when a drop is the good direction (errors, cost). */ lowerIsBetter?: boolean }[] }
  | { kind: 'progress'; rows: { label: string; percent: number; note?: string; tone?: Tone }[] }
  | { kind: 'findings'; rows: { title: string; detail?: string; tone: Tone; where?: string }[] };

export type ReportProps = ReportBody & {
  title: string;
  /** Period or date line under the title. */
  period?: string;
  /** Short verdict shown top right, e.g. "Resolved" or "3 open". */
  status?: { text: string; tone: Tone };
  className?: string;
};

const label = { incident: 'Incident report', metrics: 'Metrics report', progress: 'Progress report', findings: 'Audit findings' } as const;

/**
 * One report frame, four kinds of body: incident (impact, cause, timeline), metrics (values with change), progress
 * (bars toward done) and findings (audit list with severity). Same header and rhythm, so a page of mixed reports reads as one set.
 */
export function Report({ title, period, status, className, ...body }: ReportProps) {
  return (
    <article className={cn('rounded-xl border bg-card text-card-foreground', className)}>
      <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label[body.kind]}</p>
          <h3 className="mt-0.5 text-base font-semibold">{title}</h3>
          {period && <p className="text-xs text-muted-foreground">{period}</p>}
        </div>
        {status && <p className={cn('flex shrink-0 items-center gap-1.5 text-sm font-medium', tone[status.tone])}><span aria-hidden className={cn('size-2 rounded-full', fill[status.tone])} />{status.text}</p>}
      </header>
      <div className="px-5 py-4 text-sm">{render(body as ReportBody)}</div>
    </article>
  );
}

function render(b: ReportBody) {
  switch (b.kind) {
    case 'incident':
      return (
        <div className="grid gap-4">
          <dl className="grid gap-3">
            <div><dt className="text-xs text-muted-foreground">Impact</dt><dd className="mt-0.5">{b.impact}</dd></div>
            {b.cause && <div><dt className="text-xs text-muted-foreground">Cause</dt><dd className="mt-0.5">{b.cause}</dd></div>}
          </dl>
          <ol className="relative grid gap-3 border-s ps-4">
            {b.timeline.map((t, i) => (
              <li key={i} className="relative">
                <span aria-hidden className="absolute -start-[21px] top-1.5 size-2 rounded-full bg-border ring-4 ring-card" />
                <time className="font-mono text-xs text-muted-foreground">{t.time}</time>
                <p>{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      );
    case 'metrics':
      return (
        <ul className="divide-y">
          {b.rows.map((r) => {
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
      );
    case 'progress':
      return (
        <ul className="grid gap-4">
          {b.rows.map((r) => {
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
      );
    case 'findings':
      return (
        <ul className="divide-y">
          {b.rows.map((r) => (
            <li key={r.title} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span aria-hidden className={cn('mt-1.5 h-4 w-1 shrink-0 rounded-sm', fill[r.tone])} />
              <div className="min-w-0">
                <p className="font-medium">{r.title}</p>
                {r.detail && <p className="text-muted-foreground">{r.detail}</p>}
                {r.where && <p className="mt-0.5 font-mono text-xs text-muted-foreground">{r.where}</p>}
              </div>
            </li>
          ))}
        </ul>
      );
  }
}
