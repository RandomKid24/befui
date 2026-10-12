import * as React from 'react';
import { AreaChart } from '@/components/ui/area-chart';
import { Segmented } from '@/components/ui/segmented';

export default function AreaChartDemo() {
  const [mode, setMode] = React.useState<'stacked' | 'overlap'>('stacked');
  return (
    <div className="grid w-full max-w-xl gap-4">
      <Segmented value={mode} onValueChange={setMode} options={[{ value: 'stacked', label: 'Stacked' }, { value: 'overlap', label: 'Overlap' }]} className="justify-self-start" />
      <AreaChart
        stacked={mode === 'stacked'}
        labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']}
        format={(n) => `${n}K`}
        series={[
          { name: 'Organic', data: [12, 14, 13, 18, 21, 24, 27] },
          { name: 'Paid', data: [6, 8, 9, 10, 12, 11, 14] },
          { name: 'Referral', data: [3, 3, 4, 5, 6, 8, 9] },
        ]}
      />
    </div>
  );
}
