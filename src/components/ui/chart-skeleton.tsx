import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

const bars = [45, 70, 55, 85, 60, 95, 75, 50];

/** Loading placeholder shaped like the chart it stands in for, so the page does not jump when the data arrives. */
export function ChartSkeleton({ variant = 'bar', className }: { variant?: 'bar' | 'line' | 'pie' | 'table'; className?: string }) {
  return (
    <div className={cn('w-full', className)} role="status" aria-label="Loading chart">
      {variant === 'bar' && (
        <div className="flex h-48 items-end gap-3 border-b px-2">
          {bars.map((h, i) => <Skeleton key={i} className="flex-1 rounded-b-none" style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }} />)}
        </div>
      )}
      {variant === 'line' && (
        <svg viewBox="0 0 400 160" className="h-48 w-full text-muted">
          <path d="M0 120 C40 110 60 60 110 70 S180 130 230 80 S320 20 400 50 L400 160 L0 160Z" fill="currentColor" className="animate-pulse" />
          <path d="M0 120 C40 110 60 60 110 70 S180 130 230 80 S320 20 400 50" fill="none" stroke="currentColor" strokeWidth="3" className="animate-pulse" opacity="0.7" />
        </svg>
      )}
      {variant === 'pie' && (
        <div className="flex items-center gap-6">
          <Skeleton className="size-40 shrink-0 rounded-full" />
          <div className="grid flex-1 gap-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-3" style={{ width: `${90 - i * 15}%` }} />)}</div>
        </div>
      )}
      {variant === 'table' && (
        <div className="grid gap-3">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="flex gap-4"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-16" /></div>)}</div>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}
