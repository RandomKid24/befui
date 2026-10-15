'use client';

import * as React from 'react';
import { GlobeIcon } from './icons';
import { cn } from '@/lib/utils';

export interface Source { id: string; title: string; site: string; href: string }

/** Small numbered chip to drop inside an answer: "...grew 12% [1]". Links to the source. */
export function Cite({ n, href, title }: { n: number; href?: string; title?: string }) {
  const cls = 'ms-0.5 inline-grid h-4 min-w-4 -translate-y-0.5 place-items-center rounded-full bg-primary/10 px-1 align-baseline text-[10px] font-semibold leading-none text-primary no-underline transition-colors hover:bg-primary hover:text-primary-foreground';
  return href ? <a href={href} title={title} aria-label={`Source ${n}${title ? `: ${title}` : ''}`} className={cls}>{n}</a> : <span className={cls}>{n}</span>;
}

/** The sources under an answer, one numbered card each. Wraps on small screens. */
export function SourceList({ sources, className }: { sources: Source[]; className?: string }) {
  return (
    <ol aria-label="Sources" className={cn('flex flex-wrap gap-2', className)}>
      {sources.map((s, i) => (
        <li key={s.id}>
          <a href={s.href} className="group flex w-52 max-w-full items-start gap-2 rounded-lg border bg-card p-2.5 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/40">
            <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{i + 1}</span>
            <span className="min-w-0">
              <span className="line-clamp-2 text-[13px] font-medium leading-snug group-hover:text-primary">{s.title}</span>
              <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><GlobeIcon className="size-3" />{s.site}</span>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
