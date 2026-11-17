'use client';

import * as React from 'react';
import { Tooltip, TooltipProvider } from './tooltip';
import { cn } from '@/lib/utils';

export interface RailItem { id: string; label: string; icon: React.ReactNode; /** Red dot with a count, e.g. unread. */ badge?: number }

/** A narrow icon-only column for apps with a few big areas (Home, Inbox, Files). Labels show in a tooltip. Put the user or settings in `footer`. */
export function SidebarRail({ items, value, onChange, header, footer, className }: {
  items: RailItem[];
  value: string;
  onChange: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={100}>
      <nav aria-label="Main" className={cn('flex w-16 shrink-0 flex-col items-center gap-1 border-r bg-card py-3', className)}>
        {header && <div className="mb-2">{header}</div>}
        {items.map((it) => {
          const on = it.id === value;
          return (
            <Tooltip key={it.id} content={it.label} side="right">
              <button type="button" aria-label={it.label} aria-current={on ? 'page' : undefined} onClick={() => onChange(it.id)} className={cn('relative grid size-10 place-items-center rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-5', on ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                {on && <span aria-hidden className="absolute -left-3 h-5 w-1 rounded-r-full bg-primary" />}
                {it.icon}
                {!!it.badge && <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-4 text-white">{it.badge > 9 ? '9+' : it.badge}</span>}
              </button>
            </Tooltip>
          );
        })}
        {footer && <div className="mt-auto">{footer}</div>}
      </nav>
    </TooltipProvider>
  );
}
