import * as React from 'react';
import { Slider } from '@/components/ui/slider';

export default function SliderDemo() {
  const [v, setV] = React.useState(40);
  return (
    <div className="w-72">
      <div className="mb-1 flex justify-between text-sm"><span className="font-medium">Monthly budget</span><span className="tabular-nums text-muted-foreground">₹{v}k</span></div>
      <Slider aria-label="Budget" value={v} onValueChange={setV} min={10} max={100} step={5} format={(n) => `₹${n}k`} />
    </div>
  );
}
