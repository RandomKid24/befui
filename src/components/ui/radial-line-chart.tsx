'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface RadialLineSeries {
  name: string;
  data: number[];
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];

/**
 * Radial line chart: a line chart bent into a circle, so the end meets the start. Made for things that repeat (24 hours, 12 months, 7 weekdays).
 * One spoke per label, distance from the center is the value. A smooth closed shape grows from the middle on scroll;
 * move over the chart to read the nearest spoke. `area` fills the shape.
 */
export function RadialLineChart({ series, labels, area = true, size = 300, format = (n) => String(n), className }: { series: RadialLineSeries[]; labels: string[]; area?: boolean; size?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const n = labels.length;
  const c = size / 2;
  const r = c - 28;
  const inner = r * 0.12;
  const max = Math.max(...series.flatMap((s) => s.data), 1);
  const ang = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2;
  const P = (i: number, v: number) => [c + (inner + (v / max) * (r - inner)) * Math.cos(ang(i)), c + (inner + (v / max) * (r - inner)) * Math.sin(ang(i))] as const;
  const closed = (pts: (readonly [number, number])[]) => {
    const m = pts.length;
    let d = `M${pts[0]![0].toFixed(1)},${pts[0]![1].toFixed(1)}`;
    for (let i = 0; i < m; i++) {
      const p0 = pts[(i - 1 + m) % m]!, p1 = pts[i]!, p2 = pts[(i + 1) % m]!, p3 = pts[(i + 2) % m]!;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return `${d} Z`;
  };
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const a = Math.atan2(e.clientY - b.top - b.height / 2, e.clientX - b.left - b.width / 2) + Math.PI / 2;
    setHover(Math.round(((a + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * n) % n);
  };
  const color = (si: number) => series[si]!.color ?? palette[si % palette.length];

  return (
    <div ref={ref} className={cn('relative mx-auto', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible" role="img" aria-label={`Radial line chart over ${labels.join(', ')}`} onPointerMove={move} onPointerLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75, 1].map((t) => <circle key={t} cx={c} cy={c} r={inner + t * (r - inner)} fill="none" className="stroke-border" strokeDasharray={t < 1 ? '3 4' : undefined} />)}
        {labels.map((l, i) => {
          const [x, y] = P(i, max * 1.14);
          const [x0, y0] = P(i, 0);
          const [x1, y1] = P(i, max);
          return (
            <g key={l + i}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} className={hover === i ? 'stroke-muted-foreground' : 'stroke-border'} />
              {(n <= 12 || i % Math.ceil(n / 12) === 0) && <text x={x} y={y} dy="0.35em" textAnchor="middle" className={cn('text-[10px]', hover === i ? 'fill-foreground' : 'fill-muted-foreground')}>{l}</text>}
            </g>
          );
        })}
        {series.map((s, si) => {
          const pts = s.data.map((v, i) => P(i, v));
          const d = closed(pts);
          return (
            <g key={s.name} className={color(si)} style={{ transformBox: 'view-box', transformOrigin: 'center', transform: on ? 'scale(1)' : 'scale(0.05)', opacity: on ? 1 : 0, transition: `transform 1100ms cubic-bezier(0.22,1,0.36,1) ${si * 150}ms, opacity 400ms ease-out ${si * 150}ms` }}>
              {area && <path d={d} fill="currentColor" fillOpacity="0.2" />}
              <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              {hover !== null && <circle cx={pts[hover]![0]} cy={pts[hover]![1]} r="4" fill="currentColor" className="stroke-background" strokeWidth="2" />}
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        {hover !== null && (
          <div className="grid gap-0.5 text-xs">
            <span className="font-medium">{labels[hover]}</span>
            {series.map((s, si) => <span key={s.name} className="flex items-center justify-center gap-1.5 tabular-nums text-muted-foreground"><span className={cn('size-1.5 rounded-full bg-current', color(si))} />{series.length > 1 && `${s.name} `}<span className="font-medium text-foreground">{format(s.data[hover]!)}</span></span>)}
          </div>
        )}
      </div>
    </div>
  );
}
