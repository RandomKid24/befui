import { IncidentReport } from '@/components/ui/incident-report';

export default function IncidentReportDemo() {
  return (
    <IncidentReport
      className="w-[26rem] max-w-full"
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
  );
}
