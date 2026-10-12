import * as React from 'react';
import { cn } from '@/lib/utils';
import { smoothPath } from './area-chart';
import { useChartIn } from './charts';

export interface RidgeSeries {
  name: string;
  data: number[];
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];
const W = 600;
const padL = 84;

/**
 * Ridgeline chart: one smooth curve per row, stacked so they overlap like mountain ridges (activity by hour per team, score distributions, seasonality per city).
 * All rows share one scale, so heights compare. Ridges rise from their baseline in turn on scroll; hover one to bring it forward.
 */
export function RidgelineChart({ series, labels, step = 44, className }: { series: RidgeSeries[]; labels: string[]; step?: number; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const n = labels.length;
  const max = Math.max(...series.flatMap((s) => s.data), 1);
  const top = step * 1.4;
  const H = top + series.length * step + 22;
  const x = (i: number) => padL + (n === 1 ? 0 : (i / (n - 1)) * (W - padL - 8));
  const base = (k: number) => top + (k + 1) * step - 4;
  const amp = step * 2;
  const color = (k: number) => series[k]!.color ?? palette[k % palette.length];

  return (
    <div className={cn('w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={series.map((s) => s.name).join(', ')} onMouseLeave={() => setHover(null)}>
        {labels.map((l, i) => (n <= 8 || i % Math.ceil(n / 8) === 0) && <text key={l + i} x={x(i)} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">{l}</text>)}
        {series.map((s, k) => {
          const pts = s.data.map((v, i) => [x(i), base(k) - (v / max) * amp] as [number, number]);
          const line = smoothPath(pts);
          const dim = hover !== null && hover !== k;
          return (
            <g key={s.name} className={cn(color(k), 'cursor-pointer')} onMouseEnter={() => setHover(k)} style={{ transformBox: 'view-box', transformOrigin: `0px ${base(k)}px`, transform: on ? 'scaleY(1)' : 'scaleY(0)', opacity: dim ? 0.35 : 1, transition: `transform 900ms cubic-bezier(0.22,1,0.36,1) ${k * 110}ms, opacity 200ms` }}>
              <path d={`${line} L${x(n - 1)},${base(k)} L${x(0)},${base(k)} Z`} fill="currentColor" fillOpacity={hover === k ? 0.75 : 0.55} className="stroke-background" strokeWidth="1" style={{ transition: 'fill-opacity 200ms' }} />
              <path d={line} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
              <line x1={padL - 6} x2={W - 8} y1={base(k)} y2={base(k)} stroke="currentColor" strokeOpacity="0.25" />
              <text x={padL - 12} y={base(k) - 2} textAnchor="end" className="fill-foreground text-[11px] font-medium">{s.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
