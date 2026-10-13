'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface MarimekkoKey {
  key: string;
  label: string;
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info'];
const W = 600;
const H = 300;
const pad = { l: 36, r: 8, t: 34, b: 8 };

/**
 * Marimekko (mosaic) chart: stacked 100% bars whose widths also mean something. Column width is the size of the group, segment height is its mix
 * (market share by region where wide regions are bigger markets, plan mix per segment). Columns grow up from the bottom on scroll; hover a block for its numbers.
 */
export function MarimekkoChart({ columns, keys, format = (n) => n.toLocaleString('en-IN'), className }: { columns: { label: string; values: Record<string, number> }[]; keys: MarimekkoKey[]; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<[number, number] | null>(null);
  const totals = columns.map((c) => keys.reduce((s, k) => s + (c.values[k.key] ?? 0), 0));
  const grand = totals.reduce((a, b) => a + b, 0) || 1;
  const gap = 3;
  const inner = W - pad.l - pad.r - gap * (columns.length - 1);
  const color = (ki: number) => keys[ki]!.color ?? palette[ki % palette.length];
  let x = pad.l;
  const hv = hover ? { c: columns[hover[0]]!, k: keys[hover[1]]!, v: columns[hover[0]]!.values[keys[hover[1]]!.key] ?? 0, t: totals[hover[0]]! } : null;

  return (
    <div className={cn('w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label="Marimekko chart" onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((t) => <text key={t} x={pad.l - 6} y={pad.t + (1 - t) * (H - pad.t - pad.b) + 3} textAnchor="end" className="fill-muted-foreground text-[10px]">{t * 100}%</text>)}
        {columns.map((col, ci) => {
          const w = (totals[ci]! / grand) * inner;
          const cx0 = x;
          x += w + gap;
          let y = H - pad.b;
          return (
            <g key={col.label}>
              <text x={cx0 + w / 2} y={pad.t - 18} textAnchor="middle" className="fill-foreground text-[11px] font-medium">{col.label}</text>
              <text x={cx0 + w / 2} y={pad.t - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{format(totals[ci]!)}</text>
              {keys.map((k, ki) => {
                const v = col.values[k.key] ?? 0;
                const h = totals[ci] ? (v / totals[ci]!) * (H - pad.t - pad.b) : 0;
                y -= h;
                const active = hover?.[0] === ci && hover?.[1] === ki;
                return (
                  <g key={k.key} className={cn(color(ki), 'cursor-pointer')} onMouseEnter={() => setHover([ci, ki])} style={{ transformBox: 'view-box', transformOrigin: `${cx0}px ${H - pad.b}px`, transform: on ? 'scaleY(1)' : 'scaleY(0)', opacity: hover && !active ? 0.45 : 1, transition: `transform 800ms cubic-bezier(0.22,1,0.36,1) ${ci * 110}ms, opacity 150ms` }}>
                    <rect x={cx0} y={y} width={w} height={Math.max(h - 1.5, 0)} rx="3" fill="currentColor" fillOpacity={0.9 - ki * 0.1} />
                    {w > 46 && h > 22 && <text x={cx0 + w / 2} y={y + h / 2} dy="0.35em" textAnchor="middle" className="fill-primary-foreground text-[10px] font-medium">{Math.round((v / totals[ci]!) * 100)}%</text>}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">{keys.map((k, ki) => <li key={k.key} className="flex items-center gap-1.5"><span className={cn('size-2 rounded-full bg-current', color(ki))} />{k.label}</li>)}</ul>
        <span aria-live="polite">{hv ? `${hv.c.label}, ${hv.k.label}: ${format(hv.v)} (${Math.round((hv.v / hv.t) * 100)}% of column, ${Math.round((hv.v / grand) * 100)}% of all)` : 'Hover a block'}</span>
      </div>
    </div>
  );
}
