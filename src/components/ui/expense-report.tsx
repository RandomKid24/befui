'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

export interface ExpenseLine { date: string; category: string; description: string; amount: number; /** False flags the line as missing a receipt. */ receipt?: boolean }
export interface ExpenseReportProps extends ReportMeta {
  employee: { name: string; id?: string; department?: string };
  lines: ExpenseLine[];
  /** Cash advance already paid, taken off the amount payable. */
  advance?: number;
  currency?: string;
  locale?: string;
}

/** Employee expense claim: headline total and amount payable, itemised lines with receipt flags, and totals by category. */
export function ExpenseReport({ employee, lines, advance = 0, currency = 'INR', locale = 'en-IN', ...meta }: ExpenseReportProps) {
  const m = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const cats = [...lines.reduce((a, l) => a.set(l.category, (a.get(l.category) ?? 0) + l.amount), new Map<string, number>())];
  const missing = lines.filter((l) => l.receipt === false).length;
  return (
    <ReportView {...meta} stats={[{ label: 'Employee', value: employee.name, hint: [employee.id, employee.department].filter(Boolean).join(' · ') || undefined }, { label: 'Total claimed', value: m(total) }, { label: total - advance < 0 ? 'Employee owes' : 'Payable', value: m(Math.abs(total - advance)), hint: advance > 0 ? `after ${m(advance)} advance` : undefined }, { label: 'Missing receipts', value: missing, tone: missing ? 'warn' : undefined }]} footer={missing ? `${missing} line${missing > 1 ? 's' : ''} without receipt` : 'All receipts attached'}>
      <ReportSection flush title="Expenses">
        <table className="w-full">
          <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Date</th><th className={cn(th, 'text-start')}>Category</th><th className={cn(th, 'text-start')}>Description</th><th className={cn(th, 'text-end')}>Amount</th></tr></thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b align-top">
                <td className="whitespace-nowrap px-5 py-2.5 text-muted-foreground">{l.date}</td>
                <td className="px-5 py-2.5">{l.category}</td>
                <td className="px-5 py-2.5">{l.description}{l.receipt === false && <span className="ms-2 text-xs font-medium text-warning">No receipt</span>}</td>
                <td className="px-5 py-2.5 text-end tabular-nums">{m(l.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>
      <ReportSection title="By category">
        <ul className="grid max-w-sm gap-1.5">{cats.map(([c, v]) => <li key={c} className="flex justify-between"><span>{c}</span><span className="tabular-nums">{m(v)}</span></li>)}</ul>
      </ReportSection>
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
