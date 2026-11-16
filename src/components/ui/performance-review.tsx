'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

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
  signatures?: string[];
}

const labels = ['', 'Needs improvement', 'Below expectations', 'Meets expectations', 'Exceeds expectations', 'Outstanding'];

/** Individual review: goals scored 1 to 5 with comments, competency scores, strengths, areas to improve, next goals, an overall score worked out from the goals and signature lines. */
export function PerformanceReview({ employee, goals, competencies, strengths, improvements, next, outcome, signatures = ['Employee', 'Manager', 'HR'], ...meta }: PerformanceReviewProps) {
  const avg = goals.length ? goals.reduce((s, g) => s + g.rating, 0) / goals.length : 0;
  const Dots = ({ n }: { n: number }) => (
    <span role="img" aria-label={`${n} of 5`} className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} aria-hidden className={cn('size-2', i <= n ? 'bg-foreground' : 'bg-muted')} />)}
    </span>
  );
  const list = (title: string, items?: string[]) => items?.length ? <Section title={title}><ul className="list-disc ps-5 leading-relaxed">{items.map((x) => <li key={x}>{x}</li>)}</ul></Section> : null;
  return (
    <Sheet {...meta} footer="Confidential. Shared with the employee, manager and HR only.">
      <div className="grid grid-cols-2 gap-6 border-b pb-6 sm:grid-cols-4">
        {[['Employee', employee.name], ['Role', employee.role], ['Manager', employee.manager], ['Tenure', employee.tenure ?? '']].map(([k, v]) => (
          <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-medium">{v || '-'}</dd></div>
        ))}
      </div>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-4xl font-semibold tabular-nums">{avg.toFixed(1)}</span>
        <div><p className="font-semibold">{outcome}</p><p className="text-xs text-muted-foreground">Average of {goals.length} goals, out of 5</p></div>
      </div>
      <Section title="Goals">
        <ul className="divide-y border-y">
          {goals.map((g) => (
            <li key={g.goal} className="py-3">
              <div className="flex items-center justify-between gap-4"><span className="font-medium">{g.goal}</span><span className="flex shrink-0 items-center gap-2"><Dots n={g.rating} /><span className="w-4 text-end font-mono text-xs tabular-nums">{g.rating}</span></span></div>
              <p className="text-xs text-muted-foreground">{labels[g.rating]}</p>
              {g.comment && <p className="mt-1 max-w-prose leading-relaxed">{g.comment}</p>}
            </li>
          ))}
        </ul>
      </Section>
      {competencies && (
        <Section title="Competencies">
          <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {competencies.map((c) => <li key={c.name} className="flex items-center justify-between gap-3"><span>{c.name}</span><Dots n={c.rating} /></li>)}
          </ul>
        </Section>
      )}
      <div className="grid gap-8 sm:grid-cols-2">{list('Strengths', strengths)}{list('Areas to improve', improvements)}</div>
      {list('Goals for next period', next)}
      <div className="grid grid-cols-3 gap-8 pt-6">
        {signatures.map((s) => <div key={s} className="border-t pt-1.5 text-xs text-muted-foreground">{s}</div>)}
      </div>
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
