import * as React from 'react';
import { AiMessage } from '@/components/ui/ai-message';
import { Cite } from '@/components/ui/sources';

export default function AiMessageDemo() {
  const [fb, setFb] = React.useState<'up' | 'down' | null>(null);
  const answer = 'Carry-forward is capped at 12 days a year, and anything above that lapses on 31 March.';
  return (
    <div className="grid w-full max-w-xl gap-6">
      <AiMessage role="user">How many leave days can I carry forward?</AiMessage>
      <AiMessage role="assistant" plain={answer} onRegenerate={() => {}} feedback={fb} onFeedback={setFb}>
        <p>Carry-forward is capped at <strong>12 days</strong> a year<Cite n={1} href="#policy" title="Leave policy 2025" />, and anything above that lapses on 31 March<Cite n={2} href="#faq" title="Leave FAQ" />.</p>
        <p>Casual leave does not carry forward at all.</p>
      </AiMessage>
      <AiMessage role="assistant" streaming>Checking the policy for the part about encashment</AiMessage>
    </div>
  );
}
