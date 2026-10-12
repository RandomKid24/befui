import * as React from 'react';
import { cn } from '@/lib/utils';
import { smoothPath } from './area-chart';
import { useChartIn } from './charts';

const W = 600;
const H = 240;
const pad = { l: 40, r: 12, t: 14, b: 30 };

/**
 * Histogram: how many values fall in each range (order sizes, response times, ages, exam scores). Pass the raw `values` and a `bins` count;
 * it does the counting. Bars touch because the ranges touch. A smooth line follows the bar tops to show the overall shape.
 * Bars rise one after another on scroll; hover a bar for its range and count.
 */
export function HistogramChart({ values, bins = 12, format = (n) => String(Math.round(n * 10) / 10), curve = true, className }: { values: number[]; bins?: number; format?: (n: number) => string; curve?: boolean; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const { counts, lo, step } = React.useMemo(() => {
    const lo = Math.min(...values), hi = Math.max(...values);
    const step = (hi - lo || 1) / bins;
    const counts = Array<number>(bins).fill(0);
    values.forEach((v) => { counts[Math.min(bins - 1, Math.floor((v - lo) / step))]!++; });
    return { counts, lo, step };
  }, [values, bins]);
  const max = Math.max(...counts, 1);
  const bw = (W - pad.l - pad.r) / bins;
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const ticks = [0, 0.5, 1].map((t) => Math.round(t * max));

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible text-primary" role="img" aria-label={`Histogram of ${values.length} values in ${bins} ranges`} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray={t ? '3 4' : undefined} />
            <text x={pad.l - 8} y={y(t) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{t}</text>
          </g>
        ))}
        {counts.map((n, i) => (
          <g key={i} onMouseEnter={() => setHover(i)}>
            <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
            <rect x={pad.l + i * bw + 1} y={y(n)} width={bw - 2} height={Math.max(H - pad.b - y(n), 0)} rx="3" fill="currentColor" fillOpacity={hover === i ? 0.95 : 0.6} style={{ transformBox: 'view-box', transformOrigin: `0px ${H - pad.b}px`, transform: on ? 'scaleY(1)' : 'scaleY(0)', transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${i * 45}ms, fill-opacity 150ms` }} />
          </g>
        ))}
        {curve && (
          <path d={smoothPath(counts.map((n, i) => [pad.l + (i + 0.5) * bw, y(n)] as [number, number]))} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: 'stroke-dashoffset 1400ms cubic-bezier(0.22,1,0.36,1) 300ms' }} />
        )}
        {[0, Math.floor(bins / 2), bins].map((i) => <text key={i} x={pad.l + i * bw} y={H - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">{format(lo + i * step)}</text>)}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-1 z-10 rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-lg" style={{ left: `${((pad.l + (hover + 0.5) * bw) / W) * 100}%`, transform: 'translateX(-50%)' }}>
          <p className="font-medium">{format(lo + hover * step)} to {format(lo + (hover + 1) * step)}</p>
          <p className="text-muted-foreground">{counts[hover]} values</p>
        </div>
      )}
    </div>
  );
}
