import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface TreemapItem {
  label: string;
  value: number;
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];

interface Rect { x: number; y: number; w: number; h: number }

/** Squarified layout: tiles stay close to square. Works in a 0..100 box, so it scales to any container. */
function squarify(values: number[], W: number, H: number): Rect[] {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const areas = values.map((v) => (v / total) * W * H);
  const out: Rect[] = new Array(values.length);
  let x = 0, y = 0, w = W, h = H, i = 0;
  const worst = (row: number[], s: number) => {
    const sum = row.reduce((a, b) => a + b, 0);
    return Math.max((s * s * Math.max(...row)) / (sum * sum), (sum * sum) / (s * s * Math.min(...row)));
  };
  while (i < areas.length) {
    const s = Math.min(w, h);
    let n = 1;
    while (i + n < areas.length && worst(areas.slice(i, i + n + 1), s) <= worst(areas.slice(i, i + n), s)) n++;
    const row = areas.slice(i, i + n);
    const sum = row.reduce((a, b) => a + b, 0);
    if (w >= h) {
      const cw = sum / h;
      let cy = y;
      row.forEach((a, k) => { out[i + k] = { x, y: cy, w: cw, h: a / cw }; cy += a / cw; });
      x += cw; w -= cw;
    } else {
      const rh = sum / w;
      let cx = x;
      row.forEach((a, k) => { out[i + k] = { x: cx, y, w: a / rh, h: rh }; cx += a / rh; });
      y += rh; h -= rh;
    }
    i += n;
  }
  return out;
}

/**
 * Treemap: one tile per item, area proportional to value (budget by team, revenue by product, disk by folder).
 * Tiles spring in from the center on scroll; hover lifts one and dims the rest. Give it a height, it fills the width.
 */
export function Treemap({ items, height = 280, format = (n) => n.toLocaleString('en-IN'), className }: { items: TreemapItem[]; height?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const sorted = React.useMemo(() => items.map((it, i) => ({ ...it, i })).filter((it) => it.value > 0).sort((a, b) => b.value - a.value), [items]);
  const rects = React.useMemo(() => squarify(sorted.map((s) => s.value), 100, 100), [sorted]);
  const total = sorted.reduce((s, it) => s + it.value, 0);

  return (
    <div ref={ref} className={cn('relative w-full', className)} style={{ height }} role="img" aria-label={`Treemap of ${sorted.length} items`}>
      {sorted.map((it, k) => {
        const r = rects[k]!;
        const big = r.w > 14 && r.h > 16;
        return (
          <div key={it.label} className="absolute p-[2px]" style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)}>
            <div
              className={cn('relative size-full overflow-hidden rounded-lg', it.color ?? palette[it.i % palette.length])}
              style={{ opacity: on ? (hover !== null && hover !== k ? 0.45 : 1) : 0, transform: on ? (hover === k ? 'scale(1.02)' : 'scale(1)') : 'scale(0.6)', transition: `transform 600ms cubic-bezier(0.34,1.56,0.64,1) ${on && hover === null ? k * 55 : 0}ms, opacity 500ms ease-out ${on && hover === null ? k * 55 : 0}ms`, zIndex: hover === k ? 1 : 0 }}
            >
              <span aria-hidden className="absolute inset-0 bg-current opacity-80" />
              <span className="relative grid h-full content-start gap-0.5 p-2.5 text-primary-foreground">
                {big && <span className="truncate text-[13px] font-medium">{it.label}</span>}
                {(big || hover === k) && <span className="text-xs tabular-nums opacity-80">{format(it.value)}{big && ` · ${Math.round((it.value / total) * 100)}%`}</span>}
              </span>
              {!big && hover === k && <span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{it.label}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
