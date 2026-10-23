'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from './copy-button';

export interface GradientStop {
  color: string;
  /** Position along the gradient, 0 to 100. */
  at: number;
}

/** Turns stops and an angle into a CSS value you can paste into `background`. */
export const gradientCss = (stops: GradientStop[], angle: number) =>
  `linear-gradient(${angle}deg, ${[...stops].sort((a, b) => a.at - b.at).map((s) => `${s.color} ${s.at}%`).join(', ')})`;

/**
 * Edit a linear gradient: pick each colour, move its position, set the angle, add or remove stops (two to five). Shows a live preview and the
 * CSS to copy. Controlled: `value` is the stops, `angle` the direction in degrees.
 */
export function GradientPicker({ stops, angle, onChange, className }: { stops: GradientStop[]; angle: number; onChange: (stops: GradientStop[], angle: number) => void; className?: string }) {
  const css = gradientCss(stops, angle);
  const edit = (i: number, patch: Partial<GradientStop>) => onChange(stops.map((s, k) => (k === i ? { ...s, ...patch } : s)), angle);
  return (
    <div className={cn('grid w-full max-w-sm grid-cols-[minmax(0,1fr)] gap-4', className)}>
      <div className="h-28 rounded-xl border" style={{ background: css }} role="img" aria-label="Gradient preview" />
      <label className="grid gap-1.5 text-xs text-muted-foreground">
        <span className="flex justify-between"><span>Angle</span><span className="tabular-nums text-foreground">{angle}°</span></span>
        <input type="range" min={0} max={360} value={angle} onChange={(e) => onChange(stops, Number(e.target.value))} className="w-full accent-[var(--primary)]" />
      </label>
      <ul className="grid gap-2">
        {stops.map((s, i) => (
          <li key={i} className="flex items-center gap-3">
            <input type="color" value={s.color} onChange={(e) => edit(i, { color: e.target.value })} aria-label={`Stop ${i + 1} colour`} className="size-8 shrink-0 cursor-pointer rounded-md border bg-transparent p-0.5" />
            <input type="range" min={0} max={100} value={s.at} onChange={(e) => edit(i, { at: Number(e.target.value) })} aria-label={`Stop ${i + 1} position`} className="min-w-0 flex-1 accent-[var(--primary)]" />
            <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{s.at}%</span>
            <button type="button" disabled={stops.length <= 2} onClick={() => onChange(stops.filter((_, k) => k !== i), angle)} aria-label={`Remove stop ${i + 1}`} className="text-muted-foreground hover:text-foreground disabled:opacity-30">×</button>
          </li>
        ))}
      </ul>
      <button type="button" disabled={stops.length >= 5} onClick={() => onChange([...stops, { color: '#ffffff', at: 50 }], angle)} className="w-fit text-sm font-medium text-primary hover:underline disabled:opacity-40">+ Add stop</button>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 py-1.5 pl-3 pr-1.5">
        <code className="min-w-0 flex-1 truncate font-mono text-xs">{css}</code>
        <CopyButton value={css} className="size-7" />
      </div>
    </div>
  );
}
