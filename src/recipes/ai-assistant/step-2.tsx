import * as React from 'react';
import { AiMessage } from '@/components/ui/ai-message';
import { PromptInput } from '@/components/ui/prompt-input';

interface Msg { id: number; role: 'user' | 'assistant'; text: string }

export default function Assistant() {
  const [messages, setMessages] = React.useState<Msg[]>([{ id: 1, role: 'assistant', text: 'Hi! Ask me about leave, payroll or onboarding.' }]);
  const [value, setValue] = React.useState('');
  const send = (text: string) => {
    setValue('');
    setMessages((l) => [...l, { id: Date.now(), role: 'user', text }, { id: Date.now() + 1, role: 'assistant', text: `You asked: "${text}". Wire this to your model.` }]);
  };
  return (
    <div className="grid w-full max-w-xl gap-6">
      {messages.map((m) => <AiMessage key={m.id} role={m.role} plain={m.role === 'assistant' ? m.text : undefined}>{m.text}</AiMessage>)}
      <PromptInput value={value} onValueChange={setValue} onSubmit={send} placeholder="Ask about leave, payroll or onboarding" />
    </div>
  );
}
