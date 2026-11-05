'use client';

import * as React from 'react';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { CheckIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.5 0.12 155)', '--primary-foreground': '#fff', '--ring': 'oklch(0.5 0.12 155)' } as React.CSSProperties;

type Task = { id: string; t: string; who: string; done: boolean };
type Phase = { id: string; name: string; due: string; tasks: Task[] };
// Demo plan. Progress, the ring and the burn-down are all computed from these tasks, so ticking one changes everything.
const PLAN: Phase[] = [
  { id: 'disc', name: 'Discovery', due: 'Oct 4', tasks: [{ id: 'a1', t: 'Stakeholder interviews', who: 'Mia Cole', done: true }, { id: 'a2', t: 'Audit current product', who: 'Noah Kim', done: true }, { id: 'a3', t: 'Write the brief', who: 'Ava Reed', done: true }] },
  { id: 'des', name: 'Design', due: 'Oct 25', tasks: [{ id: 'b1', t: 'Information architecture', who: 'Ava Reed', done: true }, { id: 'b2', t: 'Core screens, desktop', who: 'Ava Reed', done: true }, { id: 'b3', t: 'Core screens, phone', who: 'Zoe Park', done: false }, { id: 'b4', t: 'Usability round one', who: 'Mia Cole', done: false }] },
  { id: 'bld', name: 'Build', due: 'Nov 29', tasks: [{ id: 'c1', t: 'Component library', who: 'Noah Kim', done: true }, { id: 'c2', t: 'Auth and onboarding', who: 'Ethan Bell', done: false }, { id: 'c3', t: 'Dashboard and reports', who: 'Noah Kim', done: false }, { id: 'c4', t: 'Billing', who: 'Ethan Bell', done: false }] },
  { id: 'lch', name: 'Launch', due: 'Dec 13', tasks: [{ id: 'd1', t: 'Load test', who: 'Noah Kim', done: false }, { id: 'd2', t: 'Release notes and help articles', who: 'Zoe Park', done: false }, { id: 'd3', t: 'Go live', who: 'Ava Reed', done: false }] },
];
const TEAM = ['Ava Reed', 'Noah Kim', 'Mia Cole', 'Ethan Bell', 'Zoe Park'];

export default function ProjectOverview() {
  const [plan, setPlan] = React.useState(PLAN);
  const [open, setOpen] = React.useState<string>('des');
  const all = plan.flatMap((p) => p.tasks);
  const done = all.filter((t) => t.done).length;
  const pct = Math.round((done / all.length) * 100);
  const remaining = all.length - done;
  const toggle = (pid: string, tid: string) => setPlan((ps) => ps.map((p) => (p.id === pid ? { ...p, tasks: p.tasks.map((t) => (t.id === tid ? { ...t, done: !t.done } : t)) } : p)));
  const current = plan.find((p) => p.tasks.some((t) => !t.done))?.id;
  // Burn-down: the ideal line falls evenly, the real one stops at today's remaining count.
  const idealAt = (k: number) => all.length - (all.length / 10) * k;
  const todayK = 4;
  const bx = (k: number) => (k / 10) * 220;
  const by = (v: number) => 6 + (1 - v / all.length) * 78;
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden @container rounded-2xl border bg-background text-left" style={THEME}>
      <div className="grid h-full @3xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6 overflow-y-auto bg-primary p-6 text-primary-foreground" aria-label="Project summary">
          <div><p className="text-xs opacity-75">Donezo, client portal rebuild</p><h1 className="font-display text-3xl font-semibold leading-tight tracking-tight">Portal 2.0</h1><p className="mt-1 text-xs opacity-75">Due Dec 13, 9 weeks left</p></div>
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 36 36" className="size-28 shrink-0 -rotate-90" role="img" aria-label={`${pct} percent complete`}><circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity=".2" strokeWidth="4" /><circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" pathLength="100" strokeDasharray={`${pct} 100`} className="transition-[stroke-dasharray] duration-(--dur-slow)" /></svg>
            <div><p className="font-display text-5xl font-semibold tabular-nums leading-none">{pct}%</p><p className="mt-1 text-xs opacity-80">{done} of {all.length} tasks</p></div>
          </div>
          <figure><figcaption className="text-xs opacity-80">Burn-down, {remaining} tasks left</figcaption>
            <svg viewBox="0 0 220 90" className="mt-2 w-full" role="img" aria-label={`Burn-down: ${remaining} tasks remain against an ideal of ${Math.round(idealAt(todayK))}`}>
              <path d={`M${bx(0)} ${by(idealAt(0))} L${bx(10)} ${by(idealAt(10))}`} stroke="white" strokeOpacity=".4" strokeDasharray="3 4" fill="none" />
              <path d={`M${bx(0)} ${by(all.length)} L${bx(todayK)} ${by(remaining)}`} stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" /><circle cx={bx(todayK)} cy={by(remaining)} r="4" fill="white" />
            </svg>
            <p className="text-[11px] opacity-75">{remaining <= idealAt(todayK) ? 'Ahead of the ideal line.' : 'Behind the ideal line.'}</p></figure>
          <div className="mt-auto"><p className="mb-2 text-xs opacity-75">Team</p><AvatarGroup names={TEAM} size="sm" max={5} /></div>
        </aside>

        <main className="min-h-0 overflow-y-auto px-6 py-6 @3xl:px-10" aria-label="Milestones">
          <ol className="relative border-l-2 border-border pl-8">
            {plan.map((p) => {
              const d = p.tasks.filter((t) => t.done).length;
              const isOpen = open === p.id;
              const state = d === p.tasks.length ? 'Done' : p.id === current ? 'In progress' : 'Upcoming';
              return (
                <li key={p.id} className="relative pb-8 last:pb-0">
                  <span aria-hidden className={cn('absolute -left-[2.45rem] top-1 grid size-5 place-items-center rounded-full border-2 bg-background text-[10px] font-bold', state === 'Done' ? 'border-primary bg-primary text-primary-foreground' : state === 'In progress' ? 'border-primary' : 'border-border')}>{state === 'Done' && <CheckIcon className="size-3" />}</span>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? '' : p.id)} className="flex w-full items-baseline justify-between gap-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                    <span><span className="font-display text-xl font-semibold tracking-tight">{p.name}</span><span className={cn('ml-3 text-xs font-medium', state === 'Done' ? 'text-primary' : state === 'In progress' ? 'text-warning' : 'text-muted-foreground')}>{state}</span></span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{d}/{p.tasks.length} · due {p.due}</span>
                  </button>
                  <p className="mt-2 h-1 rounded-full bg-secondary" aria-hidden><span className="block h-full rounded-full bg-primary transition-[width] duration-(--dur-base)" style={{ width: `${(d / p.tasks.length) * 100}%` }} /></p>
                  {isOpen && (
                    <ul className="mt-3 divide-y">
                      {p.tasks.map((t) => (
                        <li key={t.id}><label className="flex cursor-pointer items-center gap-3 py-2.5 text-[13px]"><input type="checkbox" checked={t.done} onChange={() => toggle(p.id, t.id)} className="size-4 accent-[var(--primary)]" /><span className={cn('flex-1', t.done && 'text-muted-foreground line-through')}>{t.t}</span><span className="flex items-center gap-2 text-xs text-muted-foreground"><Avatar name={t.who} size="xs" />{t.who}</span></label></li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </main>
      </div>
    </div>
  );
}
