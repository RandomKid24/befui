'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

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
    <ReportView {...meta} stats={order.map((s) => ({ label: s[0]!.toUpperCase() + s.slice(1), value: findings.filter((f) => f.severity === s).length, tone: findings.some((f) => f.severity === s) ? (s === 'critical' || s === 'major' ? 'bad' as const : s === 'minor' ? 'warn' as const : undefined) : undefined }))} footer={auditor ? `Audited by ${auditor}` : `${findings.length} findings`}>
      <ReportSection title="Scope and opinion">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:gap-10">
          <p className="max-w-prose leading-relaxed">{scope}</p>
          <p className="text-base font-semibold">{opinion}</p>
        </div>
      </ReportSection>
      <ReportSection flush title="Findings">
        <ol className="divide-y border-t">
          {sorted.map((f) => (
            <li key={f.ref} className="grid grid-cols-[3.5rem_1fr] gap-3 px-5 py-4">
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
      </ReportSection>
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
