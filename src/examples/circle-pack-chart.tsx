import { CirclePackChart } from '@/components/ui/circle-pack-chart';

export default function CirclePackChartDemo() {
  return (
    <CirclePackChart
      className="w-[34rem] max-w-full"
      items={[
        { label: 'India', value: 4200 }, { label: 'USA', value: 2600 }, { label: 'UAE', value: 1500 }, { label: 'UK', value: 1200 },
        { label: 'Germany', value: 800 }, { label: 'Singapore', value: 700 }, { label: 'Canada', value: 520 }, { label: 'Brazil', value: 380 },
        { label: 'Japan', value: 300 }, { label: 'Kenya', value: 160 }, { label: 'Chile', value: 90 },
      ]}
    />
  );
}
