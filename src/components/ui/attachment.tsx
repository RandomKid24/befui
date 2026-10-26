'use client';

import * as React from 'react';
import { AlertCircleIcon, FileTextIcon, ImageIcon, XIcon } from './icons';
import { cn } from '@/lib/utils';

/**
 * A file attached to a prompt: icon, name, size and a thin progress line while it uploads. `status="error"` turns it red.
 * Pass `onRemove` to show the x. Images show `preview` as a thumbnail when you give a URL.
 */
export function Attachment({
  name,
  size,
  status = 'done',
  progress,
  preview,
  onRemove,
  className,
}: {
  name: string;
  /** Already formatted, e.g. "2.4 MB". */
  size?: string;
  status?: 'uploading' | 'done' | 'error';
  /** 0 to 100, while uploading. */
  progress?: number;
  preview?: string;
  onRemove?: () => void;
  className?: string;
}) {
  const image = /\.(png|jpe?g|gif|webp|svg)$/i.test(name);
  return (
    <div className={cn('relative flex w-56 max-w-full items-center gap-2.5 overflow-hidden rounded-xl border bg-card p-2 pe-8', status === 'error' && 'border-destructive/40 bg-destructive/5', className)}>
      <span className={cn('grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary text-muted-foreground', status === 'error' && 'bg-destructive/10 text-destructive')}>
        {preview ? <img src={preview} alt="" className="size-full object-cover" /> : status === 'error' ? <AlertCircleIcon className="size-4" /> : image ? <ImageIcon className="size-4" /> : <FileTextIcon className="size-4" />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium">{name}</span>
        <span className={cn('block truncate text-xs', status === 'error' ? 'text-destructive' : 'text-muted-foreground')}>{status === 'error' ? 'Upload failed' : status === 'uploading' ? `Uploading ${Math.round(progress ?? 0)}%` : size}</span>
      </span>
      {onRemove && (
        <button type="button" aria-label={`Remove ${name}`} onClick={onRemove} className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40">
          <XIcon className="size-3.5" />
        </button>
      )}
      {status === 'uploading' && (
        <span role="progressbar" aria-label={`Uploading ${name}`} aria-valuenow={Math.round(progress ?? 0)} aria-valuemin={0} aria-valuemax={100} className="absolute inset-x-0 bottom-0 h-0.5 bg-secondary">
          <span className="block h-full bg-primary transition-[width] duration-(--dur-base)" style={{ width: `${progress ?? 0}%` }} />
        </span>
      )}
    </div>
  );
}
