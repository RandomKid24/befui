import * as React from 'react';
import { HistogramChart } from '@/components/ui/histogram-chart';

// Deterministic pseudo-random bell-ish values so the demo looks the same every time.
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

export default function HistogramChartDemo() {
  const values = React.useMemo(() => Array.from({ length: 400 }, (_, i) => Math.round(2400 + (rnd(i) + rnd(i + 400) + rnd(i + 800) - 1.5) * 1900)), []);
  return <HistogramChart className="w-[36rem] max-w-full" values={values} bins={14} format={(n) => `₹${Math.round(n)}`} />;
}
