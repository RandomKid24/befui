'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

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
    <ReportView {...meta} stats={[{ label: 'Health', value: <span className="capitalize">{health}</span>, tone: health === 'on track' ? 'good' : health === 'at risk' ? 'warn' : 'bad' }, { label: 'Milestones', value: `${done} / ${milestones.length}`, hint: 'done' }, ...(budget ? [{ label: 'Budget used', value: `${used}%`, hint: `${m(budget.spent)} of ${m(budget.total)}`, tone: used > 100 ? 'bad' as const : used > 85 ? 'warn' as const : undefined }] : []), ...(risks ? [{ label: 'Open risks', value: risks.length }] : [])]} footer={`${done} of ${milestones.length} milestones done`}>
      <ReportSection title="Summary"><p className="max-w-prose leading-relaxed">{summary}</p></ReportSection>
      <ReportSection flush title="Milestones">
        <table className="w-full">
          <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Milestone</th><th className={cn(th, 'text-start')}>Due</th><th className={cn(th, 'text-end')}>Status</th></tr></thead>
          <tbody>
            {milestones.map((x) => (
              <tr key={x.name} className="border-b">
                <td className="px-5 py-2.5">{x.name}</td>
                <td className="px-5 py-2.5 text-muted-foreground">{x.due}</td>
                <td className={cn('px-5 py-2.5 text-end text-xs font-semibold uppercase tracking-wide', x.state === 'done' ? 'text-muted-foreground' : healthTone[x.state])}>{x.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>
      {budget && (
        <ReportSection title="Budget">
          <div className="flex items-baseline justify-between"><span className="tabular-nums">{m(budget.spent)} of {m(budget.total)}</span><span className="font-mono text-xs text-muted-foreground">{used}% used</span></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary"><div className={cn('h-full rounded-full', used > 100 ? 'bg-destructive' : used > 85 ? 'bg-warning' : 'bg-primary')} style={{ width: `${Math.min(used, 100)}%` }} /></div>
        </ReportSection>
      )}
      {risks && risks.length > 0 && (
        <ReportSection flush title="Risks">
          <ul className="divide-y border-t">
            {risks.map((r) => (
              <li key={r.risk} className="px-5 py-2.5">
                <div className="flex items-baseline justify-between gap-3"><span className="font-medium">{r.risk}</span><span className={cn('text-xs font-semibold uppercase tracking-wide', lvl[r.level])}>{r.level}</span></div>
                <p className="text-xs text-muted-foreground">Owner: {r.owner}{r.plan ? `. ${r.plan}` : ''}</p>
              </li>
            ))}
          </ul>
        </ReportSection>
      )}
      {next && next.length > 0 && <ReportSection title="Next period"><ul className="list-disc ps-5">{next.map((n) => <li key={n}>{n}</li>)}</ul></ReportSection>}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
