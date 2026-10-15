import * as React from 'react';
import { MicIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { VoiceWave } from '@/components/ui/voice-wave';

export default function VoiceWaveDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border bg-card p-3">
      <Button size="icon" variant={on ? 'primary' : 'outline'} shape="pill" aria-pressed={on} aria-label={on ? 'Stop listening' : 'Start listening'} onClick={() => setOn(!on)}><MicIcon /></Button>
      <VoiceWave active={on} className="flex-1" />
      <span className="w-16 text-end text-xs text-muted-foreground">{on ? 'Listening' : 'Paused'}</span>
    </div>
  );
}
