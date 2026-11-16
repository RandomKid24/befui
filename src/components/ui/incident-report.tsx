'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

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
    <ReportView {...meta} stats={[{ label: 'Severity', value: severity, tone: severity === 'SEV1' ? 'bad' : severity === 'SEV2' ? 'warn' : undefined }, ...facts.map((f) => ({ label: f.label, value: f.value }))]} footer={actions ? `${open} of ${actions.length} actions open` : undefined}>
      <ReportSection title="Impact"><p className="max-w-prose leading-relaxed">{impact}</p></ReportSection>
      <ReportSection title="Root cause"><p className="max-w-prose leading-relaxed">{cause}</p></ReportSection>
      <ReportSection title="Timeline">
        <ol className="grid gap-2.5">
          {timeline.map((t, i) => <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-3"><time className="font-mono text-xs leading-5 text-muted-foreground">{t.time}</time><span>{t.text}</span></li>)}
        </ol>
      </ReportSection>
      {actions && (
        <ReportSection flush title="Follow-up actions">
          <table className="w-full">
            <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Action</th><th className={cn(th, 'text-start')}>Owner</th><th className={cn(th, 'text-start')}>Due</th><th className={cn(th, 'text-end')}>State</th></tr></thead>
            <tbody>
              {actions.map((a) => (
                <tr key={a.action} className="border-b align-top">
                  <td className="px-5 py-2.5">{a.action}</td><td className="px-5 py-2.5">{a.owner}</td><td className="px-5 py-2.5 text-muted-foreground">{a.due}</td>
                  <td className={cn('px-5 py-2.5 text-end text-xs font-semibold uppercase tracking-wide', a.done ? 'text-muted-foreground' : 'text-warning')}>{a.done ? 'Done' : 'Open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
