import { PieChart } from '@/components/ui/pie-chart';

export default function PieChartDemo() {
  return (
    <PieChart
      className="w-[32rem] max-w-full"
      format={(n) => `₹${n}L`}
      data={[{ label: 'Pro plan', value: 48 }, { label: 'Business', value: 31 }, { label: 'Starter', value: 14, color: 'text-warning' }, { label: 'Add-ons', value: 7, color: 'text-info' }]}
    />
  );
}
