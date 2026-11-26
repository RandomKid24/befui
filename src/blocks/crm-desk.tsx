'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/charts';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingShell, GlassPanel, glass } from '@/components/ui/floating-shell';
import { formatCurrency } from '@/components/ui/format';
import { BriefcaseIcon, CheckIcon, GridIcon, KanbanIcon, TargetIcon, TrophyIcon } from '@/components/ui/icons';
import { RevealGroup } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

// Demo data: swap for your API. Every figure on screen is worked out from these rows.
const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'] as const;
type Deal = { id: string; name: string; company: string; owner: string; value: number; stage: (typeof stages)[number] };
const start: Deal[] = [
  { id: '1', name: 'Rooftop solar, phase 2', company: 'Greenfield Mills', owner: 'Ananya Rao', value: 2_400_000, stage: 'Negotiation' },
  { id: '2', name: 'Cold store retrofit', company: 'Frostline Foods', owner: 'Imran Qureshi', value: 1_650_000, stage: 'Proposal' },
  { id: '3', name: 'Campus EV charging', company: 'Northgate School', owner: 'Ananya Rao', value: 980_000, stage: 'Qualified' },
  { id: '4', name: 'Boiler replacement', company: 'Sunrise Hospital', owner: 'Leela Iyer', value: 3_100_000, stage: 'Proposal' },
  { id: '5', name: 'Energy audit', company: 'Coastal Hotels', owner: 'Imran Qureshi', value: 240_000, stage: 'Lead' },
  { id: '6', name: 'Warehouse lighting', company: 'Metro Logistics', owner: 'Leela Iyer', value: 720_000, stage: 'Won' },
  { id: '7', name: 'Heat pump pilot', company: 'Valley Dairy', owner: 'Ananya Rao', value: 1_150_000, stage: 'Won' },
];
const revenue = [['Jun', 9.1], ['Jul', 11.4], ['Aug', 10.2], ['Sep', 13.8], ['Oct', 12.6]] as const;
const money = (n: number) => formatCurrency(n, { compact: true });
const sum = (ds: Deal[]) => ds.reduce((t, d) => t + d.value, 0);

export default function CrmDesk() {
  const [view, setView] = React.useState('overview');
  const [deals, setDeals] = React.useState(start);
  const [done, setDone] = React.useState<string[]>([]);
  const open = deals.filter((d) => d.stage !== 'Won');
  const won = deals.filter((d) => d.stage === 'Won');
  const next = [...open].sort((a, b) => stages.indexOf(b.stage) - stages.indexOf(a.stage) || b.value - a.value)[0];
  const owners = [...new Set(deals.map((d) => d.owner))].map((name) => ({ name, won: sum(won.filter((d) => d.owner === name)), open: sum(open.filter((d) => d.owner === name)) })).sort((a, b) => b.won - a.won);
  const advance = (id: string) => setDeals((all) => all.map((d) => (d.id === id ? { ...d, stage: stages[Math.min(stages.indexOf(d.stage) + 1, stages.length - 1)] } : d)));
  const tasks = ['Send revised quote to Frostline Foods', 'Call Sunrise Hospital about site access', 'Confirm survey date with Northgate School'];
  const tiles = [['Won this month', money(sum(won))], ['Open pipeline', money(sum(open))], ['Open deals', String(open.length)], ['Share of deals won', `${Math.round((won.length / deals.length) * 100)}%`]];

  return (
    <FloatingShell
      className="[--primary:#4d7c0f] dark:[--primary:#bef264] dark:[--primary-foreground:#1a2e05]"
      brand={{ name: 'Fernline', tagline: 'Sales desk', mark: <TargetIcon /> }}
      value={view}
      onChange={setView}
      groups={[{ label: 'Menu', items: [{ id: 'overview', label: 'Overview', icon: <GridIcon /> }, { id: 'pipeline', label: 'Pipeline', icon: <KanbanIcon />, badge: open.length }, { id: 'team', label: 'Team', icon: <TrophyIcon /> }] }]}
      footer={<><p className="text-xs text-muted-foreground">Monthly target ₹40L</p><p className="text-lg font-semibold tabular-nums">{Math.round((sum(won) / 4_000_000) * 100)}% reached</p><div aria-hidden className="mt-1 h-1.5 overflow-hidden rounded-sm bg-foreground/10"><div className="h-full bg-primary transition-[width]" style={{ width: `${Math.min(100, (sum(won) / 4_000_000) * 100)}%` }} /></div></>}
    >
      {view === 'overview' && (
        <div className="grid gap-3">
          <RevealGroup className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {tiles.map(([label, value]) => <div key={label} className={cn(glass, 'p-4')}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p></div>)}
          </RevealGroup>
          <RevealGroup className="grid gap-3 xl:grid-cols-3 [&>:first-child]:xl:col-span-2 [&>:last-child]:xl:col-span-3" step={90}>
            <GlassPanel title="Revenue won" note="Last five months, ₹ lakh" className="h-full"><BarChart height={200} data={revenue.map(([label, value]) => ({ label, value }))} /></GlassPanel>
            <GlassPanel title="Closest to closing" className="h-full bg-primary/15">
              {next ? <><p className="text-lg font-semibold">{next.name}</p><p className="text-xs text-muted-foreground">{next.company}, {next.stage.toLowerCase()}</p><p className="my-3 text-3xl font-semibold tabular-nums">{money(next.value)}</p><Button className="w-full" onClick={() => advance(next.id)}>Move to {stages[stages.indexOf(next.stage) + 1]}</Button></> : <p className="text-sm">Every deal is won.</p>}
            </GlassPanel>
            <GlassPanel title="Today" note={`${tasks.length - done.length} to do`} className="h-full">
              <ul className="divide-y divide-foreground/10">
                {tasks.map((t) => <li key={t}><label className="flex items-center gap-3 py-2.5 text-sm"><Checkbox checked={done.includes(t)} onCheckedChange={(v) => setDone(v ? [...done, t] : done.filter((x) => x !== t))} /><span className={cn(done.includes(t) && 'text-muted-foreground line-through')}>{t}</span></label></li>)}
              </ul>
            </GlassPanel>
          </RevealGroup>
        </div>
      )}
      {view === 'pipeline' && (
        <GlassPanel title="Pipeline" note="Grouped by stage, nearest to closing first">
          {[...stages].reverse().map((stage) => {
            const rows = deals.filter((d) => d.stage === stage);
            return (
              <section key={stage} aria-label={stage} className="border-t border-foreground/10 py-3 first:border-t-0">
                <h3 className="flex justify-between text-xs font-semibold text-muted-foreground"><span>{stage}</span><span className="tabular-nums">{money(sum(rows))}</span></h3>
                {!rows.length && <p className="py-2 text-xs text-muted-foreground">No deals here.</p>}
                <ul>
                  {rows.map((d) => (
                    <li key={d.id} className="flex flex-wrap items-center gap-3 py-2">
                      <BriefcaseIcon className="size-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{d.name}</p><p className="truncate text-xs text-muted-foreground">{d.company}, {d.owner}</p></div>
                      <span className="text-sm tabular-nums">{money(d.value)}</span>
                      {stage === 'Won' ? <CheckIcon className="size-4 text-success" /> : <Button size="sm" variant="outline" aria-label={`Move ${d.name} to the next stage`} onClick={() => advance(d.id)}>Advance</Button>}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </GlassPanel>
      )}
      {view === 'team' && (
        <RevealGroup className="grid gap-3 md:grid-cols-3">
          {owners.map((o, i) => <GlassPanel key={o.name}><div className="flex items-center gap-3"><Avatar name={o.name} /><div><h2 className="text-sm font-semibold">{o.name}</h2><p className="text-xs text-muted-foreground">Rank {i + 1} by won value</p></div></div><dl className="mt-4 grid grid-cols-2 gap-2"><div><dt className="text-xs text-muted-foreground">Won</dt><dd className="text-xl font-semibold tabular-nums">{money(o.won)}</dd></div><div><dt className="text-xs text-muted-foreground">Open</dt><dd className="text-xl font-semibold tabular-nums">{money(o.open)}</dd></div></dl></GlassPanel>)}
        </RevealGroup>
      )}
    </FloatingShell>
  );
}
