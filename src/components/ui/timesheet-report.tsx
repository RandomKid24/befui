'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TimesheetRow { project: string; /** Hours for each day of the week, in order. */ hours: number[]; billable?: boolean }
export interface TimesheetReportProps extends ReportMeta {
  employee: { name: string; role?: string };
  /** Column headings, e.g. ["Mon 9", "Tue 10"...]. */
  days: string[];
  rows: TimesheetRow[];
  /** Hours expected for the period, to flag a shortfall. */
  expected?: number;
  signatures?: string[];
}

/** Weekly timesheet: hours per project per day with row and column totals, billable share, a shortfall against the expected hours and approval lines. */
export function TimesheetReport({ employee, days, rows, expected, signatures = ['Employee', 'Manager'], ...meta }: TimesheetReportProps) {
  const rowTotal = (r: TimesheetRow) => r.hours.reduce((s, h) => s + h, 0);
  const total = rows.reduce((s, r) => s + rowTotal(r), 0);
  const billable = rows.filter((r) => r.billable).reduce((s, r) => s + rowTotal(r), 0);
  const dayTotal = (i: number) => rows.reduce((s, r) => s + (r.hours[i] ?? 0), 0);
  const f = (n: number) => (n === 0 ? '' : String(n));
  return (
    <Sheet {...meta} footer={expected ? (total >= expected ? `${total} of ${expected} hours` : `${expected - total} hours short of ${expected}`) : `${total} hours`}>
      <dl className="grid grid-cols-3 gap-6 border-b pb-6">
        {[['Employee', employee.name], ['Total hours', String(total)], ['Billable', `${total ? Math.round((billable / total) * 100) : 0}%`]].map(([k, v]) => (
          <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-medium">{v}{k === 'Employee' && employee.role && <span className="block text-xs font-normal text-muted-foreground">{employee.role}</span>}</dd></div>
        ))}
      </dl>
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Project</th>{days.map((d) => <th key={d} className={cn(th, 'text-end')}>{d}</th>)}<th className={cn(th, 'text-end')}>Total</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.project} className="border-b">
              <td className="py-2">{r.project}{r.billable && <span className="ms-2 text-[11px] uppercase tracking-wide text-muted-foreground">Billable</span>}</td>
              {days.map((d, i) => <td key={d} className="py-2 text-end tabular-nums">{f(r.hours[i] ?? 0)}</td>)}
              <td className="py-2 text-end font-medium tabular-nums">{rowTotal(r)}</td>
            </tr>
          ))}
          <tr className="border-y-2 border-foreground font-semibold"><td className="py-2">Total</td>{days.map((d, i) => <td key={d} className="py-2 text-end tabular-nums">{dayTotal(i)}</td>)}<td className="py-2 text-end tabular-nums">{total}</td></tr>
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-10 pt-6">
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
