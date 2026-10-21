import { FunnelChart } from '@/components/ui/funnel-chart';

export default function FunnelChartDemo() {
  return <FunnelChart className="max-w-xl" dropoff stages={[{ label: 'Visitors', value: 48200 }, { label: 'Sign-ups', value: 9640 }, { label: 'Qualified', value: 3120 }, { label: 'Demo booked', value: 1210 }, { label: 'Won', value: 340 }]} />;
}
