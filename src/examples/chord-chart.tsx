import { ChordChart } from '@/components/ui/chord-chart';

export default function ChordChartDemo() {
  return (
    <ChordChart
      size={340}
      labels={['Pune', 'Mumbai', 'Delhi', 'Bengaluru', 'Chennai']}
      matrix={[
        [0, 120, 40, 60, 20],
        [110, 0, 70, 50, 30],
        [30, 80, 0, 90, 25],
        [70, 40, 100, 0, 85],
        [15, 35, 20, 95, 0],
      ]}
    />
  );
}
