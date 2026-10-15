'use client';

import * as React from 'react';
import { AlertCircleIcon, CheckCircleIcon, ChevronDownIcon, LoaderIcon, TerminalIcon } from './icons';
import { cn } from '@/lib/utils';

const tone = {
  running: { icon: <LoaderIcon className="size-4 animate-spin text-primary" />, text: 'Running' },
  done: { icon: <CheckCircleIcon className="size-4 text-success" />, text: 'Done' },
  error: { icon: <AlertCircleIcon className="size-4 text-destructive" />, text: 'Failed' },
} as const;

/**
 * A card for one tool or function call an AI made: name, status, how long it took, and the input and output you can expand.
 * Pass `input` and `output` as strings (JSON, text) or nodes.
 */
export function ToolCall({
  name,
  status,
  input,
  output,
  duration,
  defaultOpen = false,
  className,
}: {
  name: string;
  status: keyof typeof tone;
  input?: React.ReactNode;
  output?: React.ReactNode;
  duration?: string;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const t = tone[status];
  const has = input !== undefined || output !== undefined;
  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card text-sm', className)}>
      <button
        type="button"
        aria-expanded={has ? open : undefined}
        disabled={!has}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start outline-none focus-visible:bg-muted/50 disabled:cursor-default"
      >
        <span className="grid size-6 place-items-center rounded-md bg-secondary text-muted-foreground"><TerminalIcon className="size-3.5" /></span>
        <span className="min-w-0 flex-1 truncate font-mono text-[13px] font-medium">{name}</span>
        {duration && <span className="text-xs tabular-nums text-muted-foreground">{duration}</span>}
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" role="status">{t.icon}{t.text}</span>
        {has && <ChevronDownIcon className={cn('size-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />}
      </button>
      {has && (
        <div className={cn('grid transition-[grid-template-rows] duration-300', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
          <div className="overflow-hidden">
            <div className="grid gap-3 border-t p-3">
              {input !== undefined && <Block label="Input">{input}</Block>}
              {output !== undefined && <Block label={status === 'error' ? 'Error' : 'Output'}>{output}</Block>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <pre className="max-h-48 overflow-auto rounded-lg bg-muted/60 p-2.5 font-mono text-xs leading-5 whitespace-pre-wrap">{children}</pre>
    </div>
  );
}
