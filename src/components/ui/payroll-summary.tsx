'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

export interface PayrollRow {
  name: string;
  department?: string;
  basic: number;
  allowances: number;
  /** Tax, provident fund and other cuts. */
  deductions: number;
}
export interface PayrollSummaryProps extends ReportMeta {
  rows: PayrollRow[];
  currency?: string;
  locale?: string;
  /** Shown under the totals, e.g. the bank file reference or payment date. */
  note?: string;
}

/** Monthly payroll summary: gross, deductions and net pay per person, column totals, and a gross-to-net split by department. */
export function PayrollSummary({ rows, currency = 'INR', locale = 'en-IN', note, ...meta }: PayrollSummaryProps) {
  const m = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const gross = (r: PayrollRow) => r.basic + r.allowances;
  const net = (r: PayrollRow) => gross(r) - r.deductions;
  const sum = (f: (r: PayrollRow) => number) => rows.reduce((s, r) => s + f(r), 0);
  const depts = [...rows.reduce((a, r) => a.set(r.department ?? 'Other', (a.get(r.department ?? 'Other') ?? 0) + net(r)), new Map<string, number>())];
  const totalNet = sum(net);
  return (
    <ReportView {...meta} footer={`${rows.length} employees`} stats={[{ label: 'Gross pay', value: m(sum(gross)) }, { label: 'Deductions', value: m(sum((r) => r.deductions)) }, { label: 'Net payable', value: m(totalNet) }, { label: 'Employees', value: rows.length }]}>
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Employee</th><th className={cn(th, 'text-end')}>Basic</th><th className={cn(th, 'text-end')}>Allowances</th><th className={cn(th, 'text-end')}>Gross</th><th className={cn(th, 'text-end')}>Deductions</th><th className={cn(th, 'text-end')}>Net pay</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b">
              <td className="px-5 py-2.5"><span className="font-medium">{r.name}</span>{r.department && <span className="block text-xs text-muted-foreground">{r.department}</span>}</td>
              <td className="px-5 py-2.5 text-end tabular-nums">{m(r.basic)}</td>
              <td className="px-5 py-2.5 text-end tabular-nums">{m(r.allowances)}</td>
              <td className="px-5 py-2.5 text-end tabular-nums">{m(gross(r))}</td>
              <td className="px-5 py-2.5 text-end tabular-nums text-muted-foreground">({m(r.deductions)})</td>
              <td className="px-5 py-2.5 text-end font-medium tabular-nums">{m(net(r))}</td>
            </tr>
          ))}
          <tr className="bg-muted/40 font-semibold">
            <td className="px-5 py-2.5">Total</td><td className="px-5 py-2.5 text-end tabular-nums">{m(sum((r) => r.basic))}</td><td className="px-5 py-2.5 text-end tabular-nums">{m(sum((r) => r.allowances))}</td><td className="px-5 py-2.5 text-end tabular-nums">{m(sum(gross))}</td><td className="px-5 py-2.5 text-end tabular-nums">({m(sum((r) => r.deductions))})</td><td className="px-5 py-2.5 text-end tabular-nums">{m(totalNet)}</td>
          </tr>
        </tbody>
      </table>
      {depts.length > 1 && (
        <ReportSection title="Net pay by department">
          <ul className="grid gap-2">
            {depts.map(([d, v]) => (
              <li key={d} className="flex items-center gap-3"><span className="w-28 shrink-0">{d}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${(v / totalNet) * 100}%` }} /></div><span className="w-28 text-end tabular-nums">{m(v)}</span></li>
            ))}
          </ul>
        </ReportSection>
      )}
      {note && <p className="px-5 py-3 text-xs text-muted-foreground">{note}</p>}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
