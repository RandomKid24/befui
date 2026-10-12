import { ButterflyChart } from '@/components/ui/butterfly-chart';

export default function ButterflyChartDemo() {
  return (
    <ButterflyChart
      className="w-[36rem] max-w-full"
      leftLabel="Mobile"
      rightLabel="Desktop"
      rows={[
        { label: 'Home', left: 5200, right: 3100 }, { label: 'Pricing', left: 3400, right: 4200 }, { label: 'Docs', left: 1800, right: 5600 },
        { label: 'Blog', left: 4100, right: 2300 }, { label: 'Signup', left: 2600, right: 2900 }, { label: 'Settings', left: 700, right: 1900 },
      ]}
    />
  );
}
