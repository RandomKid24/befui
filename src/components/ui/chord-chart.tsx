import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info', 'text-destructive'];

/**
 * Chord diagram: how much flows between every pair of items around a circle (migration between cities, messages between teams, trades between desks).
 * `matrix[i][j]` is the amount from i to j. Arcs sweep in, then ribbons fade in; hover an item to keep only its ribbons.
 */
export function ChordChart({ labels, matrix, size = 320, format = (n) => String(n), className }: { labels: string[]; matrix: number[][]; size?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const n = labels.length;
  const c = size / 2;
  const r = c - 56;
  const r0 = r - 12;
  const gap = 0.05;
  const rowSum = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const total = rowSum.reduce((a, b) => a + b, 0) || 1;
  const k = (Math.PI * 2 - n * gap) / total;
  const pt = (rad: number, a: number) => [c + rad * Math.sin(a), c - rad * Math.cos(a)] as const;
  const f = (p: readonly [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

  const { groups, ribbons } = React.useMemo(() => {
    let a = gap / 2;
    const groups = rowSum.map((s, i) => { const g = { i, a0: a, a1: a + s * k }; a = g.a1 + gap; return g; });
    const ribbons: { i: number; j: number; d: string; v: number }[] = [];
    const cursor = groups.map((g) => g.a0);
    const slot: number[][] = matrix.map(() => []);
    // each item hands out a slice of its arc to every partner, in order
    matrix.forEach((row, i) => row.forEach((v, j) => { slot[i]![j] = cursor[i]!; cursor[i]! += v * k; }));
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const vi = matrix[i]![j]!, vj = matrix[j]![i]!;
      if (!vi && !vj) continue;
      const s0 = slot[i]![j]!, s1 = s0 + vi * k, t0 = slot[j]![i]!, t1 = t0 + vj * k;
      const d = `M${f(pt(r0, s0))} A${r0},${r0} 0 ${s1 - s0 > Math.PI ? 1 : 0} 1 ${f(pt(r0, s1))} Q${c},${c} ${f(pt(r0, t0))} A${r0},${r0} 0 ${t1 - t0 > Math.PI ? 1 : 0} 1 ${f(pt(r0, t1))} Q${c},${c} ${f(pt(r0, s0))} Z`;
      ribbons.push({ i, j, d, v: vi + vj });
    }
    return { groups, ribbons };
  }, [matrix, n, k, c, r0]);

  const arc = (a0: number, a1: number) => `M${f(pt(r0, a0))} A${r0},${r0} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f(pt(r0, a1))} L${f(pt(r, a1))} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 0 ${f(pt(r, a0))} Z`;

  return (
    <div ref={ref} className={cn('mx-auto', className)} style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible" role="img" aria-label="Chord diagram" onMouseLeave={() => setHover(null)}>
        {ribbons.map((b, idx) => (
          <path key={idx} d={b.d} fill="currentColor" className={palette[b.i % palette.length]} style={{ opacity: on ? (hover === null || hover === b.i || hover === b.j ? 0.5 : 0.06) : 0, transition: `opacity 600ms ease-out ${on && hover === null ? 700 + idx * 30 : 0}ms` }}>
            <title>{`${labels[b.i]} and ${labels[b.j]}: ${format(b.v)}`}</title>
          </path>
        ))}
        {groups.map((g) => {
          const mid = (g.a0 + g.a1) / 2;
          const [tx, ty] = pt(r + 12, mid);
          return (
            <g key={g.i} className={cn(palette[g.i % palette.length], 'cursor-pointer')} onMouseEnter={() => setHover(g.i)}>
              <path d={arc(g.a0, g.a1)} fill="currentColor" style={{ transformBox: 'view-box', transformOrigin: 'center', transform: on ? 'scale(1)' : 'scale(0.85)', opacity: on ? 1 : 0, transition: `transform 600ms cubic-bezier(0.22,1,0.36,1) ${g.i * 80}ms, opacity 500ms ease-out ${g.i * 80}ms` }} />
              <text x={tx} y={ty} dy="0.35em" textAnchor={Math.sin(mid) > 0.2 ? 'start' : Math.sin(mid) < -0.2 ? 'end' : 'middle'} className="fill-foreground text-[11px] font-medium" style={{ opacity: on ? 1 : 0, transition: `opacity 500ms ease-out ${g.i * 80 + 300}ms` }}>{labels[g.i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
