'use client';

import * as React from 'react';
import { useChartIn } from './charts';
import { useFlip } from './motion-hooks';
import { cn } from '@/lib/utils';

export interface BarListItem {
  label: string;
  value: number;
  href?: string;
}

/**
 * Ranked list with a bar behind each label: top pages, top products, traffic sources.
 * Bars scale to the largest value. `format` styles the number on the right.
 */
export function BarList({ items, format = (n) => n.toLocaleString('en-IN'), className }: { items: BarListItem[]; format?: (n: number) => string; className?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const [ref, on] = useChartIn<HTMLUListElement>();
  useFlip(ref); // rows slide when the ranking changes
  return (
    <ul ref={ref} className={cn('relative grid gap-1.5', className)}>
      {items.map((it, i) => {
        const Tag = it.href ? 'a' : 'div';
        return (
          <li key={it.label} data-flip={it.label}>
            <Tag {...(it.href ? { href: it.href } : {})} className={cn('relative flex items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-[13px]', it.href && 'transition-colors hover:text-primary')}>
              <span aria-hidden className="absolute inset-y-0 left-0 rounded-md bg-primary/10 transition-[width] duration-(--dur-long) ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: on ? `${(it.value / max) * 100}%` : 0, transitionDelay: `${i * 60}ms` }} />
              <span className="relative truncate font-medium">{it.label}</span>
              <span className="relative tabular-nums text-muted-foreground">{format(it.value)}</span>
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}
