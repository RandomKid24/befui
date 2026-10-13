import * as React from 'react';
import { ChevronDownIcon } from './icons';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

/** Items-driven accordion. Height animates smoothly via grid rows, so no measuring. */
export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
}: {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}) {
  const [open, setOpen] = React.useState<string[]>(defaultOpen);
  const uid = React.useId();
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]));
  return (
    <div className={cn('divide-y rounded-xl border bg-card', className)}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        return (
          <div key={it.id}>
            <button
              type="button"
              id={`${uid}-button-${it.id}`}
              aria-expanded={isOpen}
              aria-controls={`${uid}-panel-${it.id}`}
              onClick={() => toggle(it.id)}
              className="group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
            >
              {it.title}
              <ChevronDownIcon className={cn('size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out', isOpen && 'rotate-180 text-foreground')} />
            </button>
            <div
              id={`${uid}-panel-${it.id}`}
              role="region"
              aria-labelledby={`${uid}-button-${it.id}`}
              className={cn('grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-sm text-muted-foreground">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
