'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronRightIcon, CopyIcon } from './icons';

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

const kind = (v: Json) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
const tone: Record<string, string> = { string: 'text-success', number: 'text-info', boolean: 'text-warning', null: 'text-muted-foreground' };
const path = (base: string, k: string | number) => (typeof k === 'number' ? `${base}[${k}]` : /^[A-Za-z_$][\w$]*$/.test(k) ? (base ? `${base}.${k}` : k) : `${base}["${k}"]`);

/**
 * A collapsible JSON viewer for API responses and payloads: keys, colour-coded values, counts on collapsed branches, and a copy
 * button on hover that copies the path (`user.orders[0].id`) or, on a branch, its JSON. `defaultDepth` sets how many levels start open.
 */
export function JsonTree({ data, defaultDepth = 2, className }: { data: unknown; defaultDepth?: number; className?: string }) {
  const [all, setAll] = React.useState<{ open: boolean; n: number } | null>(null);
  return (
    <div className={cn('rounded-xl border bg-card font-mono text-[13px]', className)}>
      <div className="flex justify-end gap-1 border-b px-2 py-1 font-sans text-xs">
        <button type="button" onClick={() => setAll({ open: true, n: (all?.n ?? 0) + 1 })} className="rounded px-2 py-1 text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">Expand all</button>
        <button type="button" onClick={() => setAll({ open: false, n: (all?.n ?? 0) + 1 })} className="rounded px-2 py-1 text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">Collapse all</button>
      </div>
      <div role="tree" aria-label="JSON" className="overflow-x-auto p-2">
        <Node name={null} value={data as Json} path="" depth={0} defaultDepth={defaultDepth} force={all} />
      </div>
    </div>
  );
}

function Node({ name, value, path: p, depth, defaultDepth, force }: { name: string | number | null; value: Json; path: string; depth: number; defaultDepth: number; force: { open: boolean; n: number } | null }) {
  const k = kind(value);
  const branch = k === 'object' || k === 'array';
  const [open, setOpen] = React.useState(depth < defaultDepth);
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => { if (force) setOpen(force.open); }, [force]);
  const entries = branch ? (Array.isArray(value) ? value.map((v, i) => [i, v] as const) : Object.entries(value as object).map(([a, b]) => [a, b as Json] as const)) : [];
  const copy = async () => {
    try { await navigator.clipboard.writeText(branch ? JSON.stringify(value, null, 2) : p || '$'); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const [o, c] = k === 'array' ? ['[', ']'] : ['{', '}'];
  return (
    <div role="treeitem" aria-expanded={branch ? open : undefined} aria-selected={false}>
      <div className="group flex items-center gap-1 rounded px-1 hover:bg-secondary/60">
        {branch ? (
          <button type="button" aria-label={open ? 'Collapse' : 'Expand'} onClick={() => setOpen(!open)} className="grid size-4 shrink-0 place-items-center rounded text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"><ChevronRightIcon className={cn('size-3 transition-transform', open && 'rotate-90')} /></button>
        ) : <span className="size-4 shrink-0" aria-hidden />}
        {name !== null && <span className="text-primary">{typeof name === 'number' ? name : `"${name}"`}<span className="text-muted-foreground">: </span></span>}
        {branch ? (
          <span className="text-muted-foreground">{o}{!open && <> {entries.length} {entries.length === 1 ? 'item' : 'items'} </>}{!open && c}</span>
        ) : (
          <span className={cn('break-all', tone[k])}>{k === 'string' ? `"${value}"` : String(value)}</span>
        )}
        <button type="button" aria-label={copied ? 'Copied' : branch ? 'Copy JSON' : 'Copy path'} onClick={copy} className="ms-1 grid size-5 shrink-0 place-items-center rounded text-muted-foreground opacity-0 outline-none hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 group-hover:opacity-100">{copied ? <CheckIcon className="size-3 text-success" /> : <CopyIcon className="size-3" />}</button>
      </div>
      {branch && open && (
        <>
          <div role="group" className="ms-2 border-s ps-2">
            {entries.map(([key, v]) => <Node key={key} name={key} value={v} path={path(p, key)} depth={depth + 1} defaultDepth={defaultDepth} force={force} />)}
          </div>
          <div className="ps-5 text-muted-foreground">{c}</div>
        </>
      )}
    </div>
  );
}
