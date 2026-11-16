import { MetricsReport } from '@/components/ui/metrics-report';

export default function MetricsReportDemo() {
  return (
    <MetricsReport
      className="w-[26rem] max-w-full"
      title="Weekly product metrics"
      period="9 to 15 Nov 2026"
      status={{ text: 'On track', tone: 'ok' }}
      rows={[
        { label: 'Active users', value: '48,210', change: 6.4 },
        { label: 'Conversion', value: '3.8%', change: -0.9 },
        { label: 'Error rate', value: '0.42%', change: -18, lowerIsBetter: true },
        { label: 'Support tickets', value: '312', change: 11, lowerIsBetter: true },
      ]}
    />
  );
}
