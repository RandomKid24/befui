import * as React from 'react';
import { ScatterChart, type ScatterPoint } from '@/components/ui/scatter-chart';

// Deterministic pseudo-random so the demo looks the same every time.
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

export default function ScatterChartDemo() {
  const points = React.useMemo<ScatterPoint[]>(() => Array.from({ length: 48 }, (_, i) => {
    const group = i % 3;
    const x = 10 + rnd(i) * 70 + group * 8;
    return { x: Math.round(x), y: Math.round(20 + x * (0.6 + group * 0.25) + rnd(i + 99) * 25), size: Math.round(20 + rnd(i + 7) * 180), group, label: `Account ${i + 1}` };
  }), []);
  return (
    <ScatterChart
      className="w-full max-w-xl"
      xLabel="Seats"
      yLabel="Monthly revenue (₹K)"
      groups={[{ name: 'Starter' }, { name: 'Pro' }, { name: 'Business' }]}
      points={points}
    />
  );
}
