'use client';

import * as React from 'react';
import { CheckIcon, CopyIcon, RefreshIcon, SparkleIcon, ThumbsDownIcon, ThumbsUpIcon } from './icons';
import { cn } from '@/lib/utils';

const act = 'grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 aria-pressed:text-primary [&_svg]:size-3.5';

/**
 * One message in an AI conversation. `role="user"` is a right-aligned bubble; `role="assistant"` is plain text with a sparkle avatar
 * and an action row (copy, regenerate, thumbs). While `streaming` a caret blinks at the end. Pass `plain` text to enable Copy.
 */
export function AiMessage({
  role,
  children,
  plain,
  streaming = false,
  onRegenerate,
  feedback,
  onFeedback,
  className,
}: {
  role: 'user' | 'assistant';
  children: React.ReactNode;
  /** The message as text, copied by the Copy button. */
  plain?: string;
  streaming?: boolean;
  onRegenerate?: () => void;
  feedback?: 'up' | 'down' | null;
  onFeedback?: (v: 'up' | 'down' | null) => void;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(plain ?? ''); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  if (role === 'user') {
    return (
      <div className={cn('flex justify-end', className)}>
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-sm leading-6">{children}</div>
      </div>
    );
  }
  return (
    <div className={cn('flex gap-3', className)}>
      <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><SparkleIcon className="size-3.5" /></span>
      <div className="min-w-0 flex-1">
        <div className="text-sm leading-7 text-foreground [&_p+p]:mt-3" aria-busy={streaming}>
          {children}
          {streaming && <span aria-hidden className="ms-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-primary" />}
        </div>
        {!streaming && (plain !== undefined || onRegenerate || onFeedback) && (
          <div className="mt-2 flex items-center gap-0.5">
            {plain !== undefined && <button type="button" aria-label="Copy" onClick={copy} className={act}>{copied ? <CheckIcon className="text-success" /> : <CopyIcon />}</button>}
            {onRegenerate && <button type="button" aria-label="Regenerate" onClick={onRegenerate} className={act}><RefreshIcon /></button>}
            {onFeedback && (
              <>
                <button type="button" aria-label="Good response" aria-pressed={feedback === 'up'} onClick={() => onFeedback(feedback === 'up' ? null : 'up')} className={act}><ThumbsUpIcon /></button>
                <button type="button" aria-label="Bad response" aria-pressed={feedback === 'down'} onClick={() => onFeedback(feedback === 'down' ? null : 'down')} className={act}><ThumbsDownIcon /></button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
