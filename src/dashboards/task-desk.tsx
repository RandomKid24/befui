'use client';

import * as React from 'react';
import { CalendarIcon, CheckSquareIcon, ClockIcon, FolderIcon, HelpCircleIcon, LayoutDashboardIcon, MailIcon, PlusIcon, ReceiptIcon, SettingsIcon, UsersIcon } from '@/components/ui/icons';
import { AppContent, AppShell } from '@/components/ui/app-shell';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// This screen's own accent. Components read these variables, so changing the one line below recolours the whole screen.
const THEME = { '--primary': 'oklch(0.55 0.11 195)', '--primary-foreground': '#fff', '--ring': 'oklch(0.55 0.11 195)', '--accent': 'color-mix(in oklab, oklch(0.55 0.11 195) 14%, var(--background))', '--accent-foreground': 'oklch(0.55 0.11 195)' } as React.CSSProperties;


type Status = 'In progress' | 'Pending' | 'Completed';
const NEXT: Record<Status, Status> = { 'In progress': 'Completed', Completed: 'Pending', Pending: 'In progress' };
const TONE: Record<Status, string> = { 'In progress': 'bg-success/15 text-success', Pending: 'bg-secondary text-muted-foreground', Completed: 'bg-info/15 text-info' };
type Task = { id: number; name: string; who: string; status: Status; week: 'This week' | 'Next week'; comments: number; files: number };
const TASKS: Task[] = [
  { id: 1, name: 'Help Dstudio get more customers', who: 'Phoenix Winters', status: 'In progress', week: 'This week', comments: 7, files: 2 },
  { id: 2, name: 'Plan a trip', who: 'Cohen Merritt', status: 'Pending', week: 'This week', comments: 10, files: 3 },
  { id: 3, name: 'Return a package', who: 'Lukas Juarez', status: 'Completed', week: 'This week', comments: 3, files: 0 },
  { id: 4, name: 'Prepare quarterly review deck', who: 'Phoenix Winters', status: 'Pending', week: 'Next week', comments: 2, files: 1 },
  { id: 5, name: 'Book venue for offsite', who: 'Cohen Merritt', status: 'In progress', week: 'Next week', comments: 5, files: 4 },
];
const DAYS = [['Mo', 15], ['Tu', 16], ['We', 17], ['Th', 18], ['Fr', 19], ['Sa', 20], ['Su', 21]] as const;
const EVENTS: Record<number, { t: string; time: string; tone: string; who: string[] }[]> = {
  17: [
    { t: 'Kickoff meeting', time: '01:00 PM to 02:30 PM', tone: 'bg-success', who: ['Ava Reed', 'Noah Kim'] },
    { t: 'Create Wordpress website for event registration', time: '04:00 PM to 05:30 PM', tone: 'bg-info', who: ['Mia Cole', 'Ethan Bell'] },
    { t: 'Create user flow for hotel booking', time: '05:30 PM to 06:30 PM', tone: 'bg-warning', who: ['Liam Cruz', 'Zoe Park'] },
  ],
  16: [{ t: 'Design critique', time: '11:00 AM to 12:00 PM', tone: 'bg-info', who: ['Ava Reed'] }],
  19: [{ t: 'Sprint demo', time: '03:00 PM to 04:00 PM', tone: 'bg-success', who: ['Noah Kim', 'Mia Cole', 'Zoe Park'] }],
};
const NOTES0 = [
  { id: 1, t: 'Landing page for website', d: 'To get started on a landing page, could you provide a bit more detail about its purpose?', done: false },
  { id: 2, t: 'Fixing icons with dark background', d: 'Icons that are easily recognizable and straightforward. Avoid overly complex designs.', done: false },
  { id: 3, t: 'Discussion regarding userflow improvement', d: "What's the main goal of the design page? (e.g., lead generation, product)", done: true },
];

export default function TaskDesk() {
  const [tasks, setTasks] = React.useState(TASKS);
  const [week, setWeek] = React.useState<'This week' | 'Next week'>('This week');
  const [day, setDay] = React.useState(17);
  const [notes, setNotes] = React.useState(NOTES0);
  const [draft, setDraft] = React.useState('');
  const shown = tasks.filter((t) => t.week === week);
  const events = EVENTS[day] ?? [];
  const done = tasks.filter((t) => t.status === 'Completed').length;
  const pct = Math.round((tasks.filter((t) => t.week === week && t.status === 'Completed').length / Math.max(1, shown.length)) * 100);
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-background text-left" style={THEME}>
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar>
            <SidebarHeader><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-background text-xs font-bold">D</span><span className="truncate text-sm font-semibold">Dstudio</span></SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarItem icon={<LayoutDashboardIcon />} label="Dashboard" />
                <SidebarItem icon={<FolderIcon />} label="Projects" />
                <SidebarItem icon={<CheckSquareIcon />} label="My Task" active />
                <SidebarItem icon={<MailIcon />} label="Chats" />
                <SidebarItem icon={<ReceiptIcon />} label="Documents" />
                <SidebarItem icon={<ReceiptIcon />} label="Receipts" />
              </SidebarGroup>
              <SidebarGroup label="Projects">
                <SidebarItem icon={<span className="size-2.5 rounded-sm bg-primary" />} label="Event Planning" />
                <SidebarItem icon={<span className="size-2.5 rounded-sm bg-success" />} label="Breakfast Plan" />
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter><SidebarItem icon={<SettingsIcon />} label="Settings" /><SidebarItem icon={<HelpCircleIcon />} label="Help & Support" badge="9" /></SidebarFooter>
          </Sidebar>
        }
      >
        <AppContent className="@container p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs text-muted-foreground">Thursday, 20th February</p><h1 className="font-display text-3xl font-semibold tracking-tight">Good evening, John,</h1></div>
            <div className="flex items-center gap-3"><div className="relative size-12" role="img" aria-label={`${pct} percent of ${week.toLowerCase()} tasks done`}><svg viewBox="0 0 36 36" className="size-12 -rotate-90"><circle cx="18" cy="18" r="15" fill="none" className="stroke-secondary" strokeWidth="4" /><circle cx="18" cy="18" r="15" fill="none" className="stroke-primary transition-[stroke-dasharray] duration-(--dur-base)" strokeWidth="4" strokeLinecap="round" pathLength="100" strokeDasharray={`${pct} 100`} /></svg><span className="absolute inset-0 grid place-items-center text-[11px] font-semibold tabular-nums">{pct}%</span></div><Button size="sm" variant="outline">Share</Button><Button size="sm" variant="outline"><PlusIcon /> Add task</Button></div>
          </div>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border px-4 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ClockIcon className="size-3.5" /><b className="text-foreground">12hrs</b> time saved</span>
            <span className="flex items-center gap-1.5"><CheckSquareIcon className="size-3.5" /><b className="text-foreground tabular-nums">{done + 23}</b> projects completed</span>
            <span className="flex items-center gap-1.5"><UsersIcon className="size-3.5" /><b className="text-foreground tabular-nums">7</b> projects in progress</span>
          </p>

          <section className="mt-6 rounded-2xl border" aria-labelledby="td-proj">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3"><h2 id="td-proj" className="text-sm font-semibold">My Projects</h2><Segmented value={week} onValueChange={setWeek} options={[{ value: 'This week', label: 'This week' }, { value: 'Next week', label: 'Next week' }]} /></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-[13px]">
                <caption className="sr-only">Tasks for {week}</caption>
                <thead><tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground"><th scope="col" className="px-5 py-2 font-medium">Task name</th><th scope="col" className="py-2 font-medium">Assign</th><th scope="col" className="py-2 pr-5 font-medium">Status</th></tr></thead>
                <tbody>
                  {shown.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                      <th scope="row" className="px-5 py-3 text-left font-medium">{t.name}<span className="ml-3 text-xs font-normal tabular-nums text-muted-foreground">{t.comments} comments, {t.files} files</span></th>
                      <td className="py-3"><span className="flex items-center gap-2"><Avatar name={t.who} size="xs" />{t.who}</span></td>
                      <td className="py-3 pr-5"><button type="button" onClick={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: NEXT[x.status] } : x)))} aria-label={`${t.name}: ${t.status}. Press to change`} className={cn('rounded-md px-2 py-0.5 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50', TONE[t.status])}>{t.status}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-5 grid gap-5 @3xl:grid-cols-2">
            <section className="rounded-2xl border p-5" aria-labelledby="td-sch">
              <h2 id="td-sch" className="flex items-center gap-2 text-sm font-semibold"><CalendarIcon className="size-4 text-muted-foreground" /> Schedule</h2>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs" role="group" aria-label="Pick a day">
                {DAYS.map(([d, n]) => (
                  <button key={n} type="button" aria-pressed={day === n} onClick={() => setDay(n)} className={cn('rounded-lg py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50', day === n ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary')}><span className="block text-[11px]">{d}</span><span className="block font-semibold tabular-nums">{n}</span></button>
                ))}
              </div>
              <ul className="mt-4 grid gap-3" aria-live="polite">
                {events.length === 0 && <li className="py-6 text-center text-[13px] text-muted-foreground">Nothing scheduled for the {day}th.</li>}
                {events.map((e) => (
                  <li key={e.t} className="flex items-center gap-3"><span className={cn('h-9 w-1 shrink-0 rounded-full', e.tone)} /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold">{e.t}</p><p className="text-xs tabular-nums text-muted-foreground">{e.time}</p></div><AvatarGroup names={e.who} size="xs" /></li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border p-5" aria-labelledby="td-notes">
              <h2 id="td-notes" className="text-sm font-semibold">Notes</h2>
              <ul className="mt-3 grid gap-3">
                {notes.map((n) => (
                  <li key={n.id} className="flex gap-3">
                    <input type="checkbox" checked={n.done} onChange={() => setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, done: !x.done } : x)))} aria-label={n.t} className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]" />
                    <div><p className={cn('text-[13px] font-medium', n.done && 'text-muted-foreground line-through')}>{n.t}</p><p className="text-xs text-muted-foreground">{n.d}</p></div>
                  </li>
                ))}
              </ul>
              <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { setNotes((ns) => [...ns, { id: Date.now(), t: draft.trim(), d: 'Added just now', done: false }]); setDraft(''); } }}>
                <input value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="New note" placeholder="Add a note" className="h-9 w-full rounded-xl border bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
                <Button size="sm" type="submit" disabled={!draft.trim()}>Add</Button>
              </form>
            </section>
          </div>
        </AppContent>
      </AppShell>
    </div>
  );
}
