'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.55 0.15 135)', '--primary-foreground': '#fff', '--ring': 'oklch(0.55 0.15 135)', '--accent': 'color-mix(in oklab, oklch(0.55 0.15 135) 14%, var(--background))', '--accent-foreground': 'oklch(0.55 0.15 135)' } as React.CSSProperties;


type Tab = 'Overview' | 'Invoices' | 'Costs' | 'Reports';
type Status = 'Paid' | 'Due' | 'Overdue';
const TABS: Tab[] = ['Overview', 'Invoices', 'Costs', 'Reports'];
const INVOICES = [
  { id: 'INV-3021', client: 'Northwind Logistics', due: 'Jun 12', amt: 7200, st: 'Paid' as Status },
  { id: 'INV-3020', client: 'Kestrel Health', due: 'Jun 09', amt: 4850, st: 'Paid' as Status },
  { id: 'INV-3019', client: 'Bluepeak Retail', due: 'May 28', amt: 3100, st: 'Overdue' as Status },
  { id: 'INV-3018', client: 'Ordo Finance', due: 'Jun 18', amt: 9400, st: 'Due' as Status },
  { id: 'INV-3017', client: 'Lumen Learning', due: 'Jun 21', amt: 1980, st: 'Due' as Status },
  { id: 'INV-3016', client: 'Harbor and Pine', due: 'May 30', amt: 2650, st: 'Overdue' as Status },
  { id: 'INV-3015', client: 'Tessera Labs', due: 'Jun 02', amt: 5300, st: 'Paid' as Status },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REV = [41, 44, 43, 49, 52, 50, 56, 61, 58, 66, 70, 74];
const COST = [33, 35, 37, 36, 40, 44, 41, 45, 47, 46, 52, 53];
const BAL = [12, -4, 9, 18, -7, 14, 22, -3, 16, 25, 11, 28, -6, 19, 24, 8, 21, -2, 17, 30, 13, 26, 9, 31];
const CATS = [['Software', 18400, 31], ['Payroll', 14200, 24], ['Marketing', 9800, 17], ['Office', 7600, 13], ['Travel', 5200, 9], ['Other', 3900, 6]] as const;
const TONE: Record<Status, string> = { Paid: 'text-success', Due: 'text-warning', Overdue: 'text-destructive' };
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const W = 600;
const H = 200;

/** A dense finance-ops screen with top navigation: metrics, a revenue and cost chart with toggles, and a filterable invoice table. */
export default function LedgerOps() {
  const [tab, setTab] = React.useState<Tab>('Overview');
  const [show, setShow] = React.useState({ rev: true, cost: true });
  const [filter, setFilter] = React.useState<Status | 'All'>('All');
  const [sort, setSort] = React.useState<'due' | 'amt'>('amt');
  const [at, setAt] = React.useState<number | null>(null);
  const [payee, setPayee] = React.useState<string | null>(null);
  const [paid, setPaid] = React.useState<string | null>(null);
  const rows = INVOICES.filter((r) => filter === 'All' || r.st === filter).sort((a, b) => (sort === 'amt' ? b.amt - a.amt : a.due.localeCompare(b.due)));
  const i = at ?? MONTHS.length - 1;
  const x = (k: number) => (k / 11) * W;
  const y = (v: number) => H - 24 - ((v - 25) / 55) * (H - 40);
  const path = (d: number[]) => d.map((v, k) => `${k ? 'L' : 'M'}${x(k)} ${y(v)}`).join(' ');
  const outstanding = INVOICES.filter((r) => r.st !== 'Paid').reduce((a, r) => a + r.amt, 0);
  const maxB = 32;
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-background text-left" style={THEME}>
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center gap-6 border-b px-5">
          <span className="flex items-center gap-2 py-3 text-sm font-semibold"><span className="grid size-6 place-items-center rounded-md bg-foreground text-[11px] font-bold text-background">Σ</span>Sigma</span>
          <nav className="flex gap-1" aria-label="Sections">
            {TABS.map((t) => <button key={t} type="button" aria-current={tab === t} onClick={() => setTab(t)} className={cn('-mb-px border-b-2 px-3 py-3.5 text-[13px] outline-none transition-colors focus-visible:bg-secondary', tab === t ? 'border-primary font-semibold text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>{t}</button>)}
          </nav>
          <span className="ml-auto text-xs text-muted-foreground">Fiscal year 2025</span>
        </header>
        <div className="@container min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-4 @2xl:grid-cols-[1fr_1fr_1.4fr]">
            <section aria-label="Deliveries" className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Revenue, June</p><p className="mt-1 font-display text-2xl font-semibold tabular-nums">{usd(REV[5]! * 1000)}</p><div className="mt-3 flex h-6 items-end gap-0.5" aria-hidden>{REV.slice(0, 6).map((v, k) => <span key={k} className="flex-1 rounded-sm bg-success/70" style={{ height: `${(v / 74) * 100}%` }} />)}</div></section>
            <section aria-label="Costs" className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Costs, June</p><p className="mt-1 font-display text-2xl font-semibold tabular-nums">{usd(COST[5]! * 1000)}</p><div className="mt-3 flex h-6 items-end gap-0.5" aria-hidden>{COST.slice(0, 6).map((v, k) => <span key={k} className="flex-1 rounded-sm bg-destructive/60" style={{ height: `${(v / 74) * 100}%` }} />)}</div></section>
            <section aria-label="Outstanding" className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Outstanding invoices</p><p className="mt-1 font-display text-2xl font-semibold tabular-nums">{usd(outstanding)}</p><div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden>{(['Due', 'Overdue'] as const).map((s) => <span key={s} className={s === 'Due' ? 'bg-warning' : 'bg-destructive'} style={{ width: `${(INVOICES.filter((r) => r.st === s).reduce((a, r) => a + r.amt, 0) / outstanding) * 100}%` }} />)}</div><p className="mt-2 text-xs text-muted-foreground">{INVOICES.filter((r) => r.st === 'Overdue').length} overdue, {INVOICES.filter((r) => r.st === 'Due').length} due soon</p></section>
          </div>

          <div className="mt-4 grid gap-4 @3xl:grid-cols-[1.15fr_1fr]">
            <section className="rounded-xl border p-4" aria-labelledby="lo-rc">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="lo-rc" className="text-sm font-semibold">Revenue and costs</h2>
                <div className="flex gap-3 text-xs">
                  {([['rev', 'Revenue', 'bg-success'], ['cost', 'Costs', 'bg-destructive']] as const).map(([k, l, c]) => <label key={k} className="flex cursor-pointer items-center gap-1.5"><input type="checkbox" checked={show[k]} onChange={() => setShow((s) => ({ ...s, [k]: !s[k] }))} className="size-3.5 accent-[var(--primary)]" /><span className={cn('size-2 rounded-sm', c)} />{l}</label>)}
                </div>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring/40" role="img" tabIndex={0} aria-label={`${MONTHS[i]}: revenue ${REV[i]}K, costs ${COST[i]}K`}
                onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setAt(Math.max(0, Math.min(11, Math.round(((e.clientX - r.left) / r.width) * 11)))); }} onPointerLeave={() => setAt(null)}
                onKeyDown={(e) => { if (e.key === 'ArrowRight') setAt(Math.min(11, i + 1)); if (e.key === 'ArrowLeft') setAt(Math.max(0, i - 1)); }} onBlur={() => setAt(null)}>
                {[30, 50, 70].map((g) => <line key={g} x1="0" x2={W} y1={y(g)} y2={y(g)} className="stroke-border" strokeDasharray="2 5" />)}
                {show.rev && <path d={path(REV)} fill="none" className="stroke-success" strokeWidth="2" strokeLinejoin="round" />}
                {show.cost && <path d={path(COST)} fill="none" className="stroke-destructive" strokeWidth="2" strokeLinejoin="round" />}
                <line x1={x(i)} x2={x(i)} y1="4" y2={H - 24} className="stroke-foreground/25" />
                {show.rev && <circle cx={x(i)} cy={y(REV[i]!)} r="4" className="fill-card stroke-success" strokeWidth="2" />}
                {show.cost && <circle cx={x(i)} cy={y(COST[i]!)} r="4" className="fill-card stroke-destructive" strokeWidth="2" />}
                {MONTHS.map((m, k) => k % 2 === 0 && <text key={m} x={x(k)} y={H - 6} textAnchor={k === 0 ? 'start' : 'middle'} className="fill-muted-foreground text-[10px]">{m}</text>)}
              </svg>
              <p className="mt-1 text-xs tabular-nums text-muted-foreground"><b className="text-foreground">{MONTHS[i]}</b> revenue {usd(REV[i]! * 1000)}, costs {usd(COST[i]! * 1000)}, margin {Math.round(((REV[i]! - COST[i]!) / REV[i]!) * 100)}%</p>
            </section>

            <section className="rounded-xl border p-4" aria-labelledby="lo-cat">
              <h2 id="lo-cat" className="text-sm font-semibold">Costs by category</h2>
              <ul className="mt-3 grid gap-2.5">
                {CATS.map(([n, v, p]) => <li key={n} className="text-[13px]"><div className="flex justify-between"><span>{n}</span><span className="tabular-nums text-muted-foreground">{usd(v)} <span className="ml-1 inline-block w-7 text-right">{p}%</span></span></div><div className="mt-1 h-1 rounded-full bg-secondary" aria-hidden><div className="h-full rounded-full bg-primary" style={{ width: `${p * 3}%` }} /></div></li>)}
              </ul>
              <h3 className="mt-5 text-xs font-medium text-muted-foreground">Daily balance change</h3>
              <div className="mt-2 flex h-14 gap-0.5" role="img" aria-label="Daily balance change, mostly positive">{BAL.map((v, k) => <span key={k} className="grid flex-1 grid-rows-2"><span className="flex items-end">{v >= 0 && <span className="w-full rounded-t-sm bg-success/70" style={{ height: `${(v / maxB) * 100}%` }} />}</span><span className="flex items-start">{v < 0 && <span className="w-full rounded-b-sm bg-destructive/70" style={{ height: `${(-v / maxB) * 100}%` }} />}</span></span>)}</div>
            </section>
          </div>

          <section className="mt-4 grid gap-4 @2xl:grid-cols-[18rem_1fr]" aria-label="Cash card">
            <div className="relative overflow-hidden rounded-xl bg-primary p-4 text-primary-foreground"><div aria-hidden className="absolute -right-6 -top-8 size-28 rounded-full bg-white/15" /><p className="relative text-xs opacity-80">Operating account</p><p className="relative mt-1 font-display text-2xl font-semibold tabular-nums">$84,260.00</p><p className="relative mt-6 font-mono text-xs tracking-[0.2em]">•••• 4417</p></div>
            <div className="rounded-xl border p-4"><p className="text-sm font-semibold">Quick payment</p><div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pay a vendor">{['Dana Cruz', 'Eli Park', 'Leo Hart', 'Amara Obi', 'Sam Roe'].map((n) => <button key={n} type="button" aria-pressed={payee === n} aria-label={n} onClick={() => { setPayee(n); setPaid(null); }} className={cn('rounded-full p-0.5 outline-none ring-2 ring-transparent focus-visible:ring-ring/50', payee === n && 'ring-primary')}><Avatar name={n} size="md" /></button>)}</div><div className="mt-3 flex items-center gap-2"><button type="button" disabled={!payee} onClick={() => setPaid(`$1,200 sent to ${payee}.`)} className="h-8 rounded-lg bg-foreground px-3 text-xs font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40">Send $1,200</button><p className="text-xs text-muted-foreground" aria-live="polite">{paid ?? (payee ? `Paying ${payee}.` : 'Pick a vendor to pay.')}</p></div></div>
          </section>

          <section className="mt-4 rounded-xl border" aria-labelledby="lo-inv">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <h2 id="lo-inv" className="text-sm font-semibold">Invoices</h2>
              <div className="flex flex-wrap items-center gap-1 text-xs">
                {(['All', 'Paid', 'Due', 'Overdue'] as const).map((f) => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={cn('rounded-md px-2.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50', filter === f ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary')}>{f}</button>)}
                <span className="mx-1 h-4 w-px bg-border" /><button type="button" onClick={() => setSort(sort === 'amt' ? 'due' : 'amt')} className="rounded-md px-2.5 py-1 text-muted-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50">Sorted by {sort === 'amt' ? 'amount' : 'due date'}</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-[13px]">
                <caption className="sr-only">Invoices</caption>
                <thead><tr className="text-left text-xs text-muted-foreground"><th scope="col" className="px-4 py-2 font-medium">Invoice</th><th scope="col" className="py-2 font-medium">Client</th><th scope="col" className="py-2 font-medium">Due</th><th scope="col" className="py-2 font-medium">Status</th><th scope="col" className="px-4 py-2 text-right font-medium">Amount</th></tr></thead>
                <tbody>
                  {rows.map((r) => <tr key={r.id} className="border-t"><td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.id}</td><th scope="row" className="py-2.5 text-left font-medium">{r.client}</th><td className="py-2.5 tabular-nums text-muted-foreground">{r.due}</td><td className={cn('py-2.5 text-xs font-semibold', TONE[r.st])}>{r.st}</td><td className="px-4 py-2.5 text-right tabular-nums">{usd(r.amt)}</td></tr>)}
                  {rows.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No invoices with that status.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
