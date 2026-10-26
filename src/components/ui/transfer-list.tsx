'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';
import { Button } from './button';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from './icons';

export interface TransferItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Two lists with arrows between them: tick items on one side and move them across. For choosing roles, columns or members from a pool.
 * Controlled with `value` (the chosen values) and `onChange`. Each side has its own search and a select-all box.
 */
export function TransferList({
  items,
  value,
  onChange,
  titles = ['Available', 'Selected'],
  searchable = true,
  className,
}: {
  items: TransferItem[];
  value: string[];
  onChange: (value: string[]) => void;
  titles?: [string, string];
  searchable?: boolean;
  className?: string;
}) {
  const [ticked, setTicked] = React.useState<Set<string>>(new Set());
  const chosen = new Set(value);
  const left = items.filter((i) => !chosen.has(i.value));
  const right = value.map((v) => items.find((i) => i.value === v)).filter(Boolean) as TransferItem[];
  const tickedIn = (list: TransferItem[]) => list.filter((i) => ticked.has(i.value) && !i.disabled);

  const move = (to: 'right' | 'left') => {
    const from = to === 'right' ? left : right;
    const ids = tickedIn(from).map((i) => i.value);
    if (!ids.length) return;
    onChange(to === 'right' ? [...value, ...ids] : value.filter((v) => !ids.includes(v)));
    setTicked((t) => { const n = new Set(t); ids.forEach((i) => n.delete(i)); return n; });
  };
  const toggle = (v: string, on: boolean) => setTicked((t) => { const n = new Set(t); on ? n.add(v) : n.delete(v); return n; });

  return (
    <div className={cn('grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]', className)}>
      <Pane title={titles[0]} list={left} ticked={ticked} toggle={toggle} searchable={searchable} setAll={(on) => left.forEach((i) => !i.disabled && toggle(i.value, on))} />
      <div className="flex justify-center gap-2 sm:flex-col sm:self-center">
        <Button variant="outline" size="icon-sm" aria-label="Move selected right" disabled={!tickedIn(left).length} onClick={() => move('right')}><ChevronRightIcon className="rtl:rotate-180 max-sm:rotate-90" /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Move selected left" disabled={!tickedIn(right).length} onClick={() => move('left')}><ChevronLeftIcon className="rtl:rotate-180 max-sm:rotate-90" /></Button>
      </div>
      <Pane title={titles[1]} list={right} ticked={ticked} toggle={toggle} searchable={searchable} setAll={(on) => right.forEach((i) => !i.disabled && toggle(i.value, on))} />
    </div>
  );
}

function Pane({ title, list, ticked, toggle, setAll, searchable }: { title: string; list: TransferItem[]; ticked: Set<string>; toggle: (v: string, on: boolean) => void; setAll: (on: boolean) => void; searchable: boolean }) {
  const [q, setQ] = React.useState('');
  const shown = list.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  const usable = shown.filter((i) => !i.disabled);
  const n = usable.filter((i) => ticked.has(i.value)).length;
  const all = usable.length > 0 && n === usable.length;
  const id = React.useId();
  return (
    <div className="flex min-h-56 min-w-0 flex-col overflow-hidden rounded-xl border bg-card" role="group" aria-labelledby={id}>
      <div className="flex items-center gap-2.5 border-b px-3 py-2">
        <Checkbox checked={all ? true : n ? 'indeterminate' : false} onCheckedChange={() => setAll(!all)} aria-label={`Select all in ${title}`} disabled={!usable.length} />
        <span id={id} className="flex-1 text-sm font-medium">{title}</span>
        <span className="text-xs tabular-nums text-muted-foreground">{n}/{list.length}</span>
      </div>
      {searchable && (
        <div className="relative border-b">
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label={`Search ${title}`} className="h-9 w-full bg-transparent ps-9 pe-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:bg-muted/50" />
        </div>
      )}
      <ul className="max-h-64 flex-1 overflow-y-auto p-1">
        {shown.map((i) => (
          <li key={i.value}>
            <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-secondary', i.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent')}>
              <Checkbox checked={ticked.has(i.value)} disabled={i.disabled} onCheckedChange={(c) => toggle(i.value, c === true)} />
              <span className="truncate">{i.label}</span>
            </label>
          </li>
        ))}
        {!shown.length && <li className="px-2 py-6 text-center text-sm text-muted-foreground">{q ? 'No matches' : 'Nothing here'}</li>}
      </ul>
    </div>
  );
}
