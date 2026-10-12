import { BumpChart } from '@/components/ui/bump-chart';

export default function BumpChartDemo() {
  return (
    <BumpChart
      className="w-[38rem] max-w-full"
      labels={['Jun', 'Jul', 'Aug', 'Sep', 'Oct']}
      series={[
        { name: 'Pune', ranks: [1, 1, 2, 3, 2] },
        { name: 'Mumbai', ranks: [2, 3, 1, 1, 1] },
        { name: 'Delhi', ranks: [3, 2, 3, 2, 3] },
        { name: 'Bengaluru', ranks: [4, 4, 4, 4, 4] },
      ]}
    />
  );
}
