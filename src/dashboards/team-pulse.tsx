'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.58 0.15 252)', '--primary-foreground': '#fff', '--ring': 'oklch(0.58 0.15 252)' } as React.CSSProperties;

type Person = { name: string; role: string; week: number[]; prev: number[]; tasks: [string, 'In progress' | 'On hold' | 'Done', number][]; finished: number; efficiency: number };
// Hours per day, this week against last, for each person. Everything on screen is computed from these.
const PEOPLE: Person[] = [
  { name: 'Margaret Lee', role: 'Product lead', week: [6, 7, 8, 6.5, 9, 3, 2], prev: [5, 6.5, 5, 7, 6, 2.5, 3], finished: 18, efficiency: 93, tasks: [['Product review for UI8 market', 'In progress', 4], ['UX research for product', 'On hold', 8], ['App design and development', 'Done', 32]] },
  { name: 'Megan Norton', role: 'Designer', week: [7, 6, 7.5, 8, 6, 0, 0], prev: [6, 6, 7, 6.5, 7, 1, 0], finished: 14, efficiency: 88, tasks: [['Homepage.fig handoff', 'In progress', 6], ['Icon set refresh', 'Done', 14], ['Illustration brief', 'On hold', 3]] },
  { name: 'Floyd Miles', role: 'Engineer', week: [8, 8.5, 9, 7, 8, 4, 1], prev: [8, 7, 8, 8.5, 7, 2, 0], finished: 22, efficiency: 96, tasks: [['Stark project API', 'In progress', 12], ['Auth migration', 'Done', 26], ['Load test plan', 'In progress', 5]] },
  { name: 'Guy Hawkins', role: 'Researcher', week: [5, 4.5, 6, 5.5, 5, 0, 0], prev: [6, 5, 5.5, 6, 6.5, 0, 0], finished: 9, efficiency: 79, tasks: [['Interview synthesis', 'In progress', 7], ['Survey analysis', 'On hold', 4], ['Persona refresh', 'Done', 9]] },
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FEED0 = [['Floyd Miles', 'Commented on Stark Project', "Next week we'll start a new project. I'll share the details later."], ['Guy Hawkins', 'Added a file to 7Heros Project', 'Homepage.fig, 13.4 MB'], ['Megan Norton', 'Commented on 7Heros Project', '']] as const;
const TONE = { 'In progress': 'bg-warning', 'On hold': 'bg-info', Done: 'bg-success' } as const;
const W = 640;
const H = 220;

export default function TeamPulse() {
  const [who, setWho] = React.useState(0);
  const [at, setAt] = React.useState<number | null>(null);
  const [feed, setFeed] = React.useState<(readonly [string, string, string])[]>([...FEED0]);
  const [msg, setMsg] = React.useState('');
  const p = PEOPLE[who]!;
  const tot = p.week.reduce((a, b) => a + b, 0);
  const prevTot = p.prev.reduce((a, b) => a + b, 0);
  const i = at ?? 2;
  const x = (k: number) => 14 + (k / 6) * (W - 28);
  const y = (v: number) => H - 30 - (v / 12) * (H - 50);
  const path = (d: number[]) => d.map((v, k) => (k ? `C${(x(k - 1) + x(k)) / 2} ${y(d[k - 1]!)}, ${(x(k - 1) + x(k)) / 2} ${y(v)}, ${x(k)} ${y(v)}` : `M${x(k)} ${y(v)}`)).join(' ');
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-background text-left" style={THEME}>
      <div className="@container flex h-full flex-col">
        <nav className="shrink-0 border-b" aria-label="People">
          <ul className="flex overflow-x-auto px-3">
            {PEOPLE.map((q, k) => {
              const load = Math.round((q.week.reduce((a, b) => a + b, 0) / 45) * 100);
              return (
                <li key={q.name} className="shrink-0">
                  <button type="button" aria-current={who === k} onClick={() => { setWho(k); setAt(null); }} className={cn('relative flex items-center gap-3 px-4 py-4 text-left outline-none focus-visible:bg-secondary', who === k ? 'bg-accent/40' : 'hover:bg-muted/50')}>
                    <span className="relative"><Avatar name={q.name} size="md" /><svg viewBox="0 0 36 36" className="absolute -inset-1 size-12 -rotate-90" aria-hidden><circle cx="18" cy="18" r="16.5" fill="none" className={who === k ? 'stroke-primary' : 'stroke-border'} strokeWidth="1.5" pathLength="100" strokeDasharray={`${Math.min(100, load)} 100`} /></svg></span>
                    <span className="leading-tight"><span className="block text-[13px] font-semibold">{q.name}</span><span className="block text-xs text-muted-foreground">{q.role}, {load}% load</span></span>
                    {who === k && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid min-h-0 flex-1 overflow-y-auto @3xl:grid-cols-[minmax(0,1fr)_20rem] @3xl:overflow-hidden">
          <main className="min-w-0 px-6 py-6 @3xl:overflow-y-auto" aria-label={`${p.name}'s week`}>
            <h1 className="font-display text-3xl font-semibold tracking-tight">{p.name}'s week</h1>
            <dl className="mt-5 grid grid-cols-3 divide-x border-y py-4">
              {[['Finished', String(p.finished), 'tasks', 'text-foreground'], ['Tracked', `${tot}h`, `${tot >= prevTot ? '+' : ''}${(tot - prevTot).toFixed(1)}h vs last week`, tot >= prevTot ? 'text-success' : 'text-destructive'], ['Efficiency', `${p.efficiency}%`, p.efficiency >= 90 ? 'on target' : 'below target', p.efficiency >= 90 ? 'text-success' : 'text-warning']].map(([l, v, d, c]) => <div key={l} className="px-4 first:pl-0"><dt className="text-xs text-muted-foreground">{l}</dt><dd className="mt-0.5"><span className="font-display text-2xl font-semibold tabular-nums">{v}</span><span className={cn('ml-2 text-[11px] font-medium', c)}>{d}</span></dd></div>)}
            </dl>
            <figure className="mt-5">
              <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring/40" role="img" tabIndex={0} aria-label={`${DAYS[i]}: ${p.week[i]} hours, last week ${p.prev[i]} hours.`}
                onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setAt(Math.max(0, Math.min(6, Math.round(((((e.clientX - r.left) / r.width) * W - 14) / (W - 28)) * 6)))); }} onPointerLeave={() => setAt(null)}
                onKeyDown={(e) => { if (e.key === 'ArrowRight') setAt(Math.min(6, i + 1)); if (e.key === 'ArrowLeft') setAt(Math.max(0, i - 1)); }} onBlur={() => setAt(null)}>
                {[0, 4, 8, 12].map((g) => <g key={g}><line x1="0" x2={W} y1={y(g)} y2={y(g)} className="stroke-border" strokeDasharray="2 5" /><text x="0" y={y(g) - 3} className="fill-muted-foreground text-[10px]">{g}h</text></g>)}
                <path d={path(p.prev)} fill="none" className="stroke-muted-foreground/60" strokeWidth="2" strokeDasharray="4 4" />
                <path d={path(p.week)} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={x(i)} x2={x(i)} y1="8" y2={H - 30} className="stroke-foreground/25" />
                <circle cx={x(i)} cy={y(p.week[i]!)} r="4.5" className="fill-card stroke-primary" strokeWidth="2.5" />
                {DAYS.map((d, k) => <text key={d} x={x(k)} y={H - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">{d}</text>)}
              </svg>
              <figcaption className="text-[13px] tabular-nums"><b>{DAYS[i]}</b> <span className="text-primary">{p.week[i]}h</span> <span className="text-muted-foreground">against {p.prev[i]}h last week. Dashed is last week.</span></figcaption>
            </figure>
            <h2 className="mt-8 text-sm font-semibold">Current tasks</h2>
            <ul className="mt-1 divide-y border-b">{p.tasks.map(([n, s, h]) => <li key={n} className="flex items-center gap-4 py-3 text-[13px]"><span className="flex-1 font-medium">{n}</span><span className="flex w-24 items-center gap-1.5 text-xs text-muted-foreground"><span className={cn('size-1.5 rounded-full', TONE[s])} />{s}</span><span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{h}h</span></li>)}</ul>
          </main>

          <aside className="border-t px-6 py-6 @3xl:overflow-y-auto @3xl:border-l @3xl:border-t-0" aria-label="Team activity">
            <h2 className="text-sm font-semibold">Team activity</h2>
            <ul className="mt-4 grid gap-4" aria-live="polite">{feed.map(([n, w, m], k) => <li key={k} className="flex gap-2.5"><Avatar name={n} size="xs" /><div className="min-w-0 text-xs"><p><b>{n}</b> <span className="text-muted-foreground">{w}</span></p>{m && <p className="mt-1.5 rounded-lg bg-secondary p-2.5">{m}</p>}</div></li>)}</ul>
            <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (msg.trim()) { setFeed((f) => [...f, [p.name, 'Posted a message', msg.trim()] as const]); setMsg(''); } }}>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Write a message" placeholder={`Message as ${p.name.split(' ')[0]}`} className="h-9 w-full rounded-lg border bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
              <Button size="sm" type="submit" disabled={!msg.trim()}>Send</Button>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
