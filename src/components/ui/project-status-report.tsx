'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type Health = 'on track' | 'at risk' | 'off track';
const healthTone: Record<Health, string> = { 'on track': 'text-success', 'at risk': 'text-warning', 'off track': 'text-destructive' };
const healthBg: Record<Health, string> = { 'on track': 'bg-success', 'at risk': 'bg-warning', 'off track': 'bg-destructive' };

export interface Milestone { name: string; due: string; state: 'done' | Health }
export interface Risk { risk: string; level: 'high' | 'medium' | 'low'; owner: string; plan?: string }
export interface ProjectStatusReportProps extends ReportMeta {
  health: Health;
  summary: string;
  milestones: Milestone[];
  /** Budget spent and total, in the currency below. */
  budget?: { spent: number; total: number };
  risks?: Risk[];
  next?: string[];
  currency?: string;
  locale?: string;
}

/** Weekly or monthly project status: overall health, summary, milestones with state, budget burn, risks with owners and next steps. */
export function ProjectStatusReport({ health, summary, milestones, budget, risks, next, currency = 'INR', locale = 'en-IN', ...meta }: ProjectStatusReportProps) {
  const m = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const done = milestones.filter((x) => x.state === 'done').length;
  const used = budget ? Math.round((budget.spent / budget.total) * 100) : 0;
  const lvl = { high: 'text-destructive', medium: 'text-warning', low: 'text-muted-foreground' } as const;
  return (
    <Sheet {...meta} footer={`${done} of ${milestones.length} milestones done`}>
      <div className="flex items-start gap-4 border-b pb-6">
        <p className={cn('flex shrink-0 items-center gap-2 text-base font-semibold capitalize', healthTone[health])}><span aria-hidden className={cn('size-3', healthBg[health])} />{health}</p>
        <p className="max-w-prose leading-relaxed">{summary}</p>
      </div>
      <Section title="Milestones">
        <table className="w-full">
          <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Milestone</th><th className={cn(th, 'text-start')}>Due</th><th className={cn(th, 'text-end')}>Status</th></tr></thead>
          <tbody>
            {milestones.map((x) => (
              <tr key={x.name} className="border-b">
                <td className="py-2">{x.name}</td>
                <td className="py-2 text-muted-foreground">{x.due}</td>
                <td className={cn('py-2 text-end text-xs font-semibold uppercase tracking-wide', x.state === 'done' ? 'text-muted-foreground' : healthTone[x.state])}>{x.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      {budget && (
        <Section title="Budget">
          <div className="flex items-baseline justify-between"><span className="tabular-nums">{m(budget.spent)} of {m(budget.total)}</span><span className="font-mono text-xs text-muted-foreground">{used}% used</span></div>
          <div className="mt-1.5 h-2 bg-muted"><div className={cn('h-full', used > 100 ? 'bg-destructive' : used > 85 ? 'bg-warning' : 'bg-foreground')} style={{ width: `${Math.min(used, 100)}%` }} /></div>
        </Section>
      )}
      {risks && risks.length > 0 && (
        <Section title="Risks">
          <ul className="divide-y border-y">
            {risks.map((r) => (
              <li key={r.risk} className="py-2.5">
                <div className="flex items-baseline justify-between gap-3"><span className="font-medium">{r.risk}</span><span className={cn('text-xs font-semibold uppercase tracking-wide', lvl[r.level])}>{r.level}</span></div>
                <p className="text-xs text-muted-foreground">Owner: {r.owner}{r.plan ? `. ${r.plan}` : ''}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {next && next.length > 0 && <Section title="Next period"><ul className="list-disc ps-5">{next.map((n) => <li key={n}>{n}</li>)}</ul></Section>}
    </Sheet>
  );
}

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

function Sheet({ organization, title, period, number, generated, className, children, footer }: ReportMeta & { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <article className={cn('mx-auto w-full max-w-3xl rounded-lg border bg-card p-6 text-sm text-card-foreground shadow-sm sm:p-10 print:border-0 print:shadow-none', className)}>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{organization}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        </div>
        <dl className="text-end text-xs text-muted-foreground">
          <dd className="font-medium text-foreground">{period}</dd>
          {number && <dd className="font-mono">{number}</dd>}
        </dl>
      </header>
      <div className="grid gap-8 py-6">{children}</div>
      <footer className="flex justify-between gap-4 border-t pt-3 text-xs text-muted-foreground">
        <span>{footer}</span>
        {generated && <span>Generated {generated}</span>}
      </footer>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

const th = 'py-2 text-xs font-medium text-muted-foreground';
