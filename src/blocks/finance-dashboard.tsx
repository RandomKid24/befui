'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.58 0.15 42)', '--primary-foreground': '#fff', '--ring': 'oklch(0.58 0.15 42)' } as React.CSSProperties;

const inr = (n: number) => `${n < 0 ? '-' : ''}₹${Math.abs(n).toLocaleString('en-IN')}`;
type Tx = { id: number; day: string; who: string; cat: string; amt: number };
const TX: Tx[] = [
  { id: 1, day: 'Today', who: 'Acme Inc. salary', cat: 'Income', amt: 185000 },
  { id: 2, day: 'Today', who: 'Big Basket', cat: 'Food', amt: -3860 },
  { id: 3, day: 'Yesterday', who: 'Rent, Koramangala', cat: 'Housing', amt: -42000 },
  { id: 4, day: 'Yesterday', who: 'Metro card top-up', cat: 'Transport', amt: -1000 },
  { id: 5, day: 'Yesterday', who: 'Freelance invoice #214', cat: 'Income', amt: 36000 },
  { id: 6, day: '9 Oct', who: 'Apollo Pharmacy', cat: 'Health', amt: -1240 },
  { id: 7, day: '9 Oct', who: 'Swiggy', cat: 'Food', amt: -740 },
  { id: 8, day: '8 Oct', who: 'Electricity board', cat: 'Housing', amt: -2310 },
  { id: 9, day: '8 Oct', who: 'Dividend, index fund', cat: 'Income', amt: 4200 },
];
const ACCOUNTS = [['Salary account', 640320], ['Savings', 420000], ['Travel card', 180000]] as const;
const GOALS = [['Emergency fund', 240000, 300000], ['Goa trip', 38000, 90000], ['New laptop', 52000, 140000]] as const;
const PEOPLE = ['Diya Rao', 'Rohan Das', 'Isha Nair', 'Kabir Shah'];
const FILTERS = ['All', 'Income', 'Spending'] as const;

export default function FinanceDashboard() {
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>('All');
  const [q, setQ] = React.useState('');
  const [to, setTo] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState('5000');
  const [sent, setSent] = React.useState<string | null>(null);
  const [goaSaved, setGoaSaved] = React.useState(38000);
  const rows = TX.filter((t) => (filter === 'All' || (filter === 'Income' ? t.amt > 0 : t.amt < 0)) && (t.who + t.cat).toLowerCase().includes(q.toLowerCase()));
  const days = [...new Set(rows.map((r) => r.day))];
  const biggest = Math.max(...TX.map((t) => Math.abs(t.amt)));
  const total = ACCOUNTS.reduce((a, [, v]) => a + v, 0);
  const moved = goaSaved > 38000;
  const incomeSum = TX.filter((t) => t.amt > 0).reduce((a, t) => a + t.amt, 0);
  const spendSum = TX.filter((t) => t.amt < 0).reduce((a, t) => a + t.amt, 0);
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden @container rounded-2xl border bg-background text-left" style={THEME}>
      <div className="grid h-full @3xl:grid-cols-[23rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6 overflow-y-auto bg-primary p-6 text-primary-foreground" aria-label="Wallet">
          <div><p className="text-xs opacity-75">Ledgerly, total balance</p><p className="mt-1 font-display text-5xl font-semibold tabular-nums leading-none tracking-tight">{inr(total)}</p></div>
          <ul className="grid gap-2.5" aria-label="Accounts">{ACCOUNTS.map(([n, v]) => <li key={n}><p className="flex justify-between text-[13px]"><span>{n}</span><span className="tabular-nums">{inr(v)}</span></p><p className="mt-1 h-1 rounded-full bg-white/20" aria-hidden><span className="block h-full rounded-full bg-white" style={{ width: `${(v / total) * 100}%` }} /></p></li>)}</ul>

          <form onSubmit={(e) => { e.preventDefault(); }} aria-label="Quick transfer" className="border-t border-white/25 pt-5">
            <p className="text-sm font-semibold">Quick transfer</p>
            <div className="mt-3 flex gap-2" role="group" aria-label="Send to">{PEOPLE.map((p) => <button key={p} type="button" aria-pressed={to === p} aria-label={p} onClick={() => { setTo(p); setSent(null); }} className={cn('rounded-full p-0.5 outline-none ring-2 ring-transparent focus-visible:ring-white', to === p && 'ring-white')}><Avatar name={p} size="md" /></button>)}</div>
            <div className="mt-3 flex gap-2"><label className="flex h-9 flex-1 items-center gap-1 rounded-lg bg-white/15 px-3 text-sm focus-within:ring-2 focus-within:ring-white"><span className="opacity-75">₹</span><input inputMode="numeric" aria-label="Amount" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} className="w-full bg-transparent tabular-nums outline-none" /></label>
              <Button type="button" size="sm" variant="secondary" disabled={!to || !amount} onClick={() => setSent(`₹${Number(amount).toLocaleString('en-IN')} sent to ${to}.`)}>Send</Button></div>
            <p className="mt-2 min-h-4 text-xs opacity-80" aria-live="polite">{sent ?? (to ? `Sending to ${to}.` : 'Pick someone to send to.')}</p>
          </form>

          <div className="border-t border-white/25 pt-5">
            <p className="text-sm font-semibold">Goals</p>
            <ul className="mt-3 grid gap-3">{GOALS.map(([n, s, g], k) => { const v = k === 1 ? goaSaved : s; return <li key={n}><p className="flex justify-between text-[13px]"><span>{n}</span><span className="tabular-nums opacity-80">{Math.round((v / g) * 100)}%</span></p><p className="mt-1 h-1 rounded-full bg-white/20" aria-hidden><span className="block h-full rounded-full bg-white transition-[width] duration-(--dur-slow)" style={{ width: `${(v / g) * 100}%` }} /></p></li>; })}</ul>
            <Button className="mt-4" size="sm" variant="secondary" disabled={moved} onClick={() => setGoaSaved((v) => v + 30000)}>{moved ? 'Moved ₹30,000 to Goa trip' : 'Move ₹30,000 to Goa trip'}</Button>
          </div>
        </aside>

        <main className="flex min-h-0 flex-col" aria-labelledby="fd-feed">
          <header className="shrink-0 border-b px-6 py-5">
            <div className="flex flex-wrap items-end justify-between gap-3"><h1 id="fd-feed" className="font-display text-2xl font-semibold tracking-tight">Recent activity</h1>
              <p className="flex gap-5 text-[13px] tabular-nums"><span><span className="text-xs text-muted-foreground">In </span><b className="text-success">{inr(incomeSum)}</b></span><span><span className="text-xs text-muted-foreground">Out </span><b>{inr(spendSum)}</b></span></p></div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex gap-4" role="group" aria-label="Filter">{FILTERS.map((f) => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={cn('-mb-px border-b-2 pb-1.5 text-[13px] outline-none focus-visible:text-foreground', filter === f ? 'border-primary font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground')}>{f}</button>)}</div>
              <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search activity" placeholder="Search activity" className="ml-auto h-8 w-48 rounded-lg border bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
            {days.length === 0 && <p className="py-16 text-center text-[13px] text-muted-foreground">Nothing matches. Clear the search or switch the filter.</p>}
            {days.map((day) => (
              <section key={day} className="mt-5" aria-label={day}>
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{day}</h2>
                <ul className="mt-1 divide-y">{rows.filter((r) => r.day === day).map((t) => (
                  <li key={t.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 py-3">
                    <div className="min-w-0"><p className="truncate text-[13px] font-medium">{t.who}</p><p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><span className="w-16">{t.cat}</span><span className="h-1 w-24 rounded-full bg-secondary" aria-hidden><span className={cn('block h-full rounded-full', t.amt > 0 ? 'bg-success' : 'bg-primary')} style={{ width: `${(Math.abs(t.amt) / biggest) * 100}%` }} /></span></p></div>
                    <p className={cn('text-sm font-semibold tabular-nums', t.amt > 0 && 'text-success')}>{t.amt > 0 ? '+' : ''}{inr(t.amt)}</p>
                  </li>
                ))}</ul>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
