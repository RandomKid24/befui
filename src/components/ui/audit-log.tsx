'use client';

import * as React from 'react';
import { Badge } from './badge';
import { SearchInput } from './search-input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { cn } from '@/lib/utils';

export interface AuditEntry {
  id: string;
  actor: string;
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | string;
  target: string;
  at: Date | string | number;
  ip?: string;
  /** Defaults to `success`. A `failed` row is outlined in red so it stands out. */
  status?: 'success' | 'failed';
  /** Shown under the target as `field  before → after`. */
  changes?: { field: string; from?: string; to?: string }[];
}

const tone = { created: 'success', updated: 'info', deleted: 'danger', exported: 'warning' } as const;
const stamp = (d: Date | string | number) => {
  const t = new Date(d);
  return `${t.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${t.toLocaleTimeString('en-GB', { hour12: false })}`;
};

/**
 * Every event on one row: when, who, what they did, to what (with before → after values), whether it worked, and from where.
 * Newest first. Search and the action filter sit on top; failed events get a red edge.
 */
export function AuditLog({ entries, className }: { entries: AuditEntry[]; className?: string }) {
  const [q, setQ] = React.useState('');
  const [action, setAction] = React.useState('');
  const actions = [...new Set(entries.map((e) => e.action))];
  const needle = q.trim().toLowerCase();
  const rows = entries.filter((e) => (!action || e.action === action) && (!needle || `${e.actor} ${e.action} ${e.target} ${e.ip ?? ''} ${e.changes?.map((c) => `${c.field} ${c.from} ${c.to}`).join(' ') ?? ''}`.toLowerCase().includes(needle)));
  const failed = rows.filter((e) => e.status === 'failed').length;

  return (
    <div className={cn('rounded-xl border bg-card', className)}>
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <SearchInput value={q} onValueChange={setQ} placeholder="Search who, what, IP" className="min-w-48 flex-1" />
        <select aria-label="Filter by action" value={action} onChange={(e) => setAction(e.target.value)} className="h-9 rounded-lg border bg-background px-3 text-[13px] capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
          <option value="">All actions</option>
          {actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <p className="ml-auto text-xs text-muted-foreground" aria-live="polite">
          {rows.length} {rows.length === 1 ? 'event' : 'events'}{failed > 0 && <> · <span className="font-medium text-destructive">{failed} failed</span></>}
        </p>
      </div>
      <Table className="[&_td]:px-3 [&_th]:px-3">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Time</TableHead>
            <TableHead>Who</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>What</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((e) => (
            <TableRow key={e.id} className={cn(e.status === 'failed' && 'bg-destructive/5 shadow-[inset_3px_0_0_var(--destructive)]')}>
              <TableCell className="whitespace-nowrap align-top font-mono text-xs tabular-nums text-muted-foreground">{stamp(e.at)}</TableCell>
              <TableCell className="whitespace-nowrap align-top font-medium">{e.actor}</TableCell>
              <TableCell className="align-top"><Badge variant={tone[e.action as keyof typeof tone] ?? 'default'} className="capitalize">{e.action}</Badge></TableCell>
              <TableCell className="whitespace-nowrap align-top">
                <span className="font-medium">{e.target}</span>
                {e.changes?.map((c) => (
                  <span key={c.field} className="mt-1 flex items-center gap-2 text-xs">
                    <span className="min-w-28 shrink-0 text-muted-foreground">{c.field}</span>
                    {c.from !== undefined && <span className="text-destructive line-through">{c.from || 'empty'}</span>}
                    {c.from !== undefined && c.to !== undefined && <span aria-hidden className="text-muted-foreground">→</span>}
                    {c.to !== undefined && <span className="font-medium text-success">{c.to || 'empty'}</span>}
                  </span>
                ))}
              </TableCell>
              <TableCell className="whitespace-nowrap align-top"><Badge variant={e.status === 'failed' ? 'danger' : 'default'} dot>{e.status === 'failed' ? 'Failed' : 'Success'}</Badge></TableCell>
              <TableCell className="whitespace-nowrap align-top font-mono text-xs text-muted-foreground">{e.ip ?? '—'}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableRow className="hover:bg-transparent"><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No events match.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
