'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'ok' | 'warn' | 'bad' | 'info';
const tone: Record<Tone, string> = { ok: 'text-success', warn: 'text-warning', bad: 'text-destructive', info: 'text-info' };
const fill: Record<Tone, string> = { ok: 'bg-success', warn: 'bg-warning', bad: 'bg-destructive', info: 'bg-info' };

export interface IncidentReportProps {
  title: string;
  period?: string;
  status?: { text: string; tone: Tone };
  impact: string;
  cause?: string;
  timeline: { time: string; text: string }[];
  className?: string;
}

/** What broke, who it hit, why, and a timeline of what happened. */
export function IncidentReport({ impact, cause, timeline, ...frame }: IncidentReportProps) {
  return (
    <Frame label="Incident report" {...frame}>
      <div className="grid gap-4">
        <dl className="grid gap-3">
          <div><dt className="text-xs text-muted-foreground">Impact</dt><dd className="mt-0.5">{impact}</dd></div>
          {cause && <div><dt className="text-xs text-muted-foreground">Cause</dt><dd className="mt-0.5">{cause}</dd></div>}
        </dl>
        <ol className="relative grid gap-3 border-s ps-4">
          {timeline.map((t, i) => (
            <li key={i} className="relative">
              <span aria-hidden className="absolute -start-[21px] top-1.5 size-2 rounded-full bg-border ring-4 ring-card" />
              <time className="font-mono text-xs text-muted-foreground">{t.time}</time>
              <p>{t.text}</p>
            </li>
          ))}
        </ol>
      </div>
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
