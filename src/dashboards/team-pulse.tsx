'use client';

import * as React from 'react';
import { CheckCircleIcon, ClockIcon, HelpCircleIcon, LayoutDashboardIcon, LayoutListIcon, MailIcon, SettingsIcon, UsersIcon } from '@/components/ui/icons';
import { AppContent, AppShell } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.58 0.15 252)', '--primary-foreground': '#fff', '--ring': 'oklch(0.58 0.15 252)' } as React.CSSProperties;

type Span = 'Week' | 'Month';
// Hours worked per day this period against the same days last period.
const PERF: Record<Span, { x: string[]; now: number[]; prev: number[] }> = {
  Week: { x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], now: [6, 7, 8, 6.5, 9, 3, 2], prev: [5, 6.5, 5, 7, 6, 2.5, 3] },
  Month: { x: ['01', '02', '03', '04', '05', '06', '07'], now: [5, 6, 7, 4, 7.5, 8, 6], prev: [6, 5, 5, 6, 6.5, 5, 7] },
};
const TASKS = [{ n: 'Product review for UI8 market', s: 'In progress', c: 'bg-warning', h: '4h' }, { n: 'UX research for product', s: 'On hold', c: 'bg-info', h: '8h' }, { n: 'App design and development', s: 'Done', c: 'bg-success', h: '32h' }];
const FEED0 = [
  { who: 'Floyd Miles', what: 'Commented on Stark Project', at: '10:15 AM', msg: "Hi! Next week we'll start a new project. I'll tell you all the details later." },
  { who: 'Guy Hawkins', what: 'Added a file to 7Heros Project', at: '10:15 AM', file: 'Homepage.fig, 13.4 MB' },
  { who: 'Kristin Watson', what: 'Commented on 7Heros Project', at: '10:15 AM' },
];
const W = 520;
const H = 190;

export default function TeamPulse() {
  const [span, setSpan] = React.useState<Span>('Week');
  const [at, setAt] = React.useState<number | null>(null);
  const [feed, setFeed] = React.useState<{ who: string; what: string; at: string; msg?: string; file?: string }[]>(FEED0);
  const [msg, setMsg] = React.useState('');
  const p = PERF[span];
  const n = p.x.length;
  const i = at ?? 2;
  const x = (k: number) => 12 + (k / (n - 1)) * (W - 24);
  const y = (v: number) => H - 28 - (v / 12) * (H - 44);
  const path = (d: number[]) => d.map((v, k) => (k ? `C${(x(k - 1) + x(k)) / 2} ${y(d[k - 1]!)}, ${(x(k - 1) + x(k)) / 2} ${y(v)}, ${x(k)} ${y(v)}` : `M${x(k)} ${y(v)}`)).join(' ');
  const total = p.now.reduce((a, b) => a + b, 0);
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-background text-left @container" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">L</span><span className="truncate text-sm font-semibold">Logip</span></SidebarHeader>
            <SidebarContent><SidebarGroup><SidebarItem icon={<LayoutDashboardIcon />} label="Home" /><SidebarItem icon={<LayoutListIcon />} label="Projects" /><SidebarItem icon={<CheckCircleIcon />} label="Tasks" active /><SidebarItem icon={<UsersIcon />} label="Team" /><SidebarItem icon={<SettingsIcon />} label="Settings" /></SidebarGroup></SidebarContent>
            <SidebarFooter><div className="rounded-xl bg-accent/70 p-3"><p className="text-[13px] font-semibold">Upgrade to Pro</p><p className="mt-0.5 text-xs text-muted-foreground">1 month free and unlock everything.</p><Button size="sm" className="mt-2 w-full">Upgrade</Button></div><SidebarItem icon={<HelpCircleIcon />} label="Help and information" /></SidebarFooter>
          </Sidebar>
        }
      >
        <AppContent className="grid content-start gap-6 p-5 sm:p-8 @4xl:grid-cols-[minmax(0,1fr)_19rem] @4xl:gap-x-10">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-semibold tracking-tight">Hello, Margaret</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">Track team progress here. You almost reached a goal!</p>
            <dl className="mt-6 grid grid-cols-3 divide-x border-y py-4">
              {[['Finished', '18', '+8 tasks', 'text-success'], ['Tracked', `${Math.round(total)}h`, '-6 hours', 'text-destructive'], ['Efficiency', '93%', '+12%', 'text-success']].map(([l, v, d, c]) => <div key={l} className="px-4 first:pl-0"><dt className="text-xs text-muted-foreground">{l}</dt><dd className="mt-1 flex flex-wrap items-baseline gap-x-2"><span className="font-display text-2xl font-semibold tabular-nums">{v}</span><span className={cn('text-[11px] font-medium', c)}>{d}</span></dd></div>)}
            </dl>
            <section className="mt-6" aria-labelledby="tp-perf">
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="tp-perf" className="text-sm font-semibold">Performance</h2><Segmented value={span} onValueChange={(v) => { setSpan(v); setAt(null); }} options={[{ value: 'Week', label: 'This week' }, { value: 'Month', label: 'This month' }]} /></div>
              <div className="relative mt-3">
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring/40" role="img" tabIndex={0} aria-label={`${p.x[i]}: ${p.now[i]} hours, last period ${p.prev[i]} hours.`}
                  onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setAt(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1))))); }} onPointerLeave={() => setAt(null)}
                  onKeyDown={(e) => { if (e.key === 'ArrowRight') setAt(Math.min(n - 1, i + 1)); if (e.key === 'ArrowLeft') setAt(Math.max(0, i - 1)); }} onBlur={() => setAt(null)}>
                  {[0, 3, 6, 9, 12].map((g) => <g key={g}><line x1="26" x2={W} y1={y(g)} y2={y(g)} className="stroke-border" strokeDasharray="2 5" /><text x="0" y={y(g) + 3} className="fill-muted-foreground text-[10px]">{g}h</text></g>)}
                  <path d={path(p.prev)} fill="none" className="stroke-warning" strokeWidth="2" strokeLinecap="round" />
                  <path d={path(p.now)} fill="none" className="stroke-info" strokeWidth="2.25" strokeLinecap="round" />
                  <line x1={x(i)} x2={x(i)} y1="6" y2={H - 28} className="stroke-foreground/25" />
                  <circle cx={x(i)} cy={y(p.now[i]!)} r="4" className="fill-card stroke-info" strokeWidth="2" /><circle cx={x(i)} cy={y(p.prev[i]!)} r="4" className="fill-card stroke-warning" strokeWidth="2" />
                  {p.x.map((l, k) => <text key={l} x={x(k)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">{l}</text>)}
                </svg>
                <div className="pointer-events-none absolute top-2 rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] text-background shadow-lg" style={{ left: `clamp(0px, calc(${(x(i) / W) * 100}% + 10px), calc(100% - 7.5rem))` }}><p className="font-semibold tabular-nums">{p.x[i]}</p><p className="tabular-nums opacity-80">This period {p.now[i]}h</p><p className="tabular-nums opacity-80">Last period {p.prev[i]}h</p></div>
              </div>
            </section>
            <section className="mt-6" aria-labelledby="tp-tasks">
              <div className="flex items-baseline justify-between"><h2 id="tp-tasks" className="text-sm font-semibold">Current tasks</h2><p className="text-xs text-muted-foreground">Done 30%</p></div>
              <ul className="mt-2 divide-y">{TASKS.map((t) => <li key={t.n} className="flex items-center gap-3 py-3 text-[13px]"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><ClockIcon className="size-4" /></span><span className="flex-1 font-medium">{t.n}</span><span className="flex w-28 items-center gap-1.5 text-xs text-muted-foreground"><span className={cn('size-1.5 rounded-full', t.c)} />{t.s}</span><span className="w-8 text-right text-xs tabular-nums text-muted-foreground">{t.h}</span></li>)}</ul>
            </section>
          </div>
          <aside className="min-w-0 @4xl:border-l @4xl:pl-8" aria-label="Profile and activity">
            <div className="rounded-2xl bg-accent/50 p-5 text-center"><Avatar name="Megan Norton" size="lg" className="mx-auto" /><p className="mt-2 text-sm font-semibold">Megan Norton</p><p className="text-xs text-muted-foreground">@megnorton</p><div className="mt-3 flex justify-center"><Button size="icon-sm" variant="outline" aria-label="Message"><MailIcon /></Button></div></div>
            <h2 className="mt-6 text-sm font-semibold">Activity</h2>
            <ul className="mt-3 grid gap-4" aria-live="polite">{feed.map((f, k) => <li key={k} className="flex gap-2.5"><Avatar name={f.who} size="xs" /><div className="min-w-0 flex-1 text-xs"><p className="flex justify-between gap-2"><span className="font-semibold">{f.who}</span><span className="text-muted-foreground">{f.at}</span></p><p className="text-muted-foreground">{f.what}</p>{f.msg && <p className="mt-1.5 rounded-xl bg-info/10 p-2.5 text-foreground">{f.msg}</p>}{f.file && <p className="mt-1.5 rounded-xl border p-2 font-mono text-[11px]">{f.file}</p>}</div></li>)}</ul>
            <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (msg.trim()) { setFeed((f) => [...f, { who: 'Margaret Lee', what: 'Posted a message', at: 'Now', msg: msg.trim() }]); setMsg(''); } }}>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Write a message" placeholder="Write a message" className="h-9 w-full rounded-xl border bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
              <Button size="sm" type="submit" disabled={!msg.trim()}>Send</Button>
            </form>
          </aside>
        </AppContent>
      </AppShell>
    </div>
  );
}
