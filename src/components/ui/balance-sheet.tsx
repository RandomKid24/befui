'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BalanceLine { label: string; amount: number }
export interface BalanceSection { title: string; lines: BalanceLine[] }
export interface BalanceSheetProps extends ReportMeta {
  assets: BalanceSection[];
  liabilities: BalanceSection[];
  equity: BalanceSection[];
  currency?: string;
  locale?: string;
}

/** Balance sheet as at a date: assets, then liabilities and equity, each with subtotals. The footer says whether assets equal liabilities plus equity, and by how much if not. */
export function BalanceSheet({ assets, liabilities, equity, currency = 'INR', locale = 'en-IN', ...meta }: BalanceSheetProps) {
  const f = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
  const m = (n: number) => (n < 0 ? `(${f.format(-n)})` : f.format(n));
  const sum = (s: BalanceSection[]) => s.reduce((a, x) => a + x.lines.reduce((b, l) => b + l.amount, 0), 0);
  const A = sum(assets), L = sum(liabilities), E = sum(equity);
  const diff = A - (L + E);
  const block = (heading: string, secs: BalanceSection[], total: number) => (
    <>
      <tr><td colSpan={2} className="pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{heading}</td></tr>
      {secs.map((s) => (
        <React.Fragment key={s.title}>
          <tr><td colSpan={2} className="pt-2 font-medium">{s.title}</td></tr>
          {s.lines.map((l) => <tr key={l.label}><td className="py-1.5 ps-4 text-foreground/90">{l.label}</td><td className="py-1.5 text-end tabular-nums">{m(l.amount)}</td></tr>)}
          {secs.length > 1 && <tr className="text-muted-foreground"><td className="py-1.5 ps-4 text-xs">Subtotal</td><td className="py-1.5 text-end text-xs tabular-nums">{m(s.lines.reduce((a, l) => a + l.amount, 0))}</td></tr>}
        </React.Fragment>
      ))}
      <tr className="border-t font-semibold"><td className="py-1.5">Total {heading.toLowerCase()}</td><td className="py-1.5 text-end tabular-nums">{m(total)}</td></tr>
    </>
  );
  return (
    <Sheet {...meta} footer={diff === 0 ? 'Assets equal liabilities plus equity' : <span className="text-destructive">Does not balance, off by {m(diff)}</span>}>
      <table className="w-full">
        <tbody>
          {block('Assets', assets, A)}
          {block('Liabilities', liabilities, L)}
          {block('Equity', equity, E)}
          <tr><td colSpan={2} className="pt-3" /></tr>
          <tr className="border-y-2 border-foreground text-base font-semibold"><td className="py-2">Liabilities and equity</td><td className="py-2 text-end tabular-nums">{m(L + E)}</td></tr>
        </tbody>
      </table>
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
