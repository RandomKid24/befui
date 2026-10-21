'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownRightIcon, ArrowUpRightIcon } from './icons';
import { Sparkline } from './charts';

export interface SparkRow {
  name: string;
  /** The current value, shown as text. */
  value: string;
  /** The trend, oldest first. The delta is worked out from the first and last point unless you pass `delta`. */
  trend: number[];
  /** Percent change. */
  delta?: number;
}

/**
 * A table where every row carries its own trend line and a green or red change chip. Good for metrics by team, product or region.
 * Set `higherIsBetter={false}` for things like churn or cost, where a fall is good news.
 */
export function SparklineTable({ rows, nameLabel = 'Metric', valueLabel = 'Now', higherIsBetter = true, className }: { rows: SparkRow[]; nameLabel?: string; valueLabel?: string; higherIsBetter?: boolean; className?: string }) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b text-left text-xs font-medium text-muted-foreground">
            <th className="py-2 pr-3 font-medium">{nameLabel}</th>
            <th className="px-3 py-2 text-right font-medium">{valueLabel}</th>
            <th className="px-3 py-2 font-medium">Trend</th>
            <th className="py-2 pl-3 text-right font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const first = r.trend[0] ?? 0, last = r.trend[r.trend.length - 1] ?? 0;
            const delta = r.delta ?? (first ? Math.round(((last - first) / Math.abs(first)) * 1000) / 10 : 0);
            const good = higherIsBetter ? delta >= 0 : delta <= 0;
            return (
              <tr key={r.name} className="border-b last:border-0 transition-colors hover:bg-muted/50">
                <td className="py-3 pr-3 font-medium">{r.name}</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.value}</td>
                <td className="px-3 py-3"><div className="h-7 w-28"><Sparkline data={r.trend} className={good ? 'text-success' : 'text-destructive'} /></div></td>
                <td className="py-3 pl-3 text-right">
                  <span className={cn('inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums', good ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                    {delta >= 0 ? <ArrowUpRightIcon className="size-3.5" /> : <ArrowDownRightIcon className="size-3.5" />}
                    {Math.abs(delta)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
