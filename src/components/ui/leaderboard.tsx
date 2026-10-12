import * as React from 'react';
import { Avatar } from './avatar';
import { ArrowDownRightIcon, ArrowUpRightIcon } from './icons';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface LeaderboardItem {
  name: string;
  value: number;
  /** Place change since the last period: positive moved up, negative moved down. */
  delta?: number;
  subtitle?: string;
  src?: string;
}

const medal = ['bg-warning/15 text-warning', 'bg-muted-foreground/15 text-muted-foreground', 'bg-orange-500/15 text-orange-600 dark:text-orange-300'];

/**
 * Ranked list of people or teams with a bar behind each score (top sellers, most active members, quiz scores).
 * Sorted for you. Bars fill in on scroll; the top three get gold, silver and bronze rank badges.
 */
export function Leaderboard({ items, format = (n) => n.toLocaleString('en-IN'), limit, className }: { items: LeaderboardItem[]; format?: (n: number) => string; limit?: number; className?: string }) {
  const [ref, on] = useChartIn<HTMLOListElement>();
  const sorted = [...items].sort((a, b) => b.value - a.value).slice(0, limit);
  const max = sorted[0]?.value || 1;
  return (
    <ol ref={ref} className={cn('grid gap-1.5', className)}>
      {sorted.map((it, i) => (
        <li key={it.name} className="relative flex items-center gap-3 overflow-hidden rounded-lg border bg-card px-3 py-2.5">
          <span aria-hidden className="absolute inset-y-0 left-0 bg-primary/10" style={{ width: on ? `${(it.value / max) * 100}%` : 0, transition: `width 900ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms` }} />
          <span className={cn('relative grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums', medal[i] ?? 'text-muted-foreground')}>{i + 1}</span>
          <Avatar name={it.name} src={it.src} size="sm" className="relative" />
          <span className="relative grid min-w-0 flex-1 leading-tight"><span className="truncate text-sm font-medium">{it.name}</span>{it.subtitle && <span className="truncate text-xs text-muted-foreground">{it.subtitle}</span>}</span>
          {it.delta !== undefined && it.delta !== 0 && (
            <span className={cn('relative inline-flex items-center text-xs font-medium tabular-nums', it.delta > 0 ? 'text-success' : 'text-destructive')} aria-label={`${it.delta > 0 ? 'Up' : 'Down'} ${Math.abs(it.delta)}`}>
              {it.delta > 0 ? <ArrowUpRightIcon className="size-3.5" /> : <ArrowDownRightIcon className="size-3.5" />}{Math.abs(it.delta)}
            </span>
          )}
          <span className="relative text-sm font-semibold tabular-nums">{format(it.value)}</span>
        </li>
      ))}
    </ol>
  );
}
