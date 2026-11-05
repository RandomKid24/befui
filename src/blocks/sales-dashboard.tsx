'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.55 0.21 18)', '--primary-foreground': '#fff', '--ring': 'oklch(0.55 0.21 18)' } as React.CSSProperties;

const STAGES = ['Qualified', 'Proposal', 'Negotiation', 'Contract', 'Won'] as const;
type Deal = { id: number; co: string; rep: string; lakh: number; stage: number; age: number };
// Demo pipeline. The funnel above is computed from this list, so advancing a deal changes the funnel.
const SEED: Deal[] = [
  { id: 1, co: 'Northwind Logistics', rep: 'Armin A.', lakh: 18.4, stage: 0, age: 4 }, { id: 2, co: 'Harbor and Pine', rep: 'Eren Y.', lakh: 6.2, stage: 0, age: 9 },
  { id: 3, co: 'Tessera Labs', rep: 'Mikaso A.', lakh: 9.8, stage: 0, age: 2 }, { id: 4, co: 'Lumen Learning', rep: 'Armin A.', lakh: 4.1, stage: 0, age: 13 },
  { id: 5, co: 'Kestrel Health', rep: 'Eren Y.', lakh: 22.5, stage: 1, age: 7 }, { id: 6, co: 'Ordo Finance', rep: 'Mikaso A.', lakh: 14.0, stage: 1, age: 11 },
  { id: 7, co: 'Bluepeak Retail', rep: 'Armin A.', lakh: 11.3, stage: 1, age: 5 }, { id: 8, co: 'Rolf Inc.', rep: 'Mikaso A.', lakh: 42.3, stage: 2, age: 16 },
  { id: 9, co: 'Quill and Co', rep: 'Eren Y.', lakh: 7.7, stage: 2, age: 8 }, { id: 10, co: 'Vantage Metals', rep: 'Armin A.', lakh: 19.2, stage: 3, age: 3 },
  { id: 11, co: 'Fable Foods', rep: 'Eren Y.', lakh: 12.6, stage: 3, age: 6 }, { id: 12, co: 'Delta Print', rep: 'Mikaso A.', lakh: 8.9, stage: 4, age: 0 },
  { id: 13, co: 'Sable Studios', rep: 'Armin A.', lakh: 15.1, stage: 4, age: 0 }, { id: 14, co: 'Ironbark Co-op', rep: 'Eren Y.', lakh: 10.4, stage: 4, age: 0 },
];
const lakh = (n: number) => `₹${n.toFixed(1)}L`;
const sum = (xs: Deal[]) => xs.reduce((a, d) => a + d.lakh, 0);

export default function SalesDashboard() {
  const [deals, setDeals] = React.useState(SEED);
  const [sel, setSel] = React.useState(2);
  const [note, setNote] = React.useState('');
  const by = STAGES.map((_, k) => deals.filter((d) => d.stage === k));
  const top = Math.max(...by.map(sum));
  const open = deals.filter((d) => d.stage < 4);
  const won = by[4]!;
  const list = [...by[sel]!].sort((a, b) => b.lakh - a.lakh);
  const advance = (d: Deal) => { setDeals((ds) => ds.map((x) => (x.id === d.id ? { ...x, stage: x.stage + 1, age: 0 } : x))); setNote(`${d.co} moved to ${STAGES[d.stage + 1]}.`); };
  const reps = ['Armin A.', 'Eren Y.', 'Mikaso A.'].map((r) => ({ r, won: sum(won.filter((d) => d.rep === r)), open: sum(open.filter((d) => d.rep === r)) }));
  const rmax = Math.max(...reps.map((x) => x.won + x.open));
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-background text-left" style={THEME}>
      <div className="@container flex h-full flex-col overflow-y-auto">
        <header className="flex shrink-0 flex-wrap items-end justify-between gap-x-10 gap-y-3 px-6 pb-4 pt-6">
          <div><p className="text-xs text-muted-foreground">Q4 pipeline, Closeline</p><p className="font-display text-5xl font-semibold tabular-nums leading-none tracking-tight">{lakh(sum(open))}<span className="ml-3 text-base font-normal text-muted-foreground">open across {open.length} deals</span></p></div>
          <p className="text-right"><span className="font-display text-3xl font-semibold tabular-nums text-primary">{lakh(sum(won))}</span><span className="block text-xs text-muted-foreground">won so far, {won.length} deals</span></p>
        </header>

        <ol className="grid shrink-0 grid-cols-5 items-end gap-px px-6" aria-label="Pipeline stages">
          {STAGES.map((s, k) => (
            <li key={s} className="min-w-0">
              <button type="button" aria-pressed={sel === k} onClick={() => { setSel(k); setNote(''); }} className="group block w-full text-left outline-none">
                <span className="block px-1 pb-1.5"><span className="block truncate text-xs text-muted-foreground group-hover:text-foreground">{s}</span><span className="block font-display text-xl font-semibold tabular-nums">{lakh(sum(by[k]!))}</span></span>
                <span className={cn('flex items-end border-b-2 px-1 transition-colors group-focus-visible:ring-2 group-focus-visible:ring-ring', sel === k ? 'border-primary bg-primary text-primary-foreground' : 'border-transparent bg-secondary group-hover:bg-accent')} style={{ height: `${3 + (sum(by[k]!) / top) * 6}rem` }}><span className="pb-1.5 text-xs font-semibold tabular-nums">{by[k]!.length} deals</span></span>
              </button>
            </li>
          ))}
        </ol>

        <div className="grid min-h-0 flex-1 gap-x-10 gap-y-8 px-6 pb-6 pt-6 @3xl:grid-cols-[minmax(0,1fr)_16rem]">
          <section aria-labelledby="sd-list" className="min-w-0">
            <div className="flex items-baseline justify-between"><h2 id="sd-list" className="font-display text-xl font-semibold tracking-tight">{STAGES[sel]}</h2><p className="text-xs text-muted-foreground" aria-live="polite">{note || `${list.length} deals, oldest first matters most`}</p></div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[26rem] text-[13px]">
                <caption className="sr-only">Deals in {STAGES[sel]}</caption>
                <thead><tr className="border-b text-left text-xs text-muted-foreground"><th scope="col" className="py-2 font-medium">Company</th><th scope="col" className="py-2 font-medium">Owner</th><th scope="col" className="py-2 text-right font-medium">Age</th><th scope="col" className="py-2 text-right font-medium">Value</th><th scope="col" className="w-24 py-2"><span className="sr-only">Action</span></th></tr></thead>
                <tbody>
                  {list.map((d) => (
                    <tr key={d.id} className="border-b">
                      <th scope="row" className="py-2.5 text-left font-medium">{d.co}</th>
                      <td className="py-2.5"><span className="flex items-center gap-2"><Avatar name={d.rep} size="xs" />{d.rep}</span></td>
                      <td className={cn('py-2.5 text-right tabular-nums', d.age > 10 ? 'font-semibold text-destructive' : 'text-muted-foreground')}>{sel === 4 ? 'Closed' : `${d.age}d`}</td>
                      <td className="py-2.5 text-right tabular-nums">{lakh(d.lakh)}</td>
                      <td className="py-2.5 text-right">{sel < 4 && <button type="button" onClick={() => advance(d)} aria-label={`Move ${d.co} to ${STAGES[sel + 1]}`} className="rounded-md border px-2.5 py-1 text-xs font-medium outline-none hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring/50">Advance</button>}</td>
                    </tr>
                  ))}
                  {list.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Nothing in {STAGES[sel]} right now.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <aside aria-labelledby="sd-reps">
            <h2 id="sd-reps" className="font-display text-xl font-semibold tracking-tight">By owner</h2>
            <ul className="mt-3 grid gap-4">
              {reps.map((x) => (
                <li key={x.r}><p className="flex items-center justify-between text-[13px]"><span className="flex items-center gap-2 font-medium"><Avatar name={x.r} size="xs" />{x.r}</span><span className="tabular-nums text-muted-foreground">{lakh(x.won + x.open)}</span></p>
                  <p className="mt-1.5 flex h-2 overflow-hidden rounded-sm bg-secondary" role="img" aria-label={`${x.r}: ${lakh(x.won)} won, ${lakh(x.open)} open`}><span className="bg-primary" style={{ width: `${(x.won / rmax) * 100}%` }} /><span className="bg-primary/30" style={{ width: `${(x.open / rmax) * 100}%` }} /></p></li>
              ))}
            </ul>
            <p className="mt-3 flex gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 bg-primary" />Won</span><span className="flex items-center gap-1.5"><span className="size-2 bg-primary/30" />Open</span></p>
          </aside>
        </div>
      </div>
    </div>
  );
}
