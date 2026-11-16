'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';
import { ReportView, rv, type ReportMeta } from './report-view';

export interface AttendanceRow {
  name: string;
  role?: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  /** Total hours worked. */
  hours: number;
}
export interface AttendanceReportProps extends ReportMeta {
  rows: AttendanceRow[];
  /** Working days in the period, to work out attendance percent. */
  workingDays: number;
}

/** Monthly attendance report: headline attendance and absences, then one row per person with present, absent, late, leave, hours and an attendance percent that turns red under 90. */
export function AttendanceReport({ rows, workingDays, ...meta }: AttendanceReportProps) {
  const t = (k: keyof AttendanceRow) => rows.reduce((s, r) => s + (r[k] as number), 0);
  const pct = (r: { present: number; late: number }) => Math.round(((r.present + r.late) / workingDays) * 100);
  const all = Math.round((t('present') + t('late')) / (workingDays * rows.length) * 100);
  const below = rows.filter((r) => pct(r) < 90).length;
  return (
    <ReportView
      {...meta}
      footer={`${rows.length} people, ${workingDays} working days`}
      stats={[
        { label: 'Attendance', value: `${all}%`, tone: all < 90 ? 'bad' : 'good', hint: below ? `${below} below 90%` : 'Everyone at 90% or more' },
        { label: 'Days absent', value: t('absent'), tone: t('absent') ? 'bad' : undefined },
        { label: 'Late arrivals', value: t('late') },
        { label: 'Hours worked', value: t('hours').toLocaleString() },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={rv.th}>Employee</TableHead>
            {['Present', 'Absent', 'Late', 'Leave', 'Hours', 'Attendance'].map((c) => <TableHead key={c} className={cn(rv.th, 'text-end')}>{c}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const p = pct(r);
            return (
              <TableRow key={r.name}>
                <TableCell className={rv.td}><span className="font-medium">{r.name}</span>{r.role && <span className="block text-xs text-muted-foreground">{r.role}</span>}</TableCell>
                <TableCell className={cn(rv.td, rv.num)}>{r.present}</TableCell>
                <TableCell className={cn(rv.td, rv.num, r.absent > 0 && 'text-destructive')}>{r.absent}</TableCell>
                <TableCell className={cn(rv.td, rv.num, r.late > 2 && 'text-warning')}>{r.late}</TableCell>
                <TableCell className={cn(rv.td, rv.num)}>{r.leave}</TableCell>
                <TableCell className={cn(rv.td, rv.num)}>{r.hours}</TableCell>
                <TableCell className={cn(rv.td, rv.num, 'font-medium', p < 90 && 'text-destructive')}>{p}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell className="px-5">Total</TableCell>
            {(['present', 'absent', 'late', 'leave', 'hours'] as const).map((k) => <TableCell key={k} className={cn('px-5', rv.num)}>{t(k)}</TableCell>)}
            <TableCell className={cn('px-5', rv.num)}>{all}%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ReportView>
  );
}
