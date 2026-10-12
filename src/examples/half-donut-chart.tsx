import { HalfDonutChart } from '@/components/ui/half-donut-chart';

export default function HalfDonutChartDemo() {
  return <HalfDonutChart max={200} format={(n) => `${n} GB`} data={[{ label: 'Documents', value: 62 }, { label: 'Photos', value: 48 }, { label: 'Backups', value: 31, color: 'text-warning' }]} />;
}
