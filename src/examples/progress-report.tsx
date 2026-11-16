import { ProgressReport } from '@/components/ui/progress-report';

export default function ProgressReportDemo() {
  return (
    <ProgressReport
      className="w-[26rem] max-w-full"
      title="Q4 launch"
      period="Week 7 of 10"
      status={{ text: '1 at risk', tone: 'warn' }}
      rows={[
        { label: 'Design', percent: 100 },
        { label: 'Backend', percent: 72, note: 'Waiting on payment sandbox access.', tone: 'warn' },
        { label: 'Mobile apps', percent: 45 },
        { label: 'Docs', percent: 20 },
      ]}
    />
  );
}
