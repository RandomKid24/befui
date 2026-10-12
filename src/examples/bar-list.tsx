import { BarList } from '@/components/ui/bar-list';

export default function BarListDemo() {
  return (
    <BarList
      className="w-full max-w-sm"
      items={[
        { label: '/pricing', value: 12840 },
        { label: '/docs/getting-started', value: 9210 },
        { label: '/blog/launch-notes', value: 5632 },
        { label: '/signup', value: 3120 },
        { label: '/changelog', value: 1480 },
      ]}
    />
  );
}
