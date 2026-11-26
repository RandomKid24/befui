'use client';

import * as React from 'react';
import { Tooltip, TooltipProvider } from './tooltip';
import { useStretch } from './motion-hooks';
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
  const nav = React.useRef<HTMLElement>(null);
  const { edge, style } = useStretch(nav, (el) => el.querySelector<HTMLElement>('[aria-current="page"]'), 'y');
  return (
    <TooltipProvider delayDuration={100}>
      <nav ref={nav} aria-label="Main" className={cn('relative flex w-16 shrink-0 flex-col items-center gap-1 border-r bg-card py-3', className)}>
        {edge && <>
          <span aria-hidden className="pointer-events-none absolute motion-reduce:!transition-none size-10 rounded-xl bg-primary/10" style={{ ...style, left: edge.left, height: 'auto' }} />
          <span aria-hidden className="pointer-events-none absolute motion-reduce:!transition-none left-0 w-1 rounded-r-full bg-primary" style={{ ...style, marginBlock: 10 }} />
        </>}
        {header && <div className="mb-2">{header}</div>}
        {items.map((it) => {
          const on = it.id === value;
          return (
            <Tooltip key={it.id} content={it.label} side="right">
              <button type="button" aria-label={it.label} aria-current={on ? 'page' : undefined} onClick={() => onChange(it.id)} className={cn('relative grid size-10 place-items-center rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-5', on ? cn('text-primary', !edge && 'bg-primary/10') : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
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
