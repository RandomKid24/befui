'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface BoxGroup {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  /** Values beyond the whiskers, drawn as dots. */
  outliers?: number[];
}

const W = 600;
const H = 280;
const pad = { l: 44, r: 12, t: 14, b: 28 };

/**
 * Box plot: the spread of a value per group (response time per endpoint, salary per level, delivery days per carrier).
 * Box is the middle half, line is the median, whiskers reach min and max. Boxes open from their median in turn on scroll;
 * hover a group for its five numbers.
 */
export function BoxPlotChart({ groups, format = (n) => String(n), className }: { groups: BoxGroup[]; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const vals = groups.flatMap((g) => [g.min, g.max, ...(g.outliers ?? [])]);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const p = (hi - lo) * 0.06 || 1;
  const min = lo >= 0 ? Math.max(0, lo - p) : lo - p;
  const span = hi + p - min;
  const dp = span < 20 ? 10 : 1;
  const slot = (W - pad.l - pad.r) / groups.length;
  const cx = (i: number) => pad.l + slot * (i + 0.5);
  const y = (v: number) => pad.t + (1 - (v - min) / span) * (H - pad.t - pad.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + t * span);
  const g = hover === null ? null : groups[hover]!;

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Box plot of ${groups.length} groups`} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray="3 4" />
            <text x={pad.l - 8} y={y(t) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{format(Math.round(t * dp) / dp)}</text>
          </g>
        ))}
        {groups.map((b, i) => (
          <g key={b.label} className="text-primary" onMouseEnter={() => setHover(i)} style={{ transformBox: 'view-box', transformOrigin: `${cx(i)}px ${y(b.median)}px`, transform: on ? 'scaleY(1)' : 'scaleY(0)', opacity: hover !== null && hover !== i ? 0.4 : 1, transition: `transform 800ms cubic-bezier(0.34,1.3,0.64,1) ${i * 90}ms, opacity 150ms` }}>
            <rect x={cx(i) - slot / 2} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent" />
            <line x1={cx(i)} x2={cx(i)} y1={y(b.max)} y2={y(b.min)} stroke="currentColor" strokeWidth="1.5" />
            {[b.min, b.max].map((v) => <line key={v} x1={cx(i) - slot * 0.14} x2={cx(i) + slot * 0.14} y1={y(v)} y2={y(v)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />)}
            <rect x={cx(i) - slot * 0.28} y={y(b.q3)} width={slot * 0.56} height={Math.max(y(b.q1) - y(b.q3), 1)} rx="4" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
            <line x1={cx(i) - slot * 0.28} x2={cx(i) + slot * 0.28} y1={y(b.median)} y2={y(b.median)} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            {b.outliers?.map((v, k) => <circle key={k} cx={cx(i)} cy={y(v)} r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />)}
          </g>
        ))}
        {groups.map((b, i) => <text key={b.label} x={cx(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">{b.label}</text>)}
      </svg>
      {g && (
        <div className="pointer-events-none absolute top-1 z-10 grid min-w-28 gap-0.5 rounded-lg border bg-popover px-2.5 py-2 text-xs shadow-lg" style={{ left: `${(cx(hover!) / W) * 100}%`, transform: `translateX(${hover! > groups.length / 2 ? '-110%' : '10%'})` }}>
          <p className="mb-0.5 font-medium">{g.label}</p>
          {([['Max', g.max], ['Q3', g.q3], ['Median', g.median], ['Q1', g.q1], ['Min', g.min]] as const).map(([k, v]) => <p key={k} className="flex justify-between gap-4 text-muted-foreground">{k}<span className="font-medium tabular-nums text-foreground">{format(v)}</span></p>)}
        </div>
      )}
    </div>
  );
}
