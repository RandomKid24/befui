import { RangeGauge } from '@/components/ui/range-gauge';

/** Credit score: poor up to 580, fair to 670, good to 740, excellent to 850. */
export default function RangeGaugeDemo() {
  return (
    <RangeGauge
      min={300}
      value={712}
      label="Credit score"
      bands={[
        { to: 580, color: 'text-destructive', label: 'Poor' },
        { to: 670, color: 'text-warning', label: 'Fair' },
        { to: 740, color: 'text-info', label: 'Good' },
        { to: 850, color: 'text-success', label: 'Excellent' },
      ]}
    />
  );
}
