import * as React from 'react';
import { Button } from '@/components/ui/button';
import { LiveChart } from '@/components/ui/live-chart';

export default function LiveChartDemo() {
  const [paused, setPaused] = React.useState(false);
  return (
    <div className="grid w-full max-w-lg gap-3">
      <div className="flex items-center justify-between"><span className="text-sm font-medium">Active users</span><Button size="xs" variant="outline" onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</Button></div>
      <LiveChart paused={paused} next={(p) => Math.max(10, Math.min(95, p + (Math.random() - 0.5) * 14))} />
    </div>
  );
}
