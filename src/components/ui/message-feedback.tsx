'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, ThumbsDownIcon, ThumbsUpIcon } from './icons';
import { Button } from './button';

export interface Feedback { rating: 'up' | 'down'; reasons: string[]; comment: string }

const defaults = {
  up: ['Accurate', 'Clear', 'Helpful', 'Well written'],
  down: ['Wrong answer', 'Unclear', 'Missing something', 'Too long', 'Unsafe'],
};

/**
 * Thumbs up and down for an AI answer, then a short follow-up: pick reasons and add a note. Fires `onSubmit` once with the
 * rating, reasons and comment, then thanks the person. Thumbs alone fire nothing until Send, so a mis-tap costs nothing.
 */
export function MessageFeedback({
  onSubmit,
  reasons = defaults,
  className,
}: {
  onSubmit?: (f: Feedback) => void;
  reasons?: { up: string[]; down: string[] };
  className?: string;
}) {
  const [rating, setRating] = React.useState<'up' | 'down' | null>(null);
  const [picked, setPicked] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const id = React.useId();

  if (sent) {
    return <p role="status" className={cn('inline-flex items-center gap-1.5 text-sm text-muted-foreground', className)}><CheckIcon className="size-4 text-success" />Thanks, that helps.</p>;
  }
  const pick = (r: 'up' | 'down') => { setRating(rating === r ? null : r); setPicked([]); };
  const thumb = 'grid size-8 place-items-center rounded-md border text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary [&_svg]:size-4';

  return (
    <div className={cn('grid gap-3', className)}>
      <div className="flex items-center gap-2" role="group" aria-label="Rate this answer">
        <span className="text-sm text-muted-foreground">Was this helpful?</span>
        <button type="button" aria-label="Helpful" aria-pressed={rating === 'up'} onClick={() => pick('up')} className={thumb}><ThumbsUpIcon /></button>
        <button type="button" aria-label="Not helpful" aria-pressed={rating === 'down'} onClick={() => pick('down')} className={thumb}><ThumbsDownIcon /></button>
      </div>
      {rating && (
        <div className="grid gap-3 rounded-xl border bg-card p-3 animate-pop">
          <div role="group" aria-label={rating === 'up' ? 'What went well' : 'What went wrong'} className="flex flex-wrap gap-1.5">
            {reasons[rating].map((r) => {
              const on = picked.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(on ? picked.filter((x) => x !== r) : [...picked, r])}
                  className={cn('h-7 rounded-full border px-3 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50', on ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}
                >
                  {r}
                </button>
              );
            })}
          </div>
          <label htmlFor={id} className="sr-only">Anything to add?</label>
          <textarea id={id} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Anything to add? (optional)" rows={2} maxLength={500} className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setRating(null)}>Cancel</Button>
            <Button size="sm" onClick={() => { onSubmit?.({ rating, reasons: picked, comment: comment.trim() }); setSent(true); }}>Send</Button>
          </div>
        </div>
      )}
    </div>
  );
}
