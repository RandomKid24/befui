'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircleIcon } from './icons';

export interface UsageItem {
  label: string;
  used: number;
  /** Plan limit. Leave out for unlimited. */
  limit?: number;
  unit?: string;
  /** Extra units allowed past the limit at a price, shown as a second segment. */
  overage?: number;
}

/**
 * Plan usage rows for a billing page: each measure is a bar with "used of limit", a percent, and a colour that moves from blue to
 * amber at 80% to red at 100%. Past the limit the bar fills and the overage is spelled out. Rows without a limit read "Unlimited".
 */
export function UsageMeter({ items, className }: { items: UsageItem[]; className?: string }) {
  return (
    <ul className={cn('grid gap-5', className)}>
      {items.map((it) => <Row key={it.label} it={it} />)}
    </ul>
  );
}

function Row({ it }: { it: UsageItem }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
  const unit = it.unit ? ` ${it.unit}` : '';
  const n = (v: number) => v.toLocaleString();
  const ratio = it.limit ? it.used / it.limit : 0;
  const over = it.limit ? Math.max(it.used - it.limit, 0) : 0;
  const tone = ratio >= 1 ? 'bg-destructive' : ratio >= 0.8 ? 'bg-warning' : 'bg-primary';
  const id = React.useId();
  return (
    <li>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span id={id} className="font-medium">{it.label}</span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {it.limit ? <><span className="font-medium text-foreground">{n(it.used)}</span> of {n(it.limit)}{unit} · {Math.round(ratio * 100)}%</> : <><span className="font-medium text-foreground">{n(it.used)}</span>{unit} · Unlimited</>}
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={it.limit ?? it.used}
        aria-valuenow={it.used}
        aria-valuetext={it.limit ? `${n(it.used)} of ${n(it.limit)}${unit}` : `${n(it.used)}${unit}, unlimited`}
        className="h-2 overflow-hidden rounded-full bg-secondary"
      >
        <div className={cn('h-full rounded-full motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out', it.limit ? tone : 'bg-primary/40')} style={{ width: on ? `${it.limit ? Math.min(ratio, 1) * 100 : 100}%` : '0%' }} />
      </div>
      {over > 0 && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircleIcon className="size-3.5" />{n(over)}{unit} over the limit{it.overage !== undefined ? `, up to ${n(it.overage)}${unit} extra is billed` : ''}.</p>
      )}
    </li>
  );
}
