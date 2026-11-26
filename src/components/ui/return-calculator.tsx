'use client';

import * as React from 'react';
import { formatCurrency, formatPercent } from './format';
import { Slider } from './slider';
import { cn } from '@/lib/utils';

export interface RentalInput {
  price: number;
  monthlyRent: number;
  monthlyCosts: number;
  emptyWeeks: number;
  /** Agent's share of the rent collected, in percent. */
  agentFee: number;
}

/** One year of a rental, before tax and loan payments. Yields are fractions of the price. */
export function rentalReturn({ price, monthlyRent, monthlyCosts, emptyWeeks, agentFee }: RentalInput) {
  const fullRent = monthlyRent * 12;
  const lostToVacancy = fullRent * (emptyWeeks / 52);
  const fee = (fullRent - lostToVacancy) * (agentFee / 100);
  const costs = monthlyCosts * 12;
  const kept = fullRent - lostToVacancy - fee - costs;
  return { fullRent, lostToVacancy, fee, costs, kept, grossYield: price ? fullRent / price : 0, netYield: price ? kept / price : 0 };
}

export interface RentalLimit { min: number; max: number; step: number }
const LIMITS: Record<keyof RentalInput, RentalLimit> = {
  price: { min: 1000000, max: 50000000, step: 100000 },
  monthlyRent: { min: 5000, max: 300000, step: 1000 },
  monthlyCosts: { min: 0, max: 100000, step: 500 },
  emptyWeeks: { min: 0, max: 26, step: 1 },
  agentFee: { min: 0, max: 20, step: 0.5 },
};
const LABELS: Record<keyof RentalInput, string> = { price: 'Property price', monthlyRent: 'Rent a month', monthlyCosts: 'Running costs a month', emptyWeeks: 'Empty weeks a year', agentFee: 'Letting agent fee' };

/** Sliders for a rental property with the yield and where the year's rent goes, updating as you move them. */
export function ReturnCalculator({ defaultValue = { price: 8000000, monthlyRent: 35000, monthlyCosts: 5000, emptyWeeks: 3, agentFee: 8 }, limits, currency, locale, onChange, className }: {
  defaultValue?: RentalInput;
  /** Change slider ranges. The defaults suit rupees. */
  limits?: Partial<Record<keyof RentalInput, RentalLimit>>;
  currency?: string;
  locale?: string;
  onChange?: (input: RentalInput) => void;
  className?: string;
}) {
  const [input, setInput] = React.useState(defaultValue);
  const r = rentalReturn(input);
  const money = (n: number) => formatCurrency(Math.round(n), { currency, locale });
  const show: Record<keyof RentalInput, (n: number) => string> = { price: money, monthlyRent: money, monthlyCosts: money, emptyWeeks: (n) => `${n} ${n === 1 ? 'week' : 'weeks'}`, agentFee: (n) => `${n}%` };
  const parts = [
    { label: 'You keep', amount: Math.max(0, r.kept), color: 'bg-success' },
    { label: 'Running costs', amount: r.costs, color: 'bg-warning' },
    { label: 'Agent fee', amount: r.fee, color: 'bg-info' },
    { label: 'Empty weeks', amount: r.lostToVacancy, color: 'bg-muted-foreground' },
  ];
  const total = parts.reduce((sum, p) => sum + p.amount, 0) || 1;
  return (
    <section aria-label="Rental return calculator" className={cn('grid w-full max-w-3xl overflow-hidden rounded-xl border bg-card md:grid-cols-2', className)}>
      <div className="grid content-start gap-4 border-b p-5 md:border-b-0 md:border-e">
        {(Object.keys(LABELS) as (keyof RentalInput)[]).map((key) => (
          <div key={key} className="grid gap-1">
            <div className="flex justify-between gap-3 text-sm"><span>{LABELS[key]}</span><output className="font-semibold tabular-nums">{show[key](input[key])}</output></div>
            <Slider className="pt-0" showValue={false} aria-label={LABELS[key]} aria-valuetext={show[key](input[key])} value={input[key]} {...(limits?.[key] ?? LIMITS[key])} onValueChange={(v) => { const next = { ...input, [key]: v }; setInput(next); onChange?.(next); }} />
          </div>
        ))}
      </div>
      <div className="grid content-start gap-4 p-5">
        <div>
          <h2 className="text-sm text-muted-foreground">Net yield</h2>
          <p className={cn('text-5xl font-semibold tracking-tight tabular-nums', r.kept < 0 && 'text-destructive')}>{formatPercent(r.netYield)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Gross yield {formatPercent(r.grossYield)}</p>
        </div>
        <p className="border-y py-3 text-sm">{r.kept < 0 ? <>You <strong className="text-destructive">lose {money(-r.kept)}</strong> a year.</> : <>You keep <strong>{money(r.kept)}</strong> a year, {money(r.kept / 12)} a month.</>}</p>
        <div aria-hidden className="flex h-3 overflow-hidden rounded-sm bg-muted">
          {parts.map((p) => <span key={p.label} className={cn('transition-[width] motion-reduce:transition-none', p.color)} style={{ width: `${(p.amount / total) * 100}%` }} />)}
        </div>
        <dl className="grid gap-1.5 text-sm">
          {parts.map((p) => (
            <div key={p.label} className="flex items-center gap-2"><span aria-hidden className={cn('size-2.5 rounded-sm', p.color)} /><dt>{p.label}</dt><dd className="ms-auto tabular-nums">{money(p.amount)}</dd></div>
          ))}
        </dl>
        <p className="text-xs text-muted-foreground">Before tax and loan payments.</p>
      </div>
    </section>
  );
}
