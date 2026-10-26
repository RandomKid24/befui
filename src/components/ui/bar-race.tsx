'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RaceFrame {
  /** Shown big in the corner, such as a year or month. */
  label: string;
  values: Record<string, number>;
}

/**
 * Bars that re-sort and grow as time moves: one frame per step, the top `top` items shown, ranked by value. It plays by itself
 * (once, when you press play or `autoplay` is on) and has a scrubber, so you can also drag to any moment. Honors reduced motion by jumping frames.
 */
export function BarRace({
  frames,
  top = 6,
  interval = 900,
  autoplay = false,
  format = (n) => n.toLocaleString(),
  className,
}: {
  frames: RaceFrame[];
  top?: number;
  /** Milliseconds per frame. */
  interval?: number;
  autoplay?: boolean;
  format?: (n: number) => string;
  className?: string;
}) {
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoplay);
  const last = frames.length - 1;
  React.useEffect(() => {
    if (!playing) return;
    if (i >= last) return setPlaying(false);
    const t = setTimeout(() => setI((x) => x + 1), interval);
    return () => clearTimeout(t);
  }, [playing, i, last, interval]);

  const frame = frames[i]!;
  const names = Array.from(new Set(frames.flatMap((f) => Object.keys(f.values))));
  const ranked = names.map((n) => ({ n, v: frame.values[n] ?? 0 })).sort((a, b) => b.v - a.v);
  const rank = new Map(ranked.map((r, k) => [r.n, k]));
  const max = Math.max(...frames.flatMap((f) => Object.values(f.values)), 1);
  const hue = (n: string) => (names.indexOf(n) * 360) / names.length;
  const ROW = 36;
  const id = React.useId();

  return (
    <div className={cn('w-full', className)}>
      <div className="relative" style={{ height: top * ROW }} role="img" aria-label={`Ranking at ${frame.label}: ${ranked.slice(0, top).map((r) => `${r.n} ${format(r.v)}`).join(', ')}`}>
        {names.map((n) => {
          const k = rank.get(n)!;
          const v = frame.values[n] ?? 0;
          return (
            <div
              key={n}
              aria-hidden
              className="absolute inset-x-0 flex items-center gap-3 motion-safe:transition-[transform,opacity] motion-safe:duration-(--dur-slow)"
              style={{ height: ROW - 6, transform: `translateY(${k * ROW}px)`, opacity: k < top ? 1 : 0 }}
            >
              <span className="w-20 shrink-0 truncate text-end text-[13px] font-medium">{n}</span>
              <div className="relative h-full flex-1">
                <div className="h-full rounded-md motion-safe:transition-[width] motion-safe:duration-(--dur-slow)" style={{ width: `${(v / max) * 88}%`, minWidth: 4, background: `oklch(0.68 0.14 ${hue(n)})` }} />
                <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[13px] tabular-nums text-muted-foreground motion-safe:transition-[inset-inline-start] motion-safe:duration-(--dur-slow)" style={{ insetInlineStart: `calc(${(v / max) * 88}% + 8px)` }}>{format(v)}</span>
              </div>
            </div>
          );
        })}
        <span aria-hidden className="pointer-events-none absolute bottom-0 end-0 text-5xl font-semibold tabular-nums text-foreground/10">{frame.label}</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => { if (!playing && i >= last) setI(0); setPlaying(!playing); }}
          className="h-8 rounded-md border px-3 text-[13px] font-medium outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {playing ? 'Pause' : i >= last ? 'Replay' : 'Play'}
        </button>
        <input
          type="range" min={0} max={last} value={i} aria-label="Moment" aria-describedby={id}
          onChange={(e) => { setPlaying(false); setI(+e.target.value); }}
          className="h-1 flex-1 accent-primary"
        />
        <span id={id} className="w-16 text-end text-xs tabular-nums text-muted-foreground">{frame.label}</span>
      </div>
    </div>
  );
}
