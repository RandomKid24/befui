'use client';

import * as React from 'react';
import { Avatar } from './avatar';
import { RelativeTime } from './relative-time';
import { auditStamp, type AuditEntry } from './audit-log';
import { cn } from '@/lib/utils';

/**
 * The "History" panel for one record (an employee, an invoice, a policy). Newest first, each change as `Field  before → after`
 * with who made it. Pick a field to see only how that one value changed over time.
 */
export function AuditRecordHistory({ entries, title = 'History', className }: { entries: AuditEntry[]; title?: string; className?: string }) {
  const [field, setField] = React.useState('');
  const fields = [...new Set(entries.flatMap((e) => e.changes?.map((c) => c.field) ?? []))];
  const rows = entries.filter((e) => !field || e.changes?.some((c) => c.field === field));
  return (
    <section className={cn('rounded-xl border bg-card', className)}>
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title} <span className="font-normal text-muted-foreground">· {rows.length}</span></h3>
        {fields.length > 0 && (
          <select aria-label="Show changes to" value={field} onChange={(e) => setField(e.target.value)} className="h-8 rounded-lg border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
            <option value="">All fields</option>
            {fields.map((f) => <option key={f}>{f}</option>)}
          </select>
        )}
      </header>
      <ul className="divide-y">
        {rows.map((e) => (
          <li key={e.id} className="flex gap-3 px-4 py-3">
            <Avatar name={e.actor} size="sm" />
            <div className="min-w-0 flex-1 text-[13px]">
              <p><span className="font-medium">{e.actor}</span> <span className="text-muted-foreground">{e.action}</span></p>
              {(e.changes ?? []).filter((c) => !field || c.field === field).map((c) => (
                <p key={c.field} className="mt-1 flex flex-wrap items-center gap-x-2 text-xs">
                  <span className="min-w-28 text-muted-foreground">{c.field}</span>
                  {c.from !== undefined && <span className="text-destructive line-through">{c.from || 'empty'}</span>}
                  {c.from !== undefined && c.to !== undefined && <span aria-hidden className="text-muted-foreground">→</span>}
                  {c.to !== undefined && <span className="font-medium text-success">{c.to || 'empty'}</span>}
                </p>
              ))}
            </div>
            <time dateTime={new Date(e.at).toISOString()} title={auditStamp(e.at)} className="shrink-0 text-xs text-muted-foreground"><RelativeTime date={e.at} /></time>
          </li>
        ))}
        {!rows.length && <li className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing changed.</li>}
      </ul>
    </section>
  );
}
