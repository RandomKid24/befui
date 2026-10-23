'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, BotIcon, BrainIcon, CheckCircleIcon, ChevronDownIcon, LoaderIcon, SearchIcon, TerminalIcon } from './icons';

export type TraceKind = 'llm' | 'tool' | 'retrieval' | 'agent';
export interface TraceSpan {
  id: string;
  name: string;
  kind: TraceKind;
  status: 'running' | 'done' | 'error';
  /** Milliseconds from the start of the whole run. */
  start: number;
  /** How long it took in milliseconds. */
  duration: number;
  tokens?: number;
  input?: React.ReactNode;
  output?: React.ReactNode;
  /** Spans started by this one. */
  children?: TraceSpan[];
}

const kinds: Record<TraceKind, { icon: typeof BotIcon; bar: string }> = {
  llm: { icon: BrainIcon, bar: 'bg-primary' },
  tool: { icon: TerminalIcon, bar: 'bg-success' },
  retrieval: { icon: SearchIcon, bar: 'bg-info' },
  agent: { icon: BotIcon, bar: 'bg-warning' },
};
const ms = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(2)}s` : `${Math.round(n)}ms`);

/**
 * The run of an AI agent as a tree: each model call, tool call and lookup is a row with a bar on a shared time scale, so you
 * can see what ran when and which step was slow. Click a row to see its input and output. Nested rows are steps the parent started.
 */
export function AgentTrace({ spans, className }: { spans: TraceSpan[]; className?: string }) {
  const flat: TraceSpan[] = [];
  const all = (l: TraceSpan[]) => l.forEach((s) => { flat.push(s); s.children && all(s.children); });
  all(spans);
  const total = Math.max(...flat.map((s) => s.start + s.duration), 1);
  const tokens = flat.reduce((n, s) => n + (s.tokens ?? 0), 0);
  const failed = flat.filter((s) => s.status === 'error').length;

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card text-sm', className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <span><span className="font-medium text-foreground tabular-nums">{ms(total)}</span> total</span>
        <span><span className="font-medium text-foreground tabular-nums">{flat.length}</span> steps</span>
        {tokens > 0 && <span><span className="font-medium text-foreground tabular-nums">{tokens.toLocaleString()}</span> tokens</span>}
        {failed > 0 && <span className="text-destructive">{failed} failed</span>}
      </div>
      <ul role="tree" aria-label="Agent run">
        {spans.map((s) => <Row key={s.id} span={s} depth={0} total={total} />)}
      </ul>
    </div>
  );
}

function Row({ span: s, depth, total }: { span: TraceSpan; depth: number; total: number }) {
  const [open, setOpen] = React.useState(false);
  const [kids, setKids] = React.useState(true);
  const { icon: Icon, bar } = kinds[s.kind];
  const detail = s.input !== undefined || s.output !== undefined;
  const hasKids = !!s.children?.length;
  const panel = React.useId();
  return (
    <li role="treeitem" aria-level={depth + 1} aria-expanded={hasKids ? kids : undefined} className="border-b last:border-b-0">
      <div className="flex items-center gap-2 px-3 py-1.5" style={{ paddingInlineStart: 12 + depth * 18 }}>
        {hasKids ? (
          <button
            type="button"
            aria-label={kids ? 'Collapse children' : 'Expand children'}
            onClick={() => setKids(!kids)}
            className="grid size-5 shrink-0 place-items-center rounded text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <ChevronDownIcon className={cn('size-3.5 transition-transform', !kids && '-rotate-90 rtl:rotate-90')} />
          </button>
        ) : (
          <span className="size-5 shrink-0" aria-hidden />
        )}
        <button
          type="button"
          aria-expanded={detail ? open : undefined}
          aria-controls={detail ? panel : undefined}
          onClick={() => detail && setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md py-1 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <span className="flex w-52 min-w-0 shrink-0 items-center gap-2 max-sm:w-36">
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-mono text-[13px]">{s.name}</span>
            {s.status === 'running' && <LoaderIcon className="size-3.5 shrink-0 animate-spin text-primary" aria-label="Running" />}
            {s.status === 'error' && <AlertCircleIcon className="size-3.5 shrink-0 text-destructive" aria-label="Failed" />}
            {s.status === 'done' && <CheckCircleIcon className="size-3.5 shrink-0 text-success" aria-label="Done" />}
          </span>
          <span className="relative h-4 flex-1 rounded bg-secondary" aria-hidden>
            <span
              className={cn('absolute inset-y-0 rounded', s.status === 'error' ? 'bg-destructive' : bar, s.status === 'running' && 'animate-pulse')}
              style={{ insetInlineStart: `${(s.start / total) * 100}%`, width: `max(${(s.duration / total) * 100}%, 3px)` }}
            />
          </span>
          <span className="w-16 shrink-0 text-end text-xs tabular-nums text-muted-foreground">{ms(s.duration)}</span>
        </button>
      </div>
      {detail && open && (
        <div id={panel} className="grid gap-2 border-t bg-muted/30 px-4 py-3 text-xs sm:grid-cols-2" style={{ paddingInlineStart: 48 + depth * 18 }}>
          {s.input !== undefined && <Block title="Input">{s.input}</Block>}
          {s.output !== undefined && <Block title="Output">{s.output}</Block>}
          {s.tokens !== undefined && <p className="text-muted-foreground sm:col-span-2">{s.tokens.toLocaleString()} tokens</p>}
        </div>
      )}
      {hasKids && kids && <ul role="group">{s.children!.map((c) => <Row key={c.id} span={c} depth={depth + 1} total={total} />)}</ul>}
    </li>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-background p-2 font-mono text-[12px] leading-relaxed">{children}</pre>
    </div>
  );
}
