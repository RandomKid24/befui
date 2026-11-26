'use client';

import * as React from 'react';
import { Button } from './button';
import { Textarea } from './input';
import { Rating } from './rating';
import { Segmented } from './segmented';
import { cn } from '@/lib/utils';

export interface Review { id: string; author: string; rating: number; title: string; body: string; date: string; /** Set once answered. */ reply?: string }

/** Reviews to answer: a list beside the chosen review and its reply box. Drafts are kept while you move between reviews. */
export function ReviewInbox({ reviews, onReply, className }: {
  reviews: Review[];
  /** Send the reply, then pass it back in `reviews`. Throw to show the message and keep the draft. */
  onReply: (id: string, text: string) => Promise<void> | void;
  className?: string;
}) {
  const [tab, setTab] = React.useState<'open' | 'done'>('open');
  const [picked, setPicked] = React.useState<string>();
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const [sending, setSending] = React.useState<string>();
  const [error, setError] = React.useState<{ id: string; text: string }>();
  const shown = reviews.filter((r) => (tab === 'done') === !!r.reply);
  const current = shown.find((r) => r.id === picked) ?? shown[0];
  const draft = current ? (drafts[current.id] ?? '') : '';

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !draft.trim() || sending) return;
    const id = current.id;
    setSending(id);
    setError(undefined);
    try {
      await onReply(id, draft.trim());
      setDrafts(({ [id]: _sent, ...rest }) => rest);
    } catch (err) {
      setError({ id, text: err instanceof Error && err.message ? err.message : 'The reply was not sent. Try again.' });
    } finally {
      setSending(undefined);
    }
  }

  const open = reviews.filter((r) => !r.reply).length;
  return (
    <section aria-label="Reviews" className={cn('grid w-full overflow-hidden rounded-xl border bg-card md:grid-cols-[18rem_1fr]', className)}>
      <div className="border-b md:border-b-0 md:border-e">
        <div className="border-b p-3">
          <Segmented value={tab} onValueChange={setTab} options={[{ value: 'open', label: `To reply (${open})` }, { value: 'done', label: `Replied (${reviews.length - open})` }]} />
        </div>
        <ul className="max-h-60 overflow-y-auto md:max-h-[26rem]">
          {shown.map((r) => (
            <li key={r.id} className="border-b last:border-b-0">
              <button type="button" aria-current={r.id === current?.id ? 'true' : undefined} onClick={() => setPicked(r.id)} className={cn('grid w-full gap-1 border-s-2 border-transparent px-3 py-2.5 text-left outline-none focus-visible:bg-muted', r.id === current?.id ? 'border-primary bg-accent' : 'hover:bg-muted')}>
                <span className="flex justify-between gap-2 text-[13px]"><span className="truncate font-semibold">{r.author}</span><span className="shrink-0 text-muted-foreground">{r.date}</span></span>
                <span className="text-xs text-muted-foreground">{r.rating} of 5 stars</span>
                <span className="truncate text-[13px]">{r.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {current ? (
        <article aria-label={`Review by ${current.author}`} className="flex flex-col gap-4 p-5">
          <header className="grid gap-1.5">
            <Rating value={current.rating} />
            <h2 className="text-lg font-semibold">{current.title}</h2>
            <p className="text-xs text-muted-foreground">{current.author}, {current.date}</p>
          </header>
          <p className="text-sm leading-relaxed">{current.body}</p>
          {current.reply ? (
            <div className="border-s-2 border-primary ps-4">
              <h3 className="text-xs font-semibold text-muted-foreground">Your reply</h3>
              <p className="mt-1 text-sm">{current.reply}</p>
            </div>
          ) : (
            <form onSubmit={send} className="mt-auto grid gap-2">
              <Textarea aria-label={`Reply to ${current.author}`} placeholder="Write a reply. It is public." value={draft} readOnly={sending === current.id} onChange={(e) => setDrafts({ ...drafts, [current.id]: e.target.value })} />
              {error?.id === current.id && <p role="alert" className="text-xs text-destructive">{error.text}</p>}
              <Button type="submit" className="justify-self-end" loading={sending === current.id} disabled={!draft.trim() || !!sending}>Post reply</Button>
            </form>
          )}
        </article>
      ) : (
        <p className="grid min-h-40 place-items-center p-6 text-sm text-muted-foreground">{tab === 'open' ? 'Every review has a reply.' : 'No replies yet.'}</p>
      )}
    </section>
  );
}
