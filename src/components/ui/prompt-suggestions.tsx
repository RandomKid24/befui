'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Suggestion { id: string; label: string; hint?: string; icon?: React.ReactNode }

/**
 * Starter prompts under an empty chat. `layout="grid"` shows two-line cards (label and hint); `layout="chips"` shows compact pills
 * that wrap. Selecting one calls `onSelect`, usually to fill the PromptInput.
 */
export function PromptSuggestions({ items, onSelect, layout = 'grid', className }: { items: Suggestion[]; onSelect: (s: Suggestion) => void; layout?: 'grid' | 'chips'; className?: string }) {
  if (layout === 'chips') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {items.map((s) => (
          <button key={s.id} type="button" onClick={() => onSelect(s)} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-[13px] outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.98] [&_svg]:size-3.5 [&_svg]:text-muted-foreground">
            {s.icon}{s.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className={cn('grid gap-2 sm:grid-cols-2', className)}>
      {items.map((s) => (
        <button key={s.id} type="button" onClick={() => onSelect(s)} className="group flex items-start gap-3 rounded-xl border bg-card p-3 text-start outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] hover:-translate-y-px hover:border-primary/40 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring/40 active:translate-y-0">
          {s.icon && <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4">{s.icon}</span>}
          <span className="min-w-0">
            <span className="block text-sm font-medium">{s.label}</span>
            {s.hint && <span className="mt-0.5 block text-[13px] text-muted-foreground">{s.hint}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
