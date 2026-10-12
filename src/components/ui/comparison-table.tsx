import * as React from 'react';
import { CheckIcon, MinusIcon } from './icons';
import { cn } from '@/lib/utils';

export interface ComparisonPlan {
  id: string;
  name: string;
  /** Shown under the name, e.g. a price. */
  note?: React.ReactNode;
  highlighted?: boolean;
}

export interface ComparisonRow {
  feature: string;
  /** Per plan id: true (included), false (not included) or text such as '5 seats'. */
  values: Record<string, boolean | string>;
}

export interface ComparisonGroup {
  title?: string;
  rows: ComparisonRow[];
}

/** Feature grid for pricing pages: plans across the top, features down the side, a check, dash or text in each cell. */
export function ComparisonTable({ plans, groups, className }: { plans: ComparisonPlan[]; groups: ComparisonGroup[]; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border bg-card', className)}>
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th scope="col" className="w-2/5 p-4 text-left font-normal"><span className="sr-only">Feature</span></th>
            {plans.map((p) => (
              <th key={p.id} scope="col" className={cn('p-4 text-center', p.highlighted && 'bg-primary/5')}>
                <div className="font-semibold">{p.name}</div>
                {p.note && <div className="mt-0.5 text-xs font-normal text-muted-foreground">{p.note}</div>}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g, gi) => (
          <tbody key={gi}>
            {g.title && (
              <tr><th colSpan={plans.length + 1} scope="colgroup" className="bg-muted/60 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.title}</th></tr>
            )}
            {g.rows.map((r) => (
              <tr key={r.feature} className="border-t">
                <th scope="row" className="px-4 py-3 text-left font-normal">{r.feature}</th>
                {plans.map((p) => {
                  const v = r.values[p.id];
                  return (
                    <td key={p.id} className={cn('px-4 py-3 text-center', p.highlighted && 'bg-primary/5')}>
                      {v === true ? <CheckIcon className="mx-auto size-4 text-success" aria-label="Included" />
                        : !v ? <MinusIcon className="mx-auto size-4 text-muted-foreground/50" aria-label="Not included" />
                        : <span className="text-[13px]">{v}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
