'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons';
import { cn } from '@/lib/utils';

export interface OrderlaneStatus {
  key: string;
  label: string;
  /** Hex colour for the column header. Without one the header uses a soft tint picked from the key. */
  color?: string;
}
export interface OrderlaneGroup {
  id: string;
  label: string;
  /** Hex colour. The group is tinted with it at about 9% opacity. */
  color?: string;
  statuses: OrderlaneStatus[];
}

/** Key for cards that have no status. They get their own first group. */
export const ORDERLANE_NONE = '__none';

const tints: Record<string, string> = {
  new: 'bg-blue-100/50 text-blue-700',
  confirmed: 'bg-emerald-100/50 text-emerald-700',
  in_production: 'bg-amber-100/50 text-amber-700',
  shipped: 'bg-blue-100/50 text-blue-700',
  delivered: 'bg-green-100/50 text-green-700',
  cancelled: 'bg-rose-100/50 text-rose-700',
  default: 'bg-slate-100/50 text-slate-700',
};

const inkFor = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const luminance = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance < 0.5 ? '#fff' : '#111';
};

// Scrolls a container sideways while a dragged card hovers near its left or right edge.
const edgeScroll = (e: React.DragEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  if (e.clientX < r.left + 64) el.scrollLeft -= 18;
  else if (e.clientX > r.right - 64) el.scrollLeft += 18;
};

const noScrollbar = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

/**
 * Board in three levels: status groups that collapse, fixed-width status columns, and cards you drag between columns.
 * Controlled: `value` maps a status key to its cards (use ORDERLANE_NONE for cards without one) and `onMove` says which card
 * was dropped where, so you can save it or ask for an attachment first. Native drag and drop, no dependency. The board and
 * each group scroll sideways when you drag near their edges. `renderCard` draws the inside of a card, the component draws its frame.
 */
export function OrderlaneKanban<T extends { id: string }>({
  groups,
  value,
  onMove,
  renderCard,
  onCardClick,
  onAdd,
  isLocked,
  savingId,
  hideEmpty,
  noStatusLabel = 'No status',
  unit = 'orders',
  className,
}: {
  groups: OrderlaneGroup[];
  value: Record<string, T[]>;
  onMove: (id: string, from: string, to: string) => void;
  renderCard: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void;
  /** Shows a + in each column header. */
  onAdd?: (statusKey: string) => void;
  /** Locked cards (won or lost) can't be dragged. */
  isLocked?: (item: T) => boolean;
  /** The card showing a saving pulse after a drop. */
  savingId?: string | null;
  /** Hide columns with no cards, and groups whose columns are all empty. */
  hideEmpty?: boolean;
  noStatusLabel?: string;
  /** What the cards are called in a group header, as in "7 leads". */
  unit?: string;
  className?: string;
}) {
  const [drag, setDrag] = React.useState<{ id: string; from: string } | null>(null);
  const [over, setOver] = React.useState<string | null>(null);
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  // A drag ends with a click on some browsers, so the card ignores clicks for a tick after it.
  const justDragged = React.useRef(false);

  const cardsOf = (key: string) => value[key] ?? [];
  const shown: OrderlaneGroup[] = [
    ...(cardsOf(ORDERLANE_NONE).length ? [{ id: ORDERLANE_NONE, label: noStatusLabel, statuses: [{ key: ORDERLANE_NONE, label: noStatusLabel }] }] : []),
    ...groups,
  ]
    .map((g) => ({ ...g, statuses: hideEmpty ? g.statuses.filter((s) => cardsOf(s.key).length > 0) : g.statuses }))
    .filter((g) => g.statuses.length > 0);

  const column = (s: OrderlaneStatus) => {
    const cards = cardsOf(s.key);
    return (
      <div
        key={s.key}
        onDragOver={(e) => { e.preventDefault(); setOver(s.key); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null); }}
        onDrop={(e) => {
          e.preventDefault();
          setOver(null);
          if (drag && drag.from !== s.key) onMove(drag.id, drag.from, s.key);
          setDrag(null);
        }}
        className={cn(
          'flex h-[calc(100vh-260px)] w-80 shrink-0 flex-col overflow-hidden rounded-xl border-2 transition-colors',
          over === s.key ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-slate-50/50',
        )}
      >
        <div
          className={cn('flex shrink-0 items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-semibold uppercase tracking-wide', !s.color && (tints[s.key] ?? tints.default))}
          style={s.color ? { backgroundColor: s.color, color: inkFor(s.color) } : undefined}
        >
          <span>{s.label}</span>
          <span className="flex items-center gap-2">
            <span className="text-xs opacity-80">({cards.length})</span>
            {onAdd && (
              <button type="button" aria-label={`Add to ${s.label}`} onClick={() => onAdd(s.key)} className="grid size-6 place-items-center rounded opacity-80 transition-opacity hover:opacity-100">
                <PlusIcon className="size-4" />
              </button>
            )}
          </span>
        </div>
        <div className={cn('min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden p-2', noScrollbar)}>
          {cards.map((item) => {
            const draggable = !isLocked?.(item);
            return (
              <div
                key={item.id}
                draggable={draggable}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', item.id);
                  e.dataTransfer.effectAllowed = 'move';
                  justDragged.current = true;
                  setDrag({ id: item.id, from: s.key });
                }}
                onDragEnd={() => { setDrag(null); setOver(null); setTimeout(() => { justDragged.current = false; }, 0); }}
                onClick={() => { if (!justDragged.current) onCardClick?.(item); }}
                className={cn(
                  'rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-[box-shadow,opacity] duration-(--dur-fast) hover:shadow-md',
                  draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
                  drag?.id === item.id && 'opacity-50',
                  savingId === item.id && 'animate-pulse',
                )}
              >
                {renderCard(item)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div onDragOver={edgeScroll} className={cn('flex min-h-[calc(100vh-220px)] gap-4 overflow-x-auto px-4 pb-4', className)}>
      {shown.map((g) => {
        const isCollapsed = collapsed[g.id];
        const count = g.statuses.reduce((n, s) => n + cardsOf(s.key).length, 0);
        const toggle = () => setCollapsed((c) => ({ ...c, [g.id]: !c[g.id] }));
        return (
          <div
            key={g.id}
            className={cn('flex shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 p-4', isCollapsed && 'w-14')}
            style={{ backgroundColor: g.color ? `${g.color}18` : 'rgba(241,245,249,0.5)' }}
          >
            {isCollapsed ? (
              <button type="button" onClick={toggle} aria-label={`Expand ${g.label}`} className="flex min-h-[120px] flex-col items-center justify-center gap-2 px-1 py-4">
                <ChevronLeftIcon className="size-[18px] rotate-90 text-slate-500" />
                <span className="text-xs font-semibold text-slate-600 [writing-mode:vertical-rl]">{g.label}</span>
                <span className="text-[11px] font-bold text-slate-500">{count}</span>
              </button>
            ) : (
              <>
                <button type="button" onClick={toggle} aria-label={`Collapse ${g.label}`} className="mb-3 flex w-full items-center gap-2 border-b border-slate-200 pb-2 text-left">
                  <span className="text-sm font-semibold text-slate-700">{g.label}</span>
                  <span className="text-xs text-slate-400">({g.statuses.length} {g.statuses.length === 1 ? 'status' : 'statuses'} • {count} {unit})</span>
                  <ChevronRightIcon className="ml-auto size-4 text-slate-400" />
                </button>
                <div onDragOver={edgeScroll} className={cn('flex gap-4 overflow-x-auto pb-2', noScrollbar)}>
                  {g.statuses.map(column)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
