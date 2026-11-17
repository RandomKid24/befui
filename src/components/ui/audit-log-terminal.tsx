'use client';

import * as React from 'react';
import { auditDay, auditTime, type AuditEntry } from './audit-log';
import { cn } from '@/lib/utils';

const color = { created: 'text-success', updated: 'text-info', deleted: 'text-destructive', exported: 'text-warning' } as const;

/** Plain log lines, one per event, like `tail -f`: time, who, action, target and changes. A date line starts each day; failed lines are red. */
export function AuditLogTerminal({ entries, className }: { entries: AuditEntry[]; className?: string }) {
  let day = '';
  return (
    <div role="log" aria-label="Audit log" className={cn('overflow-x-auto rounded-xl border bg-card p-3 font-mono text-xs leading-6', className)}>
      {entries.map((e) => {
        const d = auditDay(e.at);
        const head = d !== day && (day = d);
        const bad = e.status === 'failed';
        return (
          <React.Fragment key={e.id}>
            {head && <div className="mt-2 text-muted-foreground first:mt-0">── {d} ──</div>}
            <div className={cn('flex gap-3 whitespace-nowrap rounded px-1 hover:bg-muted/60', bad && 'bg-destructive/10 text-destructive')}>
              <span className="text-muted-foreground">{auditTime(e.at)}</span>
              <span aria-label={bad ? 'failed' : 'ok'} className={bad ? '' : 'text-success'}>{bad ? '✗' : '✓'}</span>
              <span className="w-32 shrink-0 truncate font-semibold">{e.actor}</span>
              <span className={cn('w-16 shrink-0', !bad && (color[e.action as keyof typeof color] ?? 'text-muted-foreground'))}>{e.action}</span>
              <span>{e.target}</span>
              {e.changes?.map((c) => <span key={c.field} className="text-muted-foreground">{c.field}={c.from !== undefined ? `${c.from || '∅'}→` : ''}{c.to ?? ''}</span>)}
              {e.ip && <span className="ml-auto pl-4 text-muted-foreground">{e.ip}</span>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
