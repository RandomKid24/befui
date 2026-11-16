import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

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
    <tr className={cn(strong ? 'border-t bg-muted/40 font-semibold' : 'text-foreground/90')}>
      <td className={cn('px-5 py-1.5', indent && 'ps-9')}>{label}</td>
      <td className="px-5 py-1.5 text-end tabular-nums">{m(cur)}</td>
      {cmp && <td className="px-5 py-1.5 text-end tabular-nums text-muted-foreground">{prev === undefined ? '' : m(prev)}</td>}
      {cmp && <td className="w-16 px-5 py-1.5 text-end text-xs tabular-nums text-muted-foreground">{prev === undefined ? '' : delta(cur, prev)}</td>}
    </tr>
  );
  const block = (heading: string, secs: StatementSection[], tot: number, pTot: number) => (
    <>
      <tr><td colSpan={cmp ? 4 : 2} className="px-5 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{heading}</td></tr>
      {secs.map((s) => (
        <React.Fragment key={s.title}>
          <tr><td colSpan={cmp ? 4 : 2} className="px-5 pt-2 font-medium">{s.title}</td></tr>
          {s.lines.map((l) => <Row key={l.label} indent label={l.label} cur={l.amount} prev={cmp ? l.previous : undefined} />)}
        </React.Fragment>
      ))}
      <Row strong label={`Total ${heading.toLowerCase()}`} cur={tot} prev={cmp ? pTot : undefined} />
    </>
  );
  return (
    <ReportView {...meta} stats={[{ label: 'Income', value: m(totals.inc), hint: cmp ? delta(totals.inc, totals.pInc) : undefined }, { label: 'Expenses', value: m(totals.exp), hint: cmp ? delta(totals.exp, totals.pExp) : undefined }, { label: net < 0 ? 'Net loss' : 'Net profit', value: m(net), tone: net < 0 ? 'bad' : 'good', hint: cmp ? delta(net, pNet) : undefined }]} footer="Income statement. Brackets are negative.">
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}><span className="sr-only">Line item</span></th><th className={cn(th, 'text-end')}>This period</th>{cmp && <th className={cn(th, 'text-end')}>{previousLabel}</th>}{cmp && <th className={cn(th, 'text-end')}>Change</th>}</tr></thead>
        <tbody>
          {block('Income', income, totals.inc, totals.pInc)}
          {block('Expenses', expenses, totals.exp, totals.pExp)}
          <tr><td colSpan={cmp ? 4 : 2} className="pt-3" /></tr>
          <tr className="border-t bg-muted/60 text-base font-semibold">
            <td className="px-5 py-2.5">Net profit</td>
            <td className={cn('px-5 py-2.5 text-end tabular-nums', net < 0 && 'text-destructive')}>{m(net)}</td>
            {cmp && <td className="px-5 py-2.5 text-end tabular-nums text-muted-foreground">{m(pNet)}</td>}
            {cmp && <td className="px-5 py-2.5 text-end text-xs tabular-nums text-muted-foreground">{delta(net, pNet)}</td>}
          </tr>
        </tbody>
      </table>
      {notes && <ReportSection title="Notes"><p className="max-w-prose leading-relaxed text-muted-foreground">{notes}</p></ReportSection>}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
