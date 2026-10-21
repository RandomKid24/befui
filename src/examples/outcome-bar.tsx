import { OutcomeBar } from '@/components/ui/outcome-bar';

/** 4 won, 17 lost, 51 still open: the headline is won out of closed (19%). */
export default function OutcomeBarDemo() {
  return (
    <OutcomeBar
      className="w-[26rem] max-w-full"
      headlineLabel="conversion"
      segments={[{ label: 'Won', value: 4 }, { label: 'Lost', value: 17 }]}
      ghost={{ label: 'Open', value: 51 }}
    />
  );
}
