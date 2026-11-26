import * as React from 'react';
import { SmartHomeTiles, type HomeDevice } from '@/components/ui/smart-home-tiles';

// Demo data
const start: HomeDevice[] = [
  { id: 'l', name: 'Ceiling lights', room: 'Kitchen', on: true, level: { value: 80, min: 5, max: 100, unit: '%', label: 'brightness' } },
  { id: 'f', name: 'Fridge', room: 'Kitchen', on: true, level: { value: 3, min: 1, max: 8, unit: '°C', label: 'temperature' } },
  { id: 'a', name: 'Air conditioner', room: 'Bedroom', on: false, level: { value: 24, min: 16, max: 30, unit: '°C', label: 'temperature' } },
  { id: 'd', name: 'Door camera', room: 'Entrance', on: true },
  { id: 'p', name: 'Garden pump', room: 'Entrance', on: false, offline: true },
];

export default function SmartHomeTilesDemo() {
  const [devices, setDevices] = React.useState(start);
  return <SmartHomeTiles devices={devices} onChange={(next) => setDevices((all) => all.map((d) => (d.id === next.id ? next : d)))} />;
}
