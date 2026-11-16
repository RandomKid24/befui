'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IncidentAction { action: string; owner: string; due: string; done?: boolean }
export interface IncidentReportProps extends ReportMeta {
  severity: 'SEV1' | 'SEV2' | 'SEV3';
  /** Short facts row: Duration, Detected by, Incident lead... */
  facts: { label: string; value: string }[];
  impact: string;
  cause: string;
  timeline: { time: string; text: string }[];
  actions?: IncidentAction[];
}

/** Post-incident report: severity, key facts, impact, root cause, a timeline and follow-up actions with owners and a done state. */
export function IncidentReport({ severity, facts, impact, cause, timeline, actions, ...meta }: IncidentReportProps) {
  const open = actions?.filter((a) => !a.done).length ?? 0;
  const sev = { SEV1: 'text-destructive', SEV2: 'text-warning', SEV3: 'text-muted-foreground' }[severity];
  return (
    <Sheet {...meta} footer={actions ? `${open} of ${actions.length} actions open` : undefined}>
      <div className="flex flex-wrap items-start gap-x-10 gap-y-4 border-b pb-6">
        <div><p className="text-xs text-muted-foreground">Severity</p><p className={cn('mt-1 font-mono text-xl font-semibold', sev)}>{severity}</p></div>
        {facts.map((f) => <div key={f.label}><p className="text-xs text-muted-foreground">{f.label}</p><p className="mt-1 font-medium">{f.value}</p></div>)}
      </div>
      <Section title="Impact"><p className="max-w-prose leading-relaxed">{impact}</p></Section>
      <Section title="Root cause"><p className="max-w-prose leading-relaxed">{cause}</p></Section>
      <Section title="Timeline">
        <ol className="grid gap-2">
          {timeline.map((t, i) => <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-3"><time className="font-mono text-xs leading-5 text-muted-foreground">{t.time}</time><span>{t.text}</span></li>)}
        </ol>
      </Section>
      {actions && (
        <Section title="Follow-up actions">
          <table className="w-full">
            <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Action</th><th className={cn(th, 'text-start')}>Owner</th><th className={cn(th, 'text-start')}>Due</th><th className={cn(th, 'text-end')}>State</th></tr></thead>
            <tbody>
              {actions.map((a) => (
                <tr key={a.action} className="border-b align-top">
                  <td className="py-2 pe-3">{a.action}</td><td className="py-2 pe-3">{a.owner}</td><td className="py-2 pe-3 text-muted-foreground">{a.due}</td>
                  <td className={cn('py-2 text-end text-xs font-semibold uppercase tracking-wide', a.done ? 'text-muted-foreground' : 'text-warning')}>{a.done ? 'Done' : 'Open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}
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
