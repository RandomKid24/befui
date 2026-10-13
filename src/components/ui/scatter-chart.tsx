'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface ScatterPoint {
  x: number;
  y: number;
  /** Makes it a bubble: area scales with the value. */
  size?: number;
  label?: string;
  /** Index into `groups`. */
  group?: number;
}

export interface ScatterGroup {
  name: string;
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];
const W = 600;
const H = 300;
const pad = { l: 46, r: 14, t: 14, b: 40 };

const nice = (max: number) => {
  const p = 10 ** Math.floor(Math.log10(max || 1));
  return Math.ceil(max / p / 2) * p * 2 || 1;
};

/**
 * Scatter and bubble chart in plain SVG. Points pop in one by one when scrolled into view; hover the nearest point for its readout.
 * Give points a `size` for bubbles and a `group` to color them by category. `xLabel` and `yLabel` name the axes.
 */
export function ScatterChart({
  points,
  groups = [{ name: 'Points' }],
  xLabel,
  yLabel,
  formatX = (n) => String(n),
  formatY = (n) => String(n),
  className,
}: {
  points: ScatterPoint[];
  groups?: ScatterGroup[];
  xLabel?: string;
  yLabel?: string;
  formatX?: (n: number) => string;
  formatY?: (n: number) => string;
  className?: string;
}) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const xMax = nice(Math.max(...points.map((p) => p.x)));
  const yMax = nice(Math.max(...points.map((p) => p.y)));
  const sMax = Math.max(...points.map((p) => p.size ?? 0), 1);
  const X = (v: number) => pad.l + (v / xMax) * (W - pad.l - pad.r);
  const Y = (v: number) => pad.t + (1 - v / yMax) * (H - pad.t - pad.b);
  const radius = (p: ScatterPoint) => (p.size === undefined ? 5 : 3 + Math.sqrt(p.size / sMax) * 11);
  const color = (p: ScatterPoint) => groups[p.group ?? 0]?.color ?? palette[(p.group ?? 0) % palette.length];
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const py = ((e.clientY - r.top) / r.height) * H;
    let best = -1;
    let d = 28 ** 2;
    points.forEach((p, i) => {
      const dd = (X(p.x) - px) ** 2 + (Y(p.y) - py) ** 2;
      if (dd < d) { d = dd; best = i; }
    });
    setHover(best < 0 ? null : best);
  };
  const hp = hover === null ? null : points[hover]!;

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" onPointerMove={move} onPointerLeave={() => setHover(null)} role="img" aria-label={`Scatter chart of ${points.length} points`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={Y(t * yMax)} y2={Y(t * yMax)} className="stroke-border" strokeDasharray={t ? '3 4' : undefined} />
            <text x={pad.l - 8} y={Y(t * yMax) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{formatY(t * yMax)}</text>
            <text x={X(t * xMax)} y={H - pad.b + 16} textAnchor="middle" className="fill-muted-foreground text-[10px]">{formatX(t * xMax)}</text>
          </g>
        ))}
        {xLabel && <text x={(pad.l + W - pad.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[11px]">{xLabel}</text>}
        {yLabel && <text transform={`translate(11 ${(pad.t + H - pad.b) / 2}) rotate(-90)`} textAnchor="middle" className="fill-muted-foreground text-[11px]">{yLabel}</text>}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={X(p.x)}
            cy={Y(p.y)}
            r={radius(p)}
            fill="currentColor"
            fillOpacity={p.size === undefined ? 0.85 : 0.45}
            stroke="currentColor"
            strokeWidth={p.size === undefined ? 0 : 1.5}
            className={cn(color(p), 'transition-opacity')}
            opacity={hover !== null && hover !== i ? 0.35 : 1}
            style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: on ? 'scale(1)' : 'scale(0)', transition: `transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${Math.min(i * 18, 900)}ms, opacity 150ms` }}
          />
        ))}
        {hp && <circle cx={X(hp.x)} cy={Y(hp.y)} r={radius(hp) + 4} fill="none" stroke="currentColor" strokeWidth="1.5" className={color(hp)} />}
      </svg>
      {hp && (
        <div className="pointer-events-none absolute z-10 min-w-24 rounded-lg border bg-popover px-2.5 py-2 text-xs shadow-lg" style={{ left: `${(X(hp.x) / W) * 100}%`, top: `${(Y(hp.y) / H) * 100}%`, transform: `translate(${hp.x > xMax / 2 ? 'calc(-100% - 14px)' : '14px'}, -50%)` }}>
          {hp.label && <p className="mb-0.5 font-medium">{hp.label}</p>}
          <p className="text-muted-foreground">{xLabel ?? 'x'}: <span className="font-medium text-foreground tabular-nums">{formatX(hp.x)}</span></p>
          <p className="text-muted-foreground">{yLabel ?? 'y'}: <span className="font-medium text-foreground tabular-nums">{formatY(hp.y)}</span></p>
          {hp.size !== undefined && <p className="text-muted-foreground">Size: <span className="font-medium text-foreground tabular-nums">{hp.size}</span></p>}
        </div>
      )}
      {groups.length > 1 && (
        <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {groups.map((g, gi) => <li key={g.name} className="flex items-center gap-1.5"><span className={cn('size-2 rounded-full bg-current', g.color ?? palette[gi % palette.length])} />{g.name}</li>)}
        </ul>
      )}
    </div>
  );
}
