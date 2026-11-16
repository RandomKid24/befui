'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PrinterIcon } from './icons';

export interface ReportMeta {
  organization: string;
  title: string;
  /** e.g. "1 to 31 October 2026" */
  period: string;
  /** Report number or reference. */
  number?: string;
  generated?: string;
  className?: string;
}

export interface ReportStat {
  label: string;
  value: React.ReactNode;
  /** Small line under the value, e.g. "+4.2% vs September". */
  hint?: React.ReactNode;
  tone?: 'good' | 'warn' | 'bad';
}

const tones = { good: 'text-success', warn: 'text-warning', bad: 'text-destructive' };

/**
 * The frame every befui report shares, laid out the way a report screen in an app looks: a toolbar with the title, period and a print
 * button, a strip of headline numbers, then sections of tables that run edge to edge, and a footer line. Pass `actions` to replace the print button.
 */
export function ReportView({ organization, title, period, number, generated, stats, actions, footer, className, children }: ReportMeta & { stats?: ReportStat[]; actions?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className={cn('mx-auto w-full max-w-4xl overflow-hidden rounded-lg border bg-card text-[13px] text-card-foreground shadow-sm print:border-0 print:shadow-none', className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{organization}{number && <span className="font-mono"> · {number}</span>}</p>
          <h2 className="truncate text-base font-semibold tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border bg-muted/40 px-2.5 py-1 text-xs tabular-nums">{period}</span>
          {actions ?? (
            <button type="button" onClick={() => window.print()} className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-accent print:hidden">
              <PrinterIcon className="size-3.5" />Print
            </button>
          )}
        </div>
      </header>
      {stats && stats.length > 0 && (
        <dl className="grid grid-cols-2 divide-x divide-y border-b sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] sm:divide-y-0 [&>div]:px-5 [&>div]:py-3.5">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className={cn('mt-1 text-lg font-semibold leading-none tabular-nums', s.tone && tones[s.tone])}>{s.value}</dd>
              {s.hint && <dd className="mt-1.5 text-xs text-muted-foreground">{s.hint}</dd>}
            </div>
          ))}
        </dl>
      )}
      <div className="divide-y">{children}</div>
      <footer className="flex flex-wrap justify-between gap-x-4 border-t bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
        <span>{footer}</span>
        {generated && <span>Generated {generated}</span>}
      </footer>
    </article>
  );
}

/** A titled block inside a ReportView. Its content is padded; pass `flush` for a table that should run edge to edge. */
export function ReportSection({ title, aside, flush, children }: { title: string; aside?: React.ReactNode; flush?: boolean; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 px-5 pb-3 pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
      </div>
      <div className={cn(!flush && 'px-5 pb-5')}>{children}</div>
    </section>
  );
}

/** Table cell classes shared by the reports: `rv.th`, `rv.num` (right aligned figures). */
export const rv = {
  th: 'h-8 px-5 text-[11px]',
  td: 'px-5 py-2.5',
  num: 'text-end tabular-nums',
};
