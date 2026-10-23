'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { SearchIcon } from './icons';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogLine { time: string; level: LogLevel; message: string; source?: string }

const tone: Record<LogLevel, string> = { debug: 'text-muted-foreground', info: 'text-info', warn: 'text-warning', error: 'text-destructive' };
const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

/**
 * A terminal-style log pane: time, coloured level, source and message per line. Filter by level, search the text (matches are
 * marked), and Follow keeps the newest line in view as lines are added, turning itself off if you scroll up to read.
 */
export function LogViewer({ lines, height = 288, className }: { lines: LogLine[]; height?: number; className?: string }) {
  const [on, setOn] = React.useState<Set<LogLevel>>(new Set(levels));
  const [q, setQ] = React.useState('');
  const [follow, setFollow] = React.useState(true);
  const box = React.useRef<HTMLDivElement>(null);
  const shown = lines.filter((l) => on.has(l.level) && (!q || `${l.message} ${l.source ?? ''}`.toLowerCase().includes(q.toLowerCase())));
  const count = (lv: LogLevel) => lines.filter((l) => l.level === lv).length;

  React.useEffect(() => { if (follow && box.current) box.current.scrollTop = box.current.scrollHeight; }, [shown.length, follow]);
  const mark = (t: string) => {
    if (!q) return t;
    const i = t.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? t : <>{t.slice(0, i)}<mark className="rounded-sm bg-warning/30 text-inherit">{t.slice(i, i + q.length)}</mark>{t.slice(i + q.length)}</>;
  };

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card', className)}>
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <div role="group" aria-label="Levels" className="flex gap-1">
          {levels.map((lv) => (
            <button key={lv} type="button" aria-pressed={on.has(lv)} onClick={() => setOn((s) => { const n = new Set(s); n.has(lv) ? n.delete(lv) : n.add(lv); return n; })} className={cn('h-7 rounded-full border px-2.5 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50', on.has(lv) ? 'bg-secondary font-medium' : 'text-muted-foreground opacity-60')}>
              <span className={tone[lv]}>{lv}</span> <span className="tabular-nums text-muted-foreground">{count(lv)}</span>
            </button>
          ))}
        </div>
        <div className="relative ms-auto min-w-32 flex-1 sm:max-w-56">
          <SearchIcon className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search logs" aria-label="Search logs" className="h-8 w-full rounded-md border border-input bg-background ps-8 pe-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15" />
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs"><input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} className="size-3.5 accent-primary" />Follow</label>
      </div>
      <div
        ref={box}
        role="log"
        aria-label="Logs"
        tabIndex={0}
        onScroll={(e) => { const el = e.currentTarget; const atEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 24; if (!atEnd && follow) setFollow(false); }}
        className="overflow-auto bg-muted/30 p-2 font-mono text-[12px] leading-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
        style={{ height }}
      >
        {shown.map((l, i) => (
          <div key={i} className={cn('flex gap-3 whitespace-pre-wrap break-words rounded px-1 hover:bg-secondary/60', l.level === 'error' && 'bg-destructive/5')}>
            <span className="shrink-0 text-muted-foreground tabular-nums">{l.time}</span>
            <span className={cn('w-10 shrink-0 font-semibold uppercase', tone[l.level])}>{l.level}</span>
            {l.source && <span className="hidden shrink-0 text-muted-foreground sm:inline">[{l.source}]</span>}
            <span className="min-w-0">{mark(l.message)}</span>
          </div>
        ))}
        {!shown.length && <p className="py-10 text-center font-sans text-sm text-muted-foreground">No log lines match.</p>}
      </div>
    </div>
  );
}
