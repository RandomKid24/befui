import { ComboChart } from '@/components/ui/combo-chart';

/** Bars stacked (remove `stacked` for side by side) and smooth lines on one chart. The conversion line uses the right-hand scale. */
export default function ComboChartDemo() {
  return (
    <ComboChart
      className="w-[38rem] max-w-full"
      stacked
      labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
      format={(n) => `$${n}k`}
      formatRight={(n) => `${n}%`}
      series={[
        { name: 'Revenue', type: 'bar', data: [42, 48, 45, 58, 63, 60, 72, 78, 85] },
        { name: 'Costs', type: 'bar', data: [30, 33, 35, 38, 41, 44, 46, 49, 52], color: 'text-destructive' },
        { name: 'Target', type: 'area', data: [70, 78, 84, 92, 100, 106, 114, 122, 130], color: 'text-warning' },
        { name: 'Conversion', type: 'line', axis: 'right', data: [2.1, 2.4, 2.2, 2.9, 3.1, 3, 3.6, 3.9, 4.3], color: 'text-success' },
      ]}
    />
  );
}
