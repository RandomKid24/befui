'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'ok' | 'warn' | 'bad' | 'info';
const tone: Record<Tone, string> = { ok: 'text-success', warn: 'text-warning', bad: 'text-destructive', info: 'text-info' };
const fill: Record<Tone, string> = { ok: 'bg-success', warn: 'bg-warning', bad: 'bg-destructive', info: 'bg-info' };

export interface Finding { title: string; detail?: string; tone: Tone; where?: string }
export interface AuditReportProps {
  title: string;
  period?: string;
  status?: { text: string; tone: Tone };
  rows: Finding[];
  className?: string;
}

/** Audit or review findings, each with a severity bar, a detail line and where it was found. */
export function AuditReport({ rows, ...frame }: AuditReportProps) {
  return (
    <Frame label="Audit findings" {...frame}>
      <ul className="divide-y">
        {rows.map((r) => (
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
