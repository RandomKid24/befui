import { WaterfallChart } from '@/components/ui/waterfall-chart';

export default function WaterfallChartDemo() {
  return (
    <WaterfallChart
      className="w-[36rem] max-w-full"
      format={(n) => `₹${n}L`}
      steps={[
        { label: 'Revenue', value: 120, total: true },
        { label: 'COGS', value: -42 },
        { label: 'Gross', value: 78, total: true },
        { label: 'Payroll', value: -31 },
        { label: 'Marketing', value: -12 },
        { label: 'Grants', value: 6 },
        { label: 'Tax', value: -9 },
        { label: 'Profit', value: 32, total: true },
      ]}
    />
  );
}
