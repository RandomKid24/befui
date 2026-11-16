'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StockItem { sku: string; name: string; onHand: number; reorderAt: number; unitCost: number }
export interface StockReportProps extends ReportMeta {
  items: StockItem[];
  currency?: string;
  locale?: string;
}

/** Inventory report: each item with quantity, reorder level and value. Items under their reorder level read "Low", empty ones "Out", and a short list of what to reorder follows the table. */
export function StockReport({ items, currency = 'INR', locale = 'en-IN', ...meta }: StockReportProps) {
  const m = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const state = (i: StockItem) => (i.onHand === 0 ? 'Out' : i.onHand <= i.reorderAt ? 'Low' : 'OK');
  const total = items.reduce((s, i) => s + i.onHand * i.unitCost, 0);
  const reorder = items.filter((i) => state(i) !== 'OK');
  return (
    <Sheet {...meta} footer={`${items.length} items, ${reorder.length} to reorder`}>
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}>SKU</th><th className={cn(th, 'text-start')}>Item</th><th className={cn(th, 'text-end')}>On hand</th><th className={cn(th, 'text-end')}>Reorder at</th><th className={cn(th, 'text-end')}>Value</th><th className={cn(th, 'text-end')}>Status</th></tr></thead>
        <tbody>
          {items.map((i) => {
            const s = state(i);
            return (
              <tr key={i.sku} className="border-b">
                <td className="py-2 font-mono text-xs text-muted-foreground">{i.sku}</td>
                <td className="py-2">{i.name}</td>
                <td className="py-2 text-end tabular-nums">{i.onHand.toLocaleString(locale)}</td>
                <td className="py-2 text-end tabular-nums text-muted-foreground">{i.reorderAt.toLocaleString(locale)}</td>
                <td className="py-2 text-end tabular-nums">{m(i.onHand * i.unitCost)}</td>
                <td className={cn('py-2 text-end text-xs font-semibold uppercase tracking-wide', s === 'Out' ? 'text-destructive' : s === 'Low' ? 'text-warning' : 'text-muted-foreground')}>{s}</td>
              </tr>
            );
          })}
          <tr className="font-semibold"><td className="py-2" colSpan={4}>Stock value</td><td className="py-2 text-end tabular-nums">{m(total)}</td><td /></tr>
        </tbody>
      </table>
      {reorder.length > 0 && (
        <Section title="To reorder">
          <ul className="grid gap-1">
            {reorder.map((i) => <li key={i.sku}>{i.name}: {i.onHand} left, reorder level {i.reorderAt}</li>)}
          </ul>
        </Section>
      )}
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
