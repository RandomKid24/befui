'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Switch } from './switch';

export interface FeatureFlag {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  /** Percent of users who get it while it is on. */
  rollout: number;
  /** Where it runs, such as `Production`. */
  environments?: string[];
  owner?: string;
}

/**
 * The flags page of a product: each row has a switch, the flag key, where it is on, and a rollout slider (0 to 100 percent of users)
 * that is dimmed while the flag is off. Controlled: pass `flags` and `onChange` gets the whole updated list.
 */
export function FeatureFlagTable({ flags, onChange, className }: { flags: FeatureFlag[]; onChange: (flags: FeatureFlag[]) => void; className?: string }) {
  const patch = (key: string, p: Partial<FeatureFlag>) => onChange(flags.map((f) => (f.key === key ? { ...f, ...p } : f)));
  const [q, setQ] = React.useState('');
  const shown = flags.filter((f) => `${f.name} ${f.key}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card text-sm', className)}>
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search flags" aria-label="Search flags" className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        <span className="text-xs text-muted-foreground tabular-nums">{flags.filter((f) => f.enabled).length} of {flags.length} on</span>
      </div>
      <ul className="divide-y">
        {shown.map((f) => {
          const id = `${f.key}-r`;
          return (
            <li key={f.key} className="grid items-center gap-x-4 gap-y-2 px-3 py-3 sm:grid-cols-[auto_1fr_12rem]">
              <Switch checked={f.enabled} onCheckedChange={(enabled) => patch(f.key, { enabled })} aria-label={`${f.name} enabled`} />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2"><span className="font-medium">{f.name}</span>{f.environments?.map((e) => <Badge key={e} variant={e === 'Production' ? 'primary' : 'outline'}>{e}</Badge>)}</p>
                <p className="truncate text-xs text-muted-foreground"><code className="font-mono">{f.key}</code>{f.description && ` · ${f.description}`}{f.owner && ` · ${f.owner}`}</p>
              </div>
              <div className={cn('flex items-center gap-2 transition-opacity', !f.enabled && 'opacity-40')}>
                <label htmlFor={id} className="sr-only">{f.name} rollout percent</label>
                <input id={id} type="range" min={0} max={100} step={5} value={f.rollout} disabled={!f.enabled} onChange={(e) => patch(f.key, { rollout: Number(e.target.value) })} className="h-1 flex-1 accent-primary" />
                <span className="w-10 text-end text-xs tabular-nums text-muted-foreground">{f.rollout}%</span>
              </div>
            </li>
          );
        })}
        {!shown.length && <li className="px-4 py-8 text-center text-muted-foreground">No flags match.</li>}
      </ul>
    </div>
  );
}
