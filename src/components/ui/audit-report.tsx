'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type AuditSeverity = 'critical' | 'major' | 'minor' | 'note';
export interface AuditFinding { ref: string; title: string; severity: AuditSeverity; detail: string; recommendation?: string; /** Where it was found. */ where?: string }
export interface AuditReportProps extends ReportMeta {
  scope: string;
  /** Overall opinion, e.g. "Satisfactory with exceptions". */
  opinion: string;
  findings: AuditFinding[];
  auditor?: string;
}

const tone: Record<AuditSeverity, string> = { critical: 'text-destructive', major: 'text-destructive', minor: 'text-warning', note: 'text-muted-foreground' };
const order: AuditSeverity[] = ['critical', 'major', 'minor', 'note'];

/** Audit report: scope, overall opinion, a count of findings by severity, then each finding with its reference, evidence and recommendation, worst first. */
export function AuditReport({ scope, opinion, findings, auditor, ...meta }: AuditReportProps) {
  const sorted = [...findings].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
  return (
    <Sheet {...meta} footer={auditor ? `Audited by ${auditor}` : `${findings.length} findings`}>
      <div className="grid gap-6 border-b pb-6 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-3">
          <div><p className="text-xs text-muted-foreground">Scope</p><p className="mt-1 max-w-prose leading-relaxed">{scope}</p></div>
          <div><p className="text-xs text-muted-foreground">Opinion</p><p className="mt-1 text-base font-semibold">{opinion}</p></div>
        </div>
        <dl className="grid grid-cols-4 gap-5 text-end sm:self-start">
          {order.map((s) => <div key={s}><dd className={cn('font-mono text-2xl font-semibold tabular-nums', findings.some((f) => f.severity === s) ? tone[s] : 'text-muted-foreground/40')}>{findings.filter((f) => f.severity === s).length}</dd><dt className="text-[11px] capitalize text-muted-foreground">{s}</dt></div>)}
        </dl>
      </div>
      <Section title="Findings">
        <ol className="divide-y border-y">
          {sorted.map((f) => (
            <li key={f.ref} className="grid grid-cols-[3.5rem_1fr] gap-3 py-4">
              <span className="font-mono text-xs leading-5 text-muted-foreground">{f.ref}</span>
              <div>
                <div className="flex items-baseline justify-between gap-3"><p className="font-medium">{f.title}</p><span className={cn('shrink-0 text-xs font-semibold uppercase tracking-wide', tone[f.severity])}>{f.severity}</span></div>
                <p className="mt-1 max-w-prose leading-relaxed text-muted-foreground">{f.detail}</p>
                {f.recommendation && <p className="mt-2 max-w-prose leading-relaxed"><span className="font-medium">Recommendation. </span>{f.recommendation}</p>}
                {f.where && <p className="mt-1 font-mono text-xs text-muted-foreground">{f.where}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Section>
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
