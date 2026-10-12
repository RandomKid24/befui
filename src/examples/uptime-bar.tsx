import { UptimeBar, type UptimeDay } from '@/components/ui/uptime-bar';

const days = (bad: Record<number, UptimeDay['status']>): UptimeDay[] => Array.from({ length: 60 }, (_, i) => ({ date: `${60 - i} days ago`, status: bad[i] ?? 'up', note: bad[i] === 'down' ? 'Outage: database failover took 22 minutes' : bad[i] === 'degraded' ? 'Slow responses for some users' : undefined }));

export default function UptimeBarDemo() {
  return (
    <div className="grid w-[36rem] max-w-full gap-6">
      <UptimeBar name="API" days={days({ 14: 'degraded', 41: 'down' })} />
      <UptimeBar name="Dashboard" days={days({ 22: 'degraded', 23: 'degraded', 58: 'degraded' })} />
      <UptimeBar name="Webhooks" days={days({})} />
    </div>
  );
}
