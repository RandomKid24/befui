'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon, KeyIcon, PlusIcon, TrashIcon } from './icons';

export interface ApiKey {
  id: string;
  name: string;
  /** The full secret. Only keep it in memory right after creating the key; for stored keys pass just `prefix`. */
  secret?: string;
  /** Visible start of the key, such as `sk_live_4f2a`. */
  prefix: string;
  created: string;
  lastUsed?: string;
  revoked?: boolean;
}

/**
 * List, create and revoke API keys. A key that has just been made (it has a `secret`) shows once with Show and Copy, with a note that it
 * will not be shown again; stored keys show only their start and dots. Revoking asks first. You do the real work in the callbacks.
 */
export function ApiKeyManager({
  keys,
  onCreate,
  onRevoke,
  className,
}: {
  keys: ApiKey[];
  /** Called with the name. Make the key on your server, then add it to `keys` with its `secret` so it shows once. */
  onCreate?: (name: string) => void;
  onRevoke?: (id: string) => void;
  className?: string;
}) {
  const [name, setName] = React.useState('');
  const [confirm, setConfirm] = React.useState<string | null>(null);
  const id = React.useId();
  const create = (e: React.FormEvent) => { e.preventDefault(); if (name.trim()) { onCreate?.(name.trim()); setName(''); } };

  return (
    <div className={cn('grid grid-cols-[minmax(0,1fr)] gap-4', className)}>
      <form onSubmit={create} className="flex gap-2">
        <label htmlFor={id} className="sr-only">Key name</label>
        <Input id={id} className="min-w-0 flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Key name, such as Production server" maxLength={60} />
        <Button type="submit" disabled={!name.trim()}><PlusIcon />Create key</Button>
      </form>
      <ul className="divide-y rounded-xl border bg-card">
        {keys.map((k) => <Row key={k.id} k={k} asking={confirm === k.id} ask={(v) => setConfirm(v ? k.id : null)} onRevoke={() => { onRevoke?.(k.id); setConfirm(null); }} />)}
        {!keys.length && <li className="px-4 py-8 text-center text-sm text-muted-foreground">No keys yet. Create one to start calling the API.</li>}
      </ul>
    </div>
  );
}

function Row({ k, asking, ask, onRevoke }: { k: ApiKey; asking: boolean; ask: (v: boolean) => void; onRevoke: () => void }) {
  const [show, setShow] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const fresh = !!k.secret;
  const text = fresh ? (show ? k.secret! : `${k.secret!.slice(0, k.prefix.length)}${'•'.repeat(24)}`) : `${k.prefix}${'•'.repeat(24)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(k.secret ?? ''); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const ico = 'grid size-8 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4';
  return (
    <li className={cn('grid grid-cols-[minmax(0,1fr)] gap-2 px-4 py-3', k.revoked && 'opacity-60')}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <KeyIcon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{k.name}</span>
        {k.revoked ? <Badge variant="danger">Revoked</Badge> : fresh ? <Badge variant="success">New</Badge> : <Badge variant="outline">Active</Badge>}
        <span className="ms-auto text-xs text-muted-foreground">Created {k.created}{k.lastUsed ? ` · Last used ${k.lastUsed}` : ' · Never used'}</span>
      </div>
      <div className="flex items-center gap-1">
        <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-2.5 py-1.5 font-mono text-[13px]" aria-label={fresh && show ? 'API key' : 'API key, hidden'}>{text}</code>
        {fresh && !k.revoked && (
          <>
            <button type="button" aria-label={show ? 'Hide key' : 'Show key'} aria-pressed={show} onClick={() => setShow(!show)} className={ico}>{show ? <EyeOffIcon /> : <EyeIcon />}</button>
            <button type="button" aria-label={copied ? 'Copied' : 'Copy key'} onClick={copy} className={ico}>{copied ? <CheckIcon className="text-success" /> : <CopyIcon />}</button>
          </>
        )}
        {!k.revoked && !asking && <button type="button" aria-label={`Revoke ${k.name}`} onClick={() => ask(true)} className={cn(ico, 'hover:text-destructive')}><TrashIcon /></button>}
      </div>
      {fresh && !k.revoked && <p className="text-xs text-warning">Copy it now. For your security it will not be shown again.</p>}
      {asking && (
        <div role="alertdialog" aria-label={`Revoke ${k.name}?`} className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
          <span className="flex-1">Revoke this key? Anything using it stops working right away.</span>
          <Button variant="ghost" size="sm" onClick={() => ask(false)}>Keep</Button>
          <Button variant="destructive" size="sm" onClick={onRevoke}>Revoke</Button>
        </div>
      )}
    </li>
  );
}
