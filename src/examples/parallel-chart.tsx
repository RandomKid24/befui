import { ParallelChart } from '@/components/ui/parallel-chart';

/** Five measures per car in one chart. Each axis has its own scale (top = its max). */
export default function ParallelChartDemo() {
  return (
    <ParallelChart
      className="w-[36rem] max-w-full"
      axes={['Power (hp)', 'Range (km)', 'Price ($k)', 'Boot (L)', 'Safety']}
      rows={[
        { name: 'City', values: [110, 320, 24, 380, 4.6] },
        { name: 'Sport', values: [340, 410, 62, 280, 4.4] },
        { name: 'Family', values: [180, 520, 41, 620, 4.9] },
        { name: 'Budget', values: [90, 260, 18, 330, 4.1] },
        { name: 'Luxury', values: [290, 580, 88, 500, 4.8] },
      ]}
    />
  );
}
