import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface PackItem {
  label: string;
  value: number;
  /** Any text color class. Defaults cycle through primary, success, warning, info, destructive. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info', 'text-destructive'];

/**
 * Circle packing: one bubble per item, area proportional to value, squeezed together into one cluster (users by country, revenue by customer, tags by use).
 * Bubbles pop out from the center biggest first on scroll; hover one to read its label and share. Fills the width you give it.
 */
export function CirclePackChart({ items, height = 320, format = (n) => n.toLocaleString('en-IN'), className }: { items: PackItem[]; height?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const total = items.reduce((s, d) => s + d.value, 0) || 1;

  const circles = React.useMemo(() => {
    const sorted = items.map((it, i) => ({ ...it, i })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
    const max = sorted[0]?.value ?? 1;
    const placed: { x: number; y: number; r: number; i: number; label: string; value: number; color?: string }[] = [];
    for (const d of sorted) {
      const r = 14 + Math.sqrt(d.value / max) * 70;
      if (!placed.length) { placed.push({ ...d, x: 0, y: 0, r }); continue; }
      // walk outward on a spiral until the circle fits without touching another
      let t = 0, done = false;
      while (!done && t < 4000) {
        const dist = 2 + t * 0.35, ang = t * 0.5;
        const x = Math.cos(ang) * dist, y = Math.sin(ang) * dist;
        if (placed.every((p) => (p.x - x) ** 2 + (p.y - y) ** 2 >= (p.r + r + 3) ** 2)) { placed.push({ ...d, x, y, r }); done = true; }
        t++;
      }
    }
    const x0 = Math.min(...placed.map((p) => p.x - p.r)), x1 = Math.max(...placed.map((p) => p.x + p.r));
    const y0 = Math.min(...placed.map((p) => p.y - p.r)), y1 = Math.max(...placed.map((p) => p.y + p.r));
    return { placed, box: [x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8] as const };
  }, [items]);
  const h = hover === null ? null : circles.placed.find((p) => p.i === hover)!;

  return (
    <div ref={ref} className={cn('relative w-full', className)} style={{ height }}>
      <svg viewBox={circles.box.join(' ')} className="size-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Circle packing of ${circles.placed.length} items`} onMouseLeave={() => setHover(null)}>
        {circles.placed.map((p, k) => (
          <g key={p.label} className={cn(p.color ?? palette[p.i % palette.length], 'cursor-pointer')} onMouseEnter={() => setHover(p.i)} style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: on ? (hover === p.i ? 'scale(1.06)' : 'scale(1)') : 'scale(0)', opacity: hover !== null && hover !== p.i ? 0.4 : 1, transition: `transform 600ms cubic-bezier(0.34,1.56,0.64,1) ${on && hover === null ? k * 70 : 0}ms, opacity 200ms` }}>
            <circle cx={p.x} cy={p.y} r={p.r} fill="currentColor" fillOpacity="0.85" />
            {p.r > 30 && <text x={p.x} y={p.y} dy="-0.1em" textAnchor="middle" className="fill-primary-foreground font-medium" style={{ fontSize: Math.min(13, p.r / 3.2) }}>{p.label}</text>}
            {p.r > 30 && <text x={p.x} y={p.y} dy="1.2em" textAnchor="middle" className="fill-primary-foreground tabular-nums opacity-80" style={{ fontSize: Math.min(11, p.r / 4) }}>{format(p.value)}</text>}
          </g>
        ))}
      </svg>
      {h && (
        <div className="pointer-events-none absolute right-2 top-2 rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-lg">
          <p className="font-medium">{h.label}</p>
          <p className="text-muted-foreground">{format(h.value)} · {Math.round((h.value / total) * 100)}%</p>
        </div>
      )}
    </div>
  );
}
