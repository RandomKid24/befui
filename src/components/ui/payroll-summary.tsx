'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

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
  signatures?: string[];
}

/** Monthly payroll summary: gross, deductions and net pay per person, column totals, a gross-to-net split by department and approval lines. */
export function PayrollSummary({ rows, currency = 'INR', locale = 'en-IN', note, signatures = ['Prepared by, Payroll', 'Approved by, Finance'], ...meta }: PayrollSummaryProps) {
  const m = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const gross = (r: PayrollRow) => r.basic + r.allowances;
  const net = (r: PayrollRow) => gross(r) - r.deductions;
  const sum = (f: (r: PayrollRow) => number) => rows.reduce((s, r) => s + f(r), 0);
  const depts = [...rows.reduce((a, r) => a.set(r.department ?? 'Other', (a.get(r.department ?? 'Other') ?? 0) + net(r)), new Map<string, number>())];
  const totalNet = sum(net);
  return (
    <Sheet {...meta} footer={`${rows.length} employees`}>
      <dl className="grid grid-cols-3 gap-6 border-b pb-6">
        {[['Gross pay', m(sum(gross))], ['Deductions', m(sum((r) => r.deductions))], ['Net payable', m(totalNet)]].map(([k, v]) => (
          <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-mono text-xl font-semibold tabular-nums">{v}</dd></div>
        ))}
      </dl>
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Employee</th><th className={cn(th, 'text-end')}>Basic</th><th className={cn(th, 'text-end')}>Allowances</th><th className={cn(th, 'text-end')}>Gross</th><th className={cn(th, 'text-end')}>Deductions</th><th className={cn(th, 'text-end')}>Net pay</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b">
              <td className="py-2"><span className="font-medium">{r.name}</span>{r.department && <span className="block text-xs text-muted-foreground">{r.department}</span>}</td>
              <td className="py-2 text-end tabular-nums">{m(r.basic)}</td>
              <td className="py-2 text-end tabular-nums">{m(r.allowances)}</td>
              <td className="py-2 text-end tabular-nums">{m(gross(r))}</td>
              <td className="py-2 text-end tabular-nums text-muted-foreground">({m(r.deductions)})</td>
              <td className="py-2 text-end font-medium tabular-nums">{m(net(r))}</td>
            </tr>
          ))}
          <tr className="border-y-2 border-foreground font-semibold">
            <td className="py-2">Total</td><td className="py-2 text-end tabular-nums">{m(sum((r) => r.basic))}</td><td className="py-2 text-end tabular-nums">{m(sum((r) => r.allowances))}</td><td className="py-2 text-end tabular-nums">{m(sum(gross))}</td><td className="py-2 text-end tabular-nums">({m(sum((r) => r.deductions))})</td><td className="py-2 text-end tabular-nums">{m(totalNet)}</td>
          </tr>
        </tbody>
      </table>
      {depts.length > 1 && (
        <Section title="Net pay by department">
          <ul className="grid gap-2">
            {depts.map(([d, v]) => (
              <li key={d} className="flex items-center gap-3"><span className="w-28 shrink-0">{d}</span><div className="h-1.5 flex-1 bg-muted"><div className="h-full bg-foreground" style={{ width: `${(v / totalNet) * 100}%` }} /></div><span className="w-28 text-end tabular-nums">{m(v)}</span></li>
            ))}
          </ul>
        </Section>
      )}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
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
