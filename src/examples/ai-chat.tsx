import * as React from 'react';
import { AiChat, type AiChatMessage } from '@/components/ui/ai-chat';
import { CalendarIcon, FileTextIcon, UsersIcon } from '@/components/ui/icons';
import type { Suggestion } from '@/components/ui/prompt-suggestions';
import { StreamingText } from '@/components/ui/streaming-text';

const suggestions: Suggestion[] = [
  { id: '1', label: 'Summarise this week', hint: 'Attendance, leave and approvals', icon: <CalendarIcon /> },
  { id: '2', label: 'Draft an offer letter', hint: 'From a role and a salary', icon: <FileTextIcon /> },
  { id: '3', label: 'Who is out tomorrow?', hint: 'Across all teams', icon: <UsersIcon /> },
];

const replies = [
  'Here is the short version: 142 people are in, 9 are on leave, and 6 approvals are waiting for you. Attendance is up 2% on last week.',
  'Sure. I would start with the role, the band and the joining date, then add the notice period and the probation terms. Want me to draft it?',
];

export default function AiChatDemo() {
  const [messages, setMessages] = React.useState<AiChatMessage[]>([]);
  const [value, setValue] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const n = React.useRef(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const send = (text: string) => {
    const reply = replies[n.current++ % replies.length]!;
    setValue('');
    setMessages((l) => [...l, { id: `u${Date.now()}`, role: 'user', content: text }]);
    setThinking(true);
    timers.current.push(setTimeout(() => {
      setThinking(false);
      setStreaming(true);
      setMessages((l) => [...l, { id: `a${Date.now()}`, role: 'assistant', plain: reply, streaming: true, content: <StreamingText text={reply} speed={20} caret={false} onDone={() => { setStreaming(false); setMessages((m) => m.map((x) => ({ ...x, streaming: false }))); }} /> }]);
    }, 1400));
  };
  const stop = () => { timers.current.forEach(clearTimeout); setThinking(false); setStreaming(false); setMessages((m) => m.map((x) => ({ ...x, streaming: false }))); };
  return (
    <AiChat
      className="max-w-2xl"
      messages={messages}
      value={value}
      onValueChange={setValue}
      onSubmit={send}
      onStop={stop}
      thinking={thinking}
      streaming={streaming || thinking}
      greeting="What are you working on?"
      suggestions={suggestions}
      onSuggestion={(s) => send(s.label)}
      placeholder="Message the assistant"
    />
  );
}
