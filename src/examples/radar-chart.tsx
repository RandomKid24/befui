import { RadarChart } from '@/components/ui/radar-chart';

/** Five axes make a pentagon; add or remove an axis and the shape follows. */
export default function RadarChartDemo() {
  return (
    <RadarChart
      axes={['Delivery', 'Quality', 'Communication', 'Ownership', 'Teamwork']}
      series={[
        { name: 'Aarav', values: [88, 82, 70, 90, 76] },
        { name: 'Team average', values: [72, 74, 78, 68, 80] },
      ]}
    />
  );
}
