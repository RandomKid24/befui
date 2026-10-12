import { Treemap } from '@/components/ui/treemap';

export default function TreemapDemo() {
  return (
    <Treemap
      className="w-[36rem] max-w-full"
      format={(n) => `₹${(n / 100000).toFixed(1)}L`}
      items={[
        { label: 'Engineering', value: 9000000 },
        { label: 'Sales', value: 5300000, color: 'text-success' },
        { label: 'Marketing', value: 3200000, color: 'text-warning' },
        { label: 'Operations', value: 2600000, color: 'text-info' },
        { label: 'People', value: 1500000 },
        { label: 'Finance', value: 1100000, color: 'text-success' },
        { label: 'Legal', value: 600000, color: 'text-warning' },
        { label: 'IT', value: 450000, color: 'text-info' },
      ]}
    />
  );
}
