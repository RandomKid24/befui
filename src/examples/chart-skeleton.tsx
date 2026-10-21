import { ChartSkeleton } from '@/components/ui/chart-skeleton';

export default function ChartSkeletonDemo() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <ChartSkeleton variant="bar" />
      <ChartSkeleton variant="line" />
      <ChartSkeleton variant="pie" />
      <ChartSkeleton variant="table" />
    </div>
  );
}
