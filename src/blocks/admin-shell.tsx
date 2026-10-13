'use client';

import * as React from 'react';
import { BellIcon, BarChartIcon, CalendarIcon, SortIcon, IndianRupeeIcon, LayoutDashboardIcon, LogOutIcon, MegaphoneIcon, SearchIcon, SettingsIcon, TargetIcon, UserCircleIcon, UsersIcon, WalletIcon } from '@/components/ui/icons';
import { AppContent, AppShell, PageHeader, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkline } from '@/components/ui/charts';
import { type DateRange } from '@/components/ui/calendar';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { StatCard } from '@/components/ui/stat-card';
import { Timeline } from '@/components/ui/timeline';

type Page = { group: string; title: string };

export default function AdminShell() {
  const [page, setPage] = React.useState<Page>({ group: 'Overview', title: 'Dashboard' });
  const [range, setRange] = React.useState<DateRange>();
  const is = (t: string) => page.title === t;
  const go = (group: string, title: string) => () => setPage({ group, title });
  const sub = (group: string, titles: string[]) => titles.map((t) => ({ label: t, active: is(t), onClick: go(group, t) }));

  return (
    <div className="h-[640px] overflow-hidden rounded-xl border text-left">
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">A</span>
              <span className="truncate text-sm font-semibold">Acme Industries</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Overview">
                <SidebarItem icon={<LayoutDashboardIcon />} label="Dashboard" active={is('Dashboard')} onClick={go('Overview', 'Dashboard')} />
              </SidebarGroup>
              <SidebarGroup label="People">
                <SidebarItem icon={<UsersIcon />} label="Employees" active={is('Employees')} onClick={go('People', 'Employees')} />
                <SidebarItem icon={<CalendarIcon />} label="Leave" badge="3" items={sub('People', ['Requests', 'Balances'])} />
                <SidebarItem icon={<WalletIcon />} label="Payroll" active={is('Payroll')} onClick={go('People', 'Payroll')} />
              </SidebarGroup>
              <SidebarGroup label="Marketing">
                <SidebarItem icon={<MegaphoneIcon />} label="Campaigns" active={is('Campaigns')} onClick={go('Marketing', 'Campaigns')} />
                <SidebarItem icon={<TargetIcon />} label="Leads" active={is('Leads')} onClick={go('Marketing', 'Leads')} />
                <SidebarItem icon={<BarChartIcon />} label="Reports" active={is('Reports')} onClick={go('Marketing', 'Reports')} />
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarItem icon={<SettingsIcon />} label="Settings" active={is('Settings')} onClick={go('Admin', 'Settings')} />
            </SidebarFooter>
          </Sidebar>
        }
      >
        <Topbar>
          <Breadcrumb className="ml-1" items={[{ label: page.group }, { label: page.title }]} />
          <button className="ml-auto hidden h-8 w-52 items-center gap-2 rounded-md border bg-muted/60 px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary md:flex">
            <SearchIcon className="size-3.5" /> Search <Kbd className="ml-auto">/</Kbd>
          </button>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative max-md:ml-auto">
            <BellIcon />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md p-1 pr-1.5 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/40">
                <Avatar name="Aarav Mehta" size="sm" />
                <SortIcon className="hidden size-3.5 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>aarav@acme.co</DropdownMenuLabel>
              <DropdownMenuItem><UserCircleIcon /> Profile</DropdownMenuItem>
              <DropdownMenuItem><SettingsIcon /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive><LogOutIcon /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Topbar>

        <AppContent>
          <PageHeader title={page.title} description="Switch pages from the sidebar. Only the dashboard has content in this demo." actions={<DateRangePicker value={range} onChange={setRange} placeholder="Last 30 days" className="w-64" clearable />} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Headcount" value="142" delta={4.2} icon={<UsersIcon />} chart={<Sparkline data={[3, 4, 4, 5, 6, 6, 8, 9]} />} />
            <StatCard label="Revenue" value="₹48.2L" delta={12.5} icon={<IndianRupeeIcon />} chart={<Sparkline data={[2, 3, 2.5, 4, 5, 4.6, 6, 7]} className="text-success" />} />
            <StatCard label="Open leads" value="64" delta={-3.1} icon={<TargetIcon />} chart={<Sparkline data={[8, 7, 7.5, 6, 6.2, 5, 5.4, 4]} className="text-destructive" />} className="sm:col-span-2 xl:col-span-1" />
          </div>
          <Card className="mt-4">
            <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
            <CardContent>
              <Timeline items={[
                { title: 'Diya Rao requested 3 days of casual leave', time: '10m ago', tone: 'warning', icon: <CalendarIcon /> },
                { title: 'Diwali campaign reached 200 leads', time: '2h ago', tone: 'success', icon: <MegaphoneIcon /> },
                { title: 'September payroll processed', time: 'Yesterday', tone: 'info', icon: <WalletIcon /> },
              ]} />
            </CardContent>
          </Card>
        </AppContent>
      </AppShell>
    </div>
  );
}
