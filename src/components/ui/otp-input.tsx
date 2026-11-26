'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** One-time code input. Supports paste, backspace and arrow navigation. Calls onComplete when full. */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  invalid,
  success,
  verifying,
  className,
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  invalid?: boolean;
  /** The code was accepted: the boxes turn green one after another. */
  success?: boolean;
  /** The code is being checked: a ripple runs along the boxes and they stop taking input. */
  verifying?: boolean;
  className?: string;
}) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const set = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };
  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  return (
    <div className={cn('flex gap-2', invalid && 'animate-shake', className)} role="group" aria-label="One-time code" aria-busy={verifying || undefined}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={value[i] ?? ''}
          readOnly={verifying}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            if (!d) return;
            set((value.slice(0, i) + d + value.slice(i + 1)).slice(0, length));
            focus(i + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
              if (value[i]) set(value.slice(0, i) + value.slice(i + 1));
              else { set(value.slice(0, Math.max(0, i - 1)) + value.slice(i)); focus(i - 1); }
            } else if (e.key === 'ArrowLeft') focus(i - 1);
            else if (e.key === 'ArrowRight') focus(i + 1);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (!t) return;
            set(t);
            focus(t.length);
          }}
          style={{ animationDelay: `${i * (verifying ? 110 : success ? 70 : 35)}ms` }}
          className={cn(
            'size-11 rounded-lg border bg-background text-center text-lg font-semibold tabular-nums outline-none transition-[border-color,box-shadow,transform] duration-(--dur-fast) focus:scale-105 focus:border-ring focus:ring-4 focus:ring-ring/15',
            // each digit lands as it arrives; a pasted code lands left to right
            value[i] && 'border-primary/50 bg-accent motion-safe:animate-digit-land',
            verifying && 'border-primary motion-safe:animate-digit-ok motion-safe:[animation-duration:0.9s] motion-safe:[animation-iteration-count:infinite] motion-reduce:opacity-60',
            success && 'border-success bg-success/10 motion-safe:animate-digit-ok focus:border-success',
            invalid && 'border-destructive focus:border-destructive focus:ring-destructive/15',
          )}
        />
      ))}
    </div>
  );
}
