'use client';

import * as React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.52 0.2 285)', '--primary-foreground': '#fff', '--ring': 'oklch(0.52 0.2 285)' } as React.CSSProperties;

type Status = 'Paid' | 'Pending' | 'Refunded' | 'Shipped';
type Channel = 'Web' | 'Mobile' | 'Marketplace' | 'Wholesale';
type Order = { id: string; who: string; item: string; ch: Channel; st: Status; total: number; day: number };
// Demo orders. The facet counts, the totals line and the table are all computed from this list.
const ORDERS: Order[] = [
  { id: '#4831', who: 'Kestrel Health', item: 'Starter kit x40', ch: 'Wholesale', st: 'Paid', total: 2480, day: 11 }, { id: '#4830', who: 'Bluepeak Retail', item: 'Display stands x12', ch: 'Web', st: 'Pending', total: 1190, day: 11 },
  { id: '#4829', who: 'Northwind Logistics', item: 'Label printers x6', ch: 'Marketplace', st: 'Shipped', total: 3340, day: 10 }, { id: '#4828', who: 'Ordo Finance', item: 'Desk sets x25', ch: 'Web', st: 'Refunded', total: 960, day: 10 },
  { id: '#4827', who: 'Lumen Learning', item: 'Starter kit x15', ch: 'Mobile', st: 'Paid', total: 1075, day: 10 }, { id: '#4826', who: 'Harbor and Pine', item: 'Starter kit x8', ch: 'Mobile', st: 'Paid', total: 610, day: 9 },
  { id: '#4825', who: 'Tessera Labs', item: 'Label printers x2', ch: 'Web', st: 'Shipped', total: 1120, day: 9 }, { id: '#4824', who: 'Quill and Co', item: 'Display stands x30', ch: 'Wholesale', st: 'Pending', total: 2870, day: 9 },
  { id: '#4823', who: 'Vantage Metals', item: 'Desk sets x10', ch: 'Marketplace', st: 'Paid', total: 430, day: 8 }, { id: '#4822', who: 'Fable Foods', item: 'Starter kit x20', ch: 'Web', st: 'Paid', total: 1390, day: 8 },
];
const STATUSES: Status[] = ['Paid', 'Pending', 'Shipped', 'Refunded'];
const CHANNELS: Channel[] = ['Web', 'Mobile', 'Marketplace', 'Wholesale'];
const TONE: Record<Status, string> = { Paid: 'text-success', Pending: 'text-warning', Shipped: 'text-info', Refunded: 'text-destructive' };
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
type SortKey = 'total' | 'day';

function Facet<T extends string>({ title, items, on, toggle, count }: { title: string; items: T[]; on: Set<T>; toggle: (v: T) => void; count: (v: T) => number }) {
  return (
    <fieldset className="min-w-0"><legend className="mb-1.5 text-xs font-medium text-muted-foreground">{title}</legend>
      <ul>{items.map((v) => <li key={v}><label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-[13px] hover:bg-secondary"><input type="checkbox" checked={on.has(v)} onChange={() => toggle(v)} className="size-3.5 accent-[var(--primary)]" /><span className="flex-1">{v}</span><span className="text-xs tabular-nums text-muted-foreground">{count(v)}</span></label></li>)}</ul>
    </fieldset>
  );
}

export default function EcommerceDashboard() {
  const [st, setSt] = React.useState(new Set<Status>());
  const [ch, setCh] = React.useState(new Set<Channel>());
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState<{ k: SortKey; dir: 1 | -1 }>({ k: 'day', dir: -1 });
  const [sel, setSel] = React.useState<string | null>(null);
  const flip = <T,>(s: Set<T>, v: T, set: (n: Set<T>) => void) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); set(n); };
  const rows = ORDERS.filter((o) => (!st.size || st.has(o.st)) && (!ch.size || ch.has(o.ch)) && (o.who + o.item + o.id).toLowerCase().includes(q.toLowerCase())).sort((a, b) => (a[sort.k] - b[sort.k]) * sort.dir || b.day - a.day);
  const paid = rows.filter((o) => o.st === 'Paid' || o.st === 'Shipped').reduce((a, o) => a + o.total, 0);
  const picked = ORDERS.find((o) => o.id === sel);
  const head = (k: SortKey, label: string) => <th scope="col" className="py-2 text-right font-medium"><button type="button" onClick={() => setSort((s) => ({ k, dir: s.k === k ? (-s.dir as 1 | -1) : -1 }))} aria-label={`Sort by ${label}`} className="font-medium outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"><span className="inline-flex items-center gap-0.5">{label}{sort.k === k && (sort.dir === -1 ? <ArrowDownIcon className="size-3" /> : <ArrowUpIcon className="size-3" />)}</span></button></th>;
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden @container rounded-2xl border bg-background text-left" style={THEME}>
      <div className="grid h-full @3xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="overflow-y-auto border-b p-5 @3xl:border-b-0 @3xl:border-r" aria-label="Filters">
          <p className="font-display text-xl font-semibold tracking-tight">Marketly</p>
          <p className="mb-5 text-xs text-muted-foreground">Orders, this week</p>
          <div className="grid gap-5">
            <Facet title="Status" items={STATUSES} on={st} toggle={(v) => flip(st, v, setSt)} count={(v) => ORDERS.filter((o) => o.st === v).length} />
            <Facet title="Channel" items={CHANNELS} on={ch} toggle={(v) => flip(ch, v, setCh)} count={(v) => ORDERS.filter((o) => o.ch === v).length} />
          </div>
          {(st.size > 0 || ch.size > 0) && <button type="button" onClick={() => { setSt(new Set()); setCh(new Set()); }} className="mt-4 text-xs font-medium text-primary underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/50">Clear filters</button>}
        </aside>

        <main className="flex min-h-0 flex-col">
          <header className="flex shrink-0 flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b px-6 py-5">
            <p className="flex flex-wrap items-baseline gap-x-8 gap-y-1"><span><span className="font-display text-4xl font-semibold tabular-nums leading-none">{rows.length}</span><span className="ml-2 text-xs text-muted-foreground">orders shown</span></span><span><span className="font-display text-4xl font-semibold tabular-nums leading-none text-primary">{usd(paid)}</span><span className="ml-2 text-xs text-muted-foreground">paid or shipped</span></span></p>
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search orders" placeholder="Search orders or customers" className="h-9 w-64 max-w-full rounded-lg border bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
          </header>
          <div className="min-h-0 flex-1 overflow-auto px-6">
            <table className="w-full min-w-[34rem] text-[13px]">
              <caption className="sr-only">Orders</caption>
              <thead className="sticky top-0 bg-background"><tr className="border-b text-left text-xs text-muted-foreground"><th scope="col" className="py-2 font-medium">Order</th><th scope="col" className="py-2 font-medium">Customer</th><th scope="col" className="py-2 font-medium">Channel</th><th scope="col" className="py-2 font-medium">Status</th>{head('day', 'Day')}{head('total', 'Total')}</tr></thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} aria-selected={sel === o.id} className={cn('cursor-pointer border-b transition-colors', sel === o.id ? 'bg-accent/60' : 'hover:bg-muted/50')} onClick={() => setSel(sel === o.id ? null : o.id)}>
                    <td className="py-3 font-mono text-xs text-muted-foreground"><button type="button" className="outline-none focus-visible:ring-2 focus-visible:ring-ring/50" aria-label={`Open order ${o.id}`}>{o.id}</button></td>
                    <th scope="row" className="py-3 text-left font-medium">{o.who}<span className="block text-xs font-normal text-muted-foreground">{o.item}</span></th>
                    <td className="py-3 text-muted-foreground">{o.ch}</td><td className={cn('py-3 text-xs font-semibold', TONE[o.st])}>{o.st}</td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">Oct {o.day}</td><td className="py-3 text-right tabular-nums">{usd(o.total)}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">No orders match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
          {picked && (
            <section className="shrink-0 border-t bg-muted/40 px-6 py-4" aria-label={`Order ${picked.id}`} aria-live="polite">
              <p className="flex flex-wrap items-baseline justify-between gap-2"><span><b className="font-mono text-xs">{picked.id}</b> <span className="text-[13px] font-medium">{picked.who}</span></span><button type="button" onClick={() => setSel(null)} className="text-xs text-muted-foreground underline underline-offset-4 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">Close</button></p>
              <p className="mt-1 text-[13px] text-muted-foreground">{picked.item}, via {picked.ch}. <span className={cn('font-semibold', TONE[picked.st])}>{picked.st}</span>, {usd(picked.total)}.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
