import * as React from 'react';
import { cn } from '@/lib/utils';
import { smoothPath } from './area-chart';
import { useChartIn } from './charts';

export interface StreamSeries {
  name: string;
  data: number[];
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];
const W = 600;

/**
 * Streamgraph: stacked flows around a center line, so shifts in mix stand out (genres over time, topics in support tickets).
 * Flows ripple in from the left on scroll; hover a flow or its legend entry to bring it forward.
 */
export function StreamChart({ series, labels, height = 240, className }: { series: StreamSeries[]; labels: string[]; height?: number; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const n = labels.length;
  const totals = labels.map((_, i) => series.reduce((s, x) => s + (x.data[i] ?? 0), 0));
  const max = Math.max(...totals, 1);
  const padY = 10;
  const sx = (i: number) => (n === 1 ? 0 : (i / (n - 1)) * W);
  const sy = (v: number) => padY + ((v + max / 2) / max) * (height - 2 * padY - 18);
  // silhouette baseline: every column is centered on the middle
  const edges = series.map((_, si) => labels.map((_, i) => {
    const below = series.slice(0, si).reduce((s, x) => s + (x.data[i] ?? 0), 0);
    return [-totals[i]! / 2 + below, -totals[i]! / 2 + below + (series[si]!.data[i] ?? 0)] as const;
  }));
  const color = (si: number) => series[si]!.color ?? palette[si % palette.length];

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label={series.map((s) => s.name).join(', ')} onMouseLeave={() => setHover(null)}>
        <g style={{ clipPath: on ? 'inset(-5% -5% -5% -5%)' : 'inset(-5% 100% -5% -5%)', transition: 'clip-path 1500ms cubic-bezier(0.22,1,0.36,1)' }}>
          {series.map((s, si) => {
            const top = edges[si]!.map(([lo], i) => [sx(i), sy(lo)] as [number, number]);
            const bottom = edges[si]!.map(([, hi], i) => [sx(i), sy(hi)] as [number, number]);
            const d = `${smoothPath(top)} L${bottom[n - 1]![0]},${bottom[n - 1]![1]} ${smoothPath([...bottom].reverse()).replace(/^M/, 'L')} Z`;
            return <path key={s.name} d={d} fill="currentColor" className={cn(color(si), 'cursor-pointer')} style={{ opacity: hover === null ? 0.85 : hover === si ? 1 : 0.25, transition: 'opacity 250ms' }} onMouseEnter={() => setHover(si)} />;
          })}
        </g>
        {labels.map((l, i) => (n <= 8 || i % Math.ceil(n / 8) === 0) && <text key={l + i} x={sx(i)} y={height - 2} textAnchor="middle" className="fill-muted-foreground text-[10px]">{l}</text>)}
      </svg>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {series.map((s, si) => <li key={s.name} className={cn('flex cursor-default items-center gap-1.5 transition-opacity', hover !== null && hover !== si && 'opacity-40')} onMouseEnter={() => setHover(si)} onMouseLeave={() => setHover(null)}><span className={cn('size-2 rounded-full bg-current', color(si))} />{s.name}</li>)}
      </ul>
    </div>
  );
}
