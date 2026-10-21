import { KpiStrip } from '@/components/ui/kpi-strip';

export default function KpiStripDemo() {
  return (
    <KpiStrip
      className="w-[44rem] max-w-full"
      items={[
        { label: 'Revenue', value: '₹48.2L', delta: 12.5, hint: 'vs last month' },
        { label: 'Active users', value: '8,420', delta: 4.1 },
        { label: 'Churn', value: '2.3%', delta: -0.6, inverse: true },
        { label: 'Open tickets', value: '64', delta: 9.0, inverse: true },
      ]}
    />
  );
}
