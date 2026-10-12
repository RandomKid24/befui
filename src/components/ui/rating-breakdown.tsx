import * as React from 'react';
import { StarIcon } from './icons';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

/**
 * Review summary: big average, five stars, and a bar per star level with its count (product page, app store listing).
 * `counts` is the number of ratings for 5, 4, 3, 2 and 1 stars, in that order. Bars fill in on scroll.
 * Pass `onSelect` to make each row a filter button; `selected` marks the active one.
 */
export function RatingBreakdown({ counts, selected, onSelect, className }: { counts: [number, number, number, number, number]; selected?: number | null; onSelect?: (stars: number | null) => void; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const total = counts.reduce((a, b) => a + b, 0);
  const avg = total ? counts.reduce((s, c, i) => s + c * (5 - i), 0) / total : 0;
  const max = Math.max(...counts, 1);
  return (
    <div ref={ref} className={cn('flex flex-wrap items-center gap-x-8 gap-y-4', className)}>
      <div className="grid justify-items-center gap-1">
        <span className="text-5xl font-semibold tracking-tight tabular-nums">{avg.toFixed(1)}</span>
        <span className="flex text-warning" role="img" aria-label={`${avg.toFixed(1)} out of 5`}>
          {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} className={cn('size-4', avg + 0.25 < s && 'text-muted-foreground/30')} style={{ fill: avg + 0.25 >= s ? 'currentColor' : 'none' }} />)}
        </span>
        <span className="text-xs text-muted-foreground">{total.toLocaleString('en-IN')} ratings</span>
      </div>
      <div className="grid min-w-52 flex-1 gap-1.5">
        {counts.map((c, i) => {
          const stars = 5 - i;
          const Row = onSelect ? 'button' : 'div';
          return (
            <Row key={stars} {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(selected === stars ? null : stars), 'aria-pressed': selected === stars } : {})} className={cn('group grid grid-cols-[1.5rem_1fr_2.5rem] items-center gap-2 rounded-md text-left text-xs outline-none', onSelect && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/40', selected != null && selected !== stars && 'opacity-45')}>
              <span className="flex items-center gap-0.5 tabular-nums text-muted-foreground">{stars}<StarIcon className="size-3" /></span>
              <span className="h-2 overflow-hidden rounded-full bg-secondary"><span className="block h-full rounded-full bg-warning" style={{ width: on ? `${(c / max) * 100}%` : 0, transition: `width 800ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms` }} /></span>
              <span className="text-right tabular-nums text-muted-foreground">{total ? Math.round((c / total) * 100) : 0}%</span>
            </Row>
          );
        })}
      </div>
    </div>
  );
}
