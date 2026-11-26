'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PaintLevel {
  label: string;
}

/** Fill strength per level, faint to solid. Up to five levels. */
const FILL = ['bg-foreground/10', 'bg-primary/25', 'bg-primary/50', 'bg-primary/75', 'bg-primary'];

/**
 * A weekly plan you paint: pick a level, then drag across the cells (opening hours, heating, on-call cover).
 * `value[row][col]` is an index into `levels`. With a keyboard, arrows move and Space or Enter paints.
 */
export function PaintGrid({ rows, cols, levels, value, onChange, label, labelEvery = 3, className }: {
  rows: string[];
  cols: string[];
  levels: PaintLevel[];
  value: number[][];
  onChange: (next: number[][]) => void;
  /** What is being planned, for screen readers. */
  label: string;
  /** Show every nth column heading so they do not collide. */
  labelEvery?: number;
  className?: string;
}) {
  const [brush, setBrush] = React.useState(levels.length - 1);
  const [at, setAt] = React.useState<[number, number]>([0, 0]);
  const painting = React.useRef(false);
  // a fast drag paints several cells before the parent re-renders, so build on the latest grid, not the prop
  const latest = React.useRef(value);
  latest.current = value;
  const root = React.useRef<HTMLDivElement>(null);

  const paint = (r: number, c: number) => {
    if (latest.current[r]?.[c] === brush) return;
    latest.current = latest.current.map((row, i) => (i === r ? row.map((v, j) => (j === c ? brush : v)) : row));
    onChange(latest.current);
  };
  const cellAt = (e: React.PointerEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-cell]');
    return el && root.current?.contains(el) ? (el.dataset.cell!.split(':').map(Number) as [number, number]) : null;
  };
  React.useEffect(() => {
    const stop = () => (painting.current = false);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => { window.removeEventListener('pointerup', stop); window.removeEventListener('pointercancel', stop); };
  }, []);

  const move = (r: number, c: number) => {
    const next: [number, number] = [Math.max(0, Math.min(rows.length - 1, r)), Math.max(0, Math.min(cols.length - 1, c))];
    setAt(next);
    root.current?.querySelector<HTMLElement>(`[data-cell="${next[0]}:${next[1]}"]`)?.focus();
  };
  const columns = { gridTemplateColumns: `3rem repeat(${cols.length}, minmax(0.75rem, 1fr))` };

  return (
    <div className={cn('grid min-w-0 gap-3', className)}>
      <div role="group" aria-label="Paint with" className="flex flex-wrap gap-1.5">
        {levels.map((l, i) => (
          <button key={l.label} type="button" aria-pressed={brush === i} onClick={() => setBrush(i)} className={cn('flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium outline-none transition-[border-color,background-color] duration-(--dur-fast) focus-visible:ring-2 focus-visible:ring-ring', brush === i ? 'border-primary bg-accent' : 'text-muted-foreground hover:text-foreground')}>
            <span aria-hidden className={cn('size-3 rounded-sm', FILL[i])} />{l.label}
          </button>
        ))}
      </div>
      {/* a finger on a cell paints, so scrolling happens from the pinned day names and the hour row */}
      <p className="text-xs text-muted-foreground sm:hidden">To scroll, swipe the hours or day names.</p>
      <div className="overflow-x-auto pb-1">
        <div
          ref={root}
          role="grid"
          aria-label={label}
          className="grid min-w-[30rem] select-none gap-[3px]"
          onPointerDown={(e) => {
            const hit = cellAt(e);
            if (!hit || e.button > 0) return;
            painting.current = true;
            setAt(hit);
            paint(...hit);
          }}
          onPointerMove={(e) => {
            const hit = painting.current && cellAt(e);
            if (hit) paint(...hit);
          }}
        >
          <div role="row" className="grid gap-[3px]" style={columns}>
            <span role="columnheader" className="sticky start-0 z-10 bg-card"><span className="sr-only">Day</span></span>
            {cols.map((c, i) => <span key={c} role="columnheader" className="text-[10px] text-muted-foreground">{i % labelEvery === 0 ? <span className="whitespace-nowrap">{c}</span> : <span className="sr-only">{c}</span>}</span>)}
          </div>
          {rows.map((row, r) => (
            <div key={row} role="row" className="grid gap-[3px]" style={columns}>
              <span role="rowheader" className="sticky start-0 z-10 flex items-center self-stretch truncate bg-card text-[11px] text-muted-foreground">{row}</span>
              {cols.map((col, c) => (
                <button
                  key={col}
                  type="button"
                  role="gridcell"
                  data-cell={`${r}:${c}`}
                  tabIndex={at[0] === r && at[1] === c ? 0 : -1}
                  aria-label={`${row} ${col}: ${levels[value[r]?.[c] ?? 0]?.label}`}
                  // pointer painting happens on pointerdown; a click with no detail came from the keyboard
                  onClick={(e) => e.detail === 0 && paint(r, c)}
                  onKeyDown={(e) => {
                    const step = ({ ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] } as Record<string, [number, number]>)[e.key];
                    if (!step) return;
                    e.preventDefault();
                    move(r + step[0], c + step[1]);
                  }}
                  className={cn('h-7 touch-none cursor-crosshair rounded-[4px] outline-none transition-[background-color,transform] duration-(--dur-fast) hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring motion-safe:animate-pop', FILL[value[r]?.[c] ?? 0])}
                  // the cells fill in as a diagonal wave
                  style={{ animationDelay: `${(r + c) * 14}ms`, animationFillMode: 'backwards' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
