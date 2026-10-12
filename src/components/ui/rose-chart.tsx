import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface RoseItem {
  label: string;
  value: number;
  /** Any text color class. Defaults cycle through primary, success, warning, info. */
  color?: string;
}

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info', 'text-destructive'];

/**
 * Rose (polar area) chart: equal-angle petals whose length shows the value (sales by month, incidents by weekday, load by hour).
 * Petals bloom from the center in turn on scroll; hover one to read it in the middle.
 */
export function RoseChart({ data, size = 260, format = (n) => String(n), className }: { data: RoseItem[]; size?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const c = size / 2;
  const max = Math.max(...data.map((d) => d.value), 1);
  const step = (Math.PI * 2) / data.length;
  const inner = size * 0.08;
  const petal = (i: number, v: number) => {
    const r = inner + Math.sqrt(v / max) * (c - inner - 4);
    const a0 = i * step - Math.PI / 2 + 0.02, a1 = (i + 1) * step - Math.PI / 2 - 0.02;
    const p = (rad: number, a: number) => `${(c + rad * Math.cos(a)).toFixed(1)},${(c + rad * Math.sin(a)).toFixed(1)}`;
    return `M${p(inner, a0)} L${p(r, a0)} A${r},${r} 0 0 1 ${p(r, a1)} L${p(inner, a1)} A${inner},${inner} 0 0 0 ${p(inner, a0)} Z`;
  };
  const h = hover === null ? null : data[hover]!;

  return (
    <div ref={ref} className={cn('relative mx-auto', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={data.map((d) => `${d.label} ${d.value}`).join(', ')} onMouseLeave={() => setHover(null)}>
        {[0.33, 0.66, 1].map((t) => <circle key={t} cx={c} cy={c} r={inner + t * (c - inner - 4)} fill="none" className="stroke-border" strokeDasharray="3 4" />)}
        {data.map((d, i) => (
          <path
            key={d.label}
            d={petal(i, d.value)}
            fill="currentColor"
            className={cn(d.color ?? palette[i % palette.length], 'cursor-pointer')}
            onMouseEnter={() => setHover(i)}
            style={{ transformBox: 'view-box', transformOrigin: 'center', transform: on ? (hover === i ? 'scale(1.05)' : 'scale(1)') : 'scale(0) rotate(-40deg)', opacity: on ? (hover !== null && hover !== i ? 0.35 : 0.9) : 0, transition: `transform 800ms cubic-bezier(0.34,1.4,0.64,1) ${on && hover === null ? i * 70 : 0}ms, opacity 300ms ease-out ${on && hover === null ? i * 70 : 0}ms` }}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div className="grid">
          <span className="text-lg font-semibold tabular-nums">{h ? format(h.value) : ''}</span>
          <span className="text-[11px] text-muted-foreground">{h?.label ?? ''}</span>
        </div>
      </div>
    </div>
  );
}
