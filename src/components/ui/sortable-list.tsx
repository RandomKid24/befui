'use client';

import * as React from 'react';
import { useDragLift, useFlip } from './motion-hooks';
import { cn } from '@/lib/utils';

/**
 * Vertical list you reorder by dragging a row, or by focusing its grip and pressing the up and down arrows.
 * Controlled: `items` in, `onChange` gets the new order. Items need a unique `id`.
 * Dragging works with a mouse or a finger (touch drags at once from the grip): the row lifts, a space opens and the others slide aside.
 */
export function SortableList<T extends { id: string }>({
  items,
  onChange,
  renderItem,
  className,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}) {
  const [refocus, setRefocus] = React.useState<string | null>(null);
  const root = React.useRef<HTMLUListElement>(null);
  const flip = useFlip(root);

  React.useEffect(() => {
    if (!refocus) return;
    root.current?.querySelector<HTMLElement>(`[data-grip="${CSS.escape(refocus)}"]`)?.focus();
    setRefocus(null);
  }, [refocus]);

  /** Puts a row at `index`, counted among the other rows. */
  const place = (id: string, index: number) => {
    const next = items.filter((i) => i.id !== id);
    const it = items.find((i) => i.id === id);
    if (!it) return;
    next.splice(index, 0, it);
    if (next.some((x, i) => x !== items[i])) onChange(next);
  };

  const { drag, start } = useDragLift<number>({
    locate: (x, y) => {
      const list = root.current!;
      const r = list.getBoundingClientRect();
      if (x < r.left - 40 || x > r.right + 40 || y < r.top - 40 || y > r.bottom + 40) return null;
      const rows = [...list.querySelectorAll<HTMLElement>('[data-row]:not([data-dragging])')];
      const i = rows.findIndex((el) => y - r.top < el.offsetTop + el.offsetHeight / 2);
      return i === -1 ? rows.length : i;
    },
    drop: (id, index, releasedAt) => { flip.from(id, releasedAt); place(id, index); },
  });

  const space = <li key="drop" data-flip="__drop" aria-hidden className="rounded-lg border-2 border-dashed border-primary/60 bg-primary/5" style={{ height: drag?.height }} />;
  let seen = 0;
  return (
    <ul ref={root} className={cn('relative grid gap-1.5', className)}>
      {items.map((it, i) => {
        const moving = drag?.id === it.id;
        const before = !moving && seen++ === drag?.slot ? space : null;
        return (
        <React.Fragment key={it.id}>
        {before}
        <li
          data-row={it.id}
          data-flip={it.id}
          data-dragging={moving ? '' : undefined}
          onPointerDown={start(it.id)}
          onDragStart={(e) => e.preventDefault()}
          className={cn('relative flex cursor-grab select-none items-center gap-2 rounded-lg border bg-card p-2 pr-3 text-[13px] shadow-sm transition-[box-shadow,border-color] [-webkit-touch-callout:none] hover:border-primary/40 hover:shadow-md active:cursor-grabbing', moving && (drag!.slot !== null ? 'hidden' : 'opacity-40'))}
        >
          <button
            type="button"
            data-grip={it.id}
            aria-label="Reorder, use arrow keys"
            onKeyDown={(e) => {
              const d = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
              if (!d || i + d < 0 || i + d >= items.length) return;
              e.preventDefault();
              place(it.id, i + d);
              setRefocus(it.id);
            }}
            className="grid size-6 shrink-0 cursor-grab touch-none place-items-center rounded text-muted-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/40 active:cursor-grabbing"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" /></svg>
          </button>
          <div className="min-w-0 flex-1">{renderItem(it, i)}</div>
        </li>
        </React.Fragment>
        );
      })}
      {drag?.slot === seen && space}
    </ul>
  );
}
