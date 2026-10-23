import { TokenUsageChart } from '@/components/ui/token-usage-chart';

export default function TokenUsageChartDemo() {
  return (
    <TokenUsageChart
      className="w-[36rem] max-w-full"
      days={[
        { label: 'Mon', input: 820000, output: 210000, cached: 400000 },
        { label: 'Tue', input: 940000, output: 260000, cached: 520000 },
        { label: 'Wed', input: 760000, output: 190000, cached: 610000 },
        { label: 'Thu', input: 1210000, output: 340000, cached: 480000 },
        { label: 'Fri', input: 1100000, output: 300000, cached: 700000 },
        { label: 'Sat', input: 380000, output: 90000, cached: 150000 },
        { label: 'Sun', input: 290000, output: 70000, cached: 120000 },
      ]}
    />
  );
}
