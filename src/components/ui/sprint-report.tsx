'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ReportSection, ReportView, rv } from './report-view';

export interface SprintItem { title: string; points: number; /** Why it was not finished. */ reason?: string }
export interface SprintReportProps {
  team: string;
  sprint: string;
  dates: string;
  goal: string;
  /** Story points committed at the start. */
  committed: number;
  /** Points left at the end of each day, starting with day 0. Stop at today for a sprint in progress. */
  remaining: number[];
  days: number;
  done: SprintItem[];
  spilled?: SprintItem[];
  /** Completed points of earlier sprints, oldest first. */
  velocity?: number[];
  className?: string;
}

/**
 * Sprint report: committed, completed and spilled points up top, a burndown chart (dashed ideal line, real remaining-work line), a velocity strip,
 * and a table each for what shipped and what slipped with the reason.
 */
export function SprintReport({ team, sprint, dates, goal, committed, remaining, days, done, spilled, velocity, className }: SprintReportProps) {
  const W = 560, H = 210, L = 34, R = 10, T = 12, B = 26;
  const x = (d: number) => L + (d / days) * (W - L - R);
  const y = (v: number) => T + (1 - v / committed) * (H - T - B);
  const real = remaining.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const finished = done.reduce((s, i) => s + i.points, 0);
  const slipped = (spilled ?? []).reduce((s, i) => s + i.points, 0);
  const pct = Math.round((finished / committed) * 100);
  const last = remaining.length - 1;
  const ticks = [0, 0.5, 1].map((t) => Math.round(committed * t));
  const vmax = Math.max(...(velocity ?? []), finished, 1);
  const rows = (items: SprintItem[], reason: boolean) => (
    <Table>
      <TableHeader><TableRow className="hover:bg-transparent"><TableHead className={rv.th}>Item</TableHead>{reason && <TableHead className={rv.th}>Reason</TableHead>}<TableHead className={cn(rv.th, 'w-20 text-end')}>Points</TableHead></TableRow></TableHeader>
      <TableBody>{items.map((i) => <TableRow key={i.title}><TableCell className={rv.td}>{i.title}</TableCell>{reason && <TableCell className={cn(rv.td, 'text-muted-foreground')}>{i.reason}</TableCell>}<TableCell className={cn(rv.td, rv.num)}>{i.points}</TableCell></TableRow>)}</TableBody>
    </Table>
  );
  return (
    <ReportView
      organization={`${team} · ${sprint}`} title="Sprint report" period={dates} className={className}
      footer={`Goal: ${goal}`}
      stats={[
        { label: 'Committed', value: `${committed} pts` },
        { label: 'Completed', value: `${finished} pts`, hint: `${pct}% of plan`, tone: pct >= 90 ? 'good' : pct < 70 ? 'bad' : 'warn' },
        { label: 'Spilled', value: `${slipped} pts`, hint: slipped ? 'moves on' : 'none', tone: slipped ? 'warn' : undefined },
        { label: 'Remaining', value: `${remaining[last]} pts`, hint: `day ${last} of ${days}` },
      ]}
    >
      <ReportSection title="Burndown">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Burndown: ${committed} points committed, ${remaining[last]} remaining on day ${last} of ${days}`} className="w-full">
        {ticks.map((t) => <g key={t}><line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth="1" /><text x={L - 6} y={y(t) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{t}</text></g>)}
        {Array.from({ length: days + 1 }, (_, d) => d).filter((d) => d % Math.ceil(days / 5) === 0 || d === days).map((d) => <text key={d} x={x(d)} y={H - 8} textAnchor={d === days ? 'end' : 'middle'} className="fill-muted-foreground text-[10px]">{d === 0 ? 'Start' : `Day ${d}`}</text>)}
        <polygon points={`${real} ${x(last)},${y(0)} ${x(0)},${y(0)}`} className="fill-primary/10" />
        <line x1={x(0)} y1={y(committed)} x2={x(days)} y2={y(0)} className="stroke-muted-foreground" strokeWidth="1.5" strokeDasharray="5 4" />
        <polyline points={real} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(last)} cy={y(remaining[last])} r="4.5" className="fill-primary stroke-card" strokeWidth="2" />
      </svg>
      </ReportSection>
      {velocity && velocity.length > 0 && (
        <ReportSection title="Velocity" aside="completed points per sprint">
          <div className="flex h-14 items-end gap-1.5">
            {[...velocity, finished].map((v, i, a) => <div key={i} title={`${v} points`} className={cn('flex-1 rounded-sm', i === a.length - 1 ? 'bg-primary' : 'bg-muted-foreground/30')} style={{ height: `${(v / vmax) * 100}%` }} />)}
          </div>
        </ReportSection>
      )}
      <ReportSection flush title={`Shipped, ${done.length}`}>{rows(done, false)}</ReportSection>
      {spilled && spilled.length > 0 && <ReportSection flush title={`Slipped, ${spilled.length}`}>{rows(spilled, true)}</ReportSection>}
    </ReportView>
  );
}
