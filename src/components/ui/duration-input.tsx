'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const UNITS: [string, number][] = [['w', 604800], ['d', 86400], ['h', 3600], ['m', 60], ['s', 1]];

/** "1h 30m", "90m", "1.5h", "2d4h", "45" (minutes) to seconds, or null when it cannot be read. */
export function parseDuration(text: string, bare: 's' | 'm' = 'm'): number | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  if (/^\d+(\.\d+)?$/.test(t)) return Math.round(Number(t) * (bare === 'm' ? 60 : 1));
  const re = /(\d+(?:\.\d+)?)\s*(w|d|h|m|s)(?![a-z])/g;
  let total = 0, m: RegExpExecArray | null;
  while ((m = re.exec(t))) total += Number(m[1]) * UNITS.find(([u]) => u === m![2])![1];
  // everything must have been a number and unit, nothing left over
  return total > 0 && t.replace(re, '').replace(/\s+/g, '') === '' ? Math.round(total) : null;
}

/** 5400 -> "1h 30m". */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0s';
  let left = Math.round(seconds);
  return UNITS.flatMap(([u, s]) => { const n = Math.floor(left / s); left -= n * s; return n ? [`${n}${u}`] : []; }).join(' ');
}

/**
 * A text field for lengths of time you can type the way people say them: 1h 30m, 90m, 2d, 45 (minutes). On leaving the field it
 * rewrites what you typed in a tidy form and gives the value in seconds. `min` and `max` (in seconds) are enforced with a message.
 */
export function DurationInput({ value, onChange, min, max, placeholder = 'e.g. 1h 30m', className }: { value?: number; onChange?: (seconds: number | undefined) => void; min?: number; max?: number; placeholder?: string; className?: string }) {
  const [text, setText] = React.useState(value === undefined ? '' : formatDuration(value));
  const [err, setErr] = React.useState('');
  const id = React.useId();
  React.useEffect(() => { if (value !== undefined && parseDuration(text) !== value) setText(formatDuration(value)); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = () => {
    if (!text.trim()) { setErr(''); onChange?.(undefined); return; }
    const s = parseDuration(text);
    if (s === null) { setErr('Try 1h 30m, 90m or 2d.'); return; }
    if (min !== undefined && s < min) { setErr(`At least ${formatDuration(min)}.`); return; }
    if (max !== undefined && s > max) { setErr(`At most ${formatDuration(max)}.`); return; }
    setErr(''); setText(formatDuration(s)); onChange?.(s);
  };
  return (
    <div className={cn('grid w-48 max-w-full gap-1', className)}>
      <input
        value={text}
        onChange={(e) => { setText(e.target.value); setErr(''); }}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
        placeholder={placeholder}
        inputMode="text"
        aria-invalid={!!err}
        aria-describedby={err ? id : undefined}
        spellCheck={false}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none transition-[border,box-shadow] placeholder:text-muted-foreground hover:border-muted-foreground/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15"
      />
      {err && <p id={id} role="alert" className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
