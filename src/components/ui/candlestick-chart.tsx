'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface Candle {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const W = 600;
const H = 260;
const pad = { l: 46, r: 12, t: 14, b: 26 };

/**
 * Candlestick chart: open, high, low and close per period (share price, exchange rate, any value with a daily range).
 * Green candles closed higher than they opened, red lower. Candles grow out of their midpoint one after another;
 * hover a candle for its four numbers.
 */
export function CandlestickChart({ data, format = (n) => n.toFixed(2), className }: { data: Candle[]; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<SVGSVGElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const lo = Math.min(...data.map((d) => d.low));
  const hi = Math.max(...data.map((d) => d.high));
  const padv = (hi - lo) * 0.08 || 1;
  const min = lo - padv;
  const span = hi + padv - min;
  const n = data.length;
  const slot = (W - pad.l - pad.r) / n;
  const cx = (i: number) => pad.l + slot * (i + 0.5);
  const y = (v: number) => pad.t + (1 - (v - min) / span) * (H - pad.t - pad.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + t * span);
  const d = hover === null ? null : data[hover]!;

  return (
    <div className={cn('relative w-full', className)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Candlestick chart, ${n} periods`} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray="3 4" />
            <text x={pad.l - 8} y={y(t) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{format(t)}</text>
          </g>
        ))}
        {data.map((c, i) => {
          const up = c.close >= c.open;
          const top = y(Math.max(c.open, c.close));
          const bodyH = Math.max(Math.abs(y(c.open) - y(c.close)), 1.5);
          return (
            <g
              key={c.label}
              className={up ? 'text-success' : 'text-destructive'}
              onMouseEnter={() => setHover(i)}
              style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: on ? 'scaleY(1)' : 'scaleY(0)', opacity: hover !== null && hover !== i ? 0.4 : 1, transition: `transform 650ms cubic-bezier(0.34,1.4,0.64,1) ${i * 45}ms, opacity 150ms` }}
            >
              <rect x={cx(i) - slot / 2} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent" />
              <line x1={cx(i)} x2={cx(i)} y1={y(c.high)} y2={y(c.low)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x={cx(i) - slot * 0.3} y={top} width={slot * 0.6} height={bodyH} rx="2" fill="currentColor" />
            </g>
          );
        })}
        {data.map((c, i) => (n <= 12 || i % Math.ceil(n / 12) === 0) && <text key={c.label} x={cx(i)} y={H - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{c.label}</text>)}
      </svg>
      {d && (
        <div className="pointer-events-none absolute top-1 z-10 grid min-w-28 gap-0.5 rounded-lg border bg-popover px-2.5 py-2 text-xs shadow-lg" style={{ left: `${(cx(hover!) / W) * 100}%`, transform: `translateX(${hover! > n / 2 ? '-110%' : '10%'})` }}>
          <p className="mb-0.5 font-medium">{d.label}</p>
          {([['Open', d.open], ['High', d.high], ['Low', d.low], ['Close', d.close]] as const).map(([k, v]) => <p key={k} className="flex justify-between gap-4 text-muted-foreground">{k}<span className="font-medium tabular-nums text-foreground">{format(v)}</span></p>)}
        </div>
      )}
    </div>
  );
}
