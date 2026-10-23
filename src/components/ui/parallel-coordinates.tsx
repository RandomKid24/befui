'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface ParallelAxis {
  key: string;
  label: string;
  /** Defaults to the smallest and largest value in the data. */
  min?: number;
  max?: number;
  format?: (n: number) => string;
}

export interface ParallelRow {
  name: string;
  values: Record<string, number>;
  /** Index into `groups`. */
  group?: number;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];
const W = 640;
const H = 280;
const pad = { l: 40, r: 40, t: 34, b: 14 };

/**
 * One vertical axis per measure and one line per item, crossing every axis at its value. Lines that run together are alike;
 * lines that cross are opposites. Hover a line (or its legend entry) to pull it out from the rest.
 */
export function ParallelCoordinates({
  axes,
  rows,
  groups,
  className,
}: {
  axes: ParallelAxis[];
  rows: ParallelRow[];
  groups?: { name: string; color?: string }[];
  className?: string;
}) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const scale = axes.map((a) => {
    const vals = rows.map((r) => r.values[a.key] ?? 0);
    return { min: a.min ?? Math.min(...vals), max: a.max ?? Math.max(...vals) };
  });
  const X = (i: number) => (axes.length < 2 ? W / 2 : pad.l + (i / (axes.length - 1)) * (W - pad.l - pad.r));
  const Y = (i: number, v: number) => {
    const { min, max } = scale[i]!;
    return pad.t + (1 - (v - min) / (max - min || 1)) * (H - pad.t - pad.b);
  };
  const color = (r: ParallelRow) => groups?.[r.group ?? 0]?.color ?? palette[(r.group ?? 0) % palette.length];
  const path = (r: ParallelRow) => axes.map((a, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(i, r.values[a.key] ?? 0).toFixed(1)}`).join(' ');
  const hr = hover === null ? null : rows[hover]!;

  return (
    <div className={cn('w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Parallel coordinates of ${rows.length} items across ${axes.length} measures`}>
        {rows.map((r, i) => (
          <g key={i}>
            <path d={path(r)} fill="none" stroke="transparent" strokeWidth="12" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} />
            <path
              d={path(r)}
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth={hover === i ? 3 : 1.75}
              strokeLinejoin="round"
              strokeLinecap="round"
              className={cn(color(r), 'pointer-events-none')}
              opacity={hover === null ? 0.75 : hover === i ? 1 : 0.12}
              style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms, opacity 150ms, stroke-width 150ms` }}
            />
          </g>
        ))}
        {axes.map((a, i) => (
          <g key={a.key}>
            <line x1={X(i)} x2={X(i)} y1={pad.t} y2={H - pad.b} className="stroke-border" strokeWidth="1.5" />
            <text x={X(i)} y={14} textAnchor="middle" className="fill-foreground text-[11px] font-medium">{a.label}</text>
            <text x={X(i)} y={pad.t - 6} textAnchor="middle" className="fill-muted-foreground text-[9px]">{(a.format ?? String)(scale[i]!.max)}</text>
            <text x={X(i)} y={H - 2} textAnchor="middle" className="fill-muted-foreground text-[9px]">{(a.format ?? String)(scale[i]!.min)}</text>
            {hr && <circle cx={X(i)} cy={Y(i, hr.values[a.key] ?? 0)} r="4" className={cn('fill-background stroke-current', color(hr))} strokeWidth="2" />}
          </g>
        ))}
      </svg>
      <div className="mt-1 min-h-5 text-center text-xs text-muted-foreground" aria-live="polite">
        {hr ? <><span className="font-medium text-foreground">{hr.name}</span>{axes.map((a, i) => ` · ${a.label} ${(a.format ?? String)(hr.values[a.key] ?? 0)}`).join('')}</> : 'Hover a line'}
      </div>
      {groups && groups.length > 1 && (
        <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {groups.map((g, gi) => <li key={g.name} className="flex items-center gap-1.5"><span className={cn('h-0.5 w-4 rounded bg-current', g.color ?? palette[gi % palette.length])} />{g.name}</li>)}
        </ul>
      )}
    </div>
  );
}
