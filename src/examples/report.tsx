import { Report } from '@/components/ui/report';

export default function ReportDemo() {
  return (
    <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-2">
      <Report
        kind="incident"
        title="Checkout API returned 502s"
        period="12 Nov 2026, 14:02 to 14:47 UTC"
        status={{ text: 'Resolved', tone: 'ok' }}
        impact="About 8% of card payments failed for 45 minutes."
        cause="A connection pool limit was lowered in a config change and never raised back."
        timeline={[
          { time: '14:02', text: 'Error rate alert fires.' },
          { time: '14:19', text: 'Last deploy ruled out; pool exhaustion found.' },
          { time: '14:47', text: 'Limit restored, errors back to normal.' },
        ]}
      />
      <Report
        kind="metrics"
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
      <Report
        kind="progress"
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
      <Report
        kind="findings"
        title="Access review"
        period="Admin console, October"
        status={{ text: '3 open', tone: 'bad' }}
        rows={[
          { title: 'Shared admin login still active', detail: 'Used by four people; no per-user trail.', tone: 'bad', where: 'auth/admin' },
          { title: 'Stale API keys', detail: '11 keys unused for over 180 days.', tone: 'warn', where: 'settings/keys' },
          { title: 'Audit log retention is 30 days', detail: 'Policy asks for 90.', tone: 'info' },
        ]}
      />
    </div>
  );
}
