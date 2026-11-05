'use client';

import * as React from 'react';
import { CalendarIcon, ClockIcon, LayoutDashboardIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// A personal health hub: soft floating tiles on a warm canvas, a dock for navigation, and no sidebar or top bar.
const THEME = { '--primary': 'oklch(0.66 0.17 38)', '--primary-foreground': '#fff', '--ring': 'oklch(0.66 0.17 38)' } as React.CSSProperties;
type View = 'Today' | 'Week' | 'Month';
const RINGS = [
  { k: 'Move', unit: 'kcal', goal: 600, v: { Today: 462, Week: 3380, Month: 14100 }, mult: { Today: 1, Week: 7, Month: 30 }, c: 'stroke-primary' },
  { k: 'Exercise', unit: 'min', goal: 45, v: { Today: 38, Week: 252, Month: 1010 }, mult: { Today: 1, Week: 7, Month: 30 }, c: 'stroke-success' },
  { k: 'Stand', unit: 'hrs', goal: 12, v: { Today: 9, Week: 71, Month: 288 }, mult: { Today: 1, Week: 7, Month: 30 }, c: 'stroke-info' },
] as const;
const SLEEP = [6.4, 7.1, 5.8, 7.6, 8.0, 6.9, 7.3];
const NIGHTS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BPM = [68, 71, 66, 74, 92, 118, 104, 88, 79, 72, 70, 69, 73, 81, 76];
const PLAN = [['07:00', 'Morning run, 5 km', 'Done'], ['13:00', 'Mobility, 15 min', 'Next'], ['18:30', 'Strength, upper body', 'Later']] as const;
const MOODS = ['Low', 'Okay', 'Good', 'Great'];

export default function VitalsHub() {
  const [view, setView] = React.useState<View>('Today');
  const [ring, setRing] = React.useState(0);
  const [glasses, setGlasses] = React.useState(5);
  const [night, setNight] = React.useState(4);
  const [mood, setMood] = React.useState(2);
  const r = RINGS[ring]!;
  const radii = [52, 40, 28];
  const goalOf = (x: (typeof RINGS)[number]) => x.goal * x.mult[view];
  const pct = (x: (typeof RINGS)[number]) => Math.min(100, (x.v[view] / goalOf(x)) * 100);
  const bx = (i: number) => (i / (BPM.length - 1)) * 200;
  const by = (v: number) => 56 - ((v - 60) / 65) * 50;
  return (
    <div className="relative h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-gradient-to-br from-[oklch(0.97_0.02_60)] via-[oklch(0.95_0.03_40)] to-[oklch(0.93_0.04_20)] text-left text-[oklch(0.25_0.02_40)] dark:from-[oklch(0.22_0.02_50)] dark:via-[oklch(0.2_0.02_40)] dark:to-[oklch(0.18_0.03_30)] dark:text-[oklch(0.94_0.01_60)]" style={THEME}>
      <div className="@container h-full overflow-y-auto p-5 pb-24 sm:p-8 sm:pb-24">
        <p className="text-xs opacity-60">Tuesday, 11 October</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Good morning, Diya.</h1>
        <p className="mt-1 text-lg opacity-60">You are {Math.round(pct(RINGS[0]))}% of the way to today's move goal.</p>

        <div className="mt-6 grid gap-4 @2xl:grid-cols-6">
          <section className="rounded-[2rem] bg-white/70 p-5 shadow-sm dark:bg-white/8 @2xl:col-span-3" aria-labelledby="vh-rings">
            <h2 id="vh-rings" className="text-sm font-semibold">Rings, {view.toLowerCase()}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <svg viewBox="0 0 120 120" className="size-40 shrink-0 -rotate-90" role="img" aria-label={`${r.k}: ${r.v[view]} of ${goalOf(r)} ${r.unit}`}>
                {RINGS.map((x, k) => <g key={x.k}><circle cx="60" cy="60" r={radii[k]} fill="none" className="stroke-black/8 dark:stroke-white/10" strokeWidth="9" /><circle cx="60" cy="60" r={radii[k]} fill="none" className={cn(x.c, 'transition-[stroke-dasharray] duration-(--dur-slow)', ring !== k && 'opacity-45')} strokeWidth="9" strokeLinecap="round" pathLength="100" strokeDasharray={`${pct(x)} 100`} /></g>)}
              </svg>
              <div>
                <div className="flex flex-wrap gap-1" role="group" aria-label="Pick a ring">{RINGS.map((x, k) => <button key={x.k} type="button" aria-pressed={ring === k} onClick={() => setRing(k)} className={cn('rounded-full px-3 py-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring', ring === k ? 'bg-foreground text-background' : 'bg-black/6 dark:bg-white/10')}>{x.k}</button>)}</div>
                <p className="mt-3 font-display text-4xl font-semibold tabular-nums leading-none">{r.v[view].toLocaleString('en-IN')}<span className="ml-1 text-base font-normal opacity-60">{r.unit}</span></p>
                <p className="mt-1 text-xs opacity-60">of {goalOf(r).toLocaleString('en-IN')} {r.unit}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-primary p-5 text-primary-foreground @2xl:col-span-3" aria-labelledby="vh-hr">
            <div className="flex items-baseline justify-between"><h2 id="vh-hr" className="text-sm font-semibold">Heart rate</h2><p className="text-xs opacity-80">Resting 66</p></div>
            <p className="mt-2 font-display text-5xl font-semibold tabular-nums leading-none">74<span className="ml-1 text-base font-normal opacity-80">bpm</span></p>
            <svg viewBox="0 0 200 64" className="mt-3 h-20 w-full" preserveAspectRatio="none" role="img" aria-label="Heart rate across the morning, peaking at 118 during the run"><path d={BPM.map((v, k) => `${k ? 'L' : 'M'}${bx(k)} ${by(v)}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></svg>
          </section>

          <section className="rounded-[2rem] bg-white/70 p-5 shadow-sm dark:bg-white/8 @2xl:col-span-2" aria-labelledby="vh-sleep">
            <h2 id="vh-sleep" className="text-sm font-semibold">Sleep</h2>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{SLEEP[night]}<span className="ml-1 text-sm font-normal opacity-60">hrs, {NIGHTS[night]}</span></p>
            <div className="mt-3 flex h-24 items-end gap-1.5" role="group" aria-label="Nights">{SLEEP.map((v, k) => <button key={k} type="button" aria-pressed={night === k} aria-label={`${NIGHTS[k]}: ${v} hours`} onClick={() => setNight(k)} className={cn('flex-1 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring', night === k ? 'bg-info' : 'bg-black/10 dark:bg-white/15')} style={{ height: `${(v / 9) * 100}%` }} />)}</div>
          </section>

          <section className="rounded-[2rem] bg-white/70 p-5 shadow-sm dark:bg-white/8 @2xl:col-span-2" aria-labelledby="vh-water">
            <h2 id="vh-water" className="text-sm font-semibold">Water</h2>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{(glasses * 0.25).toFixed(2)}<span className="ml-1 text-sm font-normal opacity-60">of 2 litres</span></p>
            <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Glasses of water">{Array.from({ length: 8 }, (_, k) => <button key={k} type="button" aria-pressed={k < glasses} aria-label={`Glass ${k + 1}`} onClick={() => setGlasses(k + 1 === glasses ? k : k + 1)} className={cn('h-10 rounded-b-xl rounded-t-sm border-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring', k < glasses ? 'border-info bg-info/60' : 'border-black/15 dark:border-white/20')} />)}</div>
          </section>

          <section className="rounded-[2rem] bg-white/70 p-5 shadow-sm dark:bg-white/8 @2xl:col-span-2" aria-labelledby="vh-plan">
            <h2 id="vh-plan" className="text-sm font-semibold">Today's plan</h2>
            <ul className="mt-3 grid gap-3">{PLAN.map(([t, w, s]) => <li key={t} className="flex items-center gap-3 text-[13px]"><span className="w-11 shrink-0 tabular-nums opacity-60">{t}</span><span className={cn('flex-1', s === 'Done' && 'line-through opacity-50')}>{w}</span><span className={cn('text-xs font-medium', s === 'Next' && 'text-primary')}>{s}</span></li>)}</ul>
          </section>

          <section className="rounded-[2rem] bg-white/70 p-5 shadow-sm dark:bg-white/8 @2xl:col-span-6" aria-labelledby="vh-mood">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="vh-mood" className="text-sm font-semibold">How are you feeling?</h2><p className="text-xs opacity-60" aria-live="polite">{mood === 3 ? 'Great. A good day to push a little.' : mood === 0 ? 'Low. Keep today light and drink water.' : `Logged as ${MOODS[mood]!.toLowerCase()}.`}</p></div>
            <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Mood">{MOODS.map((m, k) => <button key={m} type="button" aria-pressed={mood === k} onClick={() => setMood(k)} className={cn('rounded-2xl py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring', mood === k ? 'bg-foreground text-background' : 'bg-black/5 hover:bg-black/10 dark:bg-white/8')}>{m}</button>)}</div>
          </section>
        </div>
      </div>

      <nav className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-foreground p-1.5 text-background shadow-xl" aria-label="Range">
        {([['Today', ClockIcon], ['Week', CalendarIcon], ['Month', LayoutDashboardIcon]] as const).map(([v, Icon]) => (
          <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={cn('flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary', view === v ? 'bg-primary text-primary-foreground' : 'opacity-70 hover:opacity-100')}><Icon className="size-3.5" />{v}</button>
        ))}
      </nav>
    </div>
  );
}
