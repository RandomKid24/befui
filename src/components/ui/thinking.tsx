'use client';

import * as React from 'react';
import { CheckIcon, ChevronDownIcon } from './icons';
import { cn } from '@/lib/utils';

export interface ThinkingStep { label: string; done?: boolean }

/**
 * "Thinking" status for a model that is working: a shimmering label with three bouncing dots. Give it `steps` and it becomes a
 * collapsible list of what the model is doing, with a check on each finished step. Set `done` to settle it into "Thought for 4s".
 */
export function Thinking({ label = 'Thinking', steps, done = false, took, className }: { label?: string; steps?: ThinkingStep[]; done?: boolean; took?: string; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const text = done ? `Thought${took ? ` for ${took}` : ''}` : label;
  const head = (
    <span className="inline-flex items-center gap-2 text-sm">
      {!done && (
        <span aria-hidden className="inline-flex gap-1">
          {[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-loader-dots rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </span>
      )}
      <span className={cn(done ? 'text-muted-foreground' : 'animate-shimmer bg-[linear-gradient(110deg,var(--muted-foreground)_40%,var(--foreground)_50%,var(--muted-foreground)_60%)] bg-[length:200%_100%] bg-clip-text font-medium text-transparent')}>{text}</span>
    </span>
  );
  if (!steps?.length) return <div role="status" className={className}>{head}</div>;
  return (
    <div role="status" className={className}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex items-center gap-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
        {head}
        <ChevronDownIcon className={cn('size-3.5 text-muted-foreground transition-transform duration-(--dur-base)', open && 'rotate-180')} />
      </button>
      <div className={cn('grid transition-[grid-template-rows] duration-(--dur-base)', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <ul className="overflow-hidden">
          <li className="mt-2 ms-[3px] grid gap-1.5 border-s ps-4 text-[13px]">
            {steps.map((s) => (
              <span key={s.label} className={cn('flex items-center gap-2', s.done ? 'text-muted-foreground' : 'text-foreground')}>
                <span className={cn('grid size-4 place-items-center rounded-full', s.done ? 'bg-success/15 text-success' : 'bg-primary/10')}>
                  {s.done ? <CheckIcon className="size-2.5" /> : <span className="size-1.5 animate-pulse rounded-full bg-primary" />}
                </span>
                {s.label}
              </span>
            ))}
          </li>
        </ul>
      </div>
    </div>
  );
}
