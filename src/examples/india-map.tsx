import { useState } from 'react';
import { IndiaMap } from '@/components/ui/india-map';
import { Segmented } from '@/components/ui/segmented';

const data = [
  { id: 'M1', label: 'M1 (Maharashtra + Goa)', value: 19280 },
  { id: 'South', value: 34210 },
  { id: 'Delhi', value: 11380 },
  { id: 'Gujarat', value: 8240 },
  { id: 'Uttar Pradesh', value: 7610 },
  { id: 'West Bengal', value: 4120 },
  { id: 'Rajasthan', value: 3560 },
  { id: 'Punjab', value: 2480 },
  { id: 'Assam', value: 1390 },
];

// Merge states into your own regions: the region name is what you use as `id` in the data.
const groups = {
  M1: ['Maharashtra', 'Goa'],
  South: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Telangana', 'Andhra Pradesh'],
};

export default function IndiaMapDemo() {
  const [marker, setMarker] = useState<'bar' | 'pin'>('bar');
  return (
    <div className="grid w-full gap-4">
      <Segmented value={marker} onValueChange={setMarker} options={[{ value: 'bar', label: 'Bars' }, { value: 'pin', label: 'Pins' }]} className="justify-self-start" />
      <IndiaMap data={data} groups={groups} marker={marker} format={(n) => `${n.toLocaleString('en-IN')} orders`} />
    </div>
  );
}
