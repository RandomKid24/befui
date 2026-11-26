'use client';

import * as React from 'react';
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
  const [edge, setEdge] = React.useState<{ left: number; right: number; forward: boolean } | null>(null);

  React.useLayoutEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const measure = () => {
      // the list item, not the button: offsets are relative to the nearest positioned parent, which for a button is its own item
      const el = ul.querySelector<HTMLElement>('[aria-current="page"]')?.parentElement;
      if (!el) return setEdge(null);
      const left = el.offsetLeft;
      const right = ul.offsetWidth - left - el.offsetWidth;
      setEdge((was) => (was && was.left === left && was.right === right ? was : { left, right, forward: !was || left >= was.left }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [value, items]);

  const lead = 'var(--dur-base)';
  const trail = 'var(--dur-medium)';
  return (
    <nav aria-label={label} className={cn('max-w-full overflow-x-auto rounded-lg border bg-card p-1', className)}>
      <ul ref={list} className="relative flex w-max gap-1">
        {edge && (
          <li
            aria-hidden
            data-highlight
            className="absolute inset-y-0 rounded-md bg-foreground ease-out motion-reduce:!transition-none"
            style={{ left: edge.left, right: edge.right, transition: `left ${edge.forward ? trail : lead} var(--ease-out), right ${edge.forward ? lead : trail} var(--ease-out)` }}
          />
        )}
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
