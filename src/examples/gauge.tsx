import * as React from 'react';
import { Gauge } from '@/components/ui/gauge';
import { Slider } from '@/components/ui/slider';

export default function GaugeDemo() {
  const [v, setV] = React.useState(72);
  return (
    <div className="grid justify-items-center gap-4">
      <Gauge value={v} label="Team engagement" />
      <Slider aria-label="Gauge value" className="w-56" value={v} onValueChange={setV} showValue={false} />
    </div>
  );
}
