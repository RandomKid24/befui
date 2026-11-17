'use client';

import * as React from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { ChevronDownIcon, DownloadIcon } from './icons';
import { SearchInput } from './search-input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { auditStamp, auditTone, type AuditEntry } from './audit-log';
import { cn } from '@/lib/utils';

const RANGES = { all: ['Any time', Infinity], '24h': ['Last 24 hours', 864e5], '7d': ['Last 7 days', 6048e5], '30d': ['Last 30 days', 2592e6] } as const;
const sel = 'h-9 rounded-lg border bg-background px-2.5 text-[13px] capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring/40';

const csv = (rows: AuditEntry[]) => [['time', 'who', 'action', 'target', 'result', 'ip', 'changes'], ...rows.map((e) => [new Date(e.at).toISOString(), e.actor, e.action, e.target, e.status ?? 'success', e.ip ?? '', (e.changes ?? []).map((c) => `${c.field}: ${c.from ?? ''} -> ${c.to ?? ''}`).join('; ')])]
  .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

/**
 * The audit log for daily use: search, filter by who, action, result and time, click a row for the before and after values,
 * page through long logs and export what you see as CSV. Pass entries newest first.
 */
export function AuditLogPro({ entries, pageSize = 10, className }: { entries: AuditEntry[]; pageSize?: number; className?: string }) {
  const [f, setF] = React.useState({ q: '', who: '', action: '', failed: false, range: 'all' as keyof typeof RANGES });
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState<string | null>(null);
  const set = (p: Partial<typeof f>) => { setF((s) => ({ ...s, ...p })); setPage(0); };
  const dirty = f.q || f.who || f.action || f.failed || f.range !== 'all';

  const needle = f.q.trim().toLowerCase();
  const cutoff = Date.now() - RANGES[f.range][1];
  const rows = entries.filter((e) => (!f.who || e.actor === f.who) && (!f.action || e.action === f.action) && (!f.failed || e.status === 'failed') && new Date(e.at).getTime() >= cutoff
    && (!needle || `${e.actor} ${e.action} ${e.target} ${e.ip ?? ''} ${e.changes?.map((c) => `${c.field} ${c.from} ${c.to}`).join(' ') ?? ''}`.toLowerCase().includes(needle)));
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const p = Math.min(page, pages - 1);
  const view = rows.slice(p * pageSize, (p + 1) * pageSize);
  const uniq = (k: 'actor' | 'action') => [...new Set(entries.map((e) => e[k]))];

  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv(rows)], { type: 'text/csv' }));
    a.download = 'audit-log.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className={cn('rounded-xl border bg-card', className)}>
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <SearchInput value={f.q} onValueChange={(q) => set({ q })} placeholder="Search anything" className="min-w-44 flex-1" />
        <select aria-label="Who" className={sel} value={f.who} onChange={(e) => set({ who: e.target.value })}><option value="">Everyone</option>{uniq('actor').map((a) => <option key={a}>{a}</option>)}</select>
        <select aria-label="Action" className={sel} value={f.action} onChange={(e) => set({ action: e.target.value })}><option value="">All actions</option>{uniq('action').map((a) => <option key={a}>{a}</option>)}</select>
        <select aria-label="Time" className={sel} value={f.range} onChange={(e) => set({ range: e.target.value as keyof typeof RANGES })}>{Object.entries(RANGES).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}</select>
        <label className="flex h-9 items-center gap-2 rounded-lg border bg-background px-2.5 text-[13px]"><input type="checkbox" checked={f.failed} onChange={(e) => set({ failed: e.target.checked })} /> Failed only</label>
        {dirty && <Button variant="ghost" size="sm" onClick={() => set({ q: '', who: '', action: '', failed: false, range: 'all' })}>Clear</Button>}
        <Button variant="outline" size="sm" className="ml-auto" onClick={download} disabled={!rows.length}><DownloadIcon /> Export CSV</Button>
      </div>

      <Table className="[&_td]:px-3 [&_th]:px-3">
        <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-8"><span className="sr-only">Details</span></TableHead><TableHead>Time</TableHead><TableHead>Who</TableHead><TableHead>Action</TableHead><TableHead>What</TableHead><TableHead>Result</TableHead></TableRow></TableHeader>
        <TableBody>
          {view.map((e) => {
            const on = open === e.id;
            const can = !!e.changes?.length || !!e.ip;
            return (
              <React.Fragment key={e.id}>
                <TableRow onClick={() => can && setOpen(on ? null : e.id)} className={cn(can && 'cursor-pointer', e.status === 'failed' && 'bg-destructive/5')}>
                  <TableCell className="pr-0">{can && <button type="button" aria-expanded={on} aria-label={on ? 'Hide details' : 'Show details'} onClick={(ev) => { ev.stopPropagation(); setOpen(on ? null : e.id); }} className="grid size-6 place-items-center rounded text-muted-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/40"><ChevronDownIcon className={cn('size-4 transition-transform', !on && '-rotate-90')} /></button>}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground">{auditStamp(e.at)}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{e.actor}</TableCell>
                  <TableCell><Badge variant={auditTone[e.action as keyof typeof auditTone] ?? 'default'} className="capitalize">{e.action}</Badge></TableCell>
                  <TableCell>{e.target}{!!e.changes?.length && <span className="ml-2 text-xs text-muted-foreground">{e.changes.length} {e.changes.length === 1 ? 'change' : 'changes'}</span>}</TableCell>
                  <TableCell><Badge variant={e.status === 'failed' ? 'danger' : 'default'} dot>{e.status === 'failed' ? 'Failed' : 'Success'}</Badge></TableCell>
                </TableRow>
                {on && (
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableCell />
                    <TableCell colSpan={5} className="py-3">
                      {e.changes?.length ? (
                        <table className="w-full max-w-lg text-xs">
                          <thead className="text-left text-muted-foreground"><tr><th className="pb-1 font-normal">Field</th><th className="pb-1 font-normal">Before</th><th className="pb-1 font-normal">After</th></tr></thead>
                          <tbody>{e.changes.map((c) => <tr key={c.field} className="border-t"><td className="py-1 pr-4 text-muted-foreground">{c.field}</td><td className="py-1 pr-4 text-destructive">{c.from === undefined ? '—' : c.from || 'empty'}</td><td className="py-1 font-medium text-success">{c.to === undefined ? '—' : c.to || 'empty'}</td></tr>)}</tbody>
                        </table>
                      ) : <p className="text-xs text-muted-foreground">No field changes recorded.</p>}
                      {e.ip && <p className="mt-2 text-xs text-muted-foreground">From <span className="font-mono">{e.ip}</span></p>}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
          {!view.length && <TableRow className="hover:bg-transparent"><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No events match these filters.</TableCell></TableRow>}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
        <span aria-live="polite">{rows.length ? `${p * pageSize + 1}–${p * pageSize + view.length} of ${rows.length}` : '0 events'}{rows.some((e) => e.status === 'failed') && <> · <span className="font-medium text-destructive">{rows.filter((e) => e.status === 'failed').length} failed</span></>}</span>
        <span className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={p === 0} onClick={() => setPage(p - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</Button>
        </span>
      </div>
    </div>
  );
}
