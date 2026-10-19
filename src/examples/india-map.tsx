import { useState } from 'react';
import { IndiaMap } from '@/components/ui/india-map';
import { Segmented } from '@/components/ui/segmented';

const data = [
  { id: 'Maharashtra', value: 18420 },
  { id: 'Karnataka', value: 14210 },
  { id: 'Delhi', value: 11380 },
  { id: 'Tamil Nadu', value: 9860 },
  { id: 'Gujarat', value: 8240 },
  { id: 'Uttar Pradesh', value: 7610 },
  { id: 'Telangana', value: 6930 },
  { id: 'West Bengal', value: 4120 },
  { id: 'Rajasthan', value: 3560 },
  { id: 'Kerala', value: 3210 },
  { id: 'Punjab', value: 2480 },
  { id: 'Assam', value: 1390 },
  { id: 'Goa', value: 860 },
];

export default function IndiaMapDemo() {
  const [marker, setMarker] = useState<'bar' | 'pin'>('bar');
  return (
    <div className="grid w-full gap-4">
      <Segmented value={marker} onValueChange={setMarker} options={[{ value: 'bar', label: 'Bars' }, { value: 'pin', label: 'Pins' }]} className="justify-self-start" />
      <IndiaMap data={data} marker={marker} format={(n) => `${n.toLocaleString('en-IN')} orders`} />
    </div>
  );
}
