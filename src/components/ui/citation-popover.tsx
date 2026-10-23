'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { GlobeIcon } from './icons';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

export interface Citation {
  title: string;
  site: string;
  href: string;
  /** The passage the answer leans on. */
  quote?: string;
}

/**
 * A number to drop inside an answer ("grew 12% [1]") that opens a small card on hover or focus: site, title and the passage that
 * was used. The number is a real link to the source, so touch and screen readers get the same thing without the card.
 */
export function CitationPopover({ n, source, className }: { n: number; source: Citation; className?: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={source.href}
          aria-label={`Source ${n}: ${source.title}, ${source.site}`}
          className={cn('ms-0.5 inline-grid h-4 min-w-4 -translate-y-0.5 place-items-center rounded-full bg-primary/10 px-1 align-baseline text-[10px] font-semibold leading-none text-primary no-underline outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground', className)}
        >
          {n}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 max-w-[calc(100vw-1.5rem)] p-3" collisionPadding={12}>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><GlobeIcon className="size-3" />{source.site}</p>
        <p className="mt-1 text-[13px] font-medium leading-snug">{source.title}</p>
        {source.quote && <blockquote className="mt-2 line-clamp-4 border-s-2 ps-2.5 text-xs italic leading-relaxed text-muted-foreground">{source.quote}</blockquote>}
      </HoverCardContent>
    </HoverCard>
  );
}
