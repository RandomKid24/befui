'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { StackedBarChart } from './stacked-bar-chart';

export interface TokenDay {
  label: string;
  input: number;
  output: number;
  /** Tokens served from the prompt cache. */
  cached?: number;
}

const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/**
 * AI spend at a glance: tokens per day split into input, output and cached, with totals and an estimated cost on top.
 * Give the price per million tokens for each kind (`price`) and the cost is worked out for you; hover a bar for that day.
 */
export function TokenUsageChart({
  days,
  price = { input: 3, output: 15, cached: 0.3 },
  currency = '$',
  className,
}: {
  days: TokenDay[];
  /** Price per million tokens. */
  price?: { input: number; output: number; cached?: number };
  currency?: string;
  className?: string;
}) {
  const sum = (k: 'input' | 'output' | 'cached') => days.reduce((n, d) => n + (d[k] ?? 0), 0);
  const tot = { input: sum('input'), output: sum('output'), cached: sum('cached') };
  const cost = (tot.input * price.input + tot.output * price.output + tot.cached * (price.cached ?? price.input)) / 1e6;
  const stat = (label: string, v: string) => (
    <div className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="text-lg font-semibold tabular-nums">{v}</dd></div>
  );
  return (
    <div className={cn('grid gap-4 rounded-xl border bg-card p-4', className)}>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stat('Total tokens', compact(tot.input + tot.output + tot.cached))}
        {stat('Input', compact(tot.input))}
        {stat('Output', compact(tot.output))}
        {stat('Est. cost', `${currency}${cost.toFixed(2)}`)}
      </dl>
      <StackedBarChart
        height={170}
        format={compact}
        keys={[{ key: 'input', label: 'Input' }, { key: 'output', label: 'Output', color: 'text-success' }, ...(tot.cached ? [{ key: 'cached', label: 'Cached', color: 'text-info' }] : [])]}
        data={days.map((d) => ({ label: d.label, values: { input: d.input, output: d.output, cached: d.cached ?? 0 } }))}
      />
    </div>
  );
}
