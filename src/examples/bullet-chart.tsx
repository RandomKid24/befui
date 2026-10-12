import { BulletChart } from '@/components/ui/bullet-chart';

export default function BulletChartDemo() {
  return (
    <BulletChart
      className="w-[34rem] max-w-full"
      rows={[
        { label: 'Revenue (₹L)', value: 72, target: 66, ranges: [40, 60, 90] },
        { label: 'New customers', value: 118, target: 150, ranges: [80, 120, 180] },
        { label: 'Uptime (%)', value: 99.94, target: 99.9, ranges: [99, 99.5, 100] },
        { label: 'NPS', value: 41, target: 50, ranges: [20, 40, 70] },
      ]}
    />
  );
}
