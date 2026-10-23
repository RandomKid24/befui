'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface GraphNode {
  id: string;
  label?: string;
  /** Index into `groups`. */
  group?: number;
  /** Bigger value, bigger dot. Defaults to the number of links. */
  value?: number;
}
export interface GraphLink { source: string; target: string; weight?: number }

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];
const W = 600;
const H = 360;

/** Spring layout, run once and deterministic: nodes push apart, links pull together, everything is pulled gently to the middle. */
function layout(nodes: GraphNode[], links: GraphLink[]) {
  const n = nodes.length;
  const pos = nodes.map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { x: W / 2 + Math.cos(a) * 120, y: H / 2 + Math.sin(a) * 90, vx: 0, vy: 0 };
  });
  const idx = new Map(nodes.map((nd, i) => [nd.id, i]));
  const edges = links.flatMap((l) => (idx.has(l.source) && idx.has(l.target) ? [[idx.get(l.source)!, idx.get(l.target)!] as const] : []));
  for (let step = 0; step < 300; step++) {
    const k = 1 - step / 300;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pos[i]!.x - pos[j]!.x, dy = pos[i]!.y - pos[j]!.y;
        const d2 = Math.max(dx * dx + dy * dy, 25);
        const f = 3200 / d2;
        const d = Math.sqrt(d2);
        dx /= d; dy /= d;
        pos[i]!.vx += dx * f; pos[i]!.vy += dy * f;
        pos[j]!.vx -= dx * f; pos[j]!.vy -= dy * f;
      }
    }
    for (const [a, b] of edges) {
      const dx = pos[b]!.x - pos[a]!.x, dy = pos[b]!.y - pos[a]!.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 70) * 0.04;
      pos[a]!.vx += (dx / d) * f; pos[a]!.vy += (dy / d) * f;
      pos[b]!.vx -= (dx / d) * f; pos[b]!.vy -= (dy / d) * f;
    }
    for (const p of pos) {
      p.vx += (W / 2 - p.x) * 0.01; p.vy += (H / 2 - p.y) * 0.01;
      p.x += Math.max(-12, Math.min(12, p.vx)) * k; p.y += Math.max(-12, Math.min(12, p.vy)) * k;
      p.vx *= 0.6; p.vy *= 0.6;
    }
  }
  const xs = pos.map((p) => p.x), ys = pos.map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  // fit the settled layout into the frame
  return pos.map((p) => ({ x: 36 + ((p.x - x0) / (x1 - x0 || 1)) * (W - 72), y: 30 + ((p.y - y0) / (y1 - y0 || 1)) * (H - 60) }));
}

/**
 * Dots joined by lines: people and who they talk to, services and what they call. Positions are worked out once, so it
 * never jitters. Hover a node to light up its neighbours; click one to select it (`onSelect`).
 */
export function NetworkGraph({
  nodes,
  links,
  groups,
  onSelect,
  className,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
  groups?: { name: string; color?: string }[];
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<string | null>(null);
  const pos = React.useMemo(() => layout(nodes, links), [nodes, links]);
  const idx = new Map(nodes.map((nd, i) => [nd.id, i]));
  const degree = new Map<string, number>();
  links.forEach((l) => { degree.set(l.source, (degree.get(l.source) ?? 0) + 1); degree.set(l.target, (degree.get(l.target) ?? 0) + 1); });
  const size = (nd: GraphNode) => nd.value ?? degree.get(nd.id) ?? 1;
  const sMax = Math.max(...nodes.map(size), 1);
  const r = (nd: GraphNode) => 6 + Math.sqrt(size(nd) / sMax) * 10;
  const color = (nd: GraphNode) => groups?.[nd.group ?? 0]?.color ?? palette[(nd.group ?? 0) % palette.length];
  const near = new Set<string>();
  if (hover) { near.add(hover); links.forEach((l) => { if (l.source === hover) near.add(l.target); if (l.target === hover) near.add(l.source); }); }
  const wMax = Math.max(...links.map((l) => l.weight ?? 1), 1);

  return (
    <div className={cn('w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label={`Network of ${nodes.length} nodes and ${links.length} links`}>
        {links.map((l, i) => {
          const a = pos[idx.get(l.source) ?? -1], b = pos[idx.get(l.target) ?? -1];
          if (!a || !b) return null;
          const lit = hover && (l.source === hover || l.target === hover);
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-foreground" strokeWidth={0.75 + ((l.weight ?? 1) / wMax) * 2} opacity={on ? (hover ? (lit ? 0.7 : 0.08) : 0.3) : 0} style={{ transition: 'opacity 250ms' }} />;
        })}
        {nodes.map((nd, i) => {
          const p = pos[i]!;
          const dim = hover && !near.has(nd.id);
          return (
            <g
              key={nd.id}
              tabIndex={0}
              role="button"
              aria-label={`${nd.label ?? nd.id}, ${degree.get(nd.id) ?? 0} links`}
              onPointerEnter={() => setHover(nd.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(nd.id)}
              onBlur={() => setHover(null)}
              onClick={() => onSelect?.(nd.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect?.(nd.id))}
              className={cn('cursor-pointer outline-none [&:focus-visible>circle]:stroke-ring', color(nd))}
              opacity={dim ? 0.25 : 1}
              style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: on ? 'scale(1)' : 'scale(0)', transition: `transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${Math.min(i * 25, 700)}ms, opacity 200ms` }}
            >
              <circle cx={p.x} cy={p.y} r={r(nd)} className="fill-background" />
              <circle cx={p.x} cy={p.y} r={r(nd)} fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeWidth={hover === nd.id ? 3 : 2} />
              <text x={p.x} y={p.y + r(nd) + 11} textAnchor="middle" className="pointer-events-none fill-foreground text-[11px]">{nd.label ?? nd.id}</text>
            </g>
          );
        })}
      </svg>
      {groups && groups.length > 1 && (
        <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {groups.map((g, gi) => <li key={g.name} className="flex items-center gap-1.5"><span className={cn('size-2 rounded-full bg-current', g.color ?? palette[gi % palette.length])} />{g.name}</li>)}
        </ul>
      )}
    </div>
  );
}
