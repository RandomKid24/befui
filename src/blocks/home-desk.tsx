'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/charts';
import { FloatingShell, GlassPanel, glass } from '@/components/ui/floating-shell';
import { GridIcon, HomeIcon, LightbulbIcon, PowerIcon, ZapIcon } from '@/components/ui/icons';
import { RevealGroup } from '@/components/ui/reveal';
import { SmartHomeTiles, type HomeDevice } from '@/components/ui/smart-home-tiles';
import { cn } from '@/lib/utils';

// Demo data: swap for your hub's API.
const start: HomeDevice[] = [
  { id: 'l', name: 'Ceiling lights', room: 'Kitchen', on: true, level: { value: 80, min: 5, max: 100, unit: '%', label: 'brightness' } },
  { id: 'f', name: 'Fridge', room: 'Kitchen', on: true, level: { value: 3, min: 1, max: 8, unit: '°C', label: 'temperature' } },
  { id: 'a', name: 'Air conditioner', room: 'Bedroom', on: false, level: { value: 24, min: 16, max: 30, unit: '°C', label: 'temperature' } },
  { id: 'n', name: 'Night lamp', room: 'Bedroom', on: true, level: { value: 25, min: 5, max: 100, unit: '%', label: 'brightness' } },
  { id: 't', name: 'Television', room: 'Living room', on: false },
  { id: 'c', name: 'Door camera', room: 'Entrance', on: true },
];
const usage = [['Mon', 11.2], ['Tue', 9.8], ['Wed', 12.5], ['Thu', 10.1], ['Fri', 13.4], ['Sat', 15.2], ['Sun', 14.1]] as const;

export default function HomeDesk() {
  const [view, setView] = React.useState('home');
  const [devices, setDevices] = React.useState(start);
  const change = (next: HomeDevice) => setDevices((all) => all.map((d) => (d.id === next.id ? next : d)));
  const on = devices.filter((d) => d.on).length;
  const scenes: [string, string, (d: HomeDevice) => boolean][] = [
    ['Leaving home', 'Only the fridge and camera stay on', (d) => d.id === 'f' || d.id === 'c'],
    ['Movie night', 'Television and night lamp', (d) => ['t', 'n', 'f', 'c'].includes(d.id)],
    ['Good night', 'Lights off, air conditioner on', (d) => ['a', 'f', 'c'].includes(d.id)],
  ];
  const apply = (keep: (d: HomeDevice) => boolean) => setDevices((all) => all.map((d) => ({ ...d, on: keep(d) })));
  return (
    <FloatingShell
      className="[--primary:#0f766e] dark:[--primary:#5eead4] dark:[--primary-foreground:#042f2e]"
      brand={{ name: 'Hearth', tagline: 'Home control', mark: <HomeIcon /> }}
      value={view}
      onChange={setView}
      groups={[{ label: 'House', items: [{ id: 'home', label: 'Devices', icon: <GridIcon /> }, { id: 'scenes', label: 'Scenes', icon: <LightbulbIcon /> }, { id: 'energy', label: 'Energy', icon: <ZapIcon /> }] }]}
      actions={<Button size="sm" variant="outline" disabled={!on} onClick={() => apply(() => false)}><PowerIcon /> All off</Button>}
      footer={<><p className="text-xs text-muted-foreground">Running now</p><p className="text-lg font-semibold tabular-nums">{on} of {devices.length}</p></>}
    >
      {view === 'home' && <SmartHomeTiles className="max-w-none" devices={devices} onChange={change} />}
      {view === 'scenes' && (
        <RevealGroup className="grid gap-3 md:grid-cols-3">
          {scenes.map(([name, note, keep]) => {
            const active = devices.every((d) => d.on === keep(d));
            return <GlassPanel key={name} title={name} note={note} className={cn(active && 'bg-primary/15')}><Button className="w-full" variant={active ? 'secondary' : 'primary'} disabled={active} onClick={() => apply(keep)}>{active ? 'Active now' : 'Run scene'}</Button></GlassPanel>;
          })}
        </RevealGroup>
      )}
      {view === 'energy' && (
        <RevealGroup className="grid gap-3 lg:grid-cols-3 [&>:first-child]:lg:col-span-2">
          <GlassPanel title="Electricity this week" note="Units (kWh) a day" className="h-full"><BarChart height={220} data={usage.map(([label, value]) => ({ label, value }))} /></GlassPanel>
          <div className={cn(glass, 'h-full p-4')}><p className="text-xs text-muted-foreground">Week total</p><p className="text-4xl font-semibold tabular-nums">{usage.reduce((t, [, v]) => t + v, 0).toFixed(1)}</p><p className="text-sm text-muted-foreground">kWh</p></div>
        </RevealGroup>
      )}
    </FloatingShell>
  );
}
