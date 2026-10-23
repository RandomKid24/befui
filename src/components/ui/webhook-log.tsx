'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ChevronDownIcon, RefreshIcon } from './icons';

export interface WebhookDelivery {
  id: string;
  event: string;
  /** HTTP status your endpoint answered with. 0 means no answer (timeout). */
  status: number;
  /** When it was sent, already formatted. */
  time: string;
  /** How long your endpoint took, in milliseconds. */
  duration?: number;
  attempt?: number;
  url?: string;
  request?: string;
  response?: string;
}

const tone = (s: number) => (s >= 200 && s < 300 ? 'success' : s >= 300 && s < 500 ? 'warning' : 'danger');

/**
 * Recent webhook deliveries, newest first: event name, status code, time, how long it took. Click one for the request and response
 * bodies; failed ones get a Resend button that calls `onResend`. Filter to failures with the toggle at the top.
 */
export function WebhookLog({ deliveries, onResend, className }: { deliveries: WebhookDelivery[]; onResend?: (id: string) => void; className?: string }) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);
  const bad = deliveries.filter((d) => d.status < 200 || d.status >= 300);
  const shown = failed ? bad : deliveries;

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card text-sm', className)}>
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground tabular-nums">{deliveries.length}</span> deliveries{bad.length ? <> · <span className="text-destructive tabular-nums">{bad.length} failed</span></> : null}</p>
        <label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={failed} onChange={(e) => setFailed(e.target.checked)} className="size-3.5 accent-primary" />Failed only</label>
      </div>
      <ul>
        {shown.map((d) => {
          const isOpen = open === d.id;
          const ok = d.status >= 200 && d.status < 300;
          const panel = `${d.id}-panel`;
          return (
            <li key={d.id} className="border-b last:border-b-0">
              <div className="flex items-center gap-1 pe-2">
                <button type="button" aria-expanded={isOpen} aria-controls={panel} onClick={() => setOpen(isOpen ? null : d.id)} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-start outline-none hover:bg-muted/40 focus-visible:bg-muted/40">
                  <ChevronDownIcon className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform', !isOpen && '-rotate-90 rtl:rotate-90')} />
                  <Badge variant={tone(d.status)} className="w-14 justify-center tabular-nums">{d.status || 'Timeout'}</Badge>
                  <span className="min-w-0 flex-1 truncate font-mono text-[13px]">{d.event}</span>
                  {d.attempt && d.attempt > 1 && <span className="hidden text-xs text-muted-foreground sm:inline">attempt {d.attempt}</span>}
                  {d.duration !== undefined && <span className="hidden w-14 text-end text-xs tabular-nums text-muted-foreground sm:inline">{d.duration} ms</span>}
                  <span className="shrink-0 text-xs text-muted-foreground">{d.time}</span>
                </button>
                {!ok && onResend && <Button variant="outline" size="sm" aria-label="Resend" onClick={() => onResend(d.id)}><RefreshIcon /><span className="max-sm:hidden">Resend</span></Button>}
              </div>
              {isOpen && (
                <div id={panel} className="grid gap-3 border-t bg-muted/30 px-4 py-3 text-xs lg:grid-cols-2">
                  {d.url && <p className="font-mono text-muted-foreground lg:col-span-2">POST {d.url}</p>}
                  <Body title="Request">{d.request ?? 'No body'}</Body>
                  <Body title={`Response${d.status ? ` (${d.status})` : ''}`}>{d.response ?? 'No response'}</Body>
                </div>
              )}
            </li>
          );
        })}
        {!shown.length && <li className="px-4 py-8 text-center text-muted-foreground">{failed ? 'No failed deliveries.' : 'Nothing sent yet.'}</li>}
      </ul>
    </div>
  );
}

function Body({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-background p-2 font-mono text-[12px] leading-relaxed">{children}</pre>
    </div>
  );
}
