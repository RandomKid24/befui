import * as React from 'react';
import { RangeSlider } from '@/components/ui/range-slider';

export default function RangeSliderDemo() {
  const [v, setV] = React.useState<[number, number]>([20, 70]);
  return <RangeSlider className="w-80" value={v} onValueChange={setV} format={(n) => `₹${n}k`} />;
}
