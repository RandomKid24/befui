'use client';

import * as React from 'react';
import { BellIcon, BriefcaseIcon, CalendarIcon, CheckIcon, ClockIcon, LayoutDashboardIcon, ReceiptIcon, SearchIcon, SettingsIcon, SparkleIcon, UsersIcon } from '@/components/ui/icons';
import { AppContent, AppShell, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.55 0.2 305)', '--primary-foreground': '#fff', '--ring': 'oklch(0.55 0.2 305)', '--accent': 'color-mix(in oklab, oklch(0.55 0.2 305) 14%, var(--background))', '--accent-foreground': 'oklch(0.55 0.2 305)' } as React.CSSProperties;


const panel = 'rounded-2xl border bg-card p-4 sm:p-5';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const weekend = (i: number) => i % 7 === 5 || i % 7 === 6;
type Leave = { id: string; who: string; role: string; kind: 'Paid leave' | 'Sick leave' | 'Vacation'; from: number; to: number; ok: boolean };
const START: Leave[] = [
  { id: 'a', who: 'Ethan Parker', role: 'Software engineer', kind: 'Vacation', from: 7, to: 11, ok: true },
  { id: 'b', who: 'Liam Carter', role: 'UI/UX designer', kind: 'Paid leave', from: 1, to: 2, ok: true },
  { id: 'c', who: 'Noah Mitchell', role: 'Backend developer', kind: 'Sick leave', from: 8, to: 9, ok: false },
  { id: 'd', who: 'Ava Thompson', role: 'Product manager', kind: 'Vacation', from: 0, to: 1, ok: true },
  { id: 'e', who: 'Mia Robinson', role: 'QA engineer', kind: 'Paid leave', from: 10, to: 11, ok: false },
];
const PEOPLE = ['Ethan Parker', 'Liam Carter', 'Noah Mitchell', 'Ava Thompson', 'Mia Robinson'];
const ROLES = ['Software engineer', 'UI/UX designer', 'Backend developer', 'Product manager', 'QA engineer'];
const EVENTS = [
  { t: 'Tech Innovations Summit', d: 'Cutting-edge AI trends', time: '14:00 to 15:00', day: 'Dec 5', hot: true },
  { t: 'Software Dev Meetup', d: 'Modern development workflows', time: '14:00 to 15:00', day: 'Dec 5' },
  { t: 'Cybersecurity Workshop', d: 'Security strategies, threat response', time: '10:00 to 12:00', day: 'Dec 9' },
];
const HIRES = [
  { name: 'Sophia Adams', tasks: ['Laptop issued', 'Payroll form', 'Team intro', 'Security training', 'First 1:1'], done: 5 },
  { name: 'Lucas Morgan', tasks: ['Laptop issued', 'Payroll form', 'Team intro', 'Security training', 'First 1:1'], done: 3 },
];
const kindTone = { 'Paid leave': 'bg-primary text-primary-foreground', 'Sick leave': 'bg-warning text-white', Vacation: 'bg-success text-white' } as const;

export default function HrmsOverview() {
  const [leaves, setLeaves] = React.useState(START);
  const [ticks, setTicks] = React.useState<Record<string, number>>({ 'Sophia Adams': 5, 'Lucas Morgan': 3 });
  const [ask, setAsk] = React.useState('');
  const [reply, setReply] = React.useState('');
  const pending = leaves.filter((l) => !l.ok);
  const approve = (id: string) => setLeaves((ls) => ls.map((l) => (l.id === id ? { ...l, ok: true } : l)));
  const answer = (q: string) => setReply(q.toLowerCase().includes('report') ? `${leaves.filter((l) => l.ok).length} approved absences and ${pending.length} waiting this fortnight.` : pending.length ? `${pending.length} leave request${pending.length === 1 ? '' : 's'} need your decision.` : 'Nothing is waiting for you.');
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><UsersIcon className="size-4" /></span>
              <span className="truncate text-sm font-semibold">Peoplehub</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="HR">
                <SidebarItem icon={<LayoutDashboardIcon />} label="Overview" active />
                <SidebarItem icon={<UsersIcon />} label="Employees" />
                <SidebarItem icon={<CalendarIcon />} label="Absences" badge={String(pending.length)} />
                <SidebarItem icon={<BriefcaseIcon />} label="Hiring" />
                <SidebarItem icon={<ReceiptIcon />} label="Payroll" />
              </SidebarGroup>
              <SidebarGroup><SidebarItem icon={<SettingsIcon />} label="Settings" /></SidebarGroup>
            </SidebarContent>
          </Sidebar>
        }
      >
        <Topbar className="bg-background">
          <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-xl border bg-muted/50 px-3 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40"><SearchIcon className="size-4" /><input aria-label="Search" placeholder="Search people" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="ml-auto"><BellIcon /></Button>
          <Avatar name="Emily Stone" size="sm" />
        </Topbar>
        <AppContent className="@container bg-muted/40">
          <section className={panel} aria-labelledby="hr-abs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 id="hr-abs" className="font-display text-xl font-semibold tracking-tight">Planned absences</h1>
              <p className="text-xs text-muted-foreground">Dec 2 to 13. {pending.length === 0 ? 'Everything is approved.' : `${pending.length} waiting for approval.`}</p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <div className="grid min-w-[34rem] grid-cols-[8rem_repeat(12,minmax(0,1fr))] gap-y-1.5 text-xs">
                <span />
                {DAYS.map((d, i) => <span key={i} className={cn('pb-1 text-center text-muted-foreground', weekend(i) && 'opacity-60')}>{d}<span className="block tabular-nums">{2 + i}</span></span>)}
                {PEOPLE.map((p, row) => {
                  const l = leaves.find((x) => x.who === p)!;
                  return (
                    <React.Fragment key={p}>
                      <span className="flex items-center gap-2 pe-2"><Avatar name={p} size="xs" /><span className="min-w-0 leading-tight"><span className="block truncate font-medium text-foreground">{p}</span><span className="block truncate text-[11px] text-muted-foreground">{ROLES[row]}</span></span></span>
                      <div className="relative col-span-12 grid h-9 grid-cols-12 gap-px">
                        {DAYS.map((_, i) => <span key={i} className={cn('rounded-md', weekend(i) ? 'bg-[repeating-linear-gradient(135deg,var(--border)_0_2px,transparent_2px_6px)]' : 'bg-muted/70')} />)}
                        <button
                          type="button"
                          onClick={() => !l.ok && approve(l.id)}
                          aria-label={`${p}, ${l.kind}, ${DAYS[l.from]} to ${DAYS[l.to]}. ${l.ok ? 'Approved' : 'Pending, press to approve'}`}
                          className={cn('absolute inset-y-0.5 flex items-center gap-1.5 truncate rounded-lg px-2 text-[11px] font-medium shadow-sm outline-none transition-[opacity,box-shadow] focus-visible:ring-2 focus-visible:ring-ring', kindTone[l.kind], !l.ok && 'cursor-pointer opacity-70 ring-2 ring-dashed ring-foreground/30 hover:opacity-100')}
                          style={{ left: `${(l.from / 12) * 100}%`, width: `calc(${((l.to - l.from + 1) / 12) * 100}% - 2px)` }}
                        >
                          {l.ok ? <CheckIcon className="size-3 shrink-0" /> : <ClockIcon className="size-3 shrink-0" />}<span className="truncate">{l.kind}</span>
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="mt-4 grid gap-4 @3xl:grid-cols-3">
            <section className={panel} aria-labelledby="hr-ev">
              <h2 id="hr-ev" className="text-sm font-semibold">Future events</h2>
              <ul className="mt-3 grid gap-2">
                {EVENTS.map((e) => (
                  <li key={e.t} className={cn('rounded-xl p-3 text-[13px]', e.hot ? 'bg-warning/25' : 'border')}>
                    <p className="font-semibold">{e.t}</p><p className="text-xs text-muted-foreground">{e.d}</p>
                    <p className="mt-2 flex items-center gap-3 text-xs tabular-nums text-muted-foreground"><span className="flex items-center gap-1"><ClockIcon className="size-3" />{e.time}</span><span className="flex items-center gap-1"><CalendarIcon className="size-3" />{e.day}</span></p>
                  </li>
                ))}
              </ul>
            </section>

            <section className={panel} aria-labelledby="hr-on">
              <h2 id="hr-on" className="text-sm font-semibold">Onboarding</h2>
              <ul className="mt-3 grid gap-3">
                {HIRES.map((h) => {
                  const n = ticks[h.name] ?? 0;
                  return (
                    <li key={h.name} className="rounded-xl border p-3">
                      <div className="flex items-center gap-2.5"><Avatar name={h.name} size="sm" /><div className="flex-1 text-[13px]"><p className="font-semibold leading-tight">{h.name}</p><p className="text-xs tabular-nums text-muted-foreground">{n}/{h.tasks.length} tasks done</p></div></div>
                      <div className="mt-2.5 flex gap-1" role="group" aria-label={`${h.name} onboarding steps`}>
                        {h.tasks.map((t, i) => (
                          <button key={t} type="button" aria-pressed={i < n} aria-label={t} title={t} onClick={() => setTicks((x) => ({ ...x, [h.name]: i < n ? i : i + 1 }))} className={cn('h-2 flex-1 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60', i < n ? 'bg-primary' : 'bg-secondary hover:bg-border')} />
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className={cn(panel, 'flex flex-col bg-gradient-to-br from-accent/60 to-card')} aria-labelledby="hr-ai">
              <span className="grid size-10 place-items-center rounded-full bg-primary/15 text-primary"><SparkleIcon className="size-5" /></span>
              <h2 id="hr-ai" className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight">Welcome, Emily. What can I help with today?</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Pending leave', 'Get reports'].map((q) => <button key={q} type="button" onClick={() => answer(q)} className="rounded-lg border bg-background px-2.5 py-1 text-xs outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50">{q}</button>)}
              </div>
              <p className="mt-3 min-h-10 text-[13px] text-muted-foreground" aria-live="polite">{reply}</p>
              <form className="mt-auto flex gap-2 pt-3" onSubmit={(e) => { e.preventDefault(); if (ask.trim()) { answer(ask); setAsk(''); } }}>
                <input value={ask} onChange={(e) => setAsk(e.target.value)} aria-label="Ask anything" placeholder="Ask me anything" className="h-9 w-full rounded-xl border bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
                <Button size="sm" type="submit">Ask</Button>
              </form>
            </section>
          </div>
        </AppContent>
      </AppShell>
    </div>
  );
}
