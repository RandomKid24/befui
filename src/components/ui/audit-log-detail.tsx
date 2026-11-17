'use client';

import * as React from 'react';
import { Badge } from './badge';
import { auditStamp, auditTone, type AuditEntry } from './audit-log';
import { cn } from '@/lib/utils';

/** List on the left, full detail on the right. Click an event to see who, when, where from, the result and every before and after value. */
export function AuditLogDetail({ entries, className }: { entries: AuditEntry[]; className?: string }) {
  const [id, setId] = React.useState(entries[0]?.id);
  const e = entries.find((x) => x.id === id) ?? entries[0];
  if (!e) return null;
  const facts: [string, React.ReactNode][] = [
    ['Who', e.actor], ['When', auditStamp(e.at)], ['From', e.ip ?? '—'],
    ['Result', <Badge key="r" variant={e.status === 'failed' ? 'danger' : 'success'} dot>{e.status === 'failed' ? 'Failed' : 'Success'}</Badge>],
  ];
  return (
    <div className={cn('grid overflow-hidden rounded-xl border bg-card md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]', className)}>
      <ul aria-label="Events" className="max-h-96 divide-y overflow-y-auto border-b md:border-b-0 md:border-r">
        {entries.map((x) => (
          <li key={x.id}>
            <button type="button" aria-current={x.id === e.id} onClick={() => setId(x.id)} className={cn('flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] outline-none hover:bg-muted/60 focus-visible:bg-muted/60', x.id === e.id && 'bg-muted shadow-[inset_3px_0_0_var(--primary)]')}>
              <span aria-hidden className={cn('size-2 shrink-0 rounded-full', x.status === 'failed' ? 'bg-destructive' : 'bg-muted-foreground/50')} />
              <span className="min-w-0 flex-1 truncate"><span className="font-medium">{x.actor}</span> {x.action} {x.target}</span>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{auditStamp(x.at).split(', ')[1]}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="p-5">
        <Badge variant={auditTone[e.action as keyof typeof auditTone] ?? 'default'} className="capitalize">{e.action}</Badge>
        <h3 className="mt-2 text-base font-semibold">{e.target}</h3>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
          {facts.map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>)}
        </dl>
        <h4 className="mb-2 mt-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Changes</h4>
        {e.changes?.length ? (
          <table className="w-full text-xs">
            <thead className="text-left text-muted-foreground"><tr><th className="pb-1 font-normal">Field</th><th className="pb-1 font-normal">Before</th><th className="pb-1 font-normal">After</th></tr></thead>
            <tbody>
              {e.changes.map((c) => (
                <tr key={c.field} className="border-t">
                  <td className="py-1.5 pr-3 text-muted-foreground">{c.field}</td>
                  <td className="py-1.5 pr-3 text-destructive">{c.from === undefined ? '—' : c.from || 'empty'}</td>
                  <td className="py-1.5 font-medium text-success">{c.to === undefined ? '—' : c.to || 'empty'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-xs text-muted-foreground">No field changes recorded.</p>}
      </div>
    </div>
  );
}
