'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

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
 * Sprint report with a burndown chart as its centre: a dashed ideal line, the real remaining-work line, and a drop shadow under the gap.
 * Beside it, committed, completed and spilled points. Below, what shipped and what slipped with the reason.
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
  return (
    <article className={cn('mx-auto w-full max-w-3xl overflow-hidden rounded-xl border bg-card text-sm text-card-foreground print:border-0', className)}>
      <header className="grid grid-cols-[auto_1fr] items-center gap-5 border-b bg-muted/40 px-6 py-5">
        <p className="font-mono text-5xl font-semibold leading-none tracking-tighter text-primary">{sprint}</p>
        <div><p className="text-xs uppercase tracking-widest text-muted-foreground">{team} sprint report, {dates}</p><p className="mt-1 text-base font-medium leading-snug">{goal}</p></div>
      </header>
      <div className="grid gap-6 px-6 py-5 md:grid-cols-[1fr_11rem]">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Burndown: ${committed} points committed, ${remaining[last]} remaining on day ${last} of ${days}`} className="w-full">
          {ticks.map((t) => <g key={t}><line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth="1" /><text x={L - 6} y={y(t) + 3.5} textAnchor="end" className="fill-muted-foreground text-[10px]">{t}</text></g>)}
          {Array.from({ length: days + 1 }, (_, d) => d).filter((d) => d % Math.ceil(days / 5) === 0 || d === days).map((d) => <text key={d} x={x(d)} y={H - 8} textAnchor={d === days ? 'end' : 'middle'} className="fill-muted-foreground text-[10px]">{d === 0 ? 'Start' : `Day ${d}`}</text>)}
          <polygon points={`${real} ${x(last)},${y(0)} ${x(0)},${y(0)}`} className="fill-primary/10" />
          <line x1={x(0)} y1={y(committed)} x2={x(days)} y2={y(0)} className="stroke-muted-foreground" strokeWidth="1.5" strokeDasharray="5 4" />
          <polyline points={real} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={x(last)} cy={y(remaining[last])} r="4.5" className="fill-primary stroke-card" strokeWidth="2" />
        </svg>
        <dl className="grid grid-cols-3 content-start gap-4 md:grid-cols-1">
          {[['Committed', `${committed} pts`, ''], ['Completed', `${finished} pts`, `${pct}% of plan`], ['Spilled', `${slipped} pts`, slipped ? 'moves on' : 'none']].map(([k, v, s]) => (
            <div key={k}><dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt><dd className="font-mono text-xl font-semibold tabular-nums">{v}</dd>{s && <dd className="text-xs text-muted-foreground">{s}</dd>}</div>
          ))}
        </dl>
      </div>
      {velocity && velocity.length > 0 && (
        <div className="flex items-end gap-3 border-t px-6 py-4">
          <p className="w-24 shrink-0 text-xs text-muted-foreground">Velocity, completed points</p>
          <div className="flex h-12 flex-1 items-end gap-1.5">
            {[...velocity, finished].map((v, i, a) => <div key={i} title={`${v} points`} className={cn('flex-1', i === a.length - 1 ? 'bg-primary' : 'bg-muted-foreground/30')} style={{ height: `${(v / vmax) * 100}%` }} />)}
          </div>
        </div>
      )}
      <div className="grid gap-6 border-t px-6 py-5 sm:grid-cols-2">
        <section><h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">Shipped, {done.length}</h3>
          <ul className="grid gap-1.5">{done.map((i) => <li key={i.title} className="flex justify-between gap-3"><span>{i.title}</span><span className="font-mono text-xs text-muted-foreground">{i.points}</span></li>)}</ul></section>
        <section><h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-warning">Slipped, {spilled?.length ?? 0}</h3>
          {spilled?.length ? <ul className="grid gap-2">{spilled.map((i) => <li key={i.title}><div className="flex justify-between gap-3"><span>{i.title}</span><span className="font-mono text-xs text-muted-foreground">{i.points}</span></div>{i.reason && <p className="text-xs text-muted-foreground">{i.reason}</p>}</li>)}</ul> : <p className="text-muted-foreground">Nothing slipped.</p>}</section>
      </div>
    </article>
  );
}
