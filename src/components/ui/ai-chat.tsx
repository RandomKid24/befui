'use client';

import * as React from 'react';
import { AiMessage } from './ai-message';
import { ArrowDownIcon, SparkleIcon } from './icons';
import { PromptInput } from './prompt-input';
import { PromptSuggestions, type Suggestion } from './prompt-suggestions';
import { Thinking } from './thinking';
import { cn } from '@/lib/utils';

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  /** Plain text of an assistant message, for its Copy button. */
  plain?: string;
  streaming?: boolean;
}

/**
 * A whole AI chat in one piece: the conversation (sticks to the newest message, with a "Latest" button when you scroll up),
 * a greeting and starter prompts while it is empty, a Thinking row while `thinking`, and the PromptInput pinned at the bottom.
 * Give it a height with `className` (e.g. h-[32rem]). Controlled: you own `messages` and `value`.
 */
export function AiChat({
  messages,
  value,
  onValueChange,
  onSubmit,
  onStop,
  streaming = false,
  thinking = false,
  greeting = 'How can I help?',
  suggestions,
  onSuggestion,
  placeholder,
  className,
}: {
  messages: AiChatMessage[];
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onStop?: () => void;
  streaming?: boolean;
  thinking?: boolean;
  greeting?: React.ReactNode;
  suggestions?: Suggestion[];
  onSuggestion?: (s: Suggestion) => void;
  placeholder?: string;
  className?: string;
}) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const stick = React.useRef(true);
  const [away, setAway] = React.useState(false);
  const toEnd = (smooth = true) => {
    const el = scroller.current;
    if (!el) return;
    if (typeof el.scrollTo === 'function') el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    else el.scrollTop = el.scrollHeight;
  };
  // keep following the conversation while you are at the bottom; leave it alone once you scroll up to read
  React.useEffect(() => { if (stick.current) toEnd(false); }, [messages, thinking]);
  return (
    <div className={cn('relative flex h-[32rem] w-full flex-col overflow-hidden rounded-2xl border bg-background', className)}>
      <div
        ref={scroller}
        role="log"
        aria-live="polite"
        onScroll={(e) => {
          const el = e.currentTarget;
          const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          stick.current = near;
          setAway(!near);
        }}
        className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-4 py-5"
      >
        {messages.length === 0 && !thinking ? (
          <div className="mx-auto grid h-full max-w-md content-center justify-items-center gap-5 text-center">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><SparkleIcon className="size-5" /></span>
            <p className="text-lg font-semibold tracking-tight">{greeting}</p>
            {suggestions && <PromptSuggestions items={suggestions} onSelect={(s) => onSuggestion?.(s)} className="w-full text-start" />}
          </div>
        ) : (
          <div className="mx-auto grid max-w-2xl gap-6">
            {messages.map((m) => <AiMessage key={m.id} role={m.role} plain={m.plain} streaming={m.streaming}>{m.content}</AiMessage>)}
            {thinking && <Thinking className="ps-10" />}
          </div>
        )}
      </div>
      {away && (
        <button
          type="button"
          onClick={() => { stick.current = true; toEnd(); }}
          className="absolute bottom-24 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border bg-background/95 px-3 py-1.5 text-xs font-medium shadow-md outline-none transition-all animate-pop hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowDownIcon className="size-3.5" /> Latest
        </button>
      )}
      <div className="border-t bg-background/80 p-3">
        <div className="mx-auto max-w-2xl">
          <PromptInput value={value} onValueChange={onValueChange} onSubmit={onSubmit} onStop={onStop} streaming={streaming} placeholder={placeholder} />
        </div>
      </div>
    </div>
  );
}
