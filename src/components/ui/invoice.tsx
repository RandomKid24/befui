import * as React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface InvoiceLine {
  description: string;
  qty: number;
  price: number;
}

export interface InvoiceParty {
  name: string;
  lines?: string[];
}

const fmt = (n: number, currency: string, locale: string) => new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2 }).format(n);

/**
 * Printable invoice: header with number and status, from and bill-to blocks, line items, subtotal, tax and total.
 * Totals come from `lines`; `taxRate` is 0.18 for 18%. Put buttons (Download, Pay) in `actions`.
 */
export function Invoice({
  number,
  status = 'unpaid',
  issued,
  due,
  from,
  to,
  lines,
  taxRate = 0,
  currency = 'INR',
  locale = 'en-IN',
  notes,
  actions,
  className,
}: {
  number: string;
  status?: 'paid' | 'unpaid' | 'overdue';
  issued: string;
  due: string;
  from: InvoiceParty;
  to: InvoiceParty;
  lines: InvoiceLine[];
  taxRate?: number;
  currency?: string;
  locale?: string;
  notes?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = subtotal * taxRate;
  const money = (n: number) => fmt(n, currency, locale);
  const tone = { paid: 'success', unpaid: 'warning', overdue: 'danger' } as const;
  const party = (label: string, p: InvoiceParty) => (
    <div className="grid content-start gap-0.5 text-[13px]">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="font-medium">{p.name}</span>
      {p.lines?.map((l) => <span key={l} className="text-muted-foreground">{l}</span>)}
    </div>
  );
  return (
    <article className={cn('rounded-xl border bg-card p-6 sm:p-8', className)}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-1">
          <h2 className="text-xl font-semibold tracking-tight">Invoice {number}</h2>
          <p className="text-[13px] text-muted-foreground">Issued {issued} · Due {due}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={tone[status]} dot className="capitalize">{status}</Badge>
          {actions}
        </div>
      </header>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">{party('From', from)}{party('Bill to', to)}</div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium text-muted-foreground">
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Price</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.description} className="border-b">
                <td className="py-3">{l.description}</td>
                <td className="py-3 text-right tabular-nums">{l.qty}</td>
                <td className="py-3 text-right tabular-nums">{money(l.price)}</td>
                <td className="py-3 text-right tabular-nums">{money(l.qty * l.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="mt-4 ml-auto grid w-full max-w-xs gap-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
        {taxRate > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Tax ({+(taxRate * 100).toFixed(2)}%)</dt><dd className="tabular-nums">{money(tax)}</dd></div>}
        <div className="flex justify-between border-t pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{money(subtotal + tax)}</dd></div>
      </dl>
      {notes && <p className="mt-6 border-t pt-4 text-[13px] text-muted-foreground">{notes}</p>}
    </article>
  );
}
