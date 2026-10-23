'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, CheckCircleIcon, TriangleAlertIcon } from './icons';
import { UptimeBar, type UptimeDay } from './uptime-bar';

export interface StatusService {
  name: string;
  days: UptimeDay[];
  description?: string;
}
export interface StatusIncident {
  id: string;
  title: string;
  /** `investigating`, `identified`, `monitoring` or `resolved`. */
  state: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  /** Latest update first. */
  updates: { time: string; text: string }[];
}

const label = { investigating: 'Investigating', identified: 'Identified', monitoring: 'Monitoring', resolved: 'Resolved' };

/**
 * A public status page: one banner that says whether everything works (worked out from each service's latest day),
 * an uptime bar per service, and the incident history with its updates.
 */
export function StatusPage({ title = 'System status', services, incidents = [], className }: { title?: string; services: StatusService[]; incidents?: StatusIncident[]; className?: string }) {
  const latest = services.map((s) => s.days[s.days.length - 1]?.status ?? 'up');
  const down = latest.filter((s) => s === 'down').length;
  const slow = latest.filter((s) => s === 'degraded').length;
  const state = down ? 'down' : slow ? 'degraded' : 'up';
  const banner = {
    up: { Icon: CheckCircleIcon, text: 'All systems operational', cls: 'border-success/30 bg-success/10 text-success' },
    degraded: { Icon: TriangleAlertIcon, text: `${slow} ${slow === 1 ? 'service has' : 'services have'} degraded performance`, cls: 'border-warning/30 bg-warning/10 text-warning' },
    down: { Icon: AlertCircleIcon, text: `${down} ${down === 1 ? 'service is' : 'services are'} down`, cls: 'border-destructive/30 bg-destructive/10 text-destructive' },
  }[state];

  return (
    <div className={cn('grid gap-6', className)}>
      <header className="grid gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p role="status" className={cn('flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium', banner.cls)}><banner.Icon className="size-5" />{banner.text}</p>
      </header>
      <section aria-label="Services" className="grid gap-5 rounded-xl border bg-card p-4">
        {services.map((s) => (
          <div key={s.name}>
            <UptimeBar name={s.name} days={s.days} />
            {s.description && <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>}
          </div>
        ))}
      </section>
      {incidents.length > 0 && (
        <section aria-label="Incidents" className="grid gap-3">
          <h3 className="text-sm font-semibold">Past incidents</h3>
          {incidents.map((i) => (
            <article key={i.id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-medium">{i.title}</h4>
                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', i.state === 'resolved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>{label[i.state]}</span>
              </div>
              <ol className="mt-3 grid gap-2.5 border-s ps-4">
                {i.updates.map((u, k) => (
                  <li key={k} className="relative text-[13px]">
                    <span className="absolute -start-[21px] top-1.5 size-2 rounded-full bg-border" aria-hidden />
                    <span className="text-xs text-muted-foreground">{u.time}</span>
                    <p className="mt-0.5 leading-relaxed">{u.text}</p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
