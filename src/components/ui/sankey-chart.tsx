import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface SankeyNode {
  id: string;
  label?: string;
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];
const W = 640;
const NODE_W = 10;
const PAD = 12;

/**
 * Sankey flow diagram: how a quantity splits and merges across stages (traffic source to page to outcome, budget to team to project).
 * Columns are worked out from the links. Ribbons draw in left to right on scroll; hover a node or ribbon to follow its flow.
 */
export function SankeyChart({ nodes, links, height = 300, format = (n) => n.toLocaleString('en-IN'), className }: { nodes: SankeyNode[]; links: SankeyLink[]; height?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<{ node?: string; link?: number } | null>(null);

  const layout = React.useMemo(() => {
    const byId = new Map(nodes.map((n, i) => [n.id, { ...n, idx: i, col: 0, in: 0, out: 0, y: 0, h: 0, inOff: 0, outOff: 0 }]));
    const ls = links.filter((l) => byId.has(l.source) && byId.has(l.target) && l.value > 0);
    for (const l of ls) { byId.get(l.source)!.out += l.value; byId.get(l.target)!.in += l.value; }
    // column = longest path from a source (bounded so a cycle cannot hang)
    for (let pass = 0; pass < byId.size; pass++) for (const l of ls) byId.get(l.target)!.col = Math.max(byId.get(l.target)!.col, byId.get(l.source)!.col + 1);
    const list = [...byId.values()];
    const cols = Math.max(...list.map((n) => n.col)) + 1;
    const flow = (n: { in: number; out: number }) => Math.max(n.in, n.out);
    let scale = Infinity;
    for (let c = 0; c < cols; c++) {
      const col = list.filter((n) => n.col === c);
      const sum = col.reduce((s, n) => s + flow(n), 0);
      scale = Math.min(scale, (height - PAD * (col.length + 1)) / (sum || 1));
    }
    for (let c = 0; c < cols; c++) {
      const col = list.filter((n) => n.col === c);
      const used = col.reduce((s, n) => s + flow(n) * scale, 0) + PAD * (col.length - 1);
      let y = (height - used) / 2;
      for (const n of col) { n.y = y; n.h = flow(n) * scale; y += n.h + PAD; }
    }
    const x = (c: number) => (cols === 1 ? 0 : (c / (cols - 1)) * (W - NODE_W));
    const paths = [...ls]
      .sort((a, b) => byId.get(a.target)!.y - byId.get(b.target)!.y)
      .map((l) => {
        const s = byId.get(l.source)!;
        const t = byId.get(l.target)!;
        const w = l.value * scale;
        const y0 = s.y + s.outOff + w / 2;
        const y1 = t.y + t.inOff + w / 2;
        s.outOff += w; t.inOff += w;
        const x0 = x(s.col) + NODE_W, x1 = x(t.col), mx = (x0 + x1) / 2;
        return { l, w, d: `M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1}`, s, t, key: `${l.source}>${l.target}` };
      });
    return { list, paths, x, cols };
  }, [nodes, links, height]);

  const active = (p: (typeof layout.paths)[number], i: number) =>
    !hover || hover.link === i || (hover.node !== undefined && (p.l.source === hover.node || p.l.target === hover.node));

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label="Sankey flow diagram" onMouseLeave={() => setHover(null)}>
        {layout.paths.map((p, i) => (
          <path
            key={p.key}
            d={p.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={Math.max(p.w, 1)}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={on ? 0 : 1}
            className={cn(p.s.color ?? palette[p.s.idx % palette.length])}
            style={{ opacity: active(p, i) ? 0.38 : 0.1, transition: `stroke-dashoffset 1100ms cubic-bezier(0.22,1,0.36,1) ${p.s.col * 250 + i * 40}ms, opacity 200ms` }}
            onMouseEnter={() => setHover({ link: i })}
          />
        ))}
        {layout.list.map((n) => (
          <g key={n.id} className={cn(n.color ?? palette[n.idx % palette.length])} onMouseEnter={() => setHover({ node: n.id })} style={{ opacity: on ? 1 : 0, transition: `opacity 500ms ease-out ${n.col * 250}ms` }}>
            <rect x={layout.x(n.col)} y={n.y} width={NODE_W} height={Math.max(n.h, 2)} rx="3" fill="currentColor" />
            <text x={n.col === layout.cols - 1 ? layout.x(n.col) - 8 : layout.x(n.col) + NODE_W + 8} y={n.y + n.h / 2} dy="0.35em" textAnchor={n.col === layout.cols - 1 ? 'end' : 'start'} className="fill-foreground text-[11px] font-medium">
              {n.label ?? n.id}<tspan className="fill-muted-foreground font-normal" dx="5">{format(Math.max(n.in, n.out))}</tspan>
            </text>
          </g>
        ))}
        {hover?.link !== undefined && layout.paths[hover.link] && (
          <text x={W / 2} y={12} textAnchor="middle" className="fill-foreground text-[11px]">
            {layout.paths[hover.link]!.s.label ?? layout.paths[hover.link]!.s.id} to {layout.paths[hover.link]!.t.label ?? layout.paths[hover.link]!.t.id}: {format(layout.paths[hover.link]!.l.value)}
          </text>
        )}
      </svg>
    </div>
  );
}
