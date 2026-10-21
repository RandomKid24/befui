import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRightIcon, ArrowUpRightIcon } from './icons';

export interface Kpi {
  label: string;
  value: React.ReactNode;
  /** Percent change. Positive renders green, negative red (flip with `inverse`). */
  delta?: number;
  /** For measures where down is good, like churn or cost. */
  inverse?: boolean;
  hint?: string;
}

/**
 * A row of headline numbers sharing one border with a divider between them, the strip that sits at the top of a dashboard.
 * It is one card, not four, so it stays tidy: two columns on a phone, all in a row from tablet up.
 */
export function KpiStrip({ items, className }: { items: Kpi[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 overflow-hidden rounded-xl border bg-card sm:flex sm:divide-x [&>div]:border-b [&>div]:sm:border-b-0 [&>div:nth-last-child(-n+2)]:border-b-0 sm:[&>div]:flex-1', className)}>
      {items.map((k) => {
        const good = k.delta === undefined ? true : k.inverse ? k.delta <= 0 : k.delta >= 0;
        return (
          <div key={k.label} className="grid min-w-0 gap-1 px-5 py-4">
            <dt className="truncate text-[13px] text-muted-foreground">{k.label}</dt>
            <dd className="text-2xl font-semibold leading-none tracking-tight tabular-nums">{k.value}</dd>
            {k.delta !== undefined || k.hint ? (
              <dd className="flex items-center gap-1 text-xs text-muted-foreground">
                {k.delta !== undefined && (
                  <span className={cn('inline-flex items-center font-medium', good ? 'text-success' : 'text-destructive')}>
                    {k.delta >= 0 ? <ArrowUpRightIcon className="size-3.5" /> : <ArrowDownRightIcon className="size-3.5" />}
                    {Math.abs(k.delta)}%
                  </span>
                )}
                {k.hint}
              </dd>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}
