import * as React from 'react';
import { PaperclipIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { PromptInput } from '@/components/ui/prompt-input';

export default function PromptInputDemo() {
  const [value, setValue] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const send = () => {
    setValue('');
    setStreaming(true);
    timer.current = setTimeout(() => setStreaming(false), 3000);
  };
  const stop = () => { clearTimeout(timer.current); setStreaming(false); };
  return (
    <div className="grid w-full max-w-xl gap-3">
      <PromptInput
        value={value}
        onValueChange={setValue}
        onSubmit={send}
        onStop={stop}
        streaming={streaming}
        maxLength={400}
        placeholder="Ask about leave policy, payroll or onboarding"
        leading={<Button variant="ghost" size="icon-sm" aria-label="Attach a file"><PaperclipIcon /></Button>}
      />
      <p className="text-xs text-muted-foreground">Enter sends, Shift+Enter adds a line. After sending it shows Stop for three seconds.</p>
    </div>
  );
}
