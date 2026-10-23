'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { CheckIcon } from './icons';

export interface NpsAnswer { score: number; segment: 'detractor' | 'passive' | 'promoter'; comment: string }

const segment = (s: number): NpsAnswer['segment'] => (s <= 6 ? 'detractor' : s <= 8 ? 'passive' : 'promoter');

/**
 * The 0 to 10 "how likely are you to recommend us" question. Picking a score opens a follow-up whose wording depends on
 * the group (0-6 detractor, 7-8 passive, 9-10 promoter); Submit gives the score, group and comment once.
 */
export function NpsSurvey({
  question = 'How likely are you to recommend us to a friend or colleague?',
  followUps = { detractor: 'What went wrong, and what should we fix first?', passive: 'What would make it a 10 for you?', promoter: 'What do you like most?' },
  onSubmit,
  className,
}: {
  question?: string;
  followUps?: Record<NpsAnswer['segment'], string>;
  onSubmit?: (a: NpsAnswer) => void;
  className?: string;
}) {
  const [score, setScore] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState('');
  const [done, setDone] = React.useState(false);
  const id = React.useId();
  if (done) return <p role="status" className={cn('inline-flex items-center gap-2 text-sm', className)}><CheckIcon className="size-4 text-success" />Thank you for your feedback.</p>;
  const seg = score === null ? null : segment(score);
  return (
    <form className={cn('grid gap-4', className)} onSubmit={(e) => { e.preventDefault(); if (score === null) return; onSubmit?.({ score, segment: segment(score), comment: comment.trim() }); setDone(true); }}>
      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium">{question}</legend>
        <div role="radiogroup" aria-label="Score from 0 to 10" className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={score === n}
              aria-label={String(n)}
              tabIndex={score === n || (score === null && n === 0) ? 0 : -1}
              onClick={() => setScore(n)}
              onKeyDown={(e) => {
                const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
                if (!d) return;
                e.preventDefault();
                const next = Math.min(10, Math.max(0, (score ?? n) + d));
                setScore(next);
                (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
              }}
              className="aspect-square min-w-0 rounded-md border text-sm font-medium tabular-nums outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 aria-checked:border-primary aria-checked:bg-primary aria-checked:text-primary-foreground"
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground"><span>Not at all likely</span><span>Extremely likely</span></div>
      </fieldset>
      {seg && (
        <div className="grid gap-3 animate-pop">
          <label htmlFor={id} className="text-sm">{followUps[seg]}</label>
          <textarea id={id} value={comment} onChange={(e) => setComment(e.target.value)} rows={3} maxLength={1000} className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15" />
          <div className="flex justify-end"><Button type="submit">Submit</Button></div>
        </div>
      )}
    </form>
  );
}
