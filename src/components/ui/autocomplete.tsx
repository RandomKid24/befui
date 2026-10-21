'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

/**
 * Text input that suggests as you type. Pass `options` to filter a fixed list, or `onSearch` (returns a promise of strings) to ask a server,
 * which is how an address or place field works: fetch from your geocoding API and return the labels. Arrow keys and Enter pick; typing free
 * text still works. `onSearch` is debounced.
 */
export function Autocomplete({ value, onValueChange, options, onSearch, placeholder, debounce = 250, className }: { value: string; onValueChange: (v: string) => void; options?: string[]; onSearch?: (query: string) => Promise<string[]>; placeholder?: string; debounce?: number; className?: string }) {
  const id = React.useId();
  const [found, setFound] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const typed = React.useRef(false);

  React.useEffect(() => {
    if (!typed.current) return;
    const q = value.trim();
    if (!q) return setFound([]);
    if (!onSearch) return setFound((options ?? []).filter((o) => o.toLowerCase().includes(q.toLowerCase())).slice(0, 8));
    let stale = false;
    setLoading(true);
    const t = setTimeout(() => onSearch(q).then((r) => !stale && (setFound(r.slice(0, 8)), setLoading(false))).catch(() => !stale && setLoading(false)), debounce);
    return () => { stale = true; clearTimeout(t); };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (v: string) => { typed.current = false; onValueChange(v); setOpen(false); };
  const show = open && (found.length > 0 || loading);
  return (
    <div className={cn('relative w-full', className)}>
      <Input
        role="combobox" aria-expanded={show} aria-controls={id} aria-autocomplete="list" aria-activedescendant={show ? `${id}-${active}` : undefined}
        value={value} placeholder={placeholder} autoComplete="off"
        onChange={(e) => { typed.current = true; onValueChange(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, found.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === 'Enter' && show && found[active]) { e.preventDefault(); pick(found[active]!); }
          else if (e.key === 'Escape') setOpen(false);
        }}
      />
      {show && (
        <ul id={id} role="listbox" className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-lg animate-pop">
          {loading && !found.length ? <li className="px-2.5 py-2 text-sm text-muted-foreground">Searching…</li> : null}
          {found.map((o, i) => (
            <li key={o} id={`${id}-${i}`} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onMouseDown={(e) => { e.preventDefault(); pick(o); }} className={cn('cursor-pointer rounded-md px-2.5 py-2 text-sm', i === active && 'bg-accent text-accent-foreground')}>{o}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
