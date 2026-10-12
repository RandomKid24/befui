import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface BulletRow {
  label: string;
  value: number;
  target: number;
  /** Three ascending thresholds that shade the background (poor, ok, good), e.g. [50, 80, 100]. Defaults to 60, 85 and 100 percent of the max. */
  ranges?: [number, number, number];
}

/**
 * Bullet chart: a KPI against its target in one thin row (revenue vs goal, uptime vs SLA, quota attainment).
 * Shaded bands give context, the dark bar is the value, the tick is the target. The bar slides in on scroll.
 */
export function BulletChart({ rows, format = (n) => n.toLocaleString('en-IN'), className }: { rows: BulletRow[]; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  return (
    <div ref={ref} className={cn('grid gap-5', className)}>
      {rows.map((r, i) => {
        const max = Math.max(r.ranges?.[2] ?? 0, r.value, r.target) * 1.02;
        const [a, b, c] = r.ranges ?? [max * 0.6, max * 0.85, max];
        const pct = (v: number) => `${(v / max) * 100}%`;
        const met = r.value >= r.target;
        return (
          <div key={r.label} className="grid gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="font-medium">{r.label}</span>
              <span className="tabular-nums text-muted-foreground"><span className={cn('font-medium', met ? 'text-success' : 'text-foreground')}>{format(r.value)}</span> of {format(r.target)}</span>
            </div>
            <div className="relative h-6 overflow-hidden rounded-md bg-secondary" role="img" aria-label={`${r.label}: ${format(r.value)} against target ${format(r.target)}`}>
              <span className="absolute inset-y-0 left-0 bg-foreground/[0.07]" style={{ width: pct(c) }} />
              <span className="absolute inset-y-0 left-0 bg-foreground/[0.09]" style={{ width: pct(b) }} />
              <span className="absolute inset-y-0 left-0 bg-foreground/[0.12]" style={{ width: pct(a) }} />
              <span className={cn('absolute inset-y-[8px] left-0 rounded-full', met ? 'bg-success' : 'bg-primary')} style={{ width: on ? pct(r.value) : 0, transition: `width 1000ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms` }} />
              <span className="absolute inset-y-[3px] w-[3px] -translate-x-1/2 rounded-full bg-foreground" style={{ left: pct(r.target), opacity: on ? 1 : 0, transition: `opacity 400ms ease-out ${i * 120 + 700}ms` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
