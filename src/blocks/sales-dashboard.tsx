'use client';

import * as React from 'react';
import { ArrowUpRightIcon, BarChartIcon, BellIcon, FolderIcon, LayoutDashboardIcon, ReceiptIcon, SearchIcon, SettingsIcon, StarIcon, TargetIcon, UsersIcon } from '@/components/ui/icons';
import { AppContent, AppShell, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.55 0.21 18)', '--primary-foreground': '#fff', '--ring': 'oklch(0.55 0.21 18)' } as React.CSSProperties;

const panel = 'rounded-2xl border bg-card p-4 sm:p-5';
type Metric = 'revenue' | 'leads' | 'won';
const MONTHS = ['Jun', 'Jul', 'Aug'];
// Per source, per month: revenue in dollars, leads, deals won.
const SOURCES = [
  { name: 'Referrals', revenue: [71200, 76400, 79900], leads: [62, 71, 78], won: [14, 17, 18], share: 43 },
  { name: 'Outbound', revenue: [41800, 44100, 56500], leads: [118, 126, 141], won: [8, 9, 12], share: 27 },
  { name: 'Partners', revenue: [30900, 36200, 38100], leads: [44, 51, 49], won: [7, 9, 9], share: 18 },
  { name: 'Inbound', revenue: [19800, 17200, 20100], leads: [210, 188, 226], won: [5, 4, 6], share: 12 },
];
const WEEKS = [412, 436, 421, 468, 455, 430, 479, 512, 498, 536, 521, 574];
const REPS = [{ name: 'Armin A.', amount: 209633, share: 39.6 }, { name: 'Eren Y.', amount: 156841, share: 29.7 }, { name: 'Mikaso A.', amount: 117115, share: 22.1 }];
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export default function SalesDashboard() {
  const [src, setSrc] = React.useState(0);
  const [metric, setMetric] = React.useState<Metric>('revenue');
  const s = SOURCES[src]!;
  const series = s[metric];
  const top = Math.max(...series);
  const total = SOURCES.reduce((a, x) => a + sum(x.revenue), 0);
  const TARGET = 450;
  let streak = 0;
  for (let k = WEEKS.length - 1; k >= 0 && WEEKS[k]! >= TARGET; k--) streak++;
  const first = Math.min(...WEEKS) * 0.9;
  const last = Math.max(...WEEKS);
  const line = WEEKS.map((v, i) => `${i ? 'L' : 'M'}${(i / (WEEKS.length - 1)) * 300} ${60 - ((v - first) / (last - first)) * 52}`).join(' ');
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left @container" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><TargetIcon className="size-4" /></span><span className="truncate text-sm font-semibold">Closeline</span></SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Workspace"><SidebarItem icon={<LayoutDashboardIcon />} label="Dashboard" /><SidebarItem icon={<ReceiptIcon />} label="Sales list" /><SidebarItem icon={<FolderIcon />} label="Goals" /></SidebarGroup>
              <SidebarGroup label="Reports"><SidebarItem icon={<BarChartIcon />} label="New report" active /><SidebarItem icon={<UsersIcon />} label="Deals by user" /><SidebarItem icon={<StarIcon />} label="Deal duration" /></SidebarGroup>
              <SidebarGroup><SidebarItem icon={<SettingsIcon />} label="Settings" /></SidebarGroup>
            </SidebarContent>
          </Sidebar>
        }
      >
        <Topbar className="bg-background">
          <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-xl border bg-muted/50 px-3 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40"><SearchIcon className="size-4" /><input aria-label="Search" placeholder="Search deals" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="ml-auto"><BellIcon /></Button>
          <Avatar name="Armin Arlert" size="sm" />
        </Topbar>
        <AppContent className="bg-muted/40">
          <div className="grid gap-4 @2xl:grid-cols-5">
            <section className="@2xl:col-span-3" aria-labelledby="sd-rev">
              <h1 className="font-display text-3xl font-light text-muted-foreground">New report</h1>
              <h2 id="sd-rev" className="mt-4 text-sm font-medium">Revenue</h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-display text-5xl font-semibold tabular-nums tracking-tight">{usd(total)}</span><span className="rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">+7.9%</span><span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary">+$27,335</span></p>
              <p className="mt-2 text-xs text-muted-foreground">vs previous $501,641. Jun 1 to Aug 31, 2024.</p>
            </section>
            <div className="grid grid-cols-2 gap-3 @2xl:col-span-2">
              <section className="rounded-2xl bg-foreground p-4 text-background" aria-label="Best deal"><p className="flex items-center justify-between text-xs opacity-70">Best deal <StarIcon className="size-3.5" /></p><p className="mt-2 font-display text-2xl font-semibold tabular-nums">$42,300</p><p className="mt-3 flex items-center justify-between text-xs"><span>Rolf Inc.</span><span className="grid size-6 place-items-center rounded-full bg-background text-foreground"><ArrowUpRightIcon className="size-3" /></span></p></section>
              <section className={cn(panel, 'p-4 sm:p-4')} aria-label="Top sales"><p className="text-xs text-muted-foreground">Top sales</p><p className="mt-2 font-display text-2xl font-semibold tabular-nums">72</p><p className="mt-3 flex items-center gap-1.5 text-xs"><Avatar name="Mikaso A." size="xs" />Mikaso A.</p></section>
            </div>
          </div>

          <ul className="mt-5 grid gap-2 @lg:grid-cols-3" aria-label="Revenue by rep">
            {REPS.map((r) => <li key={r.name} className="flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2 text-[13px]"><Avatar name={r.name} size="xs" /><span className="font-semibold tabular-nums">{usd(r.amount)}</span><span className="ml-auto text-xs tabular-nums text-muted-foreground">{r.share}%</span></li>)}
          </ul>

          <section className={cn(panel, 'mt-4 flex flex-wrap items-center gap-x-6 gap-y-3')} aria-label="Sales streak">
            <div><p className="text-xs text-muted-foreground">Sales streak</p><p className="font-display text-3xl font-semibold tabular-nums">{streak} <span className="text-sm font-normal text-muted-foreground">weeks above {TARGET}</span></p></div>
            <ol className="flex flex-1 basis-64 gap-1" aria-label="Last 12 weeks against target">{WEEKS.map((v, k) => <li key={k} title={`Week ${k + 1}: ${v}`} className={cn('h-8 flex-1 rounded-md', v >= TARGET ? 'bg-primary' : 'bg-secondary')} />)}</ol>
          </section>

          <div className="mt-4 grid gap-4 @2xl:grid-cols-5">
            <section className={cn(panel, '@2xl:col-span-2')} aria-labelledby="sd-src">
              <h2 id="sd-src" className="text-sm font-semibold">Deals by source</h2>
              <ul className="mt-3 grid gap-1">
                {SOURCES.map((x, i) => (
                  <li key={x.name}><button type="button" aria-pressed={src === i} onClick={() => setSrc(i)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50', src === i ? 'bg-accent' : 'hover:bg-secondary')}>
                    <span className="grid size-7 place-items-center rounded-lg bg-background text-[11px] font-bold text-primary ring-1 ring-border">{x.name[0]}</span><span className="flex-1 font-medium">{x.name}</span><span className="tabular-nums text-muted-foreground">{usd(sum(x.revenue))}</span><span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{x.share}%</span>
                  </button></li>
                ))}
              </ul>
            </section>
            <section className={cn(panel, '@2xl:col-span-3')} aria-labelledby="sd-chart">
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="sd-chart" className="text-sm font-semibold">{s.name}, by month</h2><Segmented value={metric} onValueChange={setMetric} options={[{ value: 'revenue', label: 'Revenue' }, { value: 'leads', label: 'Leads' }, { value: 'won', label: 'Won' }]} /></div>
              <div className="mt-5 flex h-40 items-end gap-5">
                {series.map((v, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col justify-end"><span className="mb-1 text-center text-[11px] font-semibold tabular-nums">{metric === 'revenue' ? usd(v) : v}</span><span className={cn('w-full rounded-xl transition-[height] duration-(--dur-base)', i === series.length - 1 ? 'bg-primary' : 'bg-[repeating-linear-gradient(135deg,var(--border)_0_2px,transparent_2px_7px)] ring-1 ring-inset ring-border')} style={{ height: `${(v / top) * 78}%` }} /><span className="mt-1.5 text-center text-[11px] text-muted-foreground">{MONTHS[i]}</span></div>
                ))}
              </div>
            </section>
          </div>

          <section className={cn(panel, 'mt-4')} aria-labelledby="sd-dyn">
            <div className="flex items-baseline justify-between"><h2 id="sd-dyn" className="text-sm font-semibold">Sales dynamic</h2><p className="text-xs text-muted-foreground">Weekly, last 12 weeks</p></div>
            <svg viewBox="0 0 300 66" className="mt-3 h-24 w-full" preserveAspectRatio="none" role="img" aria-label="Weekly sales rising from 412 to 574"><path d={line} fill="none" className="stroke-primary" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" /></svg>
          </section>
        </AppContent>
      </AppShell>
    </div>
  );
}
