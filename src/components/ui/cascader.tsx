'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from './icons';

export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

/** Walks the tree of `options` along the `path` of values and returns the option at each level. */
function trail(options: CascaderOption[], path: string[]) {
  const out: CascaderOption[] = [];
  let level: CascaderOption[] | undefined = options;
  for (const v of path) {
    const hit: CascaderOption | undefined = level?.find((o) => o.value === v);
    if (!hit) break;
    out.push(hit);
    level = hit.children;
  }
  return out;
}

/**
 * A select with columns for nested choices: country, state, city. Picking an item with children opens the next column;
 * picking a leaf sets `value` (the full path of values) and closes. Arrow keys move inside a column, right/left change column.
 */
export function Cascader({
  options,
  value,
  onChange,
  placeholder = 'Select',
  separator = ' / ',
  className,
}: {
  options: CascaderOption[];
  value?: string[];
  onChange?: (path: string[], labels: string[]) => void;
  placeholder?: string;
  separator?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [path, setPath] = React.useState<string[]>(value ?? []);
  React.useEffect(() => { if (value) setPath(value); }, [value]);
  const picked = trail(options, value ?? path);
  const cols: CascaderOption[][] = [options];
  trail(options, path).forEach((o) => o.children?.length && cols.push(o.children));
  const label = picked.map((o) => o.label).join(separator);

  const choose = (depth: number, o: CascaderOption) => {
    const next = [...path.slice(0, depth), o.value];
    setPath(next);
    if (!o.children?.length) {
      onChange?.(next, trail(options, next).map((x) => x.label));
      setOpen(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLUListElement>, depth: number, list: CascaderOption[]) => {
    const items = list.filter((o) => !o.disabled);
    const i = items.findIndex((o) => o.value === path[depth]);
    const move = (n: number) => { e.preventDefault(); const o = items[(i + n + items.length) % items.length]; if (o) { setPath([...path.slice(0, depth), o.value]); focusSoon(e.currentTarget, depth, o.value); } };
    if (e.key === 'ArrowDown') move(1);
    else if (e.key === 'ArrowUp') move(-1);
    else if (e.key === 'ArrowRight') { const o = items[i]; if (o?.children?.length) { e.preventDefault(); focusSoon(e.currentTarget.parentElement!, depth + 1, o.children[0]!.value, true); setPath([...path.slice(0, depth), o.value, o.children[0]!.value]); } }
    else if (e.key === 'ArrowLeft' && depth > 0) { e.preventDefault(); setPath(path.slice(0, depth)); focusSoon(e.currentTarget.parentElement!, depth - 1, path[depth - 1]!, true); }
    else if (e.key === 'Enter' || e.key === ' ') { if (i >= 0) { e.preventDefault(); choose(depth, items[i]!); } }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-haspopup="listbox"
          className={cn('flex h-9 w-64 max-w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm outline-none transition-[border,box-shadow] hover:border-muted-foreground/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 data-[state=open]:border-ring', className)}
        >
          <span className={cn('truncate', !label && 'text-muted-foreground')}>{label || placeholder}</span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto max-w-[calc(100vw-2rem)] overflow-x-auto p-0">
        {cols.map((list, depth) => (
          <ul key={depth} role="listbox" aria-label={`Level ${depth + 1}`} data-depth={depth} onKeyDown={(e) => onKey(e, depth, list)} className="max-h-64 min-w-40 shrink-0 overflow-y-auto border-e p-1 last:border-e-0">
            {list.map((o) => {
              const on = path[depth] === o.value;
              const leafPicked = picked[depth]?.value === o.value;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={on}
                  aria-disabled={o.disabled}
                  data-value={o.value}
                  tabIndex={on || (!path[depth] && o === list.find((x) => !x.disabled)) ? 0 : -1}
                  onClick={() => !o.disabled && choose(depth, o)}
                  className={cn('flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-sm outline-none hover:bg-secondary focus-visible:bg-secondary', on && 'bg-accent text-accent-foreground', o.disabled && 'cursor-not-allowed opacity-50')}
                >
                  <span className="truncate">{o.label}</span>
                  {o.children?.length ? <ChevronRightIcon className="size-3.5 text-muted-foreground rtl:rotate-180" /> : leafPicked ? <CheckIcon className="size-3.5 text-primary" /> : null}
                </li>
              );
            })}
          </ul>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function focusSoon(from: HTMLElement, depth: number, value: string, root = false) {
  requestAnimationFrame(() => {
    const scope = root ? from : from.parentElement!;
    scope.querySelector<HTMLElement>(`ul[data-depth="${depth}"] [data-value="${CSS.escape(value)}"]`)?.focus();
  });
}
