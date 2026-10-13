'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Chat, type ChatMessage } from '@/components/ui/chat';
import { cn } from '@/lib/utils';

const ME = 'You';
const at = (h: number, m: number) => new Date(2026, 9, 12, h, m);

interface Convo { id: string; name: string; unread: number; messages: ChatMessage[] }

const seed: Convo[] = [
  { id: 'diya', name: 'Diya Nair', unread: 0, messages: [
    { id: 'd1', from: 'Diya Nair', text: 'Did you get a chance to look at the invoice layout?', at: at(10, 2) },
    { id: 'd2', from: ME, text: 'Yes, the totals block looks great.', at: at(10, 5) },
    { id: 'd3', from: 'Diya Nair', text: 'Perfect. I will send the final PDF today.', at: at(10, 6) },
  ] },
  { id: 'rohan', name: 'Rohan Shah', unread: 2, messages: [
    { id: 'r1', from: 'Rohan Shah', text: 'The timezone fix is in review.', at: at(9, 40) },
    { id: 'r2', from: 'Rohan Shah', text: 'Can you take a look when you are free?', at: at(9, 41) },
  ] },
  { id: 'isha', name: 'Isha Rao', unread: 1, messages: [
    { id: 'i1', from: 'Isha Rao', text: 'Lunch at one?', at: at(11, 50) },
  ] },
];

/** Conversation list beside a thread. Replace the canned reply with your own socket or API. */
export default function ChatApp() {
  const [convos, setConvos] = React.useState(seed);
  const [activeId, setActiveId] = React.useState(seed[0].id);
  const [typing, setTyping] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const active = convos.find((c) => c.id === activeId)!;
  const last = (c: Convo) => c.messages[c.messages.length - 1];
  const add = (id: string, m: ChatMessage) => setConvos((all) => all.map((c) => (c.id === id ? { ...c, messages: [...c.messages, m] } : c)));

  function send(text: string) {
    const id = activeId;
    const name = active.name;
    add(id, { id: crypto.randomUUID(), from: ME, text, at: new Date() });
    clearTimeout(timer.current);
    setTyping(name);
    timer.current = setTimeout(() => {
      setTyping(null);
      add(id, { id: crypto.randomUUID(), from: name, text: 'Got it, thanks.', at: new Date() });
    }, 1400);
  }

  return (
    <div className="grid overflow-hidden rounded-xl border bg-card md:grid-cols-[18rem_1fr]">
      <ul aria-label="Conversations" className="divide-y border-b md:border-b-0 md:border-e">
        {convos.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              aria-current={c.id === activeId ? 'true' : undefined}
              onClick={() => { setActiveId(c.id); setTyping(null); setConvos((all) => all.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x))); }}
              className={cn('flex w-full items-center gap-3 px-4 py-3 text-start outline-none transition-colors hover:bg-muted focus-visible:bg-muted', c.id === activeId && 'bg-accent')}
            >
              <Avatar name={c.name} size="md" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{c.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{last(c).text}</span>
              </span>
              {c.unread > 0 && <Badge variant="default"><span className="sr-only">Unread: </span>{c.unread}</Badge>}
            </button>
          </li>
        ))}
      </ul>
      <section aria-label="Conversation" className="grid grid-rows-[auto_1fr]">
        <h3 className="border-b px-4 py-3 text-sm font-semibold">{active.name}</h3>
        <Chat messages={active.messages} me={ME} onSend={send} typing={typing ?? undefined} className="h-[28rem] max-w-none rounded-none border-0" />
      </section>
    </div>
  );
}
