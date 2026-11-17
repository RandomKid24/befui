'use client';

import * as React from 'react';
import { Tooltip, TooltipProvider } from './tooltip';
import { cn } from '@/lib/utils';

export interface SplitSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  links: { id: string; label: string; count?: number }[];
}

/**
 * Two columns: an icon rail picks the area, a wider panel next to it lists that area's pages. Fits apps with many pages
 * under a few areas (Projects, People, Billing) without a long scrolling list.
 */
export function SidebarSplit({ sections, section, onSection, link, onLink, footer, className }: {
  sections: SplitSection[];
  section: string;
  onSection: (id: string) => void;
  link: string;
  onLink: (id: string) => void;
  footer?: React.ReactNode;
  className?: string;
}) {
  const cur = sections.find((s) => s.id === section) ?? sections[0];
  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn('flex shrink-0 border-r bg-card', className)}>
        <nav aria-label="Areas" className="flex w-14 flex-col items-center gap-1 border-r bg-muted/40 py-3">
          {sections.map((s) => (
            <Tooltip key={s.id} content={s.label} side="right">
              <button type="button" aria-label={s.label} aria-pressed={s.id === cur.id} onClick={() => onSection(s.id)} className={cn('grid size-10 place-items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-5', s.id === cur.id ? 'bg-background text-foreground shadow-sm ring-1 ring-border' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>{s.icon}</button>
            </Tooltip>
          ))}
          {footer && <div className="mt-auto">{footer}</div>}
        </nav>
        <nav aria-label={cur.label} className="w-52 p-3">
          <h2 className="px-2 pb-2 pt-1 text-sm font-semibold">{cur.label}</h2>
          <ul className="grid gap-0.5">
            {cur.links.map((l) => (
              <li key={l.id}>
                <button type="button" aria-current={l.id === link ? 'page' : undefined} onClick={() => onLink(l.id)} className={cn('flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50', l.id === link ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                  {l.label}
                  {l.count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{l.count}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </TooltipProvider>
  );
}
