'use client';

import * as React from 'react';
import { RelativeTime } from './relative-time';
import { auditStamp, type AuditEntry } from './audit-log';
import { cn } from '@/lib/utils';

type Key = 'all' | 'failed' | 'deleted' | 'exported';
const tiles: { key: Key; label: string; hit: (e: AuditEntry) => boolean; warn?: boolean }[] = [
  { key: 'all', label: 'Events', hit: () => true },
  { key: 'failed', label: 'Failed', hit: (e) => e.status === 'failed', warn: true },
  { key: 'deleted', label: 'Deleted', hit: (e) => e.action === 'deleted', warn: true },
  { key: 'exported', label: 'Exported', hit: (e) => e.action === 'exported' },
];

/**
 * For admins who want the answer first: four counts (events, failed, deleted, exported) on top, and the list below shows
 * the one you click. The risky events are marked, so a bad day is visible before you read a single row.
 */
export function AuditOverview({ entries, className }: { entries: AuditEntry[]; className?: string }) {
  const [key, setKey] = React.useState<Key>('all');
  const pick = tiles.find((t) => t.key === key)!;
  const rows = entries.filter(pick.hit);
  const risky = (e: AuditEntry) => e.status === 'failed' || e.action === 'deleted';
  return (
    <div className={cn('grid gap-3', className)}>
      <div role="group" aria-label="Show" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tiles.map((t) => {
          const n = entries.filter(t.hit).length;
          return (
            <button key={t.key} type="button" aria-pressed={key === t.key} onClick={() => setKey(t.key)} className={cn('rounded-xl border bg-card px-4 py-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/40', key === t.key && 'border-foreground')}>
              <span className={cn('block text-2xl font-semibold tabular-nums leading-none', t.warn && n > 0 && 'text-destructive')}>{n}</span>
              <span className="mt-1.5 block text-xs text-muted-foreground">{t.label}</span>
            </button>
          );
        })}
      </div>
      <ul className="divide-y rounded-xl border bg-card">
        {rows.map((e) => (
          <li key={e.id} className={cn('flex items-center gap-3 px-4 py-2.5 text-[13px]', risky(e) && 'bg-destructive/5 shadow-[inset_3px_0_0_var(--destructive)]')}>
            <p className="min-w-0 flex-1 truncate">
              <span className="font-medium">{e.actor}</span> <span className={risky(e) ? 'font-medium text-destructive' : 'text-muted-foreground'}>{e.status === 'failed' ? `failed to ${e.action}` : e.action}</span> {e.target}
            </p>
            <time dateTime={new Date(e.at).toISOString()} title={auditStamp(e.at)} className="shrink-0 text-xs text-muted-foreground"><RelativeTime date={e.at} /></time>
          </li>
        ))}
        {!rows.length && <li className="px-4 py-8 text-center text-sm text-muted-foreground">None. {pick.label === 'Failed' ? 'Nothing failed.' : ''}</li>}
      </ul>
    </div>
  );
}
