import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/charts';
import { CopyButton } from '@/components/ui/copy-button';
import avatarSrc from '@/components/ui/avatar.tsx?raw';
import buttonSrc from '@/components/ui/button.tsx?raw';
import chartsSrc from '@/components/ui/charts.tsx?raw';

type Status = 'open' | 'approved' | 'declined';
const REQUESTS = [
  { id: 'diya', name: 'Diya Rao', what: 'Casual leave', when: '27 to 29 Oct', days: 3 },
  { id: 'rohan', name: 'Rohan Das', what: 'Sick leave', when: '30 Oct', days: 1 },
  { id: 'isha', name: 'Isha Nair', what: 'Earned leave', when: '3 to 14 Nov', days: 8 },
];
const MONTHS = [
  { label: 'May', value: 38 }, { label: 'Jun', value: 52 }, { label: 'Jul', value: 47 },
  { label: 'Aug', value: 66 }, { label: 'Sep', value: 58 }, { label: 'Oct', value: 71 },
];

type Part = 'avatar' | 'button' | 'charts';
const lines = (s: string) => s.trimEnd().split('\n').length;
// line counts come from the files themselves, so the terminal never lies about them
const PARTS: { id: Part; lines: number; draws: string }[] = [
  { id: 'avatar', lines: lines(avatarSrc), draws: 'the faces' },
  { id: 'button', lines: lines(buttonSrc), draws: 'the actions' },
  { id: 'charts', lines: lines(chartsSrc), draws: 'the chart' },
];
const CMD = 'npx github:RandomKid24/befui add ';

/** Slot for a part whose file is not in the project yet. */
function Missing({ file, className = '' }: { file: string; className?: string }) {
  return <span className={`grid place-items-center rounded-md border border-dashed border-foreground/25 font-mono text-[11px] text-muted-foreground ${className}`}>{file}</span>;
}

/**
 * The first screen's proof. A terminal adds three files, and each file's component lands in the screen below it.
 * Every file line is a checkbox: untick it and that part leaves the screen, because a befui component is exactly one file.
 */
export function Assembly() {
  const still = React.useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver, []);
  const [have, setHave] = React.useState<Set<Part>>(() => new Set(still ? PARTS.map((p) => p.id) : []));
  const [typed, setTyped] = React.useState('');
  const [auto, setAuto] = React.useState(!still);

  React.useEffect(() => {
    if (!auto) return;
    let dead = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(700);
      for (const p of PARTS) {
        const line = CMD + p.id;
        for (let i = 1; i <= line.length; i++) { if (dead) return; setTyped(line.slice(0, i)); await wait(15); }
        await wait(260);
        if (dead) return;
        setHave((h) => new Set(h).add(p.id));
        setTyped('');
        await wait(480);
      }
      if (!dead) setAuto(false);
    })();
    return () => { dead = true; };
  }, [auto]);

  const toggle = (p: Part) => {
    setAuto(false);
    setTyped('');
    setHave((h) => { const n = new Set(h); if (!n.delete(p)) n.add(p); return n; });
  };

  return (
    <div>
      <div className="relative z-10 rounded-lg bg-[#0c111d] text-[#e6e9f0] shadow-lg shadow-black/20 ring-1 ring-white/10 sm:-ms-6 sm:me-12">
        <div className="flex items-center justify-between border-b border-white/10 py-1 pe-1 ps-4 font-mono text-[11px] text-[#9aa3b8]">
          <span>~/your-app</span>
          <CopyButton value={CMD + 'button'} className="size-7 border-0 bg-transparent text-[#9aa3b8] hover:bg-white/10 hover:text-white" />
        </div>
        <div className="px-4 pb-3 pt-2.5 font-mono text-[12.5px] leading-6">
          <p className="overflow-hidden whitespace-nowrap" aria-hidden>
            <span className="text-[#7aa2ff]">$</span> {typed}<span className="term-caret" />
          </p>
          <ul aria-label="Files added to the project">
            {PARTS.map((p) => {
              const on = have.has(p.id);
              return (
                <li key={p.id}>
                  <label className="-mx-2 flex cursor-pointer items-baseline gap-2 rounded px-2 hover:bg-white/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#7aa2ff]">
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(p.id)} />
                    <span aria-hidden className={on ? 'w-3 text-[#5fd39a]' : 'w-3 text-[#6b7489]'}>{on ? '+' : '·'}</span>
                    <span className={`min-w-0 flex-1 truncate transition-colors ${on ? '' : 'text-[#6b7489] line-through decoration-[#6b7489]/60'}`}>
                      <span className="hidden sm:inline">src/components/ui/</span>{p.id}.tsx
                    </span>
                    <span className="shrink-0 text-[#9aa3b8]">{p.lines} lines, {p.draws}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <ApprovalsPanel have={have} />
      <p className="mt-3 text-[13px] text-muted-foreground">
        Each terminal line is a real file from the library. Untick one and its part leaves the screen.
      </p>
    </div>
  );
}

/** The approvals screen the terminal assembles. Text and data are plain markup; the faces, actions and chart are the three files. */
function ApprovalsPanel({ have }: { have: Set<Part> }) {
  const [status, setStatus] = React.useState<Record<string, Status>>({});
  const open = REQUESTS.filter((r) => !status[r.id] || status[r.id] === 'open').length;
  const set = (id: string, s: Status) => setStatus((x) => ({ ...x, [id]: s }));
  return (
    <figure className="-mt-5 rounded-xl border bg-card pt-5 shadow-xl shadow-black/[0.06] dark:shadow-black/40">
      <div className="px-5 pb-5 pt-4">
        <header className="flex items-end justify-between gap-6 border-b pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Approvals</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground" aria-live="polite">{open === 0 ? 'Nothing waiting for you' : `${open} waiting for you`}</p>
          </div>
          <p className="text-right">
            <span className="font-display text-4xl font-semibold tabular-nums leading-none">142</span>
            <span className="mt-1 block text-xs text-muted-foreground">people, 6 away today (demo data)</span>
          </p>
        </header>
        <ul className="divide-y">
          {REQUESTS.map((r) => {
            const s = status[r.id] ?? 'open';
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                {have.has('avatar') ? <span className="part-in"><Avatar name={r.name} size="sm" /></span> : <Missing file="" className="size-8 rounded-full" />}
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-sm font-medium">{r.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{r.what}, {r.when}, {r.days} {r.days === 1 ? 'day' : 'days'}</span>
                </div>
                {!have.has('button') ? (
                  <Missing file="button.tsx" className="h-8 w-[9.75rem]" />
                ) : s === 'open' ? (
                  <div className="part-in flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => set(r.id, 'declined')} aria-label={`Decline ${r.name}`}>Decline</Button>
                    <Button size="sm" onClick={() => set(r.id, 'approved')} aria-label={`Approve ${r.name}`}>Approve</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className={s === 'approved' ? 'font-medium text-success' : 'font-medium text-destructive'}>{s === 'approved' ? 'Approved' : 'Declined'}</span>
                    <Button size="sm" variant="ghost" onClick={() => set(r.id, 'open')} aria-label={`Undo for ${r.name}`}>Undo</Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <section className="mt-4 border-t pt-4" aria-labelledby="leave-months">
          <h3 id="leave-months" className="mb-3 text-[13px] font-medium">Leave days per month</h3>
          {have.has('charts') ? <div className="part-in"><BarChart height={120} data={MONTHS} /></div> : <Missing file="charts.tsx" className="h-[120px]" />}
        </section>
      </div>
    </figure>
  );
}
