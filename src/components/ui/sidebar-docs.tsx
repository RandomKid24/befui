'use client';

import * as React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface DocsLink { id: string; label: string; /** Small tag such as New or Beta. */ tag?: string; children?: DocsLink[] }
export interface DocsSection { title: string; items: DocsLink[] }

/**
 * Navigation for docs and help sites: section titles, plain links, and nested pages hanging off a thin guide line.
 * The page you are on gets a bar and its parents stay open. Items with `tag` show a small badge.
 */
export function SidebarDocs({ sections, value, onChange, className }: {
  sections: DocsSection[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const has = (l: DocsLink): boolean => l.id === value || !!l.children?.some(has);
  const row = (l: DocsLink) => (
    <button type="button" aria-current={l.id === value ? 'page' : undefined} onClick={() => onChange(l.id)} className={cn('relative flex w-full items-center justify-between gap-2 rounded px-3 py-1.5 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50', l.id === value ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground')}>
      {l.id === value && <span aria-hidden className="absolute -left-px top-1 h-[calc(100%-8px)] w-0.5 rounded-full bg-primary" />}
      {l.label}
      {l.tag && <Badge variant="info" className="px-1.5 py-0 text-[10px]">{l.tag}</Badge>}
    </button>
  );
  return (
    <nav aria-label="Documentation" className={cn('w-60 shrink-0 overflow-y-auto border-r bg-card p-4', className)}>
      {sections.map((s) => (
        <section key={s.title} className="mb-6 last:mb-0">
          <h3 className="mb-2 px-3 text-[13px] font-semibold">{s.title}</h3>
          <ul className="ml-3 border-l">
            {s.items.map((l) => (
              <li key={l.id}>
                {row(l)}
                {l.children && has(l) && <ul className="ml-3 border-l">{l.children.map((c) => <li key={c.id}>{row(c)}</li>)}</ul>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
