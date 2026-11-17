'use client';

import * as React from 'react';
import { Avatar } from './avatar';
import { auditStamp, type AuditEntry } from './audit-log';
import { cn } from '@/lib/utils';

const dot = { created: 'bg-success', updated: 'bg-info', deleted: 'bg-destructive', exported: 'bg-warning' } as const;

/** One card per person: how many things they did, split by action, and their latest few. Good for "who has been touching this?". */
export function AuditByPerson({ entries, recent = 3, className }: { entries: AuditEntry[]; /** Latest events shown per person. */ recent?: number; className?: string }) {
  const people = new Map<string, AuditEntry[]>();
  for (const e of entries) people.set(e.actor, [...(people.get(e.actor) ?? []), e]); // entries are newest first, so each list is too
  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {[...people].map(([name, list]) => {
        const by = new Map<string, number>();
        for (const e of list) by.set(e.action, (by.get(e.action) ?? 0) + 1);
        const failed = list.filter((e) => e.status === 'failed').length;
        return (
          <section key={name} aria-label={name} className="rounded-xl border bg-card p-4">
            <header className="flex items-center gap-3">
              <Avatar name={name} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{name}</h3>
                <p className="text-xs text-muted-foreground">Last active {auditStamp(list[0].at)}</p>
              </div>
              <span className="text-right"><span className="block text-xl font-semibold tabular-nums leading-none">{list.length}</span><span className="text-[11px] text-muted-foreground">{list.length === 1 ? 'event' : 'events'}</span></span>
            </header>
            <p className="mt-3 flex flex-wrap gap-1.5 text-xs">
              {[...by].map(([a, n]) => <span key={a} className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 capitalize"><span className={cn('size-1.5 rounded-full', dot[a as keyof typeof dot] ?? 'bg-muted-foreground')} />{a} {n}</span>)}
              {failed > 0 && <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-destructive">{failed} failed</span>}
            </p>
            <ul className="mt-3 divide-y border-t text-[13px]">
              {list.slice(0, recent).map((e) => (
                <li key={e.id} className="flex items-baseline justify-between gap-3 py-1.5">
                  <span className="min-w-0 truncate"><span className={cn('capitalize', e.status === 'failed' ? 'text-destructive' : 'text-muted-foreground')}>{e.action}</span> {e.target}</span>
                  <span className={'shrink-0 text-[11px] text-muted-foreground'}>{auditStamp(e.at).split(', ')[1]}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
