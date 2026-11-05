'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.58 0.14 235)', '--primary-foreground': '#fff', '--ring': 'oklch(0.58 0.14 235)' } as React.CSSProperties;

type Ch = 'Email' | 'Paid search' | 'Social' | 'Events';
const CH: Record<Ch, string> = { Email: 'bg-primary', 'Paid search': 'bg-warning', Social: 'bg-success', Events: 'bg-destructive' };
type Send = { day: number; name: string; ch: Ch; reach: number; leads: number };
// Demo sends for October. Every number on the screen is computed from this list.
const SENDS: Send[] = [
  { day: 1, name: 'Autumn catalogue', ch: 'Email', reach: 18200, leads: 214 }, { day: 3, name: 'Retargeting wave 1', ch: 'Paid search', reach: 41000, leads: 168 },
  { day: 4, name: 'Founder story reel', ch: 'Social', reach: 26800, leads: 61 }, { day: 7, name: 'Early access list', ch: 'Email', reach: 9400, leads: 302 },
  { day: 8, name: 'Partner webinar', ch: 'Events', reach: 1200, leads: 96 }, { day: 8, name: 'Webinar replay', ch: 'Email', reach: 7800, leads: 77 },
  { day: 10, name: 'Brand keywords push', ch: 'Paid search', reach: 52300, leads: 244 }, { day: 11, name: 'Diwali early access', ch: 'Email', reach: 21600, leads: 388 },
  { day: 11, name: 'Retargeting refresh', ch: 'Paid search', reach: 36000, leads: 190 }, { day: 14, name: 'Customer spotlight', ch: 'Social', reach: 19400, leads: 48 },
  { day: 15, name: 'Trade fair, Pune', ch: 'Events', reach: 2400, leads: 171 }, { day: 17, name: 'Last chance reminder', ch: 'Email', reach: 20100, leads: 266 },
  { day: 18, name: 'Look-alike audience', ch: 'Paid search', reach: 61200, leads: 201 }, { day: 21, name: 'Launch teaser', ch: 'Social', reach: 33300, leads: 84 },
  { day: 22, name: 'Launch day email', ch: 'Email', reach: 23800, leads: 441 }, { day: 22, name: 'Launch live stream', ch: 'Social', reach: 28700, leads: 132 },
  { day: 25, name: 'Recap and offer', ch: 'Email', reach: 22400, leads: 297 }, { day: 28, name: 'Year-end webinar', ch: 'Events', reach: 1600, leads: 118 },
];
const START = 2; // October 1 falls on a Wednesday, so two blank cells lead the Monday-first grid
const k = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

export default function CampaignPerformance() {
  const [day, setDay] = React.useState(11);
  const [hidden, setHidden] = React.useState<Set<Ch>>(new Set());
  const vis = SENDS.filter((s) => !hidden.has(s.ch));
  const leads = vis.reduce((a, s) => a + s.leads, 0);
  const reach = vis.reduce((a, s) => a + s.reach, 0);
  const best = Math.max(...Array.from({ length: 31 }, (_, d) => vis.filter((s) => s.day === d + 1).reduce((a, s) => a + s.leads, 0)));
  const today = vis.filter((s) => s.day === day);
  const byCh = (Object.keys(CH) as Ch[]).map((c) => ({ c, leads: SENDS.filter((s) => s.ch === c).reduce((a, s) => a + s.leads, 0) }));
  const maxCh = Math.max(...byCh.map((x) => x.leads));
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden @container rounded-2xl border bg-background text-left" style={THEME}>
      <div className="grid h-full @3xl:grid-cols-[minmax(0,1fr)_20rem]">
        <main className="flex min-h-0 flex-col overflow-y-auto p-6" aria-labelledby="cp-month">
          <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div><p className="text-xs text-muted-foreground">Amplify, campaigns</p><h1 id="cp-month" className="font-display text-4xl font-semibold tracking-tight">October</h1></div>
            <p className="flex gap-8"><span><b className="font-display text-3xl font-semibold tabular-nums">{leads.toLocaleString('en-US')}</b><span className="block text-xs text-muted-foreground">leads</span></span><span><b className="font-display text-3xl font-semibold tabular-nums">{k(reach)}</b><span className="block text-xs text-muted-foreground">reached</span></span><span><b className="font-display text-3xl font-semibold tabular-nums">{reach ? ((leads / reach) * 100).toFixed(1) : '0.0'}%</b><span className="block text-xs text-muted-foreground">lead rate</span></span></p>
          </header>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1" role="group" aria-label="Show channels">
            {(Object.keys(CH) as Ch[]).map((c) => <label key={c} className="flex cursor-pointer items-center gap-2 text-[13px]"><input type="checkbox" checked={!hidden.has(c)} onChange={() => setHidden((h) => { const n = new Set(h); n.has(c) ? n.delete(c) : n.add(c); return n; })} className="size-3.5 accent-[var(--primary)]" /><span className={cn('size-2 rounded-sm', CH[c])} />{c}</label>)}
          </div>

          <div className="mt-5 grid grid-cols-7 border-l border-t text-center text-xs text-muted-foreground" role="presentation">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d} className="border-b border-r py-1.5">{d}</span>)}</div>
          <div className="grid flex-1 grid-cols-7 border-l" role="group" aria-label="October sends, pick a day">
            {Array.from({ length: START }, (_, i) => <span key={`b${i}`} className="border-b border-r bg-muted/30" />)}
            {Array.from({ length: 31 }, (_, i) => {
              const d = i + 1;
              const ss = vis.filter((s) => s.day === d);
              const l = ss.reduce((a, s) => a + s.leads, 0);
              return (
                <button key={d} type="button" aria-pressed={day === d} aria-label={`October ${d}: ${ss.length} sends, ${l} leads`} onClick={() => setDay(d)} className={cn('relative min-h-[4.2rem] border-b border-r p-1.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', day === d ? 'bg-accent' : 'hover:bg-muted/50')}>
                  <span className={cn('text-xs tabular-nums', day === d ? 'font-bold text-primary' : 'text-muted-foreground')}>{d}</span>
                  <span className="mt-1 flex flex-col gap-0.5" aria-hidden>{ss.slice(0, 3).map((s, n) => <span key={n} className={cn('h-1.5 rounded-sm', CH[s.ch])} style={{ width: `${Math.max(18, (s.leads / 441) * 100)}%` }} />)}</span>
                  {l > 0 && <span className={cn('absolute bottom-1 right-1.5 text-[10px] font-semibold tabular-nums', l === best ? 'text-primary' : 'text-muted-foreground')}>{l}</span>}
                </button>
              );
            })}
          </div>
        </main>

        <aside className="min-h-0 overflow-y-auto border-t bg-muted/30 p-6 @3xl:border-l @3xl:border-t-0" aria-label={`October ${day}`}>
          <p className="text-xs text-muted-foreground">Selected day</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">October {day}</h2>
          <p className="mt-1 text-[13px] text-muted-foreground" aria-live="polite">{today.length === 0 ? 'Nothing was sent on this day.' : `${today.length} send${today.length === 1 ? '' : 's'}, ${today.reduce((a, s) => a + s.leads, 0)} leads`}</p>
          <ul className="mt-4 divide-y border-y">
            {today.map((s) => <li key={s.name} className="py-3"><p className="flex items-center gap-2 text-[13px] font-semibold"><span className={cn('size-2 rounded-sm', CH[s.ch])} />{s.name}</p><p className="mt-1 text-xs tabular-nums text-muted-foreground">{s.ch}, reached {k(s.reach)}, <b className="text-foreground">{s.leads} leads</b></p></li>)}
          </ul>
          <h3 className="mt-8 text-sm font-semibold">Leads by channel</h3>
          <ul className="mt-3 grid gap-3">{byCh.map(({ c, leads: v }) => <li key={c}><p className="flex justify-between text-[13px]"><span>{c}</span><span className="tabular-nums text-muted-foreground">{v}</span></p><p className="mt-1 h-1.5 rounded-full bg-secondary" aria-hidden><span className={cn('block h-full rounded-full', CH[c])} style={{ width: `${(v / maxCh) * 100}%` }} /></p></li>)}</ul>
        </aside>
      </div>
    </div>
  );
}
