'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// A resource planner: people down the side, weeks across the top, and every task is a bar you can select, stretch and move.
const THEME = { '--primary': 'oklch(0.55 0.2 300)', '--primary-foreground': '#fff', '--ring': 'oklch(0.55 0.2 300)' } as React.CSSProperties;
const WEEKS = 12;
const PEOPLE = ['Ava Reed', 'Noah Kim', 'Mia Cole', 'Ethan Bell', 'Zoe Park'];
type Task = { id: number; name: string; who: string; start: number; len: number; hue: number };
const SEED: Task[] = [
  { id: 1, name: 'Brand audit', who: 'Ava Reed', start: 0, len: 3, hue: 300 },
  { id: 2, name: 'Identity system', who: 'Ava Reed', start: 3, len: 4, hue: 300 },
  { id: 3, name: 'Packaging dielines', who: 'Ava Reed', start: 6, len: 3, hue: 20 },
  { id: 4, name: 'Site architecture', who: 'Noah Kim', start: 1, len: 3, hue: 230 },
  { id: 5, name: 'Component build', who: 'Noah Kim', start: 4, len: 5, hue: 230 },
  { id: 6, name: 'Launch QA', who: 'Noah Kim', start: 9, len: 2, hue: 150 },
  { id: 7, name: 'Interviews', who: 'Mia Cole', start: 0, len: 2, hue: 20 },
  { id: 8, name: 'Synthesis', who: 'Mia Cole', start: 2, len: 2, hue: 20 },
  { id: 9, name: 'Usability tests', who: 'Mia Cole', start: 5, len: 3, hue: 150 },
  { id: 10, name: 'Motion study', who: 'Ethan Bell', start: 2, len: 4, hue: 300 },
  { id: 11, name: 'Launch film', who: 'Ethan Bell', start: 7, len: 4, hue: 20 },
  { id: 12, name: 'Copy deck', who: 'Zoe Park', start: 1, len: 4, hue: 230 },
  { id: 13, name: 'Press kit', who: 'Zoe Park', start: 4, len: 3, hue: 230 },
  { id: 14, name: 'Launch plan', who: 'Zoe Park', start: 8, len: 3, hue: 150 },
];
const TODAY = 4.4;

/** Two tasks for the same person that share a week, and which weeks they share. */
const overlaps = (ts: Task[]) => {
  const set = new Set<number>();
  ts.forEach((a) => ts.forEach((b) => { if (a.id < b.id && a.who === b.who && a.start < b.start + b.len && b.start < a.start + a.len) { set.add(a.id); set.add(b.id); } }));
  return set;
};

export default function StudioPlanner() {
  const [tasks, setTasks] = React.useState(SEED);
  const [sel, setSel] = React.useState<number | null>(5);
  const clash = overlaps(tasks);
  const t = tasks.find((x) => x.id === sel) ?? null;
  const patch = (p: Partial<Task>) => setTasks((ts) => ts.map((x) => (x.id === sel ? { ...x, ...p, start: Math.max(0, Math.min(WEEKS - (p.len ?? x.len), p.start ?? x.start)) } : x)));
  const load = (who: string) => Math.round((tasks.filter((x) => x.who === who).reduce((a, x) => a + x.len, 0) / WEEKS) * 100);
  const onKey = (e: React.KeyboardEvent, task: Task) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setSel(task.id); setTasks((ts) => ts.map((x) => (x.id === task.id ? { ...x, start: Math.min(WEEKS - x.len, x.start + 1) } : x))); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setSel(task.id); setTasks((ts) => ts.map((x) => (x.id === task.id ? { ...x, start: Math.max(0, x.start - 1) } : x))); }
  };
  return (
    <div className="h-[min(860px,calc(100vh-10rem))] min-h-[640px] overflow-hidden rounded-2xl border bg-background text-left" style={THEME}>
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-1 border-b px-5 py-3">
          <h1 className="font-display text-lg font-semibold tracking-tight">Studio planner</h1>
          <p className="text-xs text-muted-foreground">Q4, 12 weeks. Select a bar, then move it with the arrow keys or the controls below.</p>
          <p className={cn('ml-auto text-xs font-medium', clash.size ? 'text-destructive' : 'text-success')} aria-live="polite">{clash.size ? `${clash.size} tasks overlap for the same person` : 'No overlaps'}</p>
        </header>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid min-w-[52rem] grid-cols-[11rem_1fr]">
            <div className="sticky top-0 z-10 border-b bg-background" />
            <div className="sticky top-0 z-10 grid grid-cols-12 border-b bg-background text-center text-[11px] text-muted-foreground">{Array.from({ length: WEEKS }, (_, k) => <span key={k} className="border-l py-2 tabular-nums first:border-l-0">W{k + 1}</span>)}</div>
            {PEOPLE.map((p) => {
              const mine = tasks.filter((x) => x.who === p);
              const lanes: Task[][] = [];
              mine.sort((a, b) => a.start - b.start).forEach((x) => { const l = lanes.find((ln) => ln.every((y) => y.start + y.len <= x.start || x.start + x.len <= y.start)); l ? l.push(x) : lanes.push([x]); });
              return (
                <React.Fragment key={p}>
                  <div className="flex items-start gap-2.5 border-b px-4 py-3"><Avatar name={p} size="sm" /><div className="text-[13px] leading-tight"><p className="font-medium">{p}</p><p className={cn('text-xs tabular-nums', load(p) > 90 ? 'text-warning' : 'text-muted-foreground')}>{load(p)}% booked</p></div></div>
                  <div className="relative border-b" style={{ height: `${lanes.length * 2.5 + 1}rem` }}>
                    <div className="absolute inset-0 grid grid-cols-12" aria-hidden>{Array.from({ length: WEEKS }, (_, k) => <span key={k} className="border-l first:border-l-0" />)}</div>
                    {lanes.map((ln, li) => ln.map((x) => (
                      <button key={x.id} type="button" aria-pressed={sel === x.id} aria-label={`${x.name}, ${p}, weeks ${x.start + 1} to ${x.start + x.len}${clash.has(x.id) ? ', overlaps another task' : ''}`} onClick={() => setSel(x.id)} onKeyDown={(e) => onKey(e, x)}
                        className={cn('absolute flex h-8 items-center overflow-hidden rounded-lg px-2.5 text-left text-xs font-medium text-white outline-none transition-[left,width] duration-(--dur-base) focus-visible:ring-2 focus-visible:ring-foreground', sel === x.id && 'ring-2 ring-foreground ring-offset-1 ring-offset-background', clash.has(x.id) && 'bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgb(0_0_0/0.18)_6px_12px)]')}
                        style={{ top: `${li * 2.5 + 0.5}rem`, left: `calc(${(x.start / WEEKS) * 100}% + 2px)`, width: `calc(${(x.len / WEEKS) * 100}% - 4px)`, backgroundColor: `oklch(0.55 0.17 ${x.hue})` }}>
                        <span className="truncate">{x.name}</span>
                      </button>
                    )))}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="grid min-w-[52rem] grid-cols-[11rem_1fr] border-b" aria-label="Tasks running each week">
            <p className="px-4 py-4 text-[13px] font-medium">Load per week<span className="block text-xs font-normal text-muted-foreground">tasks running at once</span></p>
            <ol className="grid grid-cols-12">
              {Array.from({ length: WEEKS }, (_, k) => { const n = tasks.filter((x) => x.start <= k && k < x.start + x.len).length; return (
                <li key={k} className="flex flex-col items-center justify-end gap-1 border-l px-1.5 pb-3 pt-4 first:border-l-0"><span className="text-[11px] font-semibold tabular-nums">{n}</span><span className={cn('w-full rounded-md transition-[height] duration-(--dur-base)', n >= 5 ? 'bg-destructive' : 'bg-primary/70')} style={{ height: `${n * 1.1}rem` }} /></li>
              ); })}
            </ol>
          </div>
        </div>

        <footer className="shrink-0 border-t bg-muted/40 px-5 py-3" aria-label="Selected task">
          {t ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
              <p className="min-w-0"><b>{t.name}</b> <span className="text-muted-foreground">with {t.who}, weeks {t.start + 1} to {t.start + t.len}</span></p>
              <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Move</span><button type="button" onClick={() => patch({ start: t.start - 1 })} disabled={t.start === 0} aria-label="Move one week earlier" className="size-7 rounded-lg border bg-background outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35">-</button><button type="button" onClick={() => patch({ start: t.start + 1 })} disabled={t.start + t.len >= WEEKS} aria-label="Move one week later" className="size-7 rounded-lg border bg-background outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35">+</button></div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">Length<input type="range" min={1} max={8} value={t.len} onChange={(e) => patch({ len: Number(e.target.value) })} aria-label="Length in weeks" className="w-32 accent-[var(--primary)]" /><b className="w-14 tabular-nums text-foreground">{t.len} {t.len === 1 ? 'week' : 'weeks'}</b></label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">Owner<select value={t.who} onChange={(e) => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, who: e.target.value } : x)))} className="h-7 rounded-lg border bg-background px-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">{PEOPLE.map((p) => <option key={p}>{p}</option>)}</select></label>
            </div>
          ) : <p className="text-[13px] text-muted-foreground">Select a task bar to move or resize it.</p>}
        </footer>
      </div>
    </div>
  );
}
