'use client';

import * as React from 'react';
import { BarChartIcon, BellIcon, CalendarIcon, LayoutDashboardIcon, MegaphoneIcon, SearchIcon, SettingsIcon, TargetIcon } from '@/components/ui/icons';
import { AppContent, AppShell, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.58 0.14 235)', '--primary-foreground': '#fff', '--ring': 'oklch(0.58 0.14 235)' } as React.CSSProperties;

const panel = 'rounded-2xl border bg-card p-4 sm:p-5';
type Range = 'Aug' | 'Sep' | 'Oct';
// Weekly reach and leads per month, in thousands.
const CURVES: Record<Range, { reach: number[]; leads: number[] }> = {
  Aug: { reach: [38, 44, 41, 52, 49], leads: [21, 18, 26, 22, 30] },
  Sep: { reach: [47, 42, 55, 58, 51], leads: [24, 30, 27, 35, 33] },
  Oct: { reach: [52, 61, 57, 66, 72], leads: [31, 29, 38, 41, 46] },
};
const CHANNELS = [{ name: 'Email', pct: 71, tone: 'bg-primary' }, { name: 'Paid search', pct: 92, tone: 'bg-primary' }, { name: 'Social', pct: 33, tone: 'bg-warning' }, { name: 'Events', pct: 56, tone: 'bg-primary' }, { name: 'Partners', pct: 79, tone: 'bg-success' }];
const LAUNCHES = [
  { day: 'Tue, 11 Oct', time: '08:15 am', t: 'Diwali early access', where: 'Email' }, { day: 'Tue, 11 Oct', time: '09:30 pm', t: 'Retargeting refresh', where: 'Paid search' },
  { day: 'Wed, 12 Oct', time: '10:00 am', t: 'Partner webinar', where: 'Partners' }, { day: 'Thu, 13 Oct', time: '04:00 pm', t: 'Launch recap post', where: 'Social' },
];
const W = 560;
const H = 170;
const smooth = (xs: number[], max: number) => xs.map((v, i) => {
  const x = (i / (xs.length - 1)) * W;
  const y = H - 24 - (v / max) * (H - 50);
  const px = ((i - 1) / (xs.length - 1)) * W;
  const py = H - 24 - ((xs[i - 1] ?? v) / max) * (H - 50);
  return i ? `C${(px + x) / 2} ${py}, ${(px + x) / 2} ${y}, ${x} ${y}` : `M${x} ${y}`;
}).join(' ');

export default function CampaignPerformance() {
  const [range, setRange] = React.useState<Range>('Oct');
  const [wk, setWk] = React.useState<number | null>(null);
  const c = CURVES[range];
  const max = Math.max(...c.reach, ...c.leads) * 1.1;
  const at = wk ?? c.reach.length - 1;
  const conv = ((c.leads[at]! / c.reach[at]!) * 100).toFixed(0);
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left @container" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><MegaphoneIcon className="size-4" /></span><span className="truncate text-sm font-semibold">Amplify</span></SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Marketing"><SidebarItem icon={<LayoutDashboardIcon />} label="Overview" /><SidebarItem icon={<MegaphoneIcon />} label="Campaigns" active /><SidebarItem icon={<TargetIcon />} label="Audiences" /><SidebarItem icon={<CalendarIcon />} label="Calendar" /><SidebarItem icon={<BarChartIcon />} label="Reports" /></SidebarGroup>
              <SidebarGroup><SidebarItem icon={<SettingsIcon />} label="Settings" /></SidebarGroup>
            </SidebarContent>
          </Sidebar>
        }
      >
        <Topbar className="bg-background">
          <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-xl border bg-muted/50 px-3 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40"><SearchIcon className="size-4" /><input aria-label="Search" placeholder="Search campaigns" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="ml-auto"><BellIcon /></Button>
          <Avatar name="Kristin Watson" size="sm" />
        </Topbar>
        <AppContent className="bg-muted/40">
          <div className="grid gap-4 @3xl:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="min-w-0">
              <div className="grid gap-4 @lg:grid-cols-3">
                <section className={cn(panel, 'flex flex-col items-center text-center')} aria-label="Campaign owner"><span className="rounded-full p-1 ring-2 ring-primary/40"><Avatar name="Kristin Watson" size="lg" /></span><p className="mt-2 text-sm font-semibold">Kristin Watson</p><p className="text-xs text-muted-foreground">Growth lead</p><p className="mt-3 flex gap-4 text-xs tabular-nums text-muted-foreground"><span><b className="text-foreground">11</b> live</span><span><b className="text-foreground">56</b> sent</span></p></section>
                <section className="rounded-2xl bg-gradient-to-br from-warning/45 via-destructive/25 to-primary/25 p-4 sm:p-5" aria-label="Lead goal"><p className="text-xs text-foreground/70">Leads against goal</p><p className="mt-4 font-display text-5xl font-semibold tabular-nums tracking-tight">83%</p><p className="mt-1 text-xs text-foreground/70">691 of 830 this month</p></section>
                <section className="rounded-2xl bg-gradient-to-br from-success/40 via-info/25 to-primary/20 p-4 sm:p-5" aria-label="Budget used"><p className="text-xs text-foreground/70">Budget used</p><p className="mt-4 font-display text-5xl font-semibold tabular-nums tracking-tight">56%</p><p className="mt-1 text-xs text-foreground/70">₹2.4L of ₹4.3L</p></section>
              </div>
              <section className={cn(panel, 'mt-4')} aria-labelledby="cp-focus">
                <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 id="cp-focus" className="text-sm font-semibold">Reach and leads</h2><p className="text-xs text-muted-foreground">Weekly, thousands</p></div><Segmented value={range} onValueChange={(v) => { setRange(v); setWk(null); }} options={(['Aug', 'Sep', 'Oct'] as const).map((r) => ({ value: r, label: r }))} /></div>
                <div className="mt-3">
                  <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring/40" role="img" tabIndex={0} aria-label={`Week ${at + 1}: reach ${c.reach[at]}K, leads ${c.leads[at]}K.`}
                    onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setWk(Math.round(((e.clientX - r.left) / r.width) * (c.reach.length - 1))); }} onPointerLeave={() => setWk(null)}
                    onKeyDown={(e) => { if (e.key === 'ArrowRight') setWk(Math.min(c.reach.length - 1, at + 1)); if (e.key === 'ArrowLeft') setWk(Math.max(0, at - 1)); }} onBlur={() => setWk(null)}>
                    <path d={smooth(c.reach, max)} fill="none" className="stroke-destructive" strokeWidth="2.25" strokeLinecap="round" />
                    <path d={smooth(c.leads, max)} fill="none" className="stroke-primary" strokeWidth="2.25" strokeLinecap="round" />
                    <line x1={(at / (c.reach.length - 1)) * W} x2={(at / (c.reach.length - 1)) * W} y1="8" y2={H - 24} className="stroke-foreground/25" strokeDasharray="3 3" />
                    {c.reach.map((_, i) => <text key={i} x={(i / (c.reach.length - 1)) * W} y={H - 6} textAnchor={i === 0 ? 'start' : i === c.reach.length - 1 ? 'end' : 'middle'} className="fill-muted-foreground text-[11px]">Wk {i + 1}</text>)}
                  </svg>
                </div>
                <div className="mt-1 flex flex-wrap items-end justify-between gap-3"><p className="flex gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-destructive" />Reach</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-primary" />Leads</span></p><p className="text-right"><span className="font-display text-3xl font-semibold tabular-nums">{conv}%</span><span className="block text-xs text-muted-foreground">Wk {at + 1} lead rate</span></p></div>
              </section>
            </div>
            <div className="grid content-start gap-4">
              <section className={panel} aria-labelledby="cp-up"><h2 id="cp-up" className="text-sm font-semibold">Upcoming sends</h2><ul className="mt-2 divide-y">{LAUNCHES.map((l) => <li key={l.t} className="py-2.5 text-xs"><p className="flex justify-between tabular-nums text-muted-foreground"><span>{l.day}</span><span>{l.time}</span></p><p className="mt-0.5 text-[13px] font-semibold">{l.t}</p><p className="text-muted-foreground">{l.where}</p></li>)}</ul></section>
              <section className={panel} aria-labelledby="cp-ch"><h2 id="cp-ch" className="text-sm font-semibold">Channel goals</h2><ul className="mt-3 grid gap-3">{CHANNELS.map((x) => <li key={x.name}><div className="flex justify-between text-xs"><span className="font-medium">{x.name}</span><span className="tabular-nums text-muted-foreground">{x.pct}%</span></div><div className="mt-1 h-1.5 rounded-full bg-secondary" aria-hidden><div className={cn('h-full rounded-full', x.tone)} style={{ width: `${x.pct}%` }} /></div></li>)}</ul></section>
            </div>
          </div>
        </AppContent>
      </AppShell>
    </div>
  );
}
