'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Row = { kind: 'same' | 'add' | 'del'; text: string; a?: number; b?: number };

/** Line diff by longest common subsequence. Fine for config files and documents; for huge files use a real diff library. */
function diffLines(before: string, after: string): Row[] {
  const A = before.replace(/\n$/, '').split('\n'), B = after.replace(/\n$/, '').split('\n');
  const dp = Array.from({ length: A.length + 1 }, () => new Int32Array(B.length + 1));
  for (let i = A.length - 1; i >= 0; i--) for (let j = B.length - 1; j >= 0; j--) dp[i]![j] = A[i] === B[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
  const out: Row[] = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) {
    if (A[i] === B[j]) { out.push({ kind: 'same', text: A[i]!, a: i + 1, b: j + 1 }); i++; j++; }
    else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) out.push({ kind: 'del', text: A[i++]!, a: i });
    else out.push({ kind: 'add', text: B[j++]!, b: j });
  }
  while (i < A.length) out.push({ kind: 'del', text: A[i++]!, a: i });
  while (j < B.length) out.push({ kind: 'add', text: B[j++]!, b: j });
  return out;
}

/**
 * Before and after text as a unified diff (changelogs, config, contracts, document edits): removed lines in red with a minus, added lines in green with a plus,
 * line numbers for both sides and a count of changes on top. Long unchanged stretches fold into "N unchanged lines" (click to open) once they pass `context` lines on each side.
 */
export function DiffViewer({ before, after, title, context = 2, className }: { before: string; after: string; title?: string; context?: number; className?: string }) {
  const rows = React.useMemo(() => diffLines(before, after), [before, after]);
  const [open, setOpen] = React.useState<Set<number>>(new Set());
  const adds = rows.filter((r) => r.kind === 'add').length, dels = rows.filter((r) => r.kind === 'del').length;
  const changed = rows.map((r) => r.kind !== 'same');
  const near = rows.map((_, i) => changed.some((c, k) => c && Math.abs(k - i) <= context));
  const items: ({ row: Row } | { fold: number; from: number })[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (near[i] || open.has(i)) { items.push({ row: rows[i]! }); continue; }
    let j = i;
    while (j < rows.length && !near[j] && !open.has(j)) j++;
    items.push({ fold: j - i, from: i });
    i = j - 1;
  }
  const num = 'w-10 shrink-0 select-none px-2 text-right text-[11px] tabular-nums text-muted-foreground/70';

  return (
    <figure className={cn('overflow-hidden rounded-xl border bg-card', className)}>
      <figcaption className="flex items-center justify-between gap-3 border-b bg-muted/40 px-3 py-2 text-xs">
        <span className="truncate font-medium">{title ?? 'Changes'}</span>
        <span className="flex gap-2 tabular-nums"><span className="text-success">+{adds}</span><span className="text-destructive">-{dels}</span></span>
      </figcaption>
      <div className="overflow-x-auto py-1 font-mono text-[12.5px] leading-6">
        {adds + dels === 0 && <p className="px-3 py-4 text-center font-sans text-[13px] text-muted-foreground">No differences.</p>}
        {items.map((it, k) =>
          'fold' in it ? (
            <button key={k} type="button" onClick={() => setOpen((s) => new Set([...s, ...Array.from({ length: it.fold }, (_, x) => it.from + x)]))} className="block w-full bg-muted/30 py-0.5 text-center font-sans text-[11px] text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted">{it.fold} unchanged line{it.fold > 1 && 's'}</button>
          ) : (
            <div key={k} className={cn('flex min-w-max', it.row.kind === 'add' && 'bg-success/10', it.row.kind === 'del' && 'bg-destructive/10')}>
              <span className={num}>{it.row.a ?? ''}</span>
              <span className={num}>{it.row.b ?? ''}</span>
              <span aria-hidden className={cn('w-5 shrink-0 select-none text-center', it.row.kind === 'add' && 'text-success', it.row.kind === 'del' && 'text-destructive')}>{it.row.kind === 'add' ? '+' : it.row.kind === 'del' ? '-' : ''}</span>
              <span className="whitespace-pre pr-4">{it.row.text || ' '}</span>
              {it.row.kind !== 'same' && <span className="sr-only">{it.row.kind === 'add' ? 'added' : 'removed'}</span>}
            </div>
          ),
        )}
      </div>
    </figure>
  );
}
