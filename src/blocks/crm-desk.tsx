'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CapsuleBars, DeskHeader, StatTile, TickDial } from '@/components/ui/desk-kit';
import { FloatingShell, GlassPanel } from '@/components/ui/floating-shell';
import { formatCurrency } from '@/components/ui/format';
import { GridIcon, KanbanIcon, TargetIcon, TrophyIcon } from '@/components/ui/icons';
import { Kanban } from '@/components/ui/kanban';
import { RevealGroup } from '@/components/ui/reveal';
import { Toaster, toast } from '@/components/ui/toast';
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
  const advance = (id: string) => {
    const before = deals;
    const moved = deals.map((d) => (d.id === id ? { ...d, stage: stages[Math.min(stages.indexOf(d.stage) + 1, stages.length - 1)] } : d));
    setDeals(moved);
    const d = moved.find((x) => x.id === id)!;
    toast.success(`${d.name} moved to ${d.stage}`, undefined, { action: { label: 'Undo', onClick: () => setDeals(before) } });
  };
  const tasks = ['Send revised quote to Frostline Foods', 'Call Sunrise Hospital about site access', 'Confirm survey date with Northgate School'];

  return (
    <>
    <Toaster />
    <FloatingShell
      user={{ name: 'Ananya Rao', role: 'Head of sales' }}
      brand={{ name: 'Fernline', tagline: 'Sales desk', mark: <TargetIcon /> }}
      value={view}
      onChange={setView}
      groups={[{ label: 'Menu', items: [{ id: 'overview', label: 'Overview', icon: <GridIcon /> }, { id: 'pipeline', label: 'Pipeline', icon: <KanbanIcon />, badge: open.length }, { id: 'team', label: 'Team', icon: <TrophyIcon /> }] }]}
    >
      {view === 'overview' && (
        <>
          <DeskHeader title="Good morning, Ananya" summary={`${tasks.length - done.length} tasks today, ${open.length} deals open`} actions={<Button onClick={() => setView('pipeline')}><KanbanIcon /> Open pipeline</Button>} />
          <RevealGroup className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatTile hero label="Won this month" value={money(sum(won))} note={`${won.length} deals`} trend={revenue.map(([, v]) => v)} />
            <StatTile label="Open pipeline" value={money(sum(open))} note={`${open.length} deals`} />
            <StatTile label="Average open deal" value={money(open.length ? sum(open) / open.length : 0)} />
            <StatTile label="Share of deals won" value={`${Math.round((won.length / deals.length) * 100)}%`} note={`${won.length} of ${deals.length}`} />
          </RevealGroup>
          <RevealGroup className="grid gap-3 xl:grid-cols-3 [&>:first-child]:xl:col-span-2" step={90}>
            <GlassPanel title="Revenue won" note="Last five months, ₹ lakh" className="h-full"><CapsuleBars label="Revenue won by month in lakh rupees" format={(n) => `₹${n}L`} data={revenue.map(([label, value]) => ({ label, value }))} /></GlassPanel>
            <GlassPanel title="Closest to closing" className="h-full bg-primary/15">
              {next ? <><p className="text-lg font-semibold">{next.name}</p><p className="text-xs text-muted-foreground">{next.company}, {next.stage.toLowerCase()}</p><p className="my-4 text-4xl font-semibold tracking-tight tabular-nums">{money(next.value)}</p><Button className="w-full" onClick={() => advance(next.id)}>Move to {stages[stages.indexOf(next.stage) + 1]}</Button></> : <p className="text-sm">Every deal is won.</p>}
            </GlassPanel>
            <GlassPanel title="Today" note={`${tasks.length - done.length} to do`} className="h-full">
              <ul className="divide-y divide-foreground/10">
                {tasks.map((t) => <li key={t}><label className="flex items-center gap-3 py-2.5 text-sm"><Checkbox checked={done.includes(t)} onCheckedChange={(v) => setDone(v ? [...done, t] : done.filter((x) => x !== t))} /><span className={cn(done.includes(t) && 'text-muted-foreground line-through')}>{t}</span></label></li>)}
              </ul>
            </GlassPanel>
            <GlassPanel title="Leaderboard" note="By value won" className="h-full">
              <ol className="grid gap-3">
                {owners.map((o, i) => <li key={o.name} className="flex items-center gap-3"><span className="w-4 text-sm font-semibold tabular-nums text-muted-foreground">{i + 1}</span><Avatar name={o.name} size="sm" /><span className="min-w-0 flex-1 truncate text-sm">{o.name}</span><span className="text-sm font-semibold tabular-nums">{money(o.won)}</span></li>)}
              </ol>
            </GlassPanel>
            <GlassPanel title="Monthly target" note="₹40L" className="h-full"><TickDial size={170} value={Math.round((sum(won) / 4_000_000) * 100)} label="reached" display={`${Math.round((sum(won) / 4_000_000) * 100)}%`} /></GlassPanel>
          </RevealGroup>
        </>
      )}
      {view === 'pipeline' && (
        <>
          <DeskHeader title="Pipeline" summary={`${open.length} open deals worth ${money(sum(open))}. Drag a card to move it, or focus it and press Alt with an arrow key.`} />
          <Kanban<Deal>
            columns={stages.map((s) => ({ id: s, title: s, tone: s === 'Won' ? 'success' : 'default' }))}
            value={Object.fromEntries(stages.map((s) => [s, deals.filter((d) => d.stage === s)]))}
            onChange={(next) => setDeals(stages.flatMap((s) => (next[s] ?? []).map((d) => ({ ...d, stage: s }))))}
            renderCard={(d) => <div className="grid gap-1.5"><p className="text-sm font-medium">{d.name}</p><p className="text-xs text-muted-foreground">{d.company}</p><div className="flex items-center justify-between gap-2"><Avatar name={d.owner} size="sm" /><span className="text-sm font-semibold tabular-nums">{money(d.value)}</span></div></div>}
          />
        </>
      )}
      {view === 'team' && (
        <RevealGroup className="grid gap-3 md:grid-cols-3">
          {owners.map((o, i) => <GlassPanel key={o.name}><div className="flex items-center gap-3"><Avatar name={o.name} /><div><h2 className="text-sm font-semibold">{o.name}</h2><p className="text-xs text-muted-foreground">Rank {i + 1} by won value</p></div></div><dl className="mt-4 grid grid-cols-2 gap-2"><div><dt className="text-xs text-muted-foreground">Won</dt><dd className="text-xl font-semibold tabular-nums">{money(o.won)}</dd></div><div><dt className="text-xs text-muted-foreground">Open</dt><dd className="text-xl font-semibold tabular-nums">{money(o.open)}</dd></div></dl></GlassPanel>)}
        </RevealGroup>
      )}
    </FloatingShell>
    </>
  );
}
