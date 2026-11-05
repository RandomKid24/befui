'use client';

import * as React from 'react';
import { ArrowUpRightIcon, BarChartIcon, CalendarIcon, CheckSquareIcon, FolderIcon, HelpCircleIcon, LayoutDashboardIcon, PauseIcon, PlayIcon, PlusIcon, SettingsIcon, UsersIcon } from '@/components/ui/icons';
import { AppContent, AppShell } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.5 0.12 155)', '--primary-foreground': '#fff', '--ring': 'oklch(0.5 0.12 155)' } as React.CSSProperties;

const panel = 'rounded-2xl border bg-card p-4 sm:p-5';
const STATS = [
  { label: 'Total projects', value: 24, note: 'Up 3 since last month', hero: true },
  { label: 'Ended projects', value: 10, note: 'Up 1 since last month' },
  { label: 'Running projects', value: 12, note: 'Up 2 since last month' },
  { label: 'Pending projects', value: 2, note: 'On discuss' },
];
const WEEK = [{ d: 'S', v: 38, state: 'idle' }, { d: 'M', v: 74, state: 'done' }, { d: 'T', v: 52, state: 'mid' }, { d: 'W', v: 88, state: 'done' }, { d: 'T', v: 61, state: 'idle' }, { d: 'F', v: 44, state: 'idle' }, { d: 'S', v: 66, state: 'idle' }] as const;
const TEAM = [
  { name: 'Alexandra Deff', task: 'GitHub project repository', state: 'Completed' },
  { name: 'Edwin Adenike', task: 'User authentication system', state: 'In progress' },
  { name: 'Isaac Oluwatemilorun', task: 'Search and filter feature', state: 'Pending' },
  { name: 'David Oshodi', task: 'Responsive layout for homepage', state: 'In progress' },
];
const PROJECTS = [['Develop API endpoints', 'Nov 26, 2024'], ['Onboarding flow', 'Nov 28, 2024'], ['Build dashboard', 'Nov 30, 2024'], ['Optimize page load', 'Dec 5, 2024']];
const stateTone: Record<string, string> = { Completed: 'bg-success/12 text-success', 'In progress': 'bg-warning/15 text-warning', Pending: 'bg-destructive/12 text-destructive' };
const clock = (s: number) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0')).join(':');

function TimeTracker() {
  const [secs, setSecs] = React.useState(5048);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [on]);
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground" aria-labelledby="po-time">
      <div aria-hidden className="absolute -bottom-14 -right-10 size-44 rounded-full bg-white/10" />
      <h2 id="po-time" className="relative text-[13px] font-medium opacity-80">Time tracker</h2>
      <p className="relative mt-2 font-mono text-3xl font-semibold tabular-nums tracking-wide" role="timer" aria-live="off">{clock(secs)}</p>
      <div className="relative mt-4 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setOn((o) => !o)} aria-label={on ? 'Pause timer' : 'Start timer'}>{on ? <PauseIcon /> : <PlayIcon />}{on ? 'Pause' : 'Start'}</Button>
        <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground" onClick={() => { setOn(false); setSecs(0); }}>Reset</Button>
      </div>
    </section>
  );
}

export default function ProjectOverview() {
  const [day, setDay] = React.useState<number | null>(null);
  const [joined, setJoined] = React.useState(false);
  const done = WEEK.filter((w) => w.state === 'done').length;
  const total = 41;
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left @container" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><CheckSquareIcon className="size-4" /></span><span className="truncate text-sm font-semibold">Donezo</span></SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Menu"><SidebarItem icon={<LayoutDashboardIcon />} label="Dashboard" active /><SidebarItem icon={<CheckSquareIcon />} label="Tasks" badge="12+" /><SidebarItem icon={<CalendarIcon />} label="Calendar" /><SidebarItem icon={<BarChartIcon />} label="Analytics" /><SidebarItem icon={<UsersIcon />} label="Team" /></SidebarGroup>
              <SidebarGroup label="General"><SidebarItem icon={<SettingsIcon />} label="Settings" /><SidebarItem icon={<HelpCircleIcon />} label="Help" /></SidebarGroup>
            </SidebarContent>
          </Sidebar>
        }
      >
        <AppContent className="bg-muted/40">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1><p className="text-[13px] text-muted-foreground">Plan, prioritize and accomplish your tasks with ease.</p></div>
            <div className="flex gap-2"><Button size="sm"><PlusIcon /> Add project</Button><Button size="sm" variant="outline">Import data</Button></div>
          </div>
          <div className="grid grid-cols-2 gap-4 @2xl:grid-cols-4">
            {STATS.map((s) => (
              <section key={s.label} aria-label={s.label} className={cn('rounded-2xl p-4 sm:p-5', s.hero ? 'bg-primary text-primary-foreground' : 'border bg-card')}>
                <p className="flex items-center justify-between text-[13px] font-medium"><span className={s.hero ? '' : 'text-muted-foreground'}>{s.label}</span><span className={cn('grid size-6 place-items-center rounded-full border', s.hero ? 'border-white/40' : '')}><ArrowUpRightIcon className="size-3" /></span></p>
                <p className="mt-3 font-display text-4xl font-semibold tabular-nums leading-none">{s.value}</p>
                <p className={cn('mt-2 text-xs', s.hero ? 'opacity-80' : 'text-muted-foreground')}>{s.note}</p>
              </section>
            ))}
          </div>
          <div className="mt-4 grid gap-4 @2xl:grid-cols-5">
            <section className={cn(panel, '@2xl:col-span-3')} aria-labelledby="po-an">
              <h2 id="po-an" className="text-sm font-semibold">Project analytics</h2>
              <div className="mt-4 flex h-40 items-end gap-2.5" onPointerLeave={() => setDay(null)}>
                {WEEK.map((w, i) => (
                  <button key={i} type="button" onPointerEnter={() => setDay(i)} onFocus={() => setDay(i)} onBlur={() => setDay(null)} aria-label={`Day ${i + 1}: ${w.v}% of tasks`} className="group relative flex h-full flex-1 flex-col items-center justify-end outline-none">
                    {day === i && <span className="mb-1 text-[11px] font-semibold tabular-nums">{w.v}%</span>}
                    <span className={cn('w-full max-w-11 rounded-full transition-[height] duration-(--dur-base) group-focus-visible:ring-2 group-focus-visible:ring-ring/50', w.state === 'done' ? 'bg-primary' : w.state === 'mid' ? 'bg-primary/45' : 'bg-[repeating-linear-gradient(135deg,var(--border)_0_2px,transparent_2px_6px)] ring-1 ring-inset ring-border')} style={{ height: `${w.v * 0.82}%` }} />
                    <span className="mt-2 text-[11px] text-muted-foreground">{w.d}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className={cn(panel, '@2xl:col-span-2')} aria-labelledby="po-rem">
              <h2 id="po-rem" className="text-sm font-semibold">Reminders</h2>
              <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-primary">Meeting with Arc Company</p>
              <p className="mt-1 text-xs text-muted-foreground">Time: 02:00 pm to 04:00 pm</p>
              <Button className="mt-4" size="sm" onClick={() => setJoined(true)} disabled={joined}>{joined ? 'Joined' : 'Start meeting'}</Button>
            </section>
          </div>
          <div className="mt-4 grid gap-4 @2xl:grid-cols-5">
            <section className={cn(panel, '@2xl:col-span-3')} aria-labelledby="po-team">
              <div className="flex items-center justify-between"><h2 id="po-team" className="text-sm font-semibold">Team collaboration</h2><Button size="sm" variant="outline"><PlusIcon /> Add member</Button></div>
              <ul className="mt-2 divide-y">
                {TEAM.map((m) => (
                  <li key={m.name} className="flex items-center gap-3 py-3"><Avatar name={m.name} size="md" /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{m.name}</p><p className="truncate text-xs text-muted-foreground">Working on <span className="font-medium text-foreground/80">{m.task}</span></p></div><span className={cn('shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium', stateTone[m.state])}>{m.state}</span></li>
                ))}
              </ul>
            </section>
            <div className="grid content-start gap-4 @2xl:col-span-2">
              <section className={panel} aria-labelledby="po-prog">
                <h2 id="po-prog" className="text-sm font-semibold">Project progress</h2>
                <div className="mt-3 flex items-center gap-4">
                  <svg viewBox="0 0 36 36" className="size-24 shrink-0 -rotate-90" role="img" aria-label={`${total} percent complete`}><circle cx="18" cy="18" r="14" fill="none" className="stroke-secondary" strokeWidth="6" /><circle cx="18" cy="18" r="14" fill="none" className="stroke-primary" strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray={`${total} 100`} /></svg>
                  <div><p className="font-display text-3xl font-semibold tabular-nums">{total}%</p><p className="text-xs text-muted-foreground">{done} of {WEEK.length} days on target</p></div>
                </div>
              </section>
              <TimeTracker />
            </div>
          </div>
          <section className={cn(panel, 'mt-4')} aria-labelledby="po-list">
            <div className="flex items-center justify-between"><h2 id="po-list" className="text-sm font-semibold">Projects</h2><Button size="sm" variant="outline"><PlusIcon /> New</Button></div>
            <ul className="mt-2 grid gap-x-8 @2xl:grid-cols-2">
              {PROJECTS.map(([n, d]) => <li key={n} className="flex items-center gap-3 border-b py-3 last:border-0"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><FolderIcon className="size-4" /></span><div><p className="text-[13px] font-medium">{n}</p><p className="text-xs text-muted-foreground">Due date: {d}</p></div></li>)}
            </ul>
          </section>
        </AppContent>
      </AppShell>
    </div>
  );
}
