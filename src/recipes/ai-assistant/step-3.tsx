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

export default function Assistant() {
  const [messages, setMessages] = React.useState<AiChatMessage[]>([]);
  const [value, setValue] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const send = (text: string) => {
    setValue('');
    setMessages((l) => [...l, { id: `u${Date.now()}`, role: 'user', content: text }]);
    setThinking(true);
    setStreaming(true);
    // replace this timeout with your model call, and feed the reply to StreamingText (or grow `text` as tokens arrive)
    timer.current = setTimeout(() => {
      const reply = `Here is what I found for "${text}": 142 people are in, 9 are on leave, and 6 approvals wait for you.`;
      setThinking(false);
      setMessages((l) => [...l, { id: `a${Date.now()}`, role: 'assistant', plain: reply, content: <StreamingText text={reply} speed={20} caret={false} onDone={() => setStreaming(false)} /> }]);
    }, 1400);
  };
  const stop = () => { clearTimeout(timer.current); setThinking(false); setStreaming(false); };

  return (
    <AiChat
      className="max-w-2xl"
      messages={messages}
      value={value}
      onValueChange={setValue}
      onSubmit={send}
      onStop={stop}
      thinking={thinking}
      streaming={streaming}
      greeting="What are you working on?"
      suggestions={suggestions}
      onSuggestion={(s) => send(s.label)}
    />
  );
}
