import * as React from 'react';
import { CheckIcon } from './icons';
import { cn } from '@/lib/utils';

export interface TrackerStep {
  label: string;
  /** Short line under the label, e.g. a place. */
  description?: string;
  /** When it happened, e.g. "12 Oct, 4:30 pm". Leave off for steps still ahead. */
  time?: string;
  icon?: React.ReactNode;
}

/**
 * Delivery or progress tracker: steps joined by a line that fills up to the current one (Ordered, Packed, Shipped, Out for delivery, Delivered).
 * `current` is the index of the step in progress; earlier steps show a tick, the current one pulses, later ones are dimmed.
 * Horizontal on wide screens, vertical on phones, or force it with `orientation`. The line fills in on first render.
 */
export function OrderTracker({ steps, current, orientation = 'auto', className }: { steps: TrackerStep[]; current: number; orientation?: 'auto' | 'horizontal' | 'vertical'; className?: string }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
  // class sets per layout: list, step, line to the next step, and the fill's hidden / shown scale
  const L = {
    vertical: { ol: 'gap-8', li: 'items-start gap-3', seg: 'left-[15px] top-9 -bottom-7 w-0.5', off: 'origin-top scale-y-0', on: 'origin-top scale-y-100', text: 'pt-1' },
    horizontal: { ol: 'grid-flow-col auto-cols-fr', li: 'flex-col items-center text-center', seg: 'left-1/2 top-[15px] h-0.5 w-full', off: 'origin-left scale-x-0', on: 'origin-left scale-x-100', text: 'pt-2' },
    auto: { ol: 'gap-8 sm:grid-flow-col sm:auto-cols-fr sm:gap-0', li: 'items-start gap-3 sm:flex-col sm:items-center sm:text-center', seg: 'left-[15px] top-9 -bottom-7 w-0.5 sm:left-1/2 sm:top-[15px] sm:bottom-auto sm:h-0.5 sm:w-full', off: 'origin-top scale-y-0 sm:origin-left sm:scale-y-100 sm:scale-x-0', on: 'origin-top scale-y-100 sm:origin-left sm:scale-x-100', text: 'pt-1 sm:pt-2' },
  }[orientation];

  return (
    <ol aria-label="Progress" className={cn('grid', L.ol, className)}>
      {steps.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <li key={s.label} aria-current={active ? 'step' : undefined} className={cn('relative flex', L.li)}>
            {i < steps.length - 1 && (
              <span aria-hidden className={cn('absolute bg-border', L.seg)}>
                <span className={cn('block size-full bg-primary transition-transform duration-700 ease-out', done && on ? L.on : L.off)} style={{ transitionDelay: `${i * 220}ms` }} />
              </span>
            )}
            <span className="relative grid size-8 shrink-0 place-items-center">
              {active && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-primary/30" />}
              <span className={cn('relative grid size-8 place-items-center rounded-full border-2 text-xs font-semibold transition-colors duration-500 [&_svg]:size-4', done ? 'border-primary bg-primary text-primary-foreground' : active ? 'border-primary bg-background text-primary' : 'border-border bg-background text-muted-foreground')} style={{ transitionDelay: `${i * 220}ms` }}>
                {done ? <CheckIcon /> : s.icon ?? i + 1}
              </span>
            </span>
            <span className={cn('grid gap-0.5', L.text)}>
              <span className={cn('text-[13px] font-medium', i > current && 'text-muted-foreground')}>{s.label}</span>
              {s.description && <span className="text-xs text-muted-foreground">{s.description}</span>}
              {s.time && <span className="text-xs tabular-nums text-muted-foreground">{s.time}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
