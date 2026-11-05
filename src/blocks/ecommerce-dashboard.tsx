'use client';

import * as React from 'react';
import { ArrowDownRightIcon, ArrowUpRightIcon, BellIcon, BarChartIcon, DownloadIcon, FilterIcon, HelpCircleIcon, LayoutDashboardIcon, PackageIcon, ReceiptIcon, SearchIcon, SettingsIcon, ShoppingBagIcon, ShoppingCartIcon, UsersIcon } from '@/components/ui/icons';
import { AppContent, AppShell, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.52 0.2 285)', '--primary-foreground': '#fff', '--ring': 'oklch(0.52 0.2 285)' } as React.CSSProperties;

const panel = 'rounded-2xl border bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:p-5';
const CHANNELS = [{ key: 'Web', cls: 'bg-primary' }, { key: 'Mobile', cls: 'bg-primary/65' }, { key: 'Marketplace', cls: 'bg-primary/40' }, { key: 'Wholesale', cls: 'bg-primary/20' }] as const;
// Revenue per month in thousand dollars, one entry per channel, bottom to top.
const MONTHS = [{ m: 'Aug', v: [38, 21, 14, 9] }, { m: 'Sep', v: [42, 25, 15, 11] }, { m: 'Oct', v: [47, 31, 17, 12] }, { m: 'Nov', v: [51, 38, 19, 12] }, { m: 'Dec', v: [66, 44, 24, 16] }, { m: 'Jan', v: [58, 41, 22, 14] }];
const ORDERS = [
  { id: '#4821', who: 'Kestrel Health', item: 'Starter kit x40', total: 2480, state: 'Paid' }, { id: '#4820', who: 'Bluepeak Retail', item: 'Display stands x12', total: 1190, state: 'Pending' },
  { id: '#4819', who: 'Northwind Logistics', item: 'Label printers x6', total: 3340, state: 'Paid' }, { id: '#4818', who: 'Ordo Finance', item: 'Desk sets x25', total: 960, state: 'Refunded' }, { id: '#4817', who: 'Lumen Learning', item: 'Starter kit x15', total: 1075, state: 'Paid' },
];
const PRODUCTS = [{ name: 'Starter kit', type: 'Bundle', share: 78, amount: 18420 }, { name: 'Label printer', type: 'Hardware', share: 54, amount: 12980 }, { name: 'Display stand', type: 'Hardware', share: 36, amount: 8610 }, { name: 'Desk set', type: 'Bundle', share: 22, amount: 5240 }];
const tone = { Paid: 'success', Pending: 'warning', Refunded: 'danger' } as const;
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

function Delta({ v }: { v: number }) {
  const up = v >= 0;
  const Icon = up ? ArrowUpRightIcon : ArrowDownRightIcon;
  return <span className={cn('inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums', up ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive')}><Icon className="size-3" /> {Math.abs(v)}%</span>;
}

export default function EcommerceDashboard() {
  const [view, setView] = React.useState<'revenue' | 'orders'>('revenue');
  const [pick, setPick] = React.useState(MONTHS.length - 2);
  const totals = MONTHS.map((x) => x.v.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals);
  const cur = MONTHS[pick]!;
  const total = totals[pick]!;
  const mult = view === 'revenue' ? 1 : 6.4;
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left @container" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-background"><ShoppingBagIcon className="size-4" /></span><span className="truncate text-sm font-semibold">Marketly</span></SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="General"><SidebarItem icon={<LayoutDashboardIcon />} label="Dashboard" active /><SidebarItem icon={<ReceiptIcon />} label="Payments" /><SidebarItem icon={<UsersIcon />} label="Customers" /><SidebarItem icon={<ShoppingCartIcon />} label="Orders" badge="8" /></SidebarGroup>
              <SidebarGroup label="Tools"><SidebarItem icon={<PackageIcon />} label="Products" /><SidebarItem icon={<BarChartIcon />} label="Analytics" badge="Beta" /></SidebarGroup>
              <SidebarGroup label="Support"><SidebarItem icon={<SettingsIcon />} label="Settings" /><SidebarItem icon={<HelpCircleIcon />} label="Help" /></SidebarGroup>
            </SidebarContent>
            <SidebarFooter><button type="button" className="flex w-full items-center gap-2 rounded-xl border p-2 text-start outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/40"><span className="grid size-8 place-items-center rounded-lg bg-success/15 text-xs font-bold text-success">MK</span><span className="grid text-xs leading-tight"><span className="font-semibold">Marketing team</span><span className="text-muted-foreground">Workspace</span></span></button></SidebarFooter>
          </Sidebar>
        }
      >
        <Topbar className="bg-background">
          <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-xl border bg-muted/50 px-3 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40"><SearchIcon className="size-4" /><input aria-label="Search" placeholder="Search orders, customers" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="ml-auto"><BellIcon /></Button>
          <Avatar name="Rhea Kapoor" size="sm" />
        </Topbar>
        <AppContent className="bg-muted/40">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex flex-wrap items-center gap-2"><Segmented value={view} onValueChange={setView} options={[{ value: 'revenue', label: 'Revenue' }, { value: 'orders', label: 'Orders' }]} /><Button size="sm" variant="outline"><FilterIcon /> Filter</Button><Button size="sm" variant="outline"><DownloadIcon /> Export</Button></div>
          </div>
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-3">
            {[['Page views', '12,450', 15.8], ['Total revenue', '$363.95', -34.0], ['Bounce rate', '86.5%', 24.2]].map(([l, v, d]) => (
              <section key={l as string} className={panel} aria-label={l as string}><p className="text-[13px] text-muted-foreground">{l}</p><p className="mt-2 flex flex-wrap items-center gap-2"><span className="font-display text-2xl font-semibold tabular-nums tracking-tight">{v}</span><Delta v={d as number} /></p></section>
            ))}
          </div>
          <section className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-info p-5 text-primary-foreground" aria-label="Best seller">
            <div aria-hidden className="absolute -right-8 -top-10 size-40 rounded-full bg-white/15" /><div aria-hidden className="absolute bottom-[-3rem] right-24 size-28 rounded-full bg-white/10" />
            <p className="relative text-xs opacity-80">Best seller this month</p><p className="relative mt-1 font-display text-3xl font-semibold tracking-tight">Starter kit</p><p className="relative mt-1 text-[13px] opacity-90"><span className="tabular-nums">1,284</span> sold, up 18% on last month</p><Button className="relative mt-3" size="sm" variant="secondary">View product</Button>
          </section>
          <div className="mt-4 grid gap-4 @2xl:grid-cols-5">
            <section className={cn(panel, '@2xl:col-span-3')} aria-labelledby="ec-sales">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><h2 id="ec-sales" className="text-sm font-semibold">Sales overview</h2><p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight">{view === 'revenue' ? usd(Math.round(total * mult * 1000)) : Math.round(total * mult).toLocaleString('en-US')}</p><p className="mt-0.5 text-xs text-muted-foreground">{cur.m}, all channels</p></div>
                <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground" aria-label="Channels">{CHANNELS.map((c) => <li key={c.key} className="flex items-center gap-1.5"><span className={cn('size-2 rounded-sm', c.cls)} />{c.key}</li>)}</ul>
              </div>
              <div className="mt-5 flex h-48 items-end gap-3" role="group" aria-label="Revenue by month and channel">
                {MONTHS.map((mo, i) => (
                  <button key={mo.m} type="button" onClick={() => setPick(i)} aria-pressed={pick === i} aria-label={`${mo.m}: ${totals[i]} thousand dollars`} className={cn('group flex h-full flex-1 flex-col justify-end gap-0.5 outline-none transition-opacity', pick !== i && 'opacity-55 hover:opacity-100 focus-visible:opacity-100')}>
                    <span className="flex w-full flex-col-reverse gap-0.5" style={{ height: `${(totals[i]! / max) * 88}%` }}>{mo.v.map((v, k) => <span key={k} className={cn('w-full rounded-md first:rounded-b-lg last:rounded-t-lg group-focus-visible:ring-2 group-focus-visible:ring-ring/50', CHANNELS[k]!.cls)} style={{ flexGrow: v, flexBasis: 0 }} />)}</span>
                    <span className="mt-1.5 text-center text-[11px] text-muted-foreground">{mo.m}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className={cn(panel, '@2xl:col-span-2')} aria-labelledby="ec-dist">
              <h2 id="ec-dist" className="text-sm font-semibold">Distribution, {cur.m}</h2>
              <div className="mt-4 flex items-center gap-4">
                <svg viewBox="0 0 36 36" className="size-28 shrink-0 -rotate-90" role="img" aria-label={`Channel split for ${cur.m}`}>
                  {(() => { let off = 0; return cur.v.map((v, k) => { const len = (v / total) * 100; const el = <circle key={k} cx="18" cy="18" r="14" fill="none" strokeWidth="6" pathLength="100" strokeDasharray={`${Math.max(len - 1, 0)} 100`} strokeDashoffset={-off} className={['stroke-primary', 'stroke-primary/65', 'stroke-primary/40', 'stroke-primary/20'][k]} />; off += len; return el; }); })()}
                </svg>
                <ul className="grid flex-1 gap-2 text-[13px]">{cur.v.map((v, k) => <li key={k} className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-muted-foreground"><span className={cn('size-2 rounded-sm', CHANNELS[k]!.cls)} />{CHANNELS[k]!.key}</span><span className="font-medium tabular-nums">{Math.round((v / total) * 100)}%</span></li>)}</ul>
              </div>
            </section>
          </div>
          <div className="mt-4 grid gap-4 @2xl:grid-cols-5">
            <section className={cn(panel, '@2xl:col-span-3')} aria-labelledby="ec-orders">
              <div className="flex items-center justify-between"><h2 id="ec-orders" className="text-sm font-semibold">Recent orders</h2><Button size="sm" variant="ghost">See all</Button></div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[30rem] text-[13px]">
                  <caption className="sr-only">Recent orders</caption>
                  <thead><tr className="text-left text-xs text-muted-foreground"><th scope="col" className="pb-2 font-medium">Order</th><th scope="col" className="pb-2 font-medium">Customer</th><th scope="col" className="pb-2 font-medium">Status</th><th scope="col" className="pb-2 text-right font-medium">Total</th></tr></thead>
                  <tbody>{ORDERS.map((o) => <tr key={o.id} className="border-t"><td className="py-2.5 font-mono text-xs text-muted-foreground">{o.id}</td><th scope="row" className="py-2.5 text-left font-medium">{o.who}<span className="block text-xs font-normal text-muted-foreground">{o.item}</span></th><td className="py-2.5"><Badge variant={tone[o.state as keyof typeof tone]} dot>{o.state}</Badge></td><td className="py-2.5 text-right tabular-nums">{usd(o.total)}</td></tr>)}</tbody>
                </table>
              </div>
            </section>
            <section className={cn(panel, '@2xl:col-span-2')} aria-labelledby="ec-prod">
              <h2 id="ec-prod" className="text-sm font-semibold">Top products</h2>
              <ul className="mt-3 grid gap-4">{PRODUCTS.map((p) => <li key={p.name}><div className="flex items-baseline justify-between text-[13px]"><span className="font-medium">{p.name} <span className="text-xs font-normal text-muted-foreground">{p.type}</span></span><span className="tabular-nums">{usd(p.amount)}</span></div><div className="mt-1.5 h-1.5 rounded-full bg-secondary" aria-hidden><div className="h-full rounded-full bg-primary" style={{ width: `${p.share}%` }} /></div></li>)}</ul>
            </section>
          </div>
        </AppContent>
      </AppShell>
    </div>
  );
}
