'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

export interface TimesheetRow { project: string; /** Hours for each day of the week, in order. */ hours: number[]; billable?: boolean }
export interface TimesheetReportProps extends ReportMeta {
  employee: { name: string; role?: string };
  /** Column headings, e.g. ["Mon 9", "Tue 10"...]. */
  days: string[];
  rows: TimesheetRow[];
  /** Hours expected for the period, to flag a shortfall. */
  expected?: number;
}

/** Weekly timesheet: hours per project per day with row and column totals, billable share, and a shortfall against the expected hours. */
export function TimesheetReport({ employee, days, rows, expected, ...meta }: TimesheetReportProps) {
  const rowTotal = (r: TimesheetRow) => r.hours.reduce((s, h) => s + h, 0);
  const total = rows.reduce((s, r) => s + rowTotal(r), 0);
  const billable = rows.filter((r) => r.billable).reduce((s, r) => s + rowTotal(r), 0);
  const dayTotal = (i: number) => rows.reduce((s, r) => s + (r.hours[i] ?? 0), 0);
  const f = (n: number) => (n === 0 ? '' : String(n));
  return (
    <ReportView {...meta} stats={[{ label: 'Employee', value: employee.name, hint: employee.role }, { label: 'Total hours', value: total, hint: expected ? (total >= expected ? `of ${expected} expected` : `${expected - total} short of ${expected}`) : undefined, tone: expected && total < expected ? 'warn' : undefined }, { label: 'Billable', value: `${total ? Math.round((billable / total) * 100) : 0}%`, hint: `${billable} hours` }]} footer={expected ? (total >= expected ? `${total} of ${expected} hours` : `${expected - total} hours short of ${expected}`) : `${total} hours`}>
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Project</th>{days.map((d) => <th key={d} className={cn(th, 'text-end')}>{d}</th>)}<th className={cn(th, 'text-end')}>Total</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.project} className="border-b">
              <td className="px-5 py-2.5">{r.project}{r.billable && <span className="ms-2 text-[11px] uppercase tracking-wide text-muted-foreground">Billable</span>}</td>
              {days.map((d, i) => <td key={d} className="px-5 py-2.5 text-end tabular-nums">{f(r.hours[i] ?? 0)}</td>)}
              <td className="px-5 py-2.5 text-end font-medium tabular-nums">{rowTotal(r)}</td>
            </tr>
          ))}
          <tr className="bg-muted/40 font-semibold"><td className="px-5 py-2.5">Total</td>{days.map((d, i) => <td key={d} className="px-5 py-2.5 text-end tabular-nums">{dayTotal(i)}</td>)}<td className="px-5 py-2.5 text-end tabular-nums">{total}</td></tr>
        </tbody>
      </table>
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
