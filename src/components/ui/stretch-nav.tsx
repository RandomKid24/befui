'use client';

import * as React from 'react';
import { useStretch } from './motion-hooks';
import { cn } from '@/lib/utils';

export interface StretchNavItem { id: string; label: React.ReactNode }

/** A row of views with one highlight. Moving, its front edge leaves first and the back edge catches up, so it stretches towards the new item. */
export function StretchNav({ items, value, onChange, label = 'Views', className }: {
  items: StretchNavItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the navigation. */
  label?: string;
  className?: string;
}) {
  const list = React.useRef<HTMLUListElement>(null);
  // the list item, not the button: offsets are relative to the nearest positioned parent, which for a button is its own item
  const { style } = useStretch(list, (ul) => ul.querySelector<HTMLElement>('[aria-current="page"]')?.parentElement);

  return (
    <nav aria-label={label} className={cn('max-w-full overflow-x-auto rounded-lg border bg-card p-1', className)}>
      <ul ref={list} className="relative flex w-max gap-1">
        {style && <li aria-hidden data-highlight className="absolute inset-y-0 rounded-md bg-foreground motion-reduce:!transition-none" style={style} />}
        {items.map((it) => (
          <li key={it.id} className="relative">
            <button
              type="button"
              aria-current={it.id === value ? 'page' : undefined}
              onClick={() => onChange(it.id)}
              className={cn('flex h-8 items-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4', it.id === value ? 'text-background' : 'text-muted-foreground hover:text-foreground')}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
