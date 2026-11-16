'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabResult {
  name: string;
  value: number;
  unit: string;
  /** Reference range. */
  low: number;
  high: number;
  group?: string;
}
export interface LabReportProps {
  lab: string;
  title?: string;
  patient: { name: string; age: string; sex: string; id: string };
  sample: { collected: string; reported: string; doctor?: string; type?: string };
  results: LabResult[];
  note?: string;
  className?: string;
}

/**
 * Laboratory result report. Every row draws its reference range as a track with the patient's value as a marker on it,
 * so out-of-range results are visible without reading the numbers. Rows are grouped, and the flag (H or L) is worked out from the range.
 */
export function LabReport({ lab, title = 'Laboratory report', patient, sample, results, note, className }: LabReportProps) {
  const flag = (r: LabResult) => (r.value > r.high ? 'H' : r.value < r.low ? 'L' : '');
  const out = results.filter((r) => flag(r)).length;
  const groups = [...new Set(results.map((r) => r.group ?? 'Results'))];
  return (
    <article className={cn('mx-auto w-full max-w-3xl overflow-hidden rounded-sm border border-foreground/30 bg-card text-sm text-card-foreground print:border-0', className)}>
      <header className="flex items-center justify-between gap-4 bg-foreground px-6 py-3 text-background">
        <p className="text-base font-semibold tracking-tight">{lab}</p>
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">{title}</p>
      </header>
      <dl className="grid grid-cols-2 border-b text-[13px] sm:grid-cols-4">
        {[['Patient', patient.name], ['Age and sex', `${patient.age}, ${patient.sex}`], ['Patient ID', patient.id], ['Doctor', sample.doctor ?? '-'], ['Collected', sample.collected], ['Reported', sample.reported], ['Sample', sample.type ?? 'Blood'], ['Out of range', `${out} of ${results.length}`]].map(([k, v], i) => (
          <div key={k} className={cn('border-b px-6 py-2.5 sm:border-e sm:last:border-e-0 sm:[&:nth-child(4)]:border-e-0', i > 3 && 'border-b-0')}>
            <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
            <dd className={cn('mt-0.5 font-medium', k === 'Out of range' && out > 0 && 'text-destructive')}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="px-6 py-5">
        {groups.map((g) => (
          <section key={g} className="mb-6 last:mb-0">
            <h3 className="mb-1 border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-widest">{g}</h3>
            <ul>
              {results.filter((r) => (r.group ?? 'Results') === g).map((r) => {
                const span = r.high - r.low;
                const lo = r.low - span * 0.7, hi = r.high + span * 0.7;
                const pos = (v: number) => Math.min(Math.max(((v - lo) / (hi - lo)) * 100, 1.5), 98.5);
                const f = flag(r);
                return (
                  <li key={r.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-dashed py-2.5 sm:grid-cols-[11rem_6.5rem_1fr_6.5rem]">
                    <span className="font-medium">{r.name}</span>
                    <span className={cn('text-end font-mono tabular-nums sm:order-none', f ? 'font-bold text-destructive' : '')}>{r.value} <span className="text-[11px] font-normal text-muted-foreground">{r.unit}</span>{f && <span className="ms-1.5 text-xs">{f}</span>}</span>
                    <div role="img" aria-label={`${r.value} ${r.unit}, reference ${r.low} to ${r.high}`} className="relative col-span-2 h-4 sm:col-span-1">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                      <div className="absolute top-1/2 h-2 -translate-y-1/2 bg-success/25" style={{ left: `${pos(r.low)}%`, width: `${pos(r.high) - pos(r.low)}%` }} />
                      <div className={cn('absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45', f ? 'bg-destructive' : 'bg-foreground')} style={{ left: `${pos(r.value)}%` }} />
                    </div>
                    <span className="hidden text-end font-mono text-xs text-muted-foreground sm:block">{r.low} to {r.high}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {note && <p className="mt-4 max-w-prose text-xs leading-relaxed text-muted-foreground">{note}</p>}
      </div>
      <footer className="flex justify-between border-t px-6 py-2.5 text-[11px] text-muted-foreground"><span>H high, L low. Shaded band is the reference range.</span><span>End of report</span></footer>
    </article>
  );
}
