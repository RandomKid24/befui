'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ExpenseLine { date: string; category: string; description: string; amount: number; /** False flags the line as missing a receipt. */ receipt?: boolean }
export interface ExpenseReportProps extends ReportMeta {
  employee: { name: string; id?: string; department?: string };
  lines: ExpenseLine[];
  /** Cash advance already paid, taken off the amount payable. */
  advance?: number;
  currency?: string;
  locale?: string;
}

/** Employee expense claim: itemised lines with receipt flags, totals by category, advance taken off, amount payable and approval signature lines. */
export function ExpenseReport({ employee, lines, advance = 0, currency = 'INR', locale = 'en-IN', ...meta }: ExpenseReportProps) {
  const m = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const cats = [...lines.reduce((a, l) => a.set(l.category, (a.get(l.category) ?? 0) + l.amount), new Map<string, number>())];
  const missing = lines.filter((l) => l.receipt === false).length;
  return (
    <Sheet {...meta} footer={missing ? `${missing} line${missing > 1 ? 's' : ''} without receipt` : 'All receipts attached'}>
      <dl className="grid grid-cols-3 gap-6 border-b pb-6">
        {[['Employee', employee.name], ['ID', employee.id ?? ''], ['Department', employee.department ?? '']].map(([k, v]) => (
          <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-medium">{v || '-'}</dd></div>
        ))}
      </dl>
      <Section title="Expenses">
        <table className="w-full">
          <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Date</th><th className={cn(th, 'text-start')}>Category</th><th className={cn(th, 'text-start')}>Description</th><th className={cn(th, 'text-end')}>Amount</th></tr></thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b align-top">
                <td className="whitespace-nowrap py-2 pe-3 text-muted-foreground">{l.date}</td>
                <td className="py-2 pe-3">{l.category}</td>
                <td className="py-2 pe-3">{l.description}{l.receipt === false && <span className="ms-2 text-xs font-medium text-warning">No receipt</span>}</td>
                <td className="py-2 text-end tabular-nums">{m(l.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <div className="grid gap-8 sm:grid-cols-2">
        <Section title="By category">
          <ul className="grid gap-1">{cats.map(([c, v]) => <li key={c} className="flex justify-between"><span>{c}</span><span className="tabular-nums">{m(v)}</span></li>)}</ul>
        </Section>
        <dl className="grid content-start gap-1.5 self-end">
          <div className="flex justify-between"><dt>Total claimed</dt><dd className="tabular-nums">{m(total)}</dd></div>
          {advance > 0 && <div className="flex justify-between text-muted-foreground"><dt>Less advance</dt><dd className="tabular-nums">({m(advance)})</dd></div>}
          <div className="flex justify-between border-y-2 border-foreground py-2 text-base font-semibold"><dt>{total - advance < 0 ? 'Employee owes' : 'Payable'}</dt><dd className="tabular-nums">{m(Math.abs(total - advance))}</dd></div>
        </dl>
      </div>
      <div className="grid grid-cols-3 gap-8 pt-8">
        {['Employee', 'Manager', 'Finance'].map((s) => <div key={s} className="border-t pt-1.5 text-xs text-muted-foreground">{s}</div>)}
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
