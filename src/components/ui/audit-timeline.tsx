'use client';

import * as React from 'react';
import { auditDay, auditTime, type AuditEntry } from './audit-log';
import { cn } from '@/lib/utils';

const dot = { created: 'bg-success', updated: 'bg-info', deleted: 'bg-destructive', exported: 'bg-warning' } as const;

/** A vertical timeline under Today / Yesterday / date headings. Each event is a sentence with its before and after values in a small box. */
export function AuditTimeline({ entries, className }: { entries: AuditEntry[]; className?: string }) {
  const days: { label: string; list: AuditEntry[] }[] = [];
  for (const e of entries) {
    const label = auditDay(e.at);
    if (days[days.length - 1]?.label === label) days[days.length - 1].list.push(e);
    else days.push({ label, list: [e] });
  }
  return (
    <div className={cn('grid gap-6', className)}>
      {days.map((g) => (
        <section key={g.label} aria-label={g.label}>
          <h3 className="mb-3 text-sm font-semibold">{g.label} <span className="font-normal text-muted-foreground">· {g.list.length}</span></h3>
          <ol className="ml-2 border-l">
            {g.list.map((e) => (
              <li key={e.id} className="relative pb-5 pl-6 last:pb-0">
                <span aria-hidden className={cn('absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4 ring-background', e.status === 'failed' ? 'bg-destructive' : dot[e.action as keyof typeof dot] ?? 'bg-muted-foreground')} />
                <p className="text-[13px]">
                  <span className="font-medium">{e.actor}</span> {e.action} <span className="font-medium">{e.target}</span>
                  {e.status === 'failed' && <span className="ml-2 rounded bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive">Failed</span>}
                </p>
                <p className="text-xs text-muted-foreground">{auditTime(e.at)}{e.ip && ` · ${e.ip}`}</p>
                {e.changes && e.changes.length > 0 && (
                  <dl className="mt-2 grid max-w-md gap-1 rounded-lg border bg-card px-3 py-2 text-xs">
                    {e.changes.map((c) => (
                      <div key={c.field} className="flex items-center justify-between gap-4">
                        <dt className="text-muted-foreground">{c.field}</dt>
                        <dd>{c.from !== undefined && <s className="mr-1.5 text-muted-foreground">{c.from || 'empty'}</s>}{c.to !== undefined && <span className="font-medium">{c.to || 'empty'}</span>}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
