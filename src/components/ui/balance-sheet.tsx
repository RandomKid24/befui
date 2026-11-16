'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

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
      <tr><td colSpan={2} className="px-5 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{heading}</td></tr>
      {secs.map((s) => (
        <React.Fragment key={s.title}>
          <tr><td colSpan={2} className="px-5 pt-2 font-medium">{s.title}</td></tr>
          {s.lines.map((l) => <tr key={l.label}><td className="px-5 py-1.5 ps-9 text-foreground/90">{l.label}</td><td className="px-5 py-1.5 text-end tabular-nums">{m(l.amount)}</td></tr>)}
          {secs.length > 1 && <tr className="text-muted-foreground"><td className="px-5 py-1.5 ps-9 text-xs">Subtotal</td><td className="px-5 py-1.5 text-end text-xs tabular-nums">{m(s.lines.reduce((a, l) => a + l.amount, 0))}</td></tr>}
        </React.Fragment>
      ))}
      <tr className="border-t bg-muted/40 font-semibold"><td className="px-5 py-1.5">Total {heading.toLowerCase()}</td><td className="px-5 py-1.5 text-end tabular-nums">{m(total)}</td></tr>
    </>
  );
  return (
    <ReportView {...meta} stats={[{ label: 'Total assets', value: m(A) }, { label: 'Total liabilities', value: m(L) }, { label: 'Total equity', value: m(E) }, { label: diff === 0 ? 'Balanced' : 'Out of balance', value: diff === 0 ? 'Yes' : m(diff), tone: diff === 0 ? 'good' : 'bad' }]} footer={diff === 0 ? 'Assets equal liabilities plus equity' : <span className="text-destructive">Does not balance, off by {m(diff)}</span>}>
      <table className="w-full">
        <tbody>
          {block('Assets', assets, A)}
          {block('Liabilities', liabilities, L)}
          {block('Equity', equity, E)}
          <tr><td colSpan={2} className="pt-3" /></tr>
          <tr className="border-t bg-muted/60 text-base font-semibold"><td className="px-5 py-2.5">Liabilities and equity</td><td className="px-5 py-2.5 text-end tabular-nums">{m(L + E)}</td></tr>
        </tbody>
      </table>
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
