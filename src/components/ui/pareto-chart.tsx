import * as React from 'react';
import { cn } from '@/lib/utils';
import { smoothPath } from './area-chart';
import { useChartIn } from './charts';

const W = 600;
const H = 260;
const pad = { l: 44, r: 44, t: 14, b: 30 };

/**
 * Pareto chart: causes sorted from biggest to smallest as bars, with a running-total line on top. It shows whether a few causes
 * make most of the problem (the 80/20 rule): where the line crosses the dashed 80% mark is how many causes matter.
 * Pass items in any order; they are sorted for you. Bars rise, then the line draws across.
 */
export function ParetoChart({ items, format = (n) => n.toLocaleString('en-IN'), className }: { items: { label: string; value: number }[]; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, d) => s + d.value, 0) || 1;
  let run = 0;
  const cum = sorted.map((d) => (run += d.value) / total);
  const max = Math.max(...sorted.map((d) => d.value), 1);
  const n = sorted.length;
  const slot = (W - pad.l - pad.r) / n;
  const cx = (i: number) => pad.l + slot * (i + 0.5);
  const yv = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const yp = (p: number) => pad.t + (1 - p) * (H - pad.t - pad.b);
  const cut = cum.findIndex((p) => p >= 0.8);

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Pareto chart: ${cut + 1} of ${n} causes make 80 percent`} onMouseLeave={() => setHover(null)}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={yp(t)} y2={yp(t)} className="stroke-border" strokeDasharray={t ? '3 4' : undefined} />
            <text x={pad.l - 8} y={yp(t) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{format(Math.round(t * max))}</text>
            <text x={W - pad.r + 8} y={yp(t) + 3.5} className="fill-muted-foreground text-[10px]">{t * 100}%</text>
          </g>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={yp(0.8)} y2={yp(0.8)} className="stroke-warning" strokeDasharray="5 4" strokeWidth="1.25" />
        <text x={W - pad.r - 4} y={yp(0.8) - 5} textAnchor="end" className="fill-warning text-[10px] font-medium">80%</text>
        {sorted.map((d, i) => (
          <g key={d.label} onMouseEnter={() => setHover(i)}>
            <rect x={cx(i) - slot / 2} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent" />
            <rect x={cx(i) - slot * 0.32} y={yv(d.value)} width={slot * 0.64} height={H - pad.b - yv(d.value)} rx="4" className={i <= cut ? 'fill-primary' : 'fill-muted-foreground/40'} style={{ transformBox: 'view-box', transformOrigin: `0px ${H - pad.b}px`, transform: on ? 'scaleY(1)' : 'scaleY(0)', opacity: hover !== null && hover !== i ? 0.5 : 1, transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms, opacity 150ms` }} />
            <text x={cx(i)} y={H - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">{d.label}</text>
          </g>
        ))}
        <path d={smoothPath(cum.map((p, i) => [cx(i), yp(p)] as [number, number]))} fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: `stroke-dashoffset 1300ms cubic-bezier(0.22,1,0.36,1) ${n * 80 + 200}ms` }} />
        {cum.map((p, i) => <circle key={i} cx={cx(i)} cy={yp(p)} r="3.5" className="fill-background stroke-foreground" strokeWidth="2" style={{ opacity: on ? 1 : 0, transition: `opacity 300ms ease-out ${n * 80 + 400 + i * 100}ms` }} />)}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-1 z-10 grid gap-0.5 rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-lg" style={{ left: `${(cx(hover) / W) * 100}%`, transform: 'translateX(-50%)' }}>
          <p className="font-medium">{sorted[hover]!.label}</p>
          <p className="text-muted-foreground">{format(sorted[hover]!.value)} · running total {Math.round(cum[hover]! * 100)}%</p>
        </div>
      )}
    </div>
  );
}
