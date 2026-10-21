'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Slider with two handles for a range, such as a price from 20 to 80. Drag either handle, or focus one and use the arrow keys, Home and End.
 * The handles cannot cross. `value` is `[low, high]`.
 */
export function RangeSlider({ value, onValueChange, min = 0, max = 100, step = 1, format = String, className }: { value: [number, number]; onValueChange: (v: [number, number]) => void; min?: number; max?: number; step?: number; format?: (v: number) => string; className?: string }) {
  const track = React.useRef<HTMLDivElement>(null);
  const [drag, setDrag] = React.useState<0 | 1 | null>(null);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));
  const set = (which: 0 | 1, v: number) => {
    const n = snap(v);
    onValueChange(which === 0 ? [Math.min(n, value[1]), value[1]] : [value[0], Math.max(n, value[0])]);
  };
  const fromX = (x: number) => {
    const r = track.current!.getBoundingClientRect();
    return min + ((x - r.left) / r.width) * (max - min);
  };
  return (
    <div className={cn('w-full pt-7', className)}>
      <div ref={track} className="relative h-1.5 rounded-full bg-secondary">
        <div className="absolute inset-y-0 rounded-full bg-primary" style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }} />
        {([0, 1] as const).map((w) => (
          <div
            key={w}
            role="slider"
            tabIndex={0}
            aria-valuemin={min} aria-valuemax={max} aria-valuenow={value[w]} aria-label={w === 0 ? 'Minimum' : 'Maximum'}
            className="group absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-primary bg-background shadow outline-none transition-shadow focus-visible:ring-4 focus-visible:ring-primary/20 active:cursor-grabbing"
            style={{ left: `${pct(value[w])}%`, zIndex: drag === w || value[0] === value[1] && w === 1 ? 2 : 1 }}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(w); }}
            onPointerMove={(e) => drag === w && set(w, fromX(e.clientX))}
            onPointerUp={() => setDrag(null)}
            onKeyDown={(e) => {
              const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step }[e.key];
              if (d) { e.preventDefault(); set(w, value[w] + d); }
              else if (e.key === 'Home') { e.preventDefault(); set(w, min); }
              else if (e.key === 'End') { e.preventDefault(); set(w, max); }
            }}
          >
            <span className={cn('pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-background transition-opacity', drag === w ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100')}>{format(value[w])}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground tabular-nums"><span>{format(value[0])}</span><span>{format(value[1])}</span></div>
    </div>
  );
}
