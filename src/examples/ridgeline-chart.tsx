import { RidgelineChart } from '@/components/ui/ridgeline-chart';

export default function RidgelineChartDemo() {
  const hours = Array.from({ length: 24 }, (_, h) => `${h}h`);
  const peak = (center: number, width: number, height: number) => hours.map((_, h) => Math.round(height * Math.exp(-((h - center) ** 2) / (2 * width ** 2)) + 3));
  return (
    <RidgelineChart
      className="w-[38rem] max-w-full"
      labels={hours}
      series={[
        { name: 'Support', data: peak(11, 3, 60) },
        { name: 'Sales', data: peak(14, 2.5, 80) },
        { name: 'Engineering', data: peak(16, 4, 50) },
        { name: 'Ops', data: peak(21, 2, 70) },
      ]}
    />
  );
}
