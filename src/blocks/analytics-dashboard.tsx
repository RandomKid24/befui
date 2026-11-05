'use client';

import * as React from 'react';
import { ActivityIcon, ArrowDownRightIcon, ArrowUpRightIcon, BellIcon, BarChartIcon, DownloadIcon, EyeIcon, HelpCircleIcon, LayoutDashboardIcon, SearchIcon, SettingsIcon, ShoppingBagIcon, ShoppingCartIcon, TagIcon, UsersIcon, ZapIcon } from '@/components/ui/icons';
import { AppContent, AppShell, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.5 0.24 265)', '--primary-foreground': '#fff', '--ring': 'oklch(0.5 0.24 265)' } as React.CSSProperties;

type Range = '7d' | '30d' | '90d';
// Demo figures per range. Swap for your own API: each KPI is [value, change %], the profit line is one point per step.
const DATA: Record<Range, { kpi: [string, number][]; profit: number[]; labels: string[]; total: string; change: number; days: number[] }> = {
  '7d': { kpi: [['4,210', 8.2], ['1,982', 3.1], ['641', -4.6], ['318', 5.9]], profit: [31, 36, 33, 41, 44, 39, 47], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], total: '$12.4K', change: 6.4, days: [44, 62, 58, 71, 80, 49, 38] },
  '30d': { kpi: [['16,431', 13.1], ['6,225', 6.4], ['2,832', -10.3], ['1,224', 4.4]], profit: [310, 342, 330, 371, 360, 402, 389, 421, 440, 418, 452, 446], labels: ['Jan 1', '', '', 'Jan 10', '', '', 'Jan 20', '', '', '', '', 'Jan 30'], total: '$446.7K', change: 24.4, days: [52, 61, 84, 70, 66, 48, 40] },
  '90d': { kpi: [['48,902', 18.6], ['17,310', 9.8], ['8,115', -2.2], ['3,640', 11.2]], profit: [820, 905, 880, 960, 1010, 990, 1090, 1180, 1140, 1260, 1310, 1390], labels: ['Nov', '', '', 'Dec', '', '', 'Jan', '', '', 'Feb', '', ''], total: '$1.39M', change: 31.2, days: [58, 66, 77, 74, 71, 52, 44] },
};
const KPI = [{ label: 'Page views', icon: EyeIcon }, { label: 'Visitors', icon: UsersIcon }, { label: 'Clicks', icon: ActivityIcon }, { label: 'Orders', icon: ShoppingCartIcon }];
const INSIGHTS = [
  'Repeat buyers grew faster than new ones this period. Most of them came back through the Tuesday email.',
  'Clicks fell while page views rose, which usually means the landing copy is read but not acted on.',
  'Orders per visitor held steady, so the profit gain comes from larger baskets.',
];
const panel = 'rounded-2xl border bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:p-5';

function Delta({ v }: { v: number }) {
  const up = v >= 0;
  const Icon = up ? ArrowUpRightIcon : ArrowDownRightIcon;
  return <span className={cn('inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums', up ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive')}><Icon className="size-3" /> {Math.abs(v)}%</span>;
}

const W = 640;
const H = 190;
/** Smooth line with a soft fill; hover or arrow keys read any point. */
function ProfitChart({ data, labels }: { data: number[]; labels: string[] }) {
  const [at, setAt] = React.useState<number | null>(null);
  const n = data.length;
  const lo = Math.min(...data) * 0.9;
  const hi = Math.max(...data) * 1.05;
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => 10 + (1 - (v - lo) / (hi - lo)) * (H - 36);
  const d = data.map((v, i) => (i ? `C${(x(i - 1) + x(i)) / 2} ${y(data[i - 1]!)}, ${(x(i - 1) + x(i)) / 2} ${y(v)}, ${x(i)} ${y(v)}` : `M${x(i)} ${y(v)}`)).join(' ');
  const cur = at ?? n - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring/40" role="img" tabIndex={0} aria-label={`Profit trend. Point ${cur + 1} of ${n}: ${data[cur]}. Arrow keys move along the line.`}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setAt(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1))))); }} onPointerLeave={() => setAt(null)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') setAt(Math.min(n - 1, cur + 1)); if (e.key === 'ArrowLeft') setAt(Math.max(0, cur - 1)); if (e.key === 'Escape') setAt(null); }} onBlur={() => setAt(null)}>
      <defs><linearGradient id="pf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity=".22" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
      {[0, 1, 2, 3].map((i) => <line key={i} x1="0" x2={W} y1={10 + (i * (H - 36)) / 3} y2={10 + (i * (H - 36)) / 3} className="stroke-border" strokeDasharray="3 5" />)}
      <path d={`${d} L${W} ${H - 26} L0 ${H - 26} Z`} fill="url(#pf)" />
      <path d={d} fill="none" className="stroke-primary" strokeWidth="2.25" strokeLinecap="round" />
      <line x1={x(cur)} x2={x(cur)} y1="6" y2={H - 26} className="stroke-primary/40" strokeDasharray="3 3" />
      <circle cx={x(cur)} cy={y(data[cur]!)} r="5" className="fill-card stroke-primary" strokeWidth="2.5" />
      {labels.map((l, i) => l && <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} className="fill-muted-foreground text-[11px]">{l}</text>)}
    </svg>
  );
}

/** Rounded bars, the busiest one highlighted until you point at another. */
function DayBars({ data }: { data: number[] }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const top = data.indexOf(Math.max(...data));
  const [on, setOn] = React.useState<number | null>(null);
  const cur = on ?? top;
  return (
    <div className="flex h-44 items-end gap-2" onPointerLeave={() => setOn(null)}>
      {data.map((v, i) => (
        <button key={i} type="button" onPointerEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(null)} aria-label={`${days[i]}: ${v}% active`} className="group relative flex h-full flex-1 flex-col justify-end outline-none">
          <span className={cn('mb-1.5 text-center text-[11px] font-semibold tabular-nums transition-opacity', cur === i ? 'opacity-100' : 'opacity-0')}>{v}%</span>
          <span className={cn('w-full rounded-lg transition-[height,background-color] duration-(--dur-base) group-focus-visible:ring-2 group-focus-visible:ring-ring/50', cur === i ? 'bg-primary' : 'bg-secondary')} style={{ height: `${v * 1.4}%` }} />
          <span className="mt-2 text-center text-[11px] text-muted-foreground">{days[i]}</span>
        </button>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [range, setRange] = React.useState<Range>('30d');
  const [tip, setTip] = React.useState(0);
  const d = DATA[range];
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left @container" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><ShoppingBagIcon className="size-4" /></span><span className="truncate text-sm font-semibold">Shopeers</span></SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Menu">
                <SidebarItem icon={<LayoutDashboardIcon />} label="Dashboard" active />
                <SidebarItem icon={<ShoppingCartIcon />} label="Orders" badge="12" />
                <SidebarItem icon={<TagIcon />} label="Products" />
                <SidebarItem icon={<UsersIcon />} label="Customers" />
                <SidebarItem icon={<BarChartIcon />} label="Analytics" />
              </SidebarGroup>
              <SidebarGroup label="Support"><SidebarItem icon={<SettingsIcon />} label="Settings" /><SidebarItem icon={<HelpCircleIcon />} label="Help center" /></SidebarGroup>
            </SidebarContent>
            <SidebarFooter><div className="rounded-xl bg-primary/10 p-3"><p className="flex items-center gap-1.5 text-[13px] font-semibold"><ZapIcon className="size-3.5 text-primary" /> AI insights</p><p className="mt-1 text-xs text-muted-foreground">Repeat buyers are up this week. See why.</p></div></SidebarFooter>
          </Sidebar>
        }
      >
        <Topbar className="bg-background">
          <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-xl border bg-muted/50 px-3 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40"><SearchIcon className="size-4" /><input aria-label="Search" placeholder="Search anything" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative ml-auto"><BellIcon /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" /></Button>
          <Avatar name="Maya Iyer" size="sm" />
        </Topbar>
        <AppContent className="bg-muted/40">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex flex-wrap items-center gap-2"><Segmented value={range} onValueChange={setRange} options={[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }]} /><Button size="sm"><DownloadIcon /> Export</Button></div>
          </div>
          <div className="grid grid-cols-2 gap-4 @3xl:grid-cols-4">
            {KPI.map((k, i) => (
              <section key={k.label} className={panel} aria-label={k.label}>
                <p className="flex items-center justify-between text-[13px] text-muted-foreground">{k.label}<k.icon className="size-4 text-primary" /></p>
                <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-display text-2xl font-semibold tabular-nums tracking-tight">{d.kpi[i]![0]}</span><Delta v={d.kpi[i]![1]} /></p>
                <p className="mt-1 text-xs text-muted-foreground">vs previous period</p>
              </section>
            ))}
          </div>
          <section className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/65 p-4 text-primary-foreground sm:p-5" aria-label="AI insight">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/20"><ZapIcon className="size-4" /></span>
            <p className="min-w-0 flex-1 basis-60 text-[13px] leading-relaxed" aria-live="polite"><b className="mr-1.5">AI insight.</b>{INSIGHTS[tip]}</p>
            <Button size="sm" variant="secondary" onClick={() => setTip((t) => (t + 1) % INSIGHTS.length)}>Next insight</Button>
          </section>
          <div className="mt-4 grid gap-4 @3xl:grid-cols-3">
            <section className={cn(panel, '@3xl:col-span-2')} aria-labelledby="ad-profit">
              <h2 id="ad-profit" className="text-sm font-semibold">Total profit</h2>
              <p className="mt-3 flex flex-wrap items-center gap-2"><span className="font-display text-4xl font-semibold tabular-nums tracking-tight">{d.total}</span><Delta v={d.change} /></p>
              <div className="mt-4"><ProfitChart data={d.profit} labels={d.labels} /></div>
            </section>
            <section className={panel} aria-labelledby="ad-days"><h2 id="ad-days" className="mb-4 text-sm font-semibold">Most active day</h2><DayBars data={d.days} /></section>
          </div>
          <div className="mt-4 grid gap-4 @3xl:grid-cols-3">
            <section className={cn(panel, '@3xl:col-span-2')} aria-labelledby="ad-cust">
              <h2 id="ad-cust" className="text-sm font-semibold">Customers</h2>
              <div className="mt-4 grid gap-4 @lg:grid-cols-3">
                {[['New', '2,084', 'bg-primary', 72], ['Returning', '1,432', 'bg-success', 51], ['Inactive', '562', 'bg-warning', 20]].map(([l, v, c, w]) => (
                  <div key={l as string}><div className="h-1.5 rounded-full bg-secondary" aria-hidden><div className={cn('h-full rounded-full', c as string)} style={{ width: `${w}%` }} /></div><p className="mt-3 font-display text-2xl font-semibold tabular-nums">{v}</p><p className="text-xs text-muted-foreground">{l} customers</p></div>
                ))}
              </div>
            </section>
            <section className={panel} aria-labelledby="ad-repeat">
              <h2 id="ad-repeat" className="text-sm font-semibold">Repeat purchase rate</h2>
              <div className="mt-3 flex items-center gap-4">
                <svg viewBox="0 0 36 36" className="size-24 -rotate-90" role="img" aria-label="38 percent repeat purchase rate"><circle cx="18" cy="18" r="15.5" fill="none" className="stroke-secondary" strokeWidth="4" /><circle cx="18" cy="18" r="15.5" fill="none" className="stroke-primary" strokeWidth="4" strokeLinecap="round" strokeDasharray="38 100" pathLength="100" /></svg>
                <div><p className="font-display text-3xl font-semibold tabular-nums">38%</p><p className="text-xs text-muted-foreground">of buyers ordered again within 60 days</p></div>
              </div>
            </section>
          </div>
        </AppContent>
      </AppShell>
    </div>
  );
}
