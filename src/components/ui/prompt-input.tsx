'use client';

import * as React from 'react';
import { ArrowUpIcon, SquareIcon } from './icons';
import { cn } from '@/lib/utils';

/**
 * The box you type a prompt into: grows with the text up to `maxRows`, Enter sends, Shift+Enter adds a line.
 * While `streaming` the send button becomes Stop and calls `onStop`. Put attach buttons or a model picker in `leading`.
 * Controlled: `value` and `onValueChange`.
 */
export function PromptInput({
  value,
  onValueChange,
  onSubmit,
  onStop,
  streaming = false,
  placeholder = 'Ask anything',
  maxRows = 8,
  maxLength,
  disabled,
  leading,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onStop?: () => void;
  streaming?: boolean;
  placeholder?: string;
  maxRows?: number;
  maxLength?: number;
  disabled?: boolean;
  leading?: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const line = parseFloat(getComputedStyle(el).lineHeight) || 24;
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows)}px`;
  }, [value, maxRows]);
  const empty = value.trim().length === 0;
  const send = () => { if (!empty && !streaming && !disabled) onSubmit(value.trim()); };
  return (
    <div className={cn('rounded-2xl border bg-card p-2 shadow-sm transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/15', disabled && 'opacity-60', className)}>
      <textarea
        ref={ref}
        rows={1}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
        }}
        className="block max-h-none w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-6 outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center gap-1 px-1 pt-1">
        <div className="flex min-w-0 flex-1 items-center gap-1">{leading}</div>
        {maxLength !== undefined && value.length > maxLength * 0.8 && <span className="me-1 text-xs tabular-nums text-muted-foreground">{value.length}/{maxLength}</span>}
        <button
          type="button"
          aria-label={streaming ? 'Stop generating' : 'Send'}
          disabled={streaming ? !onStop : empty || disabled}
          onClick={streaming ? onStop : send}
          className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:bg-secondary disabled:text-muted-foreground"
        >
          {streaming ? <SquareIcon className="size-3.5 fill-current" /> : <ArrowUpIcon className="size-4" />}
        </button>
      </div>
    </div>
  );
}
