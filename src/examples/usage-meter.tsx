import { UsageMeter } from '@/components/ui/usage-meter';

export default function UsageMeterDemo() {
  return (
    <UsageMeter
      className="w-96 max-w-full"
      items={[
        { label: 'API calls', used: 412000, limit: 1000000 },
        { label: 'Storage', used: 83, limit: 100, unit: 'GB' },
        { label: 'Team seats', used: 12, limit: 10, overage: 5 },
        { label: 'Bandwidth', used: 2.4, unit: 'TB' },
      ]}
    />
  );
}
