import { TokenMeter } from '@/components/ui/token-meter';

export default function TokenMeterDemo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <TokenMeter used={18_400} limit={200_000} cost="$0.04" />
      <TokenMeter used={152_000} limit={200_000} />
      <TokenMeter used={196_500} limit={200_000} />
      <TokenMeter used={88_000} limit={200_000} segments={[{ label: 'Prompt', tokens: 12_000 }, { label: 'Files', tokens: 61_000 }, { label: 'Reply', tokens: 15_000 }]} />
    </div>
  );
}
