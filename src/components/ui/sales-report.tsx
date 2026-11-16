import * as React from 'react';
import { cn } from '@/lib/utils';

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

/** Sales report sheet: headline totals, a breakdown with each row's share of revenue, top products and a closing summary. */
export function SalesReport({ breakdown, breakdownLabel = 'Region', topProducts, summary, currency = 'INR', locale = 'en-IN', ...meta }: SalesReportProps) {
  const rev = breakdown.reduce((s, r) => s + r.revenue, 0);
  const orders = breakdown.reduce((s, r) => s + r.orders, 0);
  const m = (n: number) => money(n, currency, locale);
  return (
    <Sheet {...meta} footer="Sales report">
      <dl className="grid grid-cols-3 gap-6 border-b pb-6">
        {[['Revenue', m(rev)], ['Orders', orders.toLocaleString(locale)], ['Average order', m(orders ? rev / orders : 0)]].map(([k, v]) => (
          <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-mono text-xl font-semibold tabular-nums">{v}</dd></div>
        ))}
      </dl>
      <Section title={`By ${breakdownLabel.toLowerCase()}`}>
        <table className="w-full">
          <thead><tr className="border-b text-start"><th className={cn(th, 'text-start')}>{breakdownLabel}</th><th className={cn(th, 'text-end')}>Orders</th><th className={cn(th, 'text-end')}>Revenue</th><th className={cn(th, 'w-40 ps-4 text-start')}>Share</th></tr></thead>
          <tbody>
            {breakdown.map((r) => {
              const p = rev ? (r.revenue / rev) * 100 : 0;
              return (
                <tr key={r.name} className="border-b">
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-end tabular-nums">{r.orders.toLocaleString(locale)}</td>
                  <td className="py-2 text-end tabular-nums">{m(r.revenue)}</td>
                  <td className="py-2 ps-4"><div className="flex items-center gap-2"><div className="h-1.5 flex-1 bg-muted"><div className="h-full bg-foreground" style={{ width: `${p}%` }} /></div><span className="w-9 text-end text-xs tabular-nums text-muted-foreground">{p.toFixed(0)}%</span></div></td>
                </tr>
              );
            })}
            <tr className="font-semibold"><td className="py-2">Total</td><td className="py-2 text-end tabular-nums">{orders.toLocaleString(locale)}</td><td className="py-2 text-end tabular-nums">{m(rev)}</td><td /></tr>
          </tbody>
        </table>
      </Section>
      {topProducts && (
        <Section title="Top products">
          <ol className="divide-y border-y">
            {topProducts.map((p, i) => (
              <li key={p.name} className="flex items-baseline gap-3 py-2"><span className="w-5 font-mono text-xs text-muted-foreground">{i + 1}</span><span className="flex-1">{p.name}</span><span className="text-xs text-muted-foreground">{p.orders.toLocaleString(locale)} orders</span><span className="w-28 text-end tabular-nums">{m(p.revenue)}</span></li>
            ))}
          </ol>
        </Section>
      )}
      {summary && <Section title="Summary"><p className="max-w-prose leading-relaxed">{summary}</p></Section>}
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
