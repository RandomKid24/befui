'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';
import { ReportSection, ReportView, rv, type ReportMeta } from './report-view';

const money = (n: number, currency: string, locale: string) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

export interface SalesRow { name: string; orders: number; revenue: number }
export interface SalesReportProps extends ReportMeta {
  /** Regions, channels or reps. Share of total is worked out for you. */
  breakdown: SalesRow[];
  breakdownLabel?: string;
  topProducts?: SalesRow[];
  summary?: string;
  currency?: string;
  locale?: string;
}

/** Sales report: headline revenue, orders and average order, a breakdown table with each row's share of revenue, top products and a closing summary. */
export function SalesReport({ breakdown, breakdownLabel = 'Region', topProducts, summary, currency = 'INR', locale = 'en-IN', ...meta }: SalesReportProps) {
  const rev = breakdown.reduce((s, r) => s + r.revenue, 0);
  const orders = breakdown.reduce((s, r) => s + r.orders, 0);
  const m = (n: number) => money(n, currency, locale);
  const top = [...breakdown].sort((a, b) => b.revenue - a.revenue)[0];
  return (
    <ReportView
      {...meta}
      footer="Sales report"
      stats={[
        { label: 'Revenue', value: m(rev) },
        { label: 'Orders', value: orders.toLocaleString(locale) },
        { label: 'Average order', value: m(orders ? rev / orders : 0) },
        ...(top ? [{ label: `Top ${breakdownLabel.toLowerCase()}`, value: top.name, hint: `${Math.round((top.revenue / rev) * 100)}% of revenue` }] : []),
      ]}
    >
      <ReportSection flush title={`By ${breakdownLabel.toLowerCase()}`}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={rv.th}>{breakdownLabel}</TableHead>
              <TableHead className={cn(rv.th, 'text-end')}>Orders</TableHead>
              <TableHead className={cn(rv.th, 'text-end')}>Revenue</TableHead>
              <TableHead className={cn(rv.th, 'w-48')}>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdown.map((r) => {
              const p = rev ? (r.revenue / rev) * 100 : 0;
              return (
                <TableRow key={r.name}>
                  <TableCell className={cn(rv.td, 'font-medium')}>{r.name}</TableCell>
                  <TableCell className={cn(rv.td, rv.num)}>{r.orders.toLocaleString(locale)}</TableCell>
                  <TableCell className={cn(rv.td, rv.num)}>{m(r.revenue)}</TableCell>
                  <TableCell className={rv.td}>
                    <div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${p}%` }} /></div><span className="w-9 text-end text-xs tabular-nums text-muted-foreground">{p.toFixed(0)}%</span></div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent"><TableCell className="px-5">Total</TableCell><TableCell className={cn('px-5', rv.num)}>{orders.toLocaleString(locale)}</TableCell><TableCell className={cn('px-5', rv.num)}>{m(rev)}</TableCell><TableCell /></TableRow>
          </TableFooter>
        </Table>
      </ReportSection>
      {topProducts && (
        <ReportSection flush title="Top products">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent"><TableHead className={cn(rv.th, 'w-10')}>#</TableHead><TableHead className={rv.th}>Product</TableHead><TableHead className={cn(rv.th, 'text-end')}>Orders</TableHead><TableHead className={cn(rv.th, 'text-end')}>Revenue</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((p, i) => (
                <TableRow key={p.name}><TableCell className={cn(rv.td, 'font-mono text-xs text-muted-foreground')}>{i + 1}</TableCell><TableCell className={rv.td}>{p.name}</TableCell><TableCell className={cn(rv.td, rv.num)}>{p.orders.toLocaleString(locale)}</TableCell><TableCell className={cn(rv.td, rv.num)}>{m(p.revenue)}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </ReportSection>
      )}
      {summary && <ReportSection title="Summary"><p className="max-w-prose leading-relaxed">{summary}</p></ReportSection>}
    </ReportView>
  );
}
