'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface GaugeBand {
  /** Where this band ends on the scale; bands run in order from `min`. */
  to: number;
  /** Any text color class. */
  color: string;
  label?: string;
}

const A = Math.PI;
const pt = (cx: number, cy: number, r: number, t: number) => [cx - Math.cos(t * A) * r, cy - Math.sin(t * A) * r] as const;

/**
 * Speedometer: a half circle in coloured bands (good, fair, poor) with a needle that swings to the value and a big number under it.
 * Unlike the plain gauge, the bands show where the value sits on the scale, so you can see how close it is to the next zone.
 */
export function RangeGauge({ value, bands, min = 0, label, format = (n) => String(n), size = 240, className }: { value: number; bands: GaugeBand[]; min?: number; label?: string; format?: (n: number) => string; size?: number; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const max = bands[bands.length - 1]?.to ?? 100;
  const t = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const band = bands.find((b) => value <= b.to) ?? bands[bands.length - 1];
  const cx = 120, cy = 112, r = 92;
  let from = min;
  return (
    <div ref={ref} className={cn('inline-block text-center', className)} style={{ width: size }} role="meter" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-label={label}>
      <svg viewBox="0 0 240 132" className="w-full overflow-visible">
        {bands.map((b, i) => {
          const a = (from - min) / (max - min), z = (b.to - min) / (max - min);
          from = b.to;
          const [x1, y1] = pt(cx, cy, r, a + (i ? 0.006 : 0)), [x2, y2] = pt(cx, cy, r, z - (i < bands.length - 1 ? 0.006 : 0));
          return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`} fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="butt" className={b.color} style={{ opacity: on ? 1 : 0, transition: `opacity 400ms ${i * 150}ms` }} />;
        })}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${(on ? t : 0) * 180 - 90}deg)`, transition: 'transform 1200ms cubic-bezier(0.34,1.3,0.64,1) 300ms' }}>
          <path d={`M${cx - 4} ${cy}L${cx} ${cy - r + 12}L${cx + 4} ${cy}Z`} className="fill-foreground" />
        </g>
        <circle cx={cx} cy={cy} r="7" className="fill-foreground stroke-background" strokeWidth="3" />
        <text x={cx - r} y={cy + 16} textAnchor="middle" className="fill-muted-foreground text-[10px]">{format(min)}</text>
        <text x={cx + r} y={cy + 16} textAnchor="middle" className="fill-muted-foreground text-[10px]">{format(max)}</text>
      </svg>
      <p className="-mt-1 text-3xl font-semibold tabular-nums">{format(value)}</p>
      <p className={cn('text-sm font-medium', band?.color)}>{band?.label ?? label}</p>
    </div>
  );
}
