import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface SunburstNode {
  label: string;
  /** Leaf value. Parents add up their children, so leave it off for a node with `children`. */
  value?: number;
  children?: SunburstNode[];
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info', 'text-destructive'];
const sum = (n: SunburstNode): number => (n.children?.length ? n.children.reduce((s, c) => s + sum(c), 0) : n.value ?? 0);

interface Arc { key: string; label: string; value: number; depth: number; a0: number; a1: number; top: number }

/**
 * Sunburst: a hierarchy as concentric rings, the center is the whole and each ring splits its parent (spend by team and project, files by folder).
 * Rings sweep outward on scroll; hover a slice to light up its parents and children and read it in the middle.
 */
export function SunburstChart({ data, size = 300, format = (n) => n.toLocaleString('en-IN'), className }: { data: SunburstNode[]; size?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<Arc | null>(null);
  const total = data.reduce((s, n) => s + sum(n), 0) || 1;

  const { arcs, depth } = React.useMemo(() => {
    const out: Arc[] = [];
    let maxD = 0;
    const walk = (nodes: SunburstNode[], a0: number, a1: number, d: number, prefix: string, top: number | null) => {
      const t = nodes.reduce((s, n) => s + sum(n), 0) || 1;
      let a = a0;
      nodes.forEach((n, i) => {
        const v = sum(n);
        const span = ((a1 - a0) * v) / t;
        const key = prefix ? `${prefix}-${i}` : String(i);
        const arc = { key, label: n.label, value: v, depth: d, a0: a, a1: a + span, top: top ?? i };
        out.push(arc);
        maxD = Math.max(maxD, d);
        if (n.children?.length) walk(n.children, a, a + span, d + 1, key, arc.top);
        a += span;
      });
    };
    walk(data, 0, Math.PI * 2, 0, '', null);
    return { arcs: out, depth: maxD + 1 };
  }, [data]);

  const c = size / 2;
  const inner = size * 0.2;
  const ring = (c - inner - 2) / depth;
  const pt = (r: number, a: number) => `${(c + r * Math.sin(a)).toFixed(2)},${(c - r * Math.cos(a)).toFixed(2)}`;
  const d = (a: Arc) => {
    const r0 = inner + a.depth * ring + 1.5, r1 = inner + (a.depth + 1) * ring - 1.5;
    const a0 = a.a0 + 0.004, a1 = Math.min(a.a1 - 0.004, a.a0 + Math.PI * 2 - 0.001);
    if (a1 <= a0) return '';
    const big = a1 - a0 > Math.PI ? 1 : 0;
    return `M${pt(r0, a0)} L${pt(r1, a0)} A${r1},${r1} 0 ${big} 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0},${r0} 0 ${big} 0 ${pt(r0, a0)} Z`;
  };
  const related = (a: Arc) => !hover || a.key.startsWith(hover.key) || hover.key.startsWith(a.key);

  return (
    <div ref={ref} className={cn('relative mx-auto', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Sunburst chart" onMouseLeave={() => setHover(null)}>
        {arcs.map((a) => (
          <path
            key={a.key}
            d={d(a)}
            fill="currentColor"
            className={cn(palette[a.top % palette.length], 'cursor-pointer')}
            onMouseEnter={() => setHover(a)}
            style={{ transformBox: 'view-box', transformOrigin: 'center', transform: on ? 'scale(1)' : 'scale(0.5)', opacity: on ? (related(a) ? 1 - a.depth * 0.2 : 0.15) : 0, transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${a.depth * 160}ms, opacity ${on && !hover ? 600 : 200}ms ease-out ${on && !hover ? a.depth * 160 : 0}ms` }}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div className="grid max-w-[40%] gap-0.5">
          <span className="truncate text-sm font-semibold tabular-nums">{format(hover ? hover.value : total)}</span>
          <span className="truncate text-[11px] text-muted-foreground">{hover ? `${hover.label} · ${Math.round((hover.value / total) * 100)}%` : 'Total'}</span>
        </div>
      </div>
    </div>
  );
}
