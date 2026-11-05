'use client';

import * as React from 'react';
import { ArrowDownLeftIcon, ArrowUpRightIcon, BellIcon, CreditCardIcon, DownloadIcon, HelpCircleIcon, LayoutDashboardIcon, PieChartIcon, PlusIcon, ReceiptIcon, SearchIcon, SettingsIcon, TargetIcon, WalletIcon } from '@/components/ui/icons';
import { AppContent, AppShell, Topbar } from '@/components/ui/app-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.58 0.15 42)', '--primary-foreground': '#fff', '--ring': 'oklch(0.58 0.15 42)' } as React.CSSProperties;

const panel = 'rounded-2xl border bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:p-5';
const inr = (n: number) => `${n < 0 ? '-' : ''}₹${Math.abs(n).toLocaleString('en-IN')}`;
const FLOW = {
  '6m': { labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], inc: [190, 201, 208, 212, 219, 221], out: [131, 125, 118, 115, 114, 112] },
  '12m': { labels: ['N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O'], inc: [170, 182, 176, 185, 190, 196, 190, 201, 208, 212, 219, 221], out: [128, 141, 130, 127, 131, 133, 131, 125, 118, 115, 114, 112] },
};
const TX = [
  { who: 'Acme Inc. salary', when: '12 Oct', cat: 'Income', amt: 185000 },
  { who: 'Rent, Koramangala', when: '11 Oct', cat: 'Housing', amt: -42000 },
  { who: 'Big Basket', when: '10 Oct', cat: 'Food', amt: -3860 },
  { who: 'Freelance invoice #214', when: '08 Oct', cat: 'Income', amt: 36000 },
  { who: 'Apollo Pharmacy', when: '07 Oct', cat: 'Health', amt: -1240 },
];
const GOALS = [{ name: 'Emergency fund', saved: 240000, goal: 300000 }, { name: 'Goa trip', saved: 38000, goal: 90000 }, { name: 'New laptop', saved: 52000, goal: 140000 }];
const PEOPLE = ['Diya Rao', 'Rohan Das', 'Isha Nair', 'Kabir Shah'];

export default function FinanceDashboard() {
  const [span, setSpan] = React.useState<'6m' | '12m'>('6m');
  const [to, setTo] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState('5000');
  const [sent, setSent] = React.useState<string | null>(null);
  const [goals, setGoals] = React.useState(GOALS);
  const f = FLOW[span];
  const max = Math.max(...f.inc);
  const saved = f.inc.reduce((a, b) => a + b, 0) - f.out.reduce((a, b) => a + b, 0);
  const moved = goals[1]!.saved > GOALS[1]!.saved;
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border text-left @container" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><WalletIcon className="size-4" /></span><span className="truncate text-sm font-semibold">Ledgerly</span></SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Money">
                <SidebarItem icon={<LayoutDashboardIcon />} label="Overview" active /><SidebarItem icon={<CreditCardIcon />} label="Cards" /><SidebarItem icon={<ReceiptIcon />} label="Transactions" /><SidebarItem icon={<PieChartIcon />} label="Budgets" /><SidebarItem icon={<TargetIcon />} label="Goals" />
              </SidebarGroup>
              <SidebarGroup label="Account"><SidebarItem icon={<SettingsIcon />} label="Settings" /><SidebarItem icon={<HelpCircleIcon />} label="Help" /></SidebarGroup>
            </SidebarContent>
            <SidebarFooter><p className="px-1 text-xs text-muted-foreground">Last synced 2 minutes ago</p></SidebarFooter>
          </Sidebar>
        }
      >
        <Topbar className="bg-background">
          <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-xl border bg-muted/50 px-3 text-[13px] text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40"><SearchIcon className="size-4" /><input aria-label="Search" placeholder="Search transactions" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="ml-auto"><BellIcon /></Button>
          <Avatar name="Aarav Mehta" size="sm" />
        </Topbar>
        <AppContent className="bg-muted/40">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><h1 className="text-xl font-semibold tracking-tight">Good morning, Aarav</h1><p className="text-[13px] text-muted-foreground">Here is where your money stands this month.</p></div>
            <Button size="sm" variant="outline"><DownloadIcon /> Statement</Button>
          </div>

          <div className="grid gap-4 @2xl:grid-cols-5">
            <section className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground @2xl:col-span-2" aria-labelledby="fd-bal">
              <div aria-hidden className="absolute -right-10 -top-12 size-44 rounded-full bg-white/10" /><div aria-hidden className="absolute -bottom-16 right-8 size-36 rounded-full bg-white/10" />
              <h2 id="fd-bal" className="relative text-[13px] font-medium opacity-80">Total balance</h2>
              <p className="relative mt-2 font-display text-4xl font-semibold tabular-nums tracking-tight">₹12,40,320</p>
              <p className="relative mt-1 text-xs opacity-80">Across 3 accounts</p>
              <div className="relative mt-8 flex items-end justify-between"><div><p className="font-mono text-sm tracking-[0.2em]">•••• 2719</p><p className="mt-1 text-xs opacity-80">Aarav Mehta, 09/28</p></div><span className="text-sm font-bold tracking-wider">VISA</span></div>
            </section>
            <section className={cn(panel, '@2xl:col-span-3')} aria-labelledby="fd-flow">
              <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 id="fd-flow" className="text-sm font-semibold">Cash flow</h2><p className="mt-1 text-xs text-muted-foreground">Saved <span className="font-semibold text-success tabular-nums">₹{saved.toLocaleString('en-IN')}K</span> over this period</p></div><Segmented value={span} onValueChange={setSpan} options={[{ value: '6m', label: '6 months' }, { value: '12m', label: '12 months' }]} /></div>
              <div className="mt-5 flex h-36 items-end gap-2" role="img" aria-label={`Income and spending per month, ${span}`}>
                {f.labels.map((l, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col justify-end"><div className="flex flex-1 items-end justify-center gap-0.5"><span title={`Income ₹${f.inc[i]}K`} className="w-full max-w-3 rounded-t-md bg-primary" style={{ height: `${(f.inc[i]! / max) * 100}%` }} /><span title={`Spending ₹${f.out[i]}K`} className="w-full max-w-3 rounded-t-md bg-primary/25" style={{ height: `${(f.out[i]! / max) * 100}%` }} /></div><span className="mt-1.5 text-center text-[11px] text-muted-foreground">{l}</span></div>
                ))}
              </div>
              <p className="mt-2 flex gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-primary" />Income</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-primary/25" />Spending</span></p>
            </section>
          </div>

          <div className="mt-4 grid gap-4 @2xl:grid-cols-5">
            <section className={cn(panel, '@2xl:col-span-3')} aria-labelledby="fd-tx">
              <h2 id="fd-tx" className="text-sm font-semibold">Recent activity</h2>
              <ul className="mt-2 divide-y">
                {TX.map((t) => (
                  <li key={t.who} className="flex items-center gap-3 py-3">
                    <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', t.amt > 0 ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{t.amt > 0 ? <ArrowDownLeftIcon className="size-4" /> : <ArrowUpRightIcon className="size-4" />}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{t.who}</p><p className="text-xs text-muted-foreground">{t.cat}, {t.when}</p></div>
                    <p className={cn('text-[13px] font-semibold tabular-nums', t.amt > 0 && 'text-success')}>{t.amt > 0 ? '+' : ''}{inr(t.amt)}</p>
                  </li>
                ))}
              </ul>
            </section>
            <div className="grid content-start gap-4 @2xl:col-span-2">
              <section className={panel} aria-labelledby="fd-send">
                <h2 id="fd-send" className="text-sm font-semibold">Quick transfer</h2>
                <div className="mt-3 flex gap-2" role="group" aria-label="Send to">
                  {PEOPLE.map((p) => <button key={p} type="button" aria-pressed={to === p} aria-label={p} onClick={() => { setTo(p); setSent(null); }} className={cn('rounded-full p-0.5 outline-none ring-2 ring-transparent transition-shadow focus-visible:ring-ring/50', to === p && 'ring-primary')}><Avatar name={p} size="md" /></button>)}
                  <button type="button" aria-label="Add person" className="grid size-10 place-items-center rounded-full border border-dashed text-muted-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50"><PlusIcon className="size-4" /></button>
                </div>
                <div className="mt-3 flex gap-2">
                  <label className="flex h-9 flex-1 items-center gap-1 rounded-xl border bg-background px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40"><span className="text-muted-foreground">₹</span><input inputMode="numeric" aria-label="Amount" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} className="w-full bg-transparent tabular-nums outline-none" /></label>
                  <Button size="sm" disabled={!to || !amount} onClick={() => setSent(`₹${Number(amount).toLocaleString('en-IN')} sent to ${to}.`)}>Send</Button>
                </div>
                <p className="mt-2 min-h-4 text-xs text-muted-foreground" aria-live="polite">{sent ?? (to ? `Sending to ${to}.` : 'Pick someone to send to.')}</p>
              </section>
              <section className="flex items-center gap-4 rounded-2xl bg-accent p-4 sm:p-5" aria-label="Tip">
                <div className="grid size-16 shrink-0 grid-cols-4 gap-0.5" aria-hidden>{[0.15, 0.3, 0.55, 1, 0.3, 0.55, 1, 0.55, 0.55, 1, 0.55, 0.3, 1, 0.55, 0.3, 0.15].map((o, k) => <span key={k} className="rounded-[3px] bg-primary" style={{ opacity: o }} />)}</div>
                <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold">{moved ? `Moved. Goa trip is now at ${Math.round((goals[1]!.saved / goals[1]!.goal) * 100)}%.` : `You saved ₹${saved.toLocaleString('en-IN')}K this period.`}</p><p className="mt-0.5 text-xs text-muted-foreground">{moved ? 'Nice. Keep it up next month.' : 'Move ₹30,000 of it to your Goa trip goal?'}</p><Button className="mt-2" size="sm" disabled={moved} onClick={() => setGoals((g) => g.map((x, k) => (k === 1 ? { ...x, saved: x.saved + 30000 } : x)))}>{moved ? 'Done' : 'Move it'}</Button></div>
              </section>
              <section className={panel} aria-labelledby="fd-goals">
                <h2 id="fd-goals" className="text-sm font-semibold">Goals</h2>
                <ul className="mt-3 grid gap-3.5">{goals.map((g) => <li key={g.name}><div className="flex items-baseline justify-between text-[13px]"><span className="font-medium">{g.name}</span><span className="text-xs tabular-nums text-muted-foreground">{Math.round((g.saved / g.goal) * 100)}%</span></div><div className="mt-1.5 h-1.5 rounded-full bg-secondary" aria-hidden><div className="h-full rounded-full bg-primary" style={{ width: `${(g.saved / g.goal) * 100}%` }} /></div><p className="mt-1 text-xs tabular-nums text-muted-foreground">{inr(g.saved)} of {inr(g.goal)}</p></li>)}</ul>
              </section>
            </div>
          </div>
        </AppContent>
      </AppShell>
    </div>
  );
}
