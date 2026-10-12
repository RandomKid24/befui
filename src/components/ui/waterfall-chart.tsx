import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

export interface WaterfallStep {
  label: string;
  /** Change for a normal step; the running total for a `total` step. */
  value: number;
  /** A subtotal or final bar that starts at zero. */
  total?: boolean;
}

/**
 * Waterfall: how a starting number becomes an ending one (revenue to profit, headcount change, cash flow).
 * Steps are green when they add, red when they subtract, and blue for totals. Bars drop in one after another and the connector lines draw between them.
 */
export function WaterfallChart({ steps, height = 260, format = (n) => n.toLocaleString('en-IN'), className }: { steps: WaterfallStep[]; height?: number; format?: (n: number) => string; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);

  const bars = React.useMemo(() => {
    let run = 0;
    return steps.map((s) => {
      const from = s.total ? 0 : run;
      const to = s.total ? s.value : run + s.value;
      run = to;
      return { ...s, lo: Math.min(from, to), hi: Math.max(from, to), end: to, up: to >= from };
    });
  }, [steps]);
  const top = Math.max(...bars.map((b) => b.hi), 1);
  const bottom = Math.min(...bars.map((b) => b.lo), 0);
  const span = top - bottom || 1;
  const pos = (v: number) => ((top - v) / span) * 100; // percent from the top
  const n = bars.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => bottom + t * span);

  return (
    <div ref={ref} className={cn('grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2 pb-7 text-primary', className)}>
      <div className="relative" style={{ height }}>
        {ticks.map((t) => <span key={t} className="absolute right-0 -translate-y-1/2 text-[10px] tabular-nums text-muted-foreground" style={{ top: `${pos(t)}%` }}>{format(Math.round(t))}</span>)}
      </div>
      <div className="relative" style={{ height }} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => <div key={t} className="absolute inset-x-0 border-t border-dashed border-border" style={{ top: `${pos(t)}%` }} />)}
        {bars.map((b, i) => {
          const colW = 100 / n;
          const delay = i * 90;
          const color = b.total ? 'bg-primary' : b.up ? 'bg-success' : 'bg-destructive';
          return (
            <React.Fragment key={b.label}>
              {i < n - 1 && (
                <div className="absolute h-px bg-muted-foreground/50 transition-[width] duration-500 ease-out" style={{ top: `${pos(b.end)}%`, left: `${colW * i + colW * 0.82}%`, width: on ? `${colW * 0.36}%` : 0, transitionDelay: `${delay + 350}ms` }} />
              )}
              <div className="absolute flex justify-center" style={{ left: `${colW * i}%`, width: `${colW}%`, top: `${pos(b.hi)}%`, height: `${Math.max(((b.hi - b.lo) / span) * 100, 0.6)}%` }} onMouseEnter={() => setHover(i)}>
                <div
                  className={cn('w-[64%] rounded-[5px]', color)}
                  style={{ transformOrigin: b.up ? 'bottom' : 'top', transform: on ? 'scaleY(1)' : 'scaleY(0)', opacity: hover !== null && hover !== i ? 0.4 : 1, transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 150ms` }}
                />
                {hover === i && <span className="absolute -top-6 whitespace-nowrap rounded-md border bg-popover px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-popover-foreground shadow">{b.total ? '' : b.value > 0 ? '+' : ''}{format(b.value)}</span>}
              </div>
              <span className="absolute top-full mt-1.5 truncate text-center text-[11px] text-muted-foreground" style={{ left: `${colW * i}%`, width: `${colW}%` }}>{b.label}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
