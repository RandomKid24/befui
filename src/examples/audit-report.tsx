import { AuditReport } from '@/components/ui/audit-report';

export default function AuditReportDemo() {
  return (
    <AuditReport
      className="w-[26rem] max-w-full"
      title="Access review"
      period="Admin console, October"
      status={{ text: '3 open', tone: 'bad' }}
      rows={[
        { title: 'Shared admin login still active', detail: 'Used by four people; no per-user trail.', tone: 'bad', where: 'auth/admin' },
        { title: 'Stale API keys', detail: '11 keys unused for over 180 days.', tone: 'warn', where: 'settings/keys' },
        { title: 'Audit log retention is 30 days', detail: 'Policy asks for 90.', tone: 'info' },
      ]}
    />
  );
}
