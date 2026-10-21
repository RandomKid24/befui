'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface Ring {
  label: string;
  value: number;
  /** The goal; the ring is full at this value. Default 100. */
  max?: number;
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];

/**
 * Concentric progress rings, one per measure (move, exercise, stand), outermost first. Each ring is its own value against its own goal.
 * Rings sweep in on scroll; hover a legend row to isolate its ring. Two to four rings read best.
 */
export function RingChart({ rings, size = 200, format = (n) => String(n), className }: { rings: Ring[]; size?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [focus, setFocus] = React.useState<number | null>(null);
  const stroke = Math.min(18, size / (rings.length * 2 + 4));
  return (
    <div className={cn('inline-flex flex-wrap items-center gap-6', className)}>
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={rings.map((r) => `${r.label} ${format(r.value)} of ${format(r.max ?? 100)}`).join(', ')}>
        {rings.map((r, i) => {
          const rad = size / 2 - stroke / 2 - i * (stroke + 4);
          const c = 2 * Math.PI * rad;
          const pct = Math.min(1, r.value / (r.max ?? 100));
          return (
            <g key={r.label} className={r.color ?? palette[i % palette.length]} style={{ opacity: focus !== null && focus !== i ? 0.2 : 1, transition: 'opacity 200ms' }}>
              <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth={stroke} />
              <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={on ? c * (1 - pct) : c} style={{ transition: `stroke-dashoffset 1100ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms` }} />
            </g>
          );
        })}
      </svg>
      <ul className="grid gap-2 text-sm" onMouseLeave={() => setFocus(null)}>
        {rings.map((r, i) => (
          <li key={r.label} className="flex cursor-default items-center gap-2" onMouseEnter={() => setFocus(i)} style={{ opacity: focus !== null && focus !== i ? 0.4 : 1 }}>
            <span className={cn('size-2.5 rounded-full bg-current', r.color ?? palette[i % palette.length])} />
            <span className="text-muted-foreground">{r.label}</span>
            <span className="ml-auto pl-4 font-medium tabular-nums">{format(r.value)}<span className="text-muted-foreground">/{format(r.max ?? 100)}</span></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
