import * as React from 'react';
import { Button } from '@/components/ui/button';
import { StreamingText } from '@/components/ui/streaming-text';

const answer = 'Carry-forward is capped at 12 days a year. Anything above that lapses on 31 March, and casual leave does not carry forward at all. If you are close to the cap, apply for leave before the financial year ends.';

export default function StreamingTextDemo() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="grid w-full max-w-lg gap-4">
      <p className="min-h-24 text-sm leading-7"><StreamingText key={run} text={answer} speed={16} /></p>
      <Button variant="outline" size="sm" className="w-fit" onClick={() => setRun((n) => n + 1)}>Replay</Button>
    </div>
  );
}
