'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

const palette = ['text-primary', 'text-success', 'text-warning'];

/**
 * Venn diagram for two or three groups: who is in one, who is in both (customers on web, on mobile, on both; skills shared between teams).
 * `sets` names the groups. `values` counts each region, keyed by the group ids joined with "+": { a: 120, b: 90, 'a+b': 40 }.
 * Circles slide together on scroll; hover a group to light up its whole circle and see its total.
 */
export function VennChart({ sets, values, size = 300, className }: { sets: { id: string; label: string; color?: string }[]; values: Record<string, number>; size?: number; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<string | null>(null);
  const n = Math.min(sets.length, 3);
  const r = size * (n === 2 ? 0.27 : 0.22);
  const d = r * 1.05;
  const c = size / 2;
  const centers = n === 2 ? [[c - d / 2, c], [c + d / 2, c]] : [[c - d / 2, c - d * 0.3], [c + d / 2, c - d * 0.3], [c, c + d * 0.58]];
  const centroid = [centers.reduce((s, p) => s + p[0]!, 0) / n, centers.reduce((s, p) => s + p[1]!, 0) / n] as const;
  const key = (idx: number[]) => idx.map((i) => sets[i]!.id).sort().join('+');
  const val = (idx: number[]) => values[key(idx)] ?? values[idx.map((i) => sets[i]!.id).join('+')] ?? 0;
  const subsets: number[][] = n === 2 ? [[0], [1], [0, 1]] : [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]];
  const total = (i: number) => subsets.filter((s) => s.includes(i)).reduce((a, s) => a + val(s), 0);
  const labelPos = (s: number[]) => {
    const m = [s.reduce((a, i) => a + centers[i]![0]!, 0) / s.length, s.reduce((a, i) => a + centers[i]![1]!, 0) / s.length];
    const out = s.length === 1 ? r * 0.55 : s.length === 2 && n === 3 ? r * 0.3 : 0;
    const vx = m[0]! - centroid[0], vy = m[1]! - centroid[1];
    const len = Math.hypot(vx, vy) || 1;
    return [m[0]! + (vx / len) * out, m[1]! + (vy / len) * out] as const;
  };
  const color = (i: number) => sets[i]!.color ?? palette[i % palette.length];

  return (
    <div ref={ref} className={cn('mx-auto grid justify-items-center gap-3', className)} style={{ width: size }}>
      <svg width={size} height={size * (n === 2 ? 0.7 : 0.95)} viewBox={`0 ${n === 2 ? size * 0.15 : size * 0.02} ${size} ${size * (n === 2 ? 0.7 : 0.95)}`} role="img" aria-label={sets.map((s, i) => `${s.label} ${total(i)}`).join(', ')} onMouseLeave={() => setHover(null)}>
        {sets.slice(0, n).map((s, i) => (
          <circle key={s.id} cx={on ? centers[i]![0] : c} cy={on ? centers[i]![1] : c} r={r} fill="currentColor" fillOpacity={hover === s.id ? 0.5 : 0.28} stroke="currentColor" strokeWidth="2" className={cn(color(i), 'cursor-pointer')} onMouseEnter={() => setHover(s.id)} style={{ transition: `cx 900ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, cy 900ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, fill-opacity 200ms` }} />
        ))}
        {subsets.map((s) => {
          const [x, y] = labelPos(s);
          return <text key={key(s)} x={x} y={y} dy="0.35em" textAnchor="middle" className="pointer-events-none fill-foreground text-[14px] font-semibold tabular-nums" style={{ opacity: on ? 1 : 0, transition: 'opacity 500ms ease-out 800ms' }}>{val(s)}</text>;
        })}
      </svg>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {sets.slice(0, n).map((s, i) => <li key={s.id} className={cn('flex items-center gap-1.5 transition-opacity', hover && hover !== s.id && 'opacity-40')} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}><span className={cn('size-2 rounded-full bg-current', color(i))} />{s.label}<span className="font-medium tabular-nums text-foreground">{total(i)}</span></li>)}
      </ul>
    </div>
  );
}
