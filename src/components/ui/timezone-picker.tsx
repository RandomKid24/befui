'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CheckIcon, ChevronDownIcon, GlobeIcon, SearchIcon } from './icons';

const fallback = ['UTC', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo', 'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Australia/Sydney'];
const zones = (): string[] => {
  try { return (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf('timeZone'); } catch { return fallback; }
};
/** "GMT+5:30" for a zone right now. */
const offset = (tz: string, at: Date) => new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(at).find((p) => p.type === 'timeZoneName')?.value ?? '';
const clock = (tz: string, at: Date) => new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(at);

/**
 * Search every time zone by city or region and see its offset and the time there right now. Controlled with `value` (an IANA name
 * such as `Asia/Kolkata`); `onChange` fires on pick. Starts on your own zone when no value is set.
 */
export function TimezonePicker({ value, onChange, className }: { value?: string; onChange?: (tz: string) => void; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [now, setNow] = React.useState(() => new Date());
  const all = React.useMemo(zones, []);
  const mine = React.useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const cur = value ?? mine;
  React.useEffect(() => { if (open) setNow(new Date()); }, [open]);
  const hits = all.filter((z) => z.toLowerCase().replace(/_/g, ' ').includes(q.toLowerCase().trim())).slice(0, 60);
  const name = (z: string) => z.replace(/_/g, ' ').replace('/', ' / ');

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(''); }}>
      <PopoverTrigger asChild>
        <button type="button" aria-haspopup="listbox" className={cn('flex h-9 w-72 max-w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm outline-none transition-[border,box-shadow] hover:border-muted-foreground/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15', className)}>
          <GlobeIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-start">{name(cur)}</span>
          <span className="text-xs text-muted-foreground">{offset(cur, now)}</span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 max-w-[calc(100vw-2rem)] p-0">
        <div className="relative border-b">
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search city or region" aria-label="Search time zones" className="h-10 w-full bg-transparent ps-9 pe-3 text-sm outline-none placeholder:text-muted-foreground/70" />
        </div>
        <ul role="listbox" aria-label="Time zones" className="max-h-64 overflow-y-auto p-1">
          {hits.map((z) => (
            <li key={z} role="option" aria-selected={z === cur} tabIndex={0} onClick={() => { onChange?.(z); setOpen(false); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange?.(z); setOpen(false); } }} className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none hover:bg-secondary focus-visible:bg-secondary">
              <span className="flex-1 truncate">{name(z)}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{clock(z, now)} · {offset(z, now)}</span>
              {z === cur && <CheckIcon className="size-3.5 text-primary" />}
            </li>
          ))}
          {!hits.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No zone matches.</li>}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
