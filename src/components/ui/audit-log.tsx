'use client';

import * as React from 'react';
import { ActivityIcon, ChevronDownIcon, DownloadIcon, EditIcon, EyeIcon, PlusIcon, TrashIcon } from './icons';
import { cn } from '@/lib/utils';

export interface AuditEntry {
  id: string;
  actor: string;
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | string;
  target: string;
  at: Date | string | number;
  ip?: string;
  /** Field-level changes. The first two show on the row; the rest open with "more". */
  changes?: { field: string; from?: string; to?: string }[];
}

const look: Record<string, { icon: React.ReactNode; tile: string; dot: string }> = {
  created: { icon: <PlusIcon />, tile: 'bg-success/10 text-success', dot: 'bg-success' },
  updated: { icon: <EditIcon />, tile: 'bg-info/10 text-info', dot: 'bg-info' },
  deleted: { icon: <TrashIcon />, tile: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  exported: { icon: <DownloadIcon />, tile: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  viewed: { icon: <EyeIcon />, tile: 'bg-secondary text-muted-foreground', dot: 'bg-muted-foreground' },
};
const fallback = { icon: <ActivityIcon />, tile: 'bg-secondary text-muted-foreground', dot: 'bg-muted-foreground' };
const PREVIEW = 2;

const day = (d: Date) => {
  const n = new Date();
  const diff = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86400000);
  return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

function Change({ c }: { c: NonNullable<AuditEntry['changes']>[number] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className="w-32 shrink-0 text-muted-foreground">{c.field}</span>
      {c.from !== undefined && <s className="rounded bg-destructive/10 px-1.5 py-0.5 text-destructive">{c.from || 'empty'}</s>}
      {c.from !== undefined && c.to !== undefined && <span aria-hidden className="text-muted-foreground">→</span>}
      {c.to !== undefined && <span className="rounded bg-success/10 px-1.5 py-0.5 font-medium text-success">{c.to || 'empty'}</span>}
    </div>
  );
}

/**
 * Who did what, grouped by day, newest first. The sentence says what happened, the changes sit right under it
 * (no click needed), and the chips on top count and filter by action. Pass entries newest first.
 */
export function AuditLog({ entries, className }: { entries: AuditEntry[]; className?: string }) {
  const [only, setOnly] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<Set<string>>(new Set());
  const flip = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.action, (counts.get(e.action) ?? 0) + 1);

  const groups: { label: string; list: AuditEntry[] }[] = [];
  for (const e of entries) {
    if (only && e.action !== only) continue;
    const label = day(new Date(e.at));
    const last = groups[groups.length - 1];
    if (last?.label === label) last.list.push(e);
    else groups.push({ label, list: [e] });
  }

  return (
    <div className={cn('grid gap-4', className)}>
      <div role="group" aria-label="Filter by action" className="flex flex-wrap gap-1.5">
        {[[null, entries.length] as const, ...counts].map(([a, n]) => (
          <button key={a ?? 'all'} type="button" aria-pressed={only === a} onClick={() => setOnly(a)} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40', only === a ? 'border-foreground bg-foreground text-background' : 'bg-card text-muted-foreground hover:bg-secondary')}>
            {a && <span className={cn('size-1.5 rounded-full', (look[a] ?? fallback).dot)} />}
            {a ?? 'All'} <span className="tabular-nums opacity-70">{n}</span>
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <section key={g.label} aria-label={g.label}>
          <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{g.label}</h3>
          <ul className="divide-y overflow-hidden rounded-xl border bg-card">
            {g.list.map((e) => {
              const v = look[e.action] ?? fallback;
              const all = e.changes ?? [];
              const on = open.has(e.id);
              const shown = on ? all : all.slice(0, PREVIEW);
              const more = all.length - PREVIEW;
              return (
                <li key={e.id} className="flex gap-3 px-4 py-3">
                  <span className={cn('mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4', v.tile)}>{v.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 text-[13px] leading-snug">
                        <span className="font-medium">{e.actor}</span> <span className="text-muted-foreground">{e.action}</span> <span className="font-medium">{e.target}</span>
                      </p>
                      <time dateTime={new Date(e.at).toISOString()} className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {new Date(e.at).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })}
                      </time>
                    </div>
                    {shown.length > 0 && <div className="mt-2 grid gap-1.5 rounded-lg bg-muted/40 px-3 py-2">{shown.map((c) => <Change key={c.field} c={c} />)}</div>}
                    {(more > 0 || e.ip) && (
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                        {more > 0 && (
                          <button type="button" aria-expanded={on} onClick={() => flip(e.id)} className="inline-flex items-center gap-1 rounded text-foreground/80 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40">
                            {on ? 'Show less' : `${more} more ${more === 1 ? 'change' : 'changes'}`}
                            <ChevronDownIcon className={cn('size-3 transition-transform', on && 'rotate-180')} />
                          </button>
                        )}
                        {e.ip && <span className="ml-auto font-mono">{e.ip}</span>}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      {groups.length === 0 && <p className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">No matching activity.</p>}
    </div>
  );
}
