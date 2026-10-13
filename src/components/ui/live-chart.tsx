'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const W = 600;

/**
 * Streaming line chart that scrolls left as new points arrive: active users, requests per second, CPU.
 * `next(prev)` returns the next value every `intervalMs`. Set `paused` to freeze it. The line slides smoothly between ticks
 * (a plain jump with reduced motion). Colored with a text-* class.
 */
export function LiveChart({
  next,
  points = 40,
  intervalMs = 1000,
  height = 120,
  paused,
  format = (n) => String(Math.round(n)),
  className,
}: {
  next: (prev: number) => number;
  points?: number;
  intervalMs?: number;
  height?: number;
  paused?: boolean;
  format?: (n: number) => string;
  className?: string;
}) {
  const nextRef = React.useRef(next);
  nextRef.current = next;
  const [data, setData] = React.useState<number[]>(() => {
    const a: number[] = [];
    for (let i = 0; i < points + 1; i++) a.push(nextRef.current(a[i - 1] ?? 50));
    return a;
  });
  const g = React.useRef<SVGGElement>(null);
  const step = W / (points - 1);
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setData((d) => [...d.slice(1), nextRef.current(d[d.length - 1]!)]), intervalMs);
    return () => clearInterval(id);
  }, [paused, intervalMs]);

  // Snap back one step, then slide one step left over the interval: the line never jumps.
  React.useEffect(() => {
    const el = g.current;
    if (!el || reduce) return;
    el.style.transition = 'none';
    el.style.transform = 'translateX(0)';
    el.getBoundingClientRect();
    el.style.transition = paused ? 'none' : `transform ${intervalMs}ms linear`;
    el.style.transform = paused ? 'translateX(0)' : `translateX(${-step}px)`;
  }, [data, paused, intervalMs, step, reduce]);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const y = (v: number) => 8 + (1 - (v - min) / span) * (height - 16);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = data[data.length - 2]!;

  return (
    <div className={cn('relative text-primary', className)}>
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="w-full overflow-hidden" style={{ height }} role="img" aria-label={`Live value ${format(last)}`}>
        <g ref={g}>
          <path d={`${line} L${(data.length - 1) * step},${height} L0,${height} Z`} fill="currentColor" fillOpacity="0.1" />
          <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <span className="absolute right-0 top-0 rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-primary-foreground">{format(last)}</span>
    </div>
  );
}
