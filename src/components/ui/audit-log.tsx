'use client';

import * as React from 'react';
import { RelativeTime } from './relative-time';
import { cn } from '@/lib/utils';

export interface AuditEntry {
  id: string;
  actor: string;
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | string;
  target: string;
  at: Date | string | number;
  ip?: string;
  /** Shown under the line as `Field: before → after`. */
  changes?: { field: string; from?: string; to?: string }[];
}

const dot = { created: 'bg-success', updated: 'bg-info', deleted: 'bg-destructive', exported: 'bg-warning' } as const;

const text = (c: NonNullable<AuditEntry['changes']>[number]) =>
  c.from !== undefined && c.to !== undefined ? `${c.field}: ${c.from || 'empty'} → ${c.to || 'empty'}` : `${c.field}: ${c.to ?? c.from}`;

/** Who did what and when, newest first. One line per entry; changes are written out underneath. */
export function AuditLog({ entries, className }: { entries: AuditEntry[]; className?: string }) {
  return (
    <ul className={cn('divide-y rounded-xl border bg-card', className)}>
      {entries.map((e) => (
        <li key={e.id} className="flex gap-3 px-4 py-3">
          <span aria-hidden className={cn('mt-1.5 size-2 shrink-0 rounded-full', dot[e.action as keyof typeof dot] ?? 'bg-muted-foreground')} />
          <div className="min-w-0 flex-1 text-[13px]">
            <p><span className="font-medium">{e.actor}</span> {e.action} <span className="font-medium">{e.target}</span></p>
            {e.changes?.map((c) => <p key={c.field} className="text-xs text-muted-foreground">{text(c)}</p>)}
          </div>
          <RelativeTime date={e.at} className="shrink-0 text-xs text-muted-foreground" />
        </li>
      ))}
    </ul>
  );
}
