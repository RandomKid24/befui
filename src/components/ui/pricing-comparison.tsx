import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, MinusIcon } from './icons';

export interface PricingPlan {
  name: string;
  price: string;
  note?: string;
  /** Highlights the column as the plan to pick. */
  featured?: boolean;
}

export interface PricingFeature {
  label: string;
  /** One value per plan: true (included), false (not included) or text such as "5 seats". */
  values: (boolean | string)[];
}

/**
 * The feature grid under a pricing page: plans across the top (one highlighted), features down the side, a check, a dash or a short text
 * in each cell. Group related features by passing a `group` row (a feature with no values). Scrolls sideways on a phone with the feature names pinned.
 */
export function PricingComparison({ plans, features, className }: { plans: PricingPlan[]; features: (PricingFeature | { group: string })[]; className?: string }) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border', className)}>
      <table className="w-full min-w-[34rem] border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-card"><span className="sr-only">Feature</span></th>
            {plans.map((p) => (
              <th key={p.name} className={cn('px-4 py-4 text-center align-bottom font-normal', p.featured && 'bg-primary/5')}>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xl font-semibold tabular-nums">{p.price}</p>
                {p.note ? <p className="text-xs text-muted-foreground">{p.note}</p> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((f, i) =>
            'group' in f ? (
              <tr key={i}><th colSpan={plans.length + 1} className="sticky left-0 bg-muted/50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.group}</th></tr>
            ) : (
              <tr key={i} className="border-t">
                <th scope="row" className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-normal">{f.label}</th>
                {plans.map((p, k) => {
                  const v = f.values[k];
                  return (
                    <td key={p.name} className={cn('px-4 py-3 text-center', p.featured && 'bg-primary/5')}>
                      {v === true ? <CheckIcon className="mx-auto size-4 text-success" aria-label="Included" /> : v === false || v === undefined ? <MinusIcon className="mx-auto size-4 text-muted-foreground/50" aria-label="Not included" /> : <span className="tabular-nums">{v}</span>}
                    </td>
                  );
                })}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
