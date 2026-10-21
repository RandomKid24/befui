'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface Cohort {
  /** Row label, such as the signup month. */
  label: string;
  /** Size of the group when it started. */
  size: number;
  /** Percent still active after 0, 1, 2... periods. The first is usually 100. A cohort that is younger has fewer entries. */
  retention: number[];
}

/**
 * Retention triangle: a row per group of users (by signup month), a column per period since they joined, each cell the percent still
 * active and tinted by it (darker is better). Older groups have more cells, which makes the triangle. Hover a cell for the head count.
 */
export function CohortTable({ cohorts, periodLabel = 'Month', className }: { cohorts: Cohort[]; periodLabel?: string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const cols = Math.max(...cohorts.map((c) => c.retention.length), 0);
  return (
    <div ref={ref} className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-1 text-xs tabular-nums">
        <thead>
          <tr className="text-muted-foreground">
            <th className="px-2 text-left font-medium">Cohort</th>
            <th className="px-2 text-right font-medium">Users</th>
            {Array.from({ length: cols }, (_, i) => <th key={i} className="min-w-11 font-medium">{periodLabel} {i}</th>)}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((c, r) => (
            <tr key={c.label}>
              <th scope="row" className="whitespace-nowrap px-2 text-left font-medium">{c.label}</th>
              <td className="px-2 text-right text-muted-foreground">{c.size.toLocaleString('en-IN')}</td>
              {Array.from({ length: cols }, (_, i) => {
                const v = c.retention[i];
                return v === undefined ? <td key={i} /> : (
                  <td
                    key={i}
                    title={`${Math.round((c.size * v) / 100).toLocaleString('en-IN')} of ${c.size.toLocaleString('en-IN')} users`}
                    className="rounded-md py-2 text-center font-medium transition-opacity"
                    style={{ background: `color-mix(in srgb, var(--primary) ${Math.round(10 + v * 0.8)}%, var(--secondary))`, color: v > 55 ? 'var(--primary-foreground)' : undefined, opacity: on ? 1 : 0, transitionDelay: `${(r + i) * 35}ms` }}
                  >
                    {Math.round(v)}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
