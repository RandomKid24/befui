'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CapsuleBars, DeskHeader, StatTile, TickDial } from '@/components/ui/desk-kit';
import { FloatingShell, GlassPanel, glass } from '@/components/ui/floating-shell';
import { GridIcon, HomeIcon, LightbulbIcon, MinusIcon, PlusIcon, PowerIcon, ZapIcon } from '@/components/ui/icons';
import { RevealGroup } from '@/components/ui/reveal';
import { SmartHomeTiles, type HomeDevice } from '@/components/ui/smart-home-tiles';
import { Toaster, toast } from '@/components/ui/toast';
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
  const apply = (name: string, keep: (d: HomeDevice) => boolean) => {
    const before = devices;
    setDevices(devices.map((d) => ({ ...d, on: keep(d) })));
    toast.success(name, undefined, { action: { label: 'Undo', onClick: () => setDevices(before) } });
  };
  const ac = devices.find((d) => d.id === 'a')!;
  const heat = ac.level!;
  const setHeat = (value: number) => change({ ...ac, level: { ...heat, value } });
  return (
    <>
    <Toaster />
    <FloatingShell
      user={{ name: 'Noor Khan', role: 'Admin' }}
      brand={{ name: 'Hearth', tagline: 'Home control', mark: <HomeIcon /> }}
      value={view}
      onChange={setView}
      groups={[{ label: 'House', items: [{ id: 'home', label: 'Devices', icon: <GridIcon /> }, { id: 'scenes', label: 'Scenes', icon: <LightbulbIcon /> }, { id: 'energy', label: 'Energy', icon: <ZapIcon /> }] }]}
      actions={<Button size="sm" variant="outline" disabled={!on} onClick={() => apply('Everything is off', () => false)}><PowerIcon /> All off</Button>}
    >
      {view === 'home' && (
        <>
          <DeskHeader title="Good evening, Noor" summary={`${on} of ${devices.length} devices are on`} />
          <RevealGroup className="grid gap-3 lg:grid-cols-3">
            <GlassPanel title="Bedroom climate" note={ac.on ? 'Cooling to target' : 'Air conditioner is off'} className="h-full">
              <TickDial size={180} min={heat.min} max={heat.max} value={heat.value} label="target °C" />
              <div className="mt-2 flex justify-center gap-2">
                <Button variant="outline" size="icon" aria-label="One degree cooler" disabled={!ac.on || heat.value <= heat.min} onClick={() => setHeat(heat.value - 1)}><MinusIcon /></Button>
                {!ac.on && <Button onClick={() => change({ ...ac, on: true })}>Turn on</Button>}
                <Button variant="outline" size="icon" aria-label="One degree warmer" disabled={!ac.on || heat.value >= heat.max} onClick={() => setHeat(heat.value + 1)}><PlusIcon /></Button>
              </div>
            </GlassPanel>
            <GlassPanel title="Electricity this week" note="Units (kWh) a day" className="h-full"><CapsuleBars height={240} label="Electricity used each day in kWh" format={(n) => `${n} kWh`} data={usage.map(([label, value]) => ({ label, value }))} /></GlassPanel>
            <div className="grid gap-3">
              <StatTile hero label="Running now" value={`${on} devices`} note="Across the house" />
              <StatTile label="Used today" value={`${usage[usage.length - 1][1]} kWh`} trend={usage.map(([, v]) => v)} />
            </div>
          </RevealGroup>
          <SmartHomeTiles className={cn(glass, 'max-w-none p-3')} devices={devices} onChange={change} />
        </>
      )}
      {view === 'scenes' && (
        <RevealGroup className="grid gap-3 md:grid-cols-3">
          {scenes.map(([name, note, keep]) => {
            const active = devices.every((d) => d.on === keep(d));
            return <GlassPanel key={name} title={name} note={note} className={cn(active && 'bg-primary/15')}><Button className="w-full" variant={active ? 'secondary' : 'primary'} disabled={active} onClick={() => apply(`${name} is on`, keep)}>{active ? 'Active now' : 'Run scene'}</Button></GlassPanel>;
          })}
        </RevealGroup>
      )}
      {view === 'energy' && (
        <RevealGroup className="grid gap-3 lg:grid-cols-3 [&>:first-child]:lg:col-span-2">
          <GlassPanel title="Electricity this week" note="Units (kWh) a day" className="h-full"><CapsuleBars height={280} label="Electricity used each day in kWh" format={(n) => `${n} kWh`} data={usage.map(([label, value]) => ({ label, value }))} /></GlassPanel>
          <div className={cn(glass, 'h-full p-4')}><p className="text-xs text-muted-foreground">Week total</p><p className="text-4xl font-semibold tabular-nums">{usage.reduce((t, [, v]) => t + v, 0).toFixed(1)}</p><p className="text-sm text-muted-foreground">kWh</p></div>
        </RevealGroup>
      )}
    </FloatingShell>
    </>
  );
}
