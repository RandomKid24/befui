import { AiMessage } from '@/components/ui/ai-message';

export default function Assistant() {
  return (
    <div className="grid w-full max-w-xl gap-6">
      <AiMessage role="user">How many leave days can I carry forward?</AiMessage>
      <AiMessage role="assistant" plain="Up to 12 days a year.">
        <p>You can carry forward up to <strong>12 days</strong> a year. Anything above that lapses on 31 March.</p>
      </AiMessage>
    </div>
  );
}
