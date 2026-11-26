'use client';

import * as React from 'react';
import { Button } from './button';
import { MinusIcon, PlusIcon } from './icons';
import { cn } from '@/lib/utils';

export interface VitalReading { label: string; value: string; unit?: string; /** Short context, like "Usual 60 to 100". */ note?: string }

/** Heart rate from real readings (newest last), other measurements, and a water counter. It shows data; it does not judge it. */
export function HealthVitals({ heartRate, readings, water, waterGoal = 8, onWaterChange, updatedAt, className }: {
  /** Heart rate readings in bpm, oldest first. Add to the array and the line moves. */
  heartRate: number[];
  readings: VitalReading[];
  water: number;
  waterGoal?: number;
  onWaterChange: (glasses: number) => void;
  /** When the newest reading was taken, as you want it shown. */
  updatedAt?: string;
  className?: string;
}) {
  const latest = heartRate[heartRate.length - 1];
  const low = Math.min(...heartRate);
  const high = Math.max(...heartRate);
  const points = heartRate.map((v, i) => `${(i / Math.max(1, heartRate.length - 1)) * 300},${72 - ((v - low) / (high - low || 1)) * 64}`).join(' ');
  return (
    <section aria-label="Health vitals" className={cn('w-full max-w-xl rounded-xl border bg-card', className)}>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold">Heart rate</h2>
          {updatedAt && <p className="text-xs text-muted-foreground">{updatedAt}</p>}
        </div>
        {latest === undefined ? (
          <p className="py-8 text-sm text-muted-foreground">No heart rate readings yet.</p>
        ) : (
          <>
            <p className="mt-1 tabular-nums"><span className="text-4xl font-semibold tracking-tight">{latest}</span> <span className="text-sm text-muted-foreground">bpm</span></p>
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="mt-3 h-20 w-full text-destructive" role="img" aria-label={`Last ${heartRate.length} heart rate readings, from ${low} to ${high} bpm`}>
              <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <p className="flex justify-between text-xs tabular-nums text-muted-foreground"><span>Low {low}</span><span>High {high}</span></p>
          </>
        )}
      </div>
      <dl className="divide-y border-t">
        {readings.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 px-5 py-2.5">
            <dt className="text-sm">{r.label}{r.note && <span className="block text-xs text-muted-foreground">{r.note}</span>}</dt>
            <dd className="whitespace-nowrap font-semibold tabular-nums">{r.value}{r.unit && <span className="ms-1 text-xs font-normal text-muted-foreground">{r.unit}</span>}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Water</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" aria-label="Remove a glass" disabled={water <= 0} onClick={() => onWaterChange(water - 1)}><MinusIcon /></Button>
            <p role="status" className="w-24 text-center text-sm tabular-nums">{water} of {waterGoal} glasses</p>
            <Button variant="outline" size="icon-sm" aria-label="Add a glass" onClick={() => onWaterChange(water + 1)}><PlusIcon /></Button>
          </div>
        </div>
        <div aria-hidden className="mt-3 flex gap-1">
          {Array.from({ length: waterGoal }, (_, i) => (
            <span key={i} className="relative h-8 flex-1 overflow-hidden rounded-sm border">
              <span className={cn('absolute inset-0 origin-bottom bg-info transition-transform duration-(--dur-base) motion-reduce:transition-none', i < water ? 'scale-y-100' : 'scale-y-0')} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
