'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

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
    <ReportView {...meta} stats={[{ label: 'Items', value: items.length }, { label: 'Stock value', value: m(total) }, { label: 'Low stock', value: items.filter((i) => state(i) === 'Low').length, tone: 'warn' }, { label: 'Out of stock', value: items.filter((i) => state(i) === 'Out').length, tone: 'bad' }]} footer={`${items.length} items, ${reorder.length} to reorder`}>
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}>SKU</th><th className={cn(th, 'text-start')}>Item</th><th className={cn(th, 'text-end')}>On hand</th><th className={cn(th, 'text-end')}>Reorder at</th><th className={cn(th, 'text-end')}>Value</th><th className={cn(th, 'text-end')}>Status</th></tr></thead>
        <tbody>
          {items.map((i) => {
            const s = state(i);
            return (
              <tr key={i.sku} className="border-b">
                <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">{i.sku}</td>
                <td className="px-5 py-2.5">{i.name}</td>
                <td className="px-5 py-2.5 text-end tabular-nums">{i.onHand.toLocaleString(locale)}</td>
                <td className="px-5 py-2.5 text-end tabular-nums text-muted-foreground">{i.reorderAt.toLocaleString(locale)}</td>
                <td className="px-5 py-2.5 text-end tabular-nums">{m(i.onHand * i.unitCost)}</td>
                <td className={cn('px-5 py-2.5 text-end text-xs font-semibold uppercase tracking-wide', s === 'Out' ? 'text-destructive' : s === 'Low' ? 'text-warning' : 'text-muted-foreground')}>{s}</td>
              </tr>
            );
          })}
          <tr className="bg-muted/40 font-semibold"><td className="px-5 py-2.5" colSpan={4}>Stock value</td><td className="px-5 py-2.5 text-end tabular-nums">{m(total)}</td><td /></tr>
        </tbody>
      </table>
      {reorder.length > 0 && (
        <ReportSection title="To reorder">
          <ul className="grid gap-1.5">
            {reorder.map((i) => <li key={i.sku}>{i.name}: {i.onHand} left, reorder level {i.reorderAt}</li>)}
          </ul>
        </ReportSection>
      )}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
