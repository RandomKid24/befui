'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Audio level bars for a voice input: they dance while `active` and settle to a flat line when not. Give it a real `level`
 * (0 to 1, from an analyser) to drive the height, or leave it out for a gentle idle motion. Use it next to a mic button.
 */
export function VoiceWave({ active = true, level, bars = 24, label, className }: { active?: boolean; level?: number; bars?: number; label?: string; className?: string }) {
  return (
    <div role="img" aria-label={label ?? (active ? 'Listening' : 'Not listening')} className={cn('flex h-10 items-center justify-center gap-[3px]', className)}>
      {Array.from({ length: bars }, (_, i) => {
        // a fixed pseudo-random spread so the bars are not in step
        const seed = ((i * 7919) % 97) / 97;
        const live = level === undefined ? 0.35 + seed * 0.65 : Math.max(0.12, level * (0.5 + seed * 0.5));
        return (
          <span
            key={i}
            className={cn('w-[3px] rounded-full bg-primary transition-colors', active ? (level === undefined ? 'animate-wave motion-reduce:animate-none' : 'transition-[height] duration-100') : 'bg-muted-foreground/40')}
            style={{
              height: active ? `${live * 100}%` : '10%',
              animationDelay: level === undefined ? `${-seed * 1.1}s` : undefined,
              animationDuration: level === undefined ? `${0.8 + seed * 0.7}s` : undefined,
              transformOrigin: 'center',
              opacity: active ? 0.5 + seed * 0.5 : 1,
            }}
          />
        );
      })}
    </div>
  );
}
