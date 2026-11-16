'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ReportSection, ReportView, rv } from './report-view';

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
 * Laboratory result report. One table per group: the result, then its reference range drawn as a track with the value as a marker,
 * so out-of-range results are visible without reading the numbers. The H or L flag is worked out from the range.
 */
export function LabReport({ lab, title = 'Laboratory report', patient, sample, results, note, className }: LabReportProps) {
  const flag = (r: LabResult) => (r.value > r.high ? 'H' : r.value < r.low ? 'L' : '');
  const out = results.filter((r) => flag(r)).length;
  const groups = [...new Set(results.map((r) => r.group ?? 'Results'))];
  return (
    <ReportView
      organization={lab} title={title} period={`Reported ${sample.reported}`} className={className}
      footer="H high, L low. Shaded band is the reference range."
      stats={[
        { label: 'Patient', value: <span className="text-sm">{patient.name}</span>, hint: `${patient.age}, ${patient.sex} · ${patient.id}` },
        { label: 'Sample', value: <span className="text-sm">{sample.type ?? 'Blood'}</span>, hint: `Collected ${sample.collected}` },
        { label: 'Doctor', value: <span className="text-sm">{sample.doctor ?? '-'}</span> },
        { label: 'Out of range', value: out, tone: out ? 'bad' : 'good', hint: `of ${results.length} tests` },
      ]}
    >
      {groups.map((g) => (
        <ReportSection key={g} flush title={g}>
          <Table className="table-fixed">
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead className={cn(rv.th, 'w-[30%]')}>Test</TableHead><TableHead className={cn(rv.th, 'w-[22%] text-end')}>Result</TableHead><TableHead className={cn(rv.th, 'hidden sm:table-cell')}>Range</TableHead><TableHead className={cn(rv.th, 'hidden w-[18%] text-end sm:table-cell')}>Reference</TableHead></TableRow></TableHeader>
            <TableBody>
              {results.filter((r) => (r.group ?? 'Results') === g).map((r) => {
                const span = r.high - r.low;
                const lo = r.low - span * 0.7, hi = r.high + span * 0.7;
                const pos = (v: number) => Math.min(Math.max(((v - lo) / (hi - lo)) * 100, 1.5), 98.5);
                const f = flag(r);
                return (
                  <TableRow key={r.name}>
                    <TableCell className={cn(rv.td, 'font-medium')}>{r.name}</TableCell>
                    <TableCell className={cn(rv.td, rv.num, f && 'font-semibold text-destructive')}>{r.value} <span className="text-[11px] font-normal text-muted-foreground">{r.unit}</span>{f && <span className="ms-1.5 rounded bg-destructive/10 px-1 text-[11px] font-bold">{f}</span>}</TableCell>
                    <TableCell className={cn(rv.td, 'hidden sm:table-cell')}>
                      <div role="img" aria-label={`${r.value} ${r.unit}, reference ${r.low} to ${r.high}`} className="relative h-4">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                        <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-success/25" style={{ left: `${pos(r.low)}%`, width: `${pos(r.high) - pos(r.low)}%` }} />
                        <div className={cn('absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full', f ? 'bg-destructive' : 'bg-foreground')} style={{ left: `${pos(r.value)}%` }} />
                      </div>
                    </TableCell>
                    <TableCell className={cn(rv.td, rv.num, 'hidden font-mono text-xs text-muted-foreground sm:table-cell')}>{r.low} to {r.high}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ReportSection>
      ))}
      {note && <ReportSection title="Note"><p className="max-w-prose leading-relaxed text-muted-foreground">{note}</p></ReportSection>}
    </ReportView>
  );
}
