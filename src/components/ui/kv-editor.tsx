'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { EyeIcon, EyeOffIcon, PlusIcon, XIcon } from './icons';

export interface KvPair { key: string; value: string }

/** Turns pasted `.env` text (`KEY=value`, `# comments`, quotes) into pairs. */
export function parseEnv(text: string): KvPair[] {
  return text.split(/\r?\n/).flatMap((raw) => {
    const line = raw.trim().replace(/^export\s+/, '');
    const eq = line.indexOf('=');
    if (!line || line.startsWith('#') || eq < 1) return [];
    return [{ key: line.slice(0, eq).trim(), value: line.slice(eq + 1).trim().replace(/^(['"])(.*)\1$/, '$2') }];
  });
}

/**
 * Edit environment variables or headers as key and value rows: add and remove rows, values hidden until you show them, duplicate
 * keys flagged, and paste a whole `.env` file into a key field to fill many rows at once. Controlled with `pairs` and `onChange`.
 */
export function KvEditor({ pairs, onChange, secret = true, keyPlaceholder = 'KEY', valuePlaceholder = 'value', className }: { pairs: KvPair[]; onChange: (pairs: KvPair[]) => void; secret?: boolean; keyPlaceholder?: string; valuePlaceholder?: string; className?: string }) {
  const [shown, setShown] = React.useState<Set<number>>(new Set());
  const set = (i: number, p: Partial<KvPair>) => onChange(pairs.map((x, k) => (k === i ? { ...x, ...p } : x)));
  const dupes = new Set(pairs.map((p) => p.key).filter((k, i, a) => k && a.indexOf(k) !== i));
  const input = 'h-9 min-w-0 rounded-md border border-input bg-background px-2.5 font-mono text-[13px] outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 aria-[invalid=true]:border-destructive';

  const paste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!/\n/.test(text.trim()) && !/^\s*(export\s+)?\w+=/.test(text)) return;
    const found = parseEnv(text);
    if (!found.length) return;
    e.preventDefault();
    const rest = pairs.filter((_, k) => !(k === i && !pairs[k]!.key && !pairs[k]!.value));
    onChange([...rest, ...found]);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      {pairs.map((p, i) => {
        const dup = dupes.has(p.key);
        return (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 max-sm:grid-cols-[1fr_auto]">
            <input value={p.key} onChange={(e) => set(i, { key: e.target.value })} onPaste={(e) => paste(i, e)} placeholder={keyPlaceholder} aria-label={`Key ${i + 1}`} aria-invalid={dup} spellCheck={false} className={input} />
            <div className="relative max-sm:order-3 max-sm:col-span-2">
              <input value={p.value} onChange={(e) => set(i, { value: e.target.value })} type={secret && !shown.has(i) ? 'password' : 'text'} placeholder={valuePlaceholder} aria-label={`Value ${i + 1}`} spellCheck={false} autoComplete="off" className={cn(input, 'w-full', secret && 'pe-9')} />
              {secret && (
                <button type="button" aria-label={shown.has(i) ? 'Hide value' : 'Show value'} aria-pressed={shown.has(i)} onClick={() => setShown((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })} className="absolute end-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">
                  {shown.has(i) ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              )}
            </div>
            <button type="button" aria-label={`Remove ${p.key || `row ${i + 1}`}`} onClick={() => onChange(pairs.filter((_, k) => k !== i))} className="grid size-8 place-items-center rounded-md text-muted-foreground outline-none hover:bg-secondary hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring/50"><XIcon className="size-4" /></button>
            {dup && <p role="alert" className="col-span-full -mt-1 text-xs text-destructive">{p.key} appears more than once.</p>}
          </div>
        );
      })}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={() => onChange([...pairs, { key: '', value: '' }])}><PlusIcon />Add variable</Button>
        <span className="text-xs text-muted-foreground">Paste a .env file into any key field.</span>
      </div>
    </div>
  );
}
