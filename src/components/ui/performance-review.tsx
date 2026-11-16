'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

export interface ReviewGoal { goal: string; /** 1 to 5. */ rating: number; comment?: string }
export interface ReviewCompetency { name: string; rating: number }
export interface PerformanceReviewProps extends ReportMeta {
  employee: { name: string; role: string; manager: string; tenure?: string };
  goals: ReviewGoal[];
  competencies?: ReviewCompetency[];
  strengths?: string[];
  improvements?: string[];
  /** Next-period goals. */
  next?: string[];
  /** Verdict line, e.g. "Meets expectations". */
  outcome: string;
}

const labels = ['', 'Needs improvement', 'Below expectations', 'Meets expectations', 'Exceeds expectations', 'Outstanding'];

/** Individual review: goals scored 1 to 5 with comments, competency scores, strengths, areas to improve, next goals, and an overall score worked out from the goals. */
export function PerformanceReview({ employee, goals, competencies, strengths, improvements, next, outcome, ...meta }: PerformanceReviewProps) {
  const avg = goals.length ? goals.reduce((s, g) => s + g.rating, 0) / goals.length : 0;
  const Dots = ({ n }: { n: number }) => (
    <span role="img" aria-label={`${n} of 5`} className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} aria-hidden className={cn('size-2 rounded-full', i <= n ? 'bg-primary' : 'bg-secondary')} />)}
    </span>
  );
  const list = (title: string, items?: string[]) => items?.length ? <ReportSection title={title}><ul className="list-disc ps-5 leading-relaxed">{items.map((x) => <li key={x}>{x}</li>)}</ul></ReportSection> : null;
  return (
    <ReportView {...meta} stats={[{ label: 'Overall score', value: `${avg.toFixed(1)} / 5`, hint: outcome }, { label: 'Employee', value: employee.name, hint: employee.role }, { label: 'Manager', value: employee.manager }, ...(employee.tenure ? [{ label: 'Tenure', value: employee.tenure }] : [])]} footer="Confidential. Shared with the employee, manager and HR only.">
      <ReportSection flush title="Goals" aside={`Average of ${goals.length} goals`}>
        <ul className="divide-y border-t">
          {goals.map((g) => (
            <li key={g.goal} className="px-5 py-3">
              <div className="flex items-center justify-between gap-4"><span className="font-medium">{g.goal}</span><span className="flex shrink-0 items-center gap-2"><Dots n={g.rating} /><span className="w-4 text-end font-mono text-xs tabular-nums">{g.rating}</span></span></div>
              <p className="text-xs text-muted-foreground">{labels[g.rating]}</p>
              {g.comment && <p className="mt-1 max-w-prose leading-relaxed">{g.comment}</p>}
            </li>
          ))}
        </ul>
      </ReportSection>
      {competencies && (
        <ReportSection title="Competencies">
          <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {competencies.map((c) => <li key={c.name} className="flex items-center justify-between gap-3"><span>{c.name}</span><Dots n={c.rating} /></li>)}
          </ul>
        </ReportSection>
      )}
      {list('Strengths', strengths)}
      {list('Areas to improve', improvements)}
      {list('Goals for next period', next)}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
