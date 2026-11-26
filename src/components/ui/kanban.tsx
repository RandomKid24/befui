'use client';

import * as React from 'react';
import { useDragLift, useFlip } from './motion-hooks';
import { cn } from '@/lib/utils';

export interface KanbanColumn {
  id: string;
  title: string;
  /** Dot color next to the title. */
  tone?: 'default' | 'info' | 'warning' | 'success' | 'danger';
}

const dot = { default: 'bg-muted-foreground', info: 'bg-info', warning: 'bg-warning', success: 'bg-success', danger: 'bg-destructive' };

/**
 * Board of columns with draggable cards. Controlled: `value` maps column id to its cards, `onChange` gets the new map.
 * Drag with a mouse or a finger (hold a moment on touch): the card lifts and tilts, a space opens where it will land and the others slide aside.
 * Keyboard: focus a card, then Alt + arrows moves it.
 * Cards need a unique `id`. `renderCard` draws what is inside the card.
 */
export function Kanban<T extends { id: string }>({
  columns,
  value,
  onChange,
  renderCard,
  onAdd,
  className,
}: {
  columns: KanbanColumn[];
  value: Record<string, T[]>;
  onChange: (next: Record<string, T[]>) => void;
  renderCard: (item: T) => React.ReactNode;
  onAdd?: (columnId: string) => void;
  className?: string;
}) {
  const [refocus, setRefocus] = React.useState<string | null>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const flip = useFlip(root);

  React.useEffect(() => {
    if (!refocus) return;
    root.current?.querySelector<HTMLElement>(`[data-card="${CSS.escape(refocus)}"]`)?.focus();
    setRefocus(null);
  }, [refocus]);

  /** Moves a card; `index` counts cards in the target column without the moving one. */
  const move = (id: string, col: string, index: number) => {
    let item: T | undefined;
    const next: Record<string, T[]> = {};
    for (const c of columns) {
      const list = value[c.id] ?? [];
      item ??= list.find((i) => i.id === id);
      next[c.id] = list.filter((i) => i.id !== id);
    }
    if (!item) return;
    next[col] = [...next[col].slice(0, index), item, ...next[col].slice(index)];
    onChange(next);
  };

  const { drag, start } = useDragLift<{ col: string; index: number }>({
    locate: (x, y) => {
      const board = root.current!;
      const edge = board.getBoundingClientRect();
      if (x > edge.right - 48) board.scrollLeft += 14;
      else if (x < edge.left + 48) board.scrollLeft -= 14;
      const section = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-column]');
      if (!section || !board.contains(section)) return null;
      const list = section.querySelector<HTMLElement>('[data-list]')!;
      const cards = [...list.querySelectorAll<HTMLElement>('[data-card]:not([data-dragging])')];
      const down = y - list.getBoundingClientRect().top;
      const i = cards.findIndex((el) => down < el.offsetTop + el.offsetHeight / 2);
      return { col: section.dataset.column!, index: i === -1 ? cards.length : i };
    },
    drop: (id, slot, releasedAt) => {
      flip.from(id, releasedAt); // it settles into place from where you let go
      move(id, slot.col, slot.index);
    },
  });

  const onKey = (e: React.KeyboardEvent, id: string, col: number, row: number) => {
    if (!e.altKey) return;
    const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const dy = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!dx && !dy) return;
    e.preventDefault();
    const to = columns[col + dx];
    if (dx && to) move(id, to.id, Math.min(row, (value[to.id] ?? []).length));
    else if (dy && row + dy >= 0 && row + dy < (value[columns[col].id] ?? []).length) move(id, columns[col].id, row + dy);
    else return;
    setRefocus(id);
  };

  return (
    <div ref={root} className={cn('relative flex w-full gap-3 overflow-x-auto pb-2', className)}>
      {columns.map((c, ci) => {
        const items = value[c.id] ?? [];
        const target = drag?.slot?.col === c.id;
        const showAt = target ? drag!.slot!.index : -1;
        let seen = 0;
        const space = <div key="drop" data-flip="__drop" aria-hidden className="shrink-0 rounded-lg border-2 border-dashed border-primary/60 bg-primary/5" style={{ height: drag?.height }} />;
        return (
          <section key={c.id} aria-label={c.title} data-column={c.id} className={cn('flex w-64 shrink-0 flex-col rounded-xl bg-muted/60 p-2 ring-1 ring-transparent transition-[background-color,box-shadow]', target && 'bg-accent/60 ring-primary/40')}>
            <header className="flex items-center gap-2 px-1.5 pb-2 pt-1 text-[13px] font-medium">
              <span className={cn('size-2 rounded-full', dot[c.tone ?? 'default'])} />
              {c.title}
              <span key={items.length} className="rounded-full bg-background px-1.5 text-[11px] tabular-nums text-muted-foreground motion-safe:animate-pop">{items.length}</span>
              {onAdd && <button type="button" aria-label={`Add to ${c.title}`} onClick={() => onAdd(c.id)} className="ml-auto grid size-5 place-items-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground">+</button>}
            </header>
            <div data-list className="relative flex min-h-12 flex-1 flex-col gap-2">
              {items.map((it, ri) => {
                const moving = it.id === drag?.id;
                const before = !moving && seen++ === showAt ? space : null;
                return (
                  <React.Fragment key={it.id}>
                    {before}
                    <div
                      data-card={it.id}
                      data-flip={it.id}
                      data-dragging={moving ? '' : undefined}
                      tabIndex={0}
                      onPointerDown={start(it.id)}
                      onDragStart={(e) => e.preventDefault()}
                      onKeyDown={(e) => onKey(e, it.id, ci, ri)}
                      className={cn('cursor-grab select-none rounded-lg border bg-card p-3 text-[13px] shadow-sm outline-none transition-[box-shadow,border-color] [-webkit-touch-callout:none] hover:border-primary/40 hover:shadow-md active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring/40', moving && (drag!.slot ? 'hidden' : 'opacity-40'))}
                    >
                      {renderCard(it)}
                    </div>
                  </React.Fragment>
                );
              })}
              {showAt >= 0 && seen === showAt && space}
              {items.length === 0 && showAt < 0 && <p className="grid flex-1 place-items-center rounded-lg border border-dashed py-4 text-xs text-muted-foreground">Drop cards here</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
