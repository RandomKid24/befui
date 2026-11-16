import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatementLine { label: string; amount: number; /** Same line last period, for the comparison column. */ previous?: number }
export interface StatementSection { title: string; lines: StatementLine[] }
export interface IncomeStatementProps extends ReportMeta {
  /** Income sections first, then cost sections. */
  income: StatementSection[];
  expenses: StatementSection[];
  currency?: string;
  locale?: string;
  /** Column heading for the previous period. Leave out to hide the comparison. */
  previousLabel?: string;
  notes?: string;
}

/** Profit and loss statement: income, expenses, subtotals and net profit, with an optional last-period column and change. Negatives show in brackets. */
export function IncomeStatement({ income, expenses, currency = 'INR', locale = 'en-IN', previousLabel, notes, ...meta }: IncomeStatementProps) {
  const f = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
  const m = (n: number) => (n < 0 ? `(${f.format(-n)})` : f.format(n));
  const sum = (s: StatementSection[], k: 'amount' | 'previous') => s.reduce((a, x) => a + x.lines.reduce((b, l) => b + (l[k] ?? 0), 0), 0);
  const cmp = !!previousLabel;
  const delta = (cur: number, prev: number) => (prev ? `${cur >= prev ? '+' : ''}${(((cur - prev) / Math.abs(prev)) * 100).toFixed(1)}%` : '');
  const totals = { inc: sum(income, 'amount'), exp: sum(expenses, 'amount'), pInc: sum(income, 'previous'), pExp: sum(expenses, 'previous') };
  const net = totals.inc - totals.exp;
  const pNet = totals.pInc - totals.pExp;

  const Row = ({ label, cur, prev, strong, indent }: { label: string; cur: number; prev?: number; strong?: boolean; indent?: boolean }) => (
    <tr className={cn(strong ? 'border-t font-semibold' : 'text-foreground/90')}>
      <td className={cn('py-1.5', indent && 'ps-4')}>{label}</td>
      <td className="py-1.5 text-end tabular-nums">{m(cur)}</td>
      {cmp && <td className="py-1.5 text-end tabular-nums text-muted-foreground">{prev === undefined ? '' : m(prev)}</td>}
      {cmp && <td className="w-16 py-1.5 text-end text-xs tabular-nums text-muted-foreground">{prev === undefined ? '' : delta(cur, prev)}</td>}
    </tr>
  );
  const block = (heading: string, secs: StatementSection[], tot: number, pTot: number) => (
    <>
      <tr><td colSpan={cmp ? 4 : 2} className="pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{heading}</td></tr>
      {secs.map((s) => (
        <React.Fragment key={s.title}>
          <tr><td colSpan={cmp ? 4 : 2} className="pt-2 font-medium">{s.title}</td></tr>
          {s.lines.map((l) => <Row key={l.label} indent label={l.label} cur={l.amount} prev={cmp ? l.previous : undefined} />)}
        </React.Fragment>
      ))}
      <Row strong label={`Total ${heading.toLowerCase()}`} cur={tot} prev={cmp ? pTot : undefined} />
    </>
  );
  return (
    <Sheet {...meta} footer="Income statement. Brackets are negative.">
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')} /><th className={cn(th, 'text-end')}>This period</th>{cmp && <th className={cn(th, 'text-end')}>{previousLabel}</th>}{cmp && <th className={cn(th, 'text-end')}>Change</th>}</tr></thead>
        <tbody>
          {block('Income', income, totals.inc, totals.pInc)}
          {block('Expenses', expenses, totals.exp, totals.pExp)}
          <tr><td colSpan={cmp ? 4 : 2} className="pt-3" /></tr>
          <tr className="border-y-2 border-foreground text-base font-semibold">
            <td className="py-2">Net profit</td>
            <td className={cn('py-2 text-end tabular-nums', net < 0 && 'text-destructive')}>{m(net)}</td>
            {cmp && <td className="py-2 text-end tabular-nums text-muted-foreground">{m(pNet)}</td>}
            {cmp && <td className="py-2 text-end text-xs tabular-nums text-muted-foreground">{delta(net, pNet)}</td>}
          </tr>
        </tbody>
      </table>
      {notes && <Section title="Notes"><p className="max-w-prose leading-relaxed text-muted-foreground">{notes}</p></Section>}
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
