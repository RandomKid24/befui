'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';
import { smoothPath } from './area-chart';

export interface ComboSeries {
  name: string;
  data: number[];
  /** How to draw it: columns, a smooth line, or a smooth line with a filled area. */
  type: 'bar' | 'line' | 'area';
  /** 'right' gives it its own scale on the right edge, for a different unit (a percent beside dollars). */
  axis?: 'left' | 'right';
  /** Any text color class, e.g. 'text-success'. Defaults cycle through primary, info, success, warning, destructive. */
  color?: string;
}

const palette = ['text-primary', 'text-info', 'text-success', 'text-warning', 'text-destructive'];
const W = 600, H = 260;
const pad = { l: 44, r: 44, t: 14, b: 26 };

const nice = (max: number) => {
  const p = 10 ** Math.floor(Math.log10(max || 1));
  return Math.ceil(max / p / 2) * p * 2 || 1;
};

/**
 * Bars, smooth lines and smooth areas on one chart, so many values read together (revenue bars with a conversion line and a target area).
 * Series with `axis: 'right'` use their own scale. Bars grow and lines draw in on scroll; hover a month for every value; hover a legend name to isolate it.
 */
export function ComboChart({ series, labels, format = (n) => String(n), formatRight = format, className }: { series: ComboSeries[]; labels: string[]; format?: (n: number) => string; formatRight?: (n: number) => string; className?: string }) {
  const id = React.useId();
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const [focus, setFocus] = React.useState<number | null>(null);
  const n = labels.length;
  const right = (s: ComboSeries) => s.axis === 'right';
  const maxOf = (r: boolean) => nice(Math.max(...series.filter((s) => right(s) === r).flatMap((s) => s.data), 0));
  const maxL = maxOf(false), maxR = maxOf(true);
  const hasRight = series.some(right);
  const plotW = W - pad.l - pad.r, plotH = H - pad.t - pad.b;
  const slot = plotW / n;
  const x = (i: number) => pad.l + slot * (i + 0.5);
  const y = (s: ComboSeries, v: number) => pad.t + (1 - v / (right(s) ? maxR : maxL)) * plotH;
  const base = pad.t + plotH;
  const color = (s: ComboSeries, i: number) => s.color ?? palette[i % palette.length];
  const bars = series.map((s, i) => [s, i] as const).filter(([s]) => s.type === 'bar');
  const group = slot * 0.7, bw = group / (bars.length || 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const dim = (i: number) => focus !== null && focus !== i;

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.floor((px - pad.l) / slot))));
  };

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-pan-y overflow-visible" onPointerMove={move} onPointerLeave={() => setHover(null)} role="img" aria-label={series.map((s) => s.name).join(', ')}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={pad.t + (1 - t) * plotH} y2={pad.t + (1 - t) * plotH} className="stroke-border" strokeDasharray={t ? '3 4' : undefined} />
            <text x={pad.l - 8} y={pad.t + (1 - t) * plotH + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{format(t * maxL)}</text>
            {hasRight && <text x={W - pad.r + 8} y={pad.t + (1 - t) * plotH + 3.5} className="fill-muted-foreground text-[10px]">{formatRight(t * maxR)}</text>}
          </g>
        ))}
        {labels.map((l, i) => (n <= 12 || i % Math.ceil(n / 12) === 0) && <text key={l + i} x={x(i)} y={H - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{l}</text>)}
        {hover !== null && <rect x={pad.l + slot * hover} y={pad.t} width={slot} height={plotH} className="fill-muted-foreground/10" />}
        {series.map((s, si) => s.type === 'area' && (
          <g key={s.name} className={color(s, si)} style={{ opacity: dim(si) ? 0.15 : 1, transition: 'opacity 200ms' }}>
            <defs><linearGradient id={`${id}${si}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity="0.28" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
            <path d={`${smoothPath(s.data.map((v, i) => [x(i), y(s, v)]))} L${x(n - 1)},${base} L${x(0)},${base} Z`} fill={`url(#${id}${si})`} style={{ opacity: on ? 1 : 0, transition: 'opacity 900ms ease-out' }} />
          </g>
        ))}
        {bars.map(([s, si], bi) => (
          <g key={s.name} className={color(s, si)} style={{ opacity: dim(si) ? 0.15 : 1, transition: 'opacity 200ms' }}>
            {s.data.map((v, i) => (
              <rect key={i} x={x(i) - group / 2 + bi * bw + 1} width={Math.max(bw - 2, 1)} y={y(s, v)} height={base - y(s, v)} rx={Math.min(4, bw / 2)} fill="currentColor" fillOpacity={hover === i ? 1 : 0.85} style={{ transformBox: 'fill-box', transformOrigin: 'bottom', transform: on ? 'scaleY(1)' : 'scaleY(0)', transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms` }} />
            ))}
          </g>
        ))}
        <g style={{ clipPath: on ? 'inset(-10% -10% -10% -10%)' : 'inset(-10% 100% -10% -10%)', transition: 'clip-path 1200ms cubic-bezier(0.22,1,0.36,1) 300ms' }}>
          {series.map((s, si) => s.type !== 'bar' && (
            <g key={s.name} className={color(s, si)} style={{ opacity: dim(si) ? 0.15 : 1, transition: 'opacity 200ms' }}>
              <path d={smoothPath(s.data.map((v, i) => [x(i), y(s, v)]))} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {hover !== null && <circle cx={x(hover)} cy={y(s, s.data[hover] ?? 0)} r="4.5" fill="currentColor" className="stroke-background" strokeWidth="2" />}
            </g>
          ))}
        </g>
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-2 z-10 min-w-32 rounded-lg border bg-popover px-2.5 py-2 text-xs shadow-lg" style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? '-105%' : '8%'})` }}>
          <p className="mb-1 font-medium">{labels[hover]}</p>
          {series.map((s, si) => <p key={s.name} className="flex items-center gap-1.5"><span className={cn('size-2 rounded-full bg-current', color(s, si))} />{s.name}<span className="ml-auto pl-3 font-medium tabular-nums">{(right(s) ? formatRight : format)(s.data[hover] ?? 0)}</span></p>)}
        </div>
      )}
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground" onMouseLeave={() => setFocus(null)}>
        {series.map((s, si) => <li key={s.name} className={cn('flex cursor-default items-center gap-1.5', dim(si) && 'opacity-40')} onMouseEnter={() => setFocus(si)}><span className={cn('size-2 bg-current', s.type === 'bar' ? 'rounded-sm' : 'rounded-full', color(s, si))} />{s.name}</li>)}
      </ul>
    </div>
  );
}
