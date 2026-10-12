import { ParetoChart } from '@/components/ui/pareto-chart';

export default function ParetoChartDemo() {
  return (
    <ParetoChart
      className="w-[36rem] max-w-full"
      items={[
        { label: 'Login', value: 142 }, { label: 'Billing', value: 96 }, { label: 'Slow', value: 61 }, { label: 'Export', value: 28 },
        { label: 'Mobile', value: 17 }, { label: 'Search', value: 11 }, { label: 'Other', value: 9 },
      ]}
    />
  );
}
