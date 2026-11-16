import { IncidentReport } from '@/components/ui/incident-report';

export default function IncidentReportDemo() {
  return (
    <IncidentReport
      organization="Kiran Foods Pvt Ltd"
      title="Checkout returned errors"
      period="12 November 2026"
      number="INC-218"
      generated="14 Nov 2026"
      severity="SEV2"
      facts={[
        { label: 'Duration', value: '45 minutes' },
        { label: 'Detected by', value: 'Error rate alert' },
        { label: 'Incident lead', value: 'Imran Shaikh' },
      ]}
      impact="About 8% of card payments failed between 14:02 and 14:47 UTC. No orders were lost; most customers retried and paid."
      cause="A config change lowered the database connection pool limit. Under evening traffic the pool ran out and requests timed out. The change was reviewed but the limit was not part of the review checklist."
      timeline={[
        { time: '14:02', text: 'Error rate alert fires and the on-call engineer is paged.' },
        { time: '14:11', text: 'Last deploy rolled back. Errors continue.' },
        { time: '14:19', text: 'Pool exhaustion found in the database metrics.' },
        { time: '14:47', text: 'Pool limit restored and errors return to normal.' },
      ]}
      actions={[
        { action: 'Add pool limits to the config review checklist', owner: 'Imran Shaikh', due: '20 Nov', done: true },
        { action: 'Alert on pool usage above 80%', owner: 'Meera Joshi', due: '27 Nov' },
        { action: 'Load test checkout at twice evening peak', owner: 'Rohan Desai', due: '4 Dec' },
      ]}
    />
  );
}
