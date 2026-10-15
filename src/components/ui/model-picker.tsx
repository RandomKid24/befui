'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from './icons';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

export interface Model {
  id: string;
  name: string;
  /** One line on what it is good at. */
  description?: string;
  /** Context window, already formatted, e.g. "200K". */
  context?: string;
  /** Small tags such as "Fast", "Vision" or "$$". */
  tags?: string[];
}

/** Picker for which model answers: a compact button that opens a list with each model's description, context size and tags. */
export function ModelPicker({ models, value, onValueChange, className }: { models: Model[]; value: string; onValueChange: (id: string) => void; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const current = models.find((m) => m.id === value) ?? models[0]!;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label={`Model: ${current.name}`} className={cn('inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 data-[state=open]:bg-secondary', className)}>
          {current.name}
          <ChevronsUpDownIcon className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-1.5">
        <ul role="listbox" aria-label="Models" className="grid gap-0.5">
          {models.map((m) => (
            <li key={m.id} role="option" aria-selected={m.id === value}>
              <button type="button" onClick={() => { onValueChange(m.id); setOpen(false); }} className="flex w-full items-start gap-2.5 rounded-lg p-2.5 text-start outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary">
                <span className="grid size-4 shrink-0 place-items-center pt-1 text-primary">{m.id === value && <CheckIcon className="size-4" />}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium">{m.name}</span>
                    {m.context && <span className="rounded-md bg-muted px-1.5 py-px font-mono text-[10px] text-muted-foreground">{m.context}</span>}
                  </span>
                  {m.description && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{m.description}</span>}
                  {m.tags && m.tags.length > 0 && (
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {m.tags.map((t) => <span key={t} className="rounded-full border px-2 py-px text-[11px] text-muted-foreground">{t}</span>)}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
