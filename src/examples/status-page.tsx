import { StatusPage } from '@/components/ui/status-page';
import type { UptimeDay } from '@/components/ui/uptime-bar';

const days = (bad: Record<number, UptimeDay['status']>, notes: Record<number, string> = {}): UptimeDay[] =>
  Array.from({ length: 60 }, (_, i) => ({ date: `Day ${i - 59}`, status: bad[i] ?? 'up', note: notes[i] }));

export default function StatusPageDemo() {
  return (
    <StatusPage
      className="w-[42rem] max-w-full"
      title="Acme status"
      services={[
        { name: 'API', description: 'REST and GraphQL', days: days({ 22: 'degraded', 41: 'down' }, { 22: 'Elevated latency', 41: 'Database failover' }) },
        { name: 'Dashboard', days: days({ 41: 'degraded' }, { 41: 'Slow loads during failover' }) },
        { name: 'Webhooks', days: days({ 59: 'degraded' }, { 59: 'Delayed deliveries' }) },
      ]}
      incidents={[
        { id: 'i1', title: 'Delayed webhook deliveries', state: 'monitoring', updates: [{ time: '2 days ago, 10:40', text: 'A fix is in place. We are watching the queue drain.' }, { time: '2 days ago, 09:55', text: 'Webhook deliveries are delayed by up to 20 minutes.' }] },
        { id: 'i2', title: 'Database failover', state: 'resolved', updates: [{ time: '18 days ago, 14:20', text: 'Resolved. All services are back to normal.' }, { time: '18 days ago, 13:42', text: 'The primary database failed over. API requests are failing.' }] },
      ]}
    />
  );
}
