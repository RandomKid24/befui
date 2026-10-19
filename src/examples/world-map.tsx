import { useState } from 'react';
import { Segmented } from '@/components/ui/segmented';
import { WorldMap } from '@/components/ui/world-map';

const data = [
  { id: 'India', value: 1240 },
  { id: 'United States of America', value: 980 },
  { id: 'Brazil', value: 410 },
  { id: 'Germany', value: 360 },
  { id: 'United Kingdom', value: 330 },
  { id: 'Nigeria', value: 190 },
  { id: 'Australia', value: 170 },
  { id: 'Japan', value: 260 },
  { id: 'Canada', value: 220 },
  { id: 'South Africa', value: 120 },
  { id: 'Indonesia', value: 150 },
];

export default function WorldMapDemo() {
  const [view, setView] = useState<'flat' | 'globe'>('flat');
  const [marker, setMarker] = useState<'bar' | 'pin'>('bar');
  return (
    <div className="grid w-full gap-4">
      <div className="flex flex-wrap gap-2">
        <Segmented value={view} onValueChange={setView} options={[{ value: 'flat', label: 'Map' }, { value: 'globe', label: 'Globe' }]} />
        <Segmented value={marker} onValueChange={setMarker} options={[{ value: 'bar', label: 'Bars' }, { value: 'pin', label: 'Pins' }]} />
      </div>
      <WorldMap data={data} projection={view} marker={marker} format={(n) => `${n.toLocaleString('en-IN')} users`} />
    </div>
  );
}
