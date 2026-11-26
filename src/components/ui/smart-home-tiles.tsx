'use client';

import * as React from 'react';
import { Slider } from './slider';
import { StretchNav } from './stretch-nav';
import { Switch } from './switch';
import { cn } from '@/lib/utils';

export interface HomeDevice {
  id: string;
  name: string;
  room: string;
  on: boolean;
  /** A dial for brightness, temperature, speed. Leave out for plain on or off. */
  level?: { value: number; min: number; max: number; step?: number; unit: string; label: string };
  /** Not reachable: controls are locked. */
  offline?: boolean;
}

/** Devices by room, each with a switch and, where it has one, a level you can set. */
export function SmartHomeTiles({ devices, onChange, className }: {
  devices: HomeDevice[];
  onChange: (device: HomeDevice) => void;
  className?: string;
}) {
  const [room, setRoom] = React.useState('');
  const rooms = [...new Set(devices.map((d) => d.room))];
  const active = rooms.includes(room) ? room : '';
  const shown = devices.filter((d) => !active || d.room === active);
  const running = shown.filter((d) => d.on && !d.offline).length;
  return (
    <section aria-label="Home devices" className={cn('grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] gap-3', className)}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <StretchNav label="Rooms" value={active} onChange={setRoom} items={[{ id: '', label: 'All rooms' }, ...rooms.map((r) => ({ id: r, label: r }))]} />
        <p role="status" className="text-sm text-muted-foreground">{running} of {shown.length} on</p>
      </div>
      <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
        {shown.map((d) => (
          <li key={d.id} className={cn('flex flex-col gap-3 p-4 transition-colors last:odd:sm:col-span-2', d.on && !d.offline ? 'bg-[color-mix(in_srgb,var(--primary)_10%,var(--card))]' : 'bg-card')}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{d.name}</h3>
                <p className="text-xs text-muted-foreground">{d.room}, {d.offline ? 'offline' : d.on ? 'on' : 'off'}</p>
              </div>
              <Switch aria-label={d.name} checked={d.on} disabled={d.offline} onCheckedChange={(on) => onChange({ ...d, on })} />
            </div>
            {d.level && (
              <div>
                <p className="tabular-nums"><span className={cn('text-3xl font-semibold tracking-tight', (!d.on || d.offline) && 'text-muted-foreground')}>{d.level.value}</span><span className="text-sm text-muted-foreground">{d.level.unit}</span></p>
                <Slider className="pt-1" showValue={false} aria-label={`${d.name} ${d.level.label}`} value={d.level.value} min={d.level.min} max={d.level.max} step={d.level.step} disabled={!d.on || d.offline} onValueChange={(value) => onChange({ ...d, level: { ...d.level!, value } })} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
