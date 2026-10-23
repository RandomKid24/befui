'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from './copy-button';

type Mode = 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const pad = (n: number) => String(n).padStart(2, '0');

/** Does one cron field (`*`, `5`, `1,15`, `1-5`, `*\/10`, `1-30/5`) match the number? */
function field(expr: string, n: number, min: number, max: number): boolean | null {
  let hit = false;
  for (const part of expr.split(',')) {
    const [range = '', stepRaw] = part.split('/');
    const step = stepRaw === undefined ? 1 : Number(stepRaw);
    if (!Number.isInteger(step) || step < 1) return null;
    let lo = min, hi = max;
    if (range !== '*') {
      const [a, b] = range.split('-');
      lo = Number(a); hi = b === undefined ? (stepRaw === undefined ? lo : max) : Number(b);
      if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo < min || hi > max || lo > hi) return null;
    }
    if (n >= lo && n <= hi && (n - lo) % step === 0) hit = true;
  }
  return hit;
}

/** The next `count` times a 5-field cron expression fires after `from`, or null if the expression is invalid. */
export function nextRuns(expr: string, count = 3, from = new Date()): Date[] | null {
  const f = expr.trim().split(/\s+/);
  if (f.length !== 5) return null;
  const [mi, ho, dom, mo, dow] = f as [string, string, string, string, string];
  const out: Date[] = [];
  const t = new Date(from);
  t.setSeconds(0, 0);
  for (let i = 0; i < 366 * 24 * 60 && out.length < count; i++) {
    t.setMinutes(t.getMinutes() + 1);
    const m = [field(mi, t.getMinutes(), 0, 59), field(ho, t.getHours(), 0, 23), field(mo, t.getMonth() + 1, 1, 12)];
    const d = field(dom, t.getDate(), 1, 31), w = field(dow.replace(/7/g, '0'), t.getDay(), 0, 6);
    if (m.includes(null) || d === null || w === null) return null;
    // like real cron: when both day fields are restricted, either may match
    const dayOk = dom !== '*' && dow !== '*' ? d || w : d && w;
    if (m.every(Boolean) && dayOk) out.push(new Date(t));
  }
  return out;
}

/** Reads a simple expression back into the friendly controls; anything else opens in Custom. */
function parse(v?: string) {
  const d = { mode: 'daily' as Mode, every: 15, minute: 0, time: '09:00', days: [1], dom: 1 };
  const f = v?.trim().split(/\s+/);
  if (!f || f.length !== 5) return d;
  const [mi, ho, dm, mo, dw] = f as [string, string, string, string, string];
  const n = (x: string) => /^\d+$/.test(x);
  const at = () => `${pad(Number(ho))}:${pad(Number(mi))}`;
  if (mo !== '*') return { ...d, mode: 'custom' as Mode };
  if (/^\*\/\d+$/.test(mi) && ho === '*' && dm === '*' && dw === '*') return { ...d, mode: 'minutes' as Mode, every: Number(mi.slice(2)) };
  if (n(mi) && ho === '*' && dm === '*' && dw === '*') return { ...d, mode: 'hourly' as Mode, minute: Number(mi) };
  if (n(mi) && n(ho) && dm === '*' && dw === '*') return { ...d, mode: 'daily' as Mode, time: at() };
  if (n(mi) && n(ho) && dm === '*' && /^[0-6](,[0-6])*$/.test(dw)) return { ...d, mode: 'weekly' as Mode, time: at(), days: dw.split(',').map(Number) };
  if (n(mi) && n(ho) && n(dm) && dw === '*') return { ...d, mode: 'monthly' as Mode, time: at(), dom: Number(dm) };
  return { ...d, mode: 'custom' as Mode };
}

/**
 * Pick a schedule in words (every N minutes, hourly, daily, weekly, monthly) and get the cron expression, a plain sentence and the
 * next three run times. Choose Custom to type your own five fields; it says if it cannot read them. Controlled with `value`.
 */
export function CronBuilder({ value, onChange, className }: { value?: string; onChange?: (cron: string) => void; className?: string }) {
  const start = React.useMemo(() => parse(value), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [mode, setMode] = React.useState<Mode>(start.mode);
  const [every, setEvery] = React.useState(start.every);
  const [minute, setMinute] = React.useState(start.minute);
  const [time, setTime] = React.useState(start.time);
  const [days, setDays] = React.useState<number[]>(start.days);
  const [dom, setDom] = React.useState(start.dom);
  const [custom, setCustom] = React.useState(value ?? '0 9 * * 1');
  const [h, m] = time.split(':').map(Number) as [number, number];

  const cron =
    mode === 'minutes' ? `*/${every} * * * *`
    : mode === 'hourly' ? `${minute} * * * *`
    : mode === 'daily' ? `${m} ${h} * * *`
    : mode === 'weekly' ? `${m} ${h} * * ${[...days].sort().join(',') || '*'}`
    : mode === 'monthly' ? `${m} ${h} ${dom} * *`
    : custom.trim();

  React.useEffect(() => { onChange?.(cron); }, [cron]); // eslint-disable-line react-hooks/exhaustive-deps
  const runs = React.useMemo(() => nextRuns(cron), [cron]);
  const at = `${pad(h)}:${pad(m)}`;
  const sentence =
    mode === 'minutes' ? `Every ${every} minute${every === 1 ? '' : 's'}`
    : mode === 'hourly' ? `Every hour, at ${minute} past`
    : mode === 'daily' ? `Every day at ${at}`
    : mode === 'weekly' ? (days.length ? `Every ${days.slice().sort().map((d) => DAYS[d]).join(', ')} at ${at}` : 'Pick at least one day')
    : mode === 'monthly' ? `On day ${dom} of every month at ${at}`
    : runs ? 'Custom schedule' : 'Not a valid cron expression';
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const num = 'h-9 w-20 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15';
  const modes: [Mode, string][] = [['minutes', 'Minutes'], ['hourly', 'Hourly'], ['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['custom', 'Custom']];
  const timeInput = <input type="time" value={time} onChange={(e) => e.target.value && setTime(e.target.value)} aria-label="Time" className={cn(num, 'w-32')} />;

  return (
    <div className={cn('grid gap-4 rounded-xl border bg-card p-4', className)}>
      <div role="tablist" aria-label="Frequency" className="flex flex-wrap gap-1 rounded-lg bg-secondary p-0.5">
        {modes.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className="h-8 flex-1 rounded-md px-3 text-[13px] font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-sm">{label}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {mode === 'minutes' && <>Every <input type="number" min={1} max={59} value={every} onChange={(e) => setEvery(Math.min(59, Math.max(1, Number(e.target.value) || 1)))} aria-label="Minutes" className={num} /> minutes</>}
        {mode === 'hourly' && <>At <input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(Math.min(59, Math.max(0, Number(e.target.value) || 0)))} aria-label="Minute past the hour" className={num} /> minutes past every hour</>}
        {mode === 'daily' && <>Every day at {timeInput}</>}
        {mode === 'weekly' && (
          <>
            <span role="group" aria-label="Days" className="flex gap-1">
              {DAYS.map((d, i) => (
                <button key={d} type="button" aria-pressed={days.includes(i)} onClick={() => setDays(days.includes(i) ? days.filter((x) => x !== i) : [...days, i])} className="h-8 w-10 rounded-md border text-xs font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary">{d}</button>
              ))}
            </span>
            at {timeInput}
          </>
        )}
        {mode === 'monthly' && <>On day <input type="number" min={1} max={31} value={dom} onChange={(e) => setDom(Math.min(31, Math.max(1, Number(e.target.value) || 1)))} aria-label="Day of month" className={num} /> at {timeInput}</>}
        {mode === 'custom' && <input value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Cron expression" aria-invalid={!runs} spellCheck={false} placeholder="m h dom mon dow" className="h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 aria-[invalid=true]:border-destructive" />}
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
        <code className="flex-1 font-mono text-sm">{cron}</code>
        <CopyButton value={cron} />
      </div>
      <div aria-live="polite">
        <p className={cn('text-sm font-medium', !runs && 'text-destructive')}>{sentence}</p>
        {runs && (
          <ul className="mt-1.5 grid gap-0.5 text-xs text-muted-foreground">
            {runs.map((d) => <li key={+d} className="tabular-nums">{fmt.format(d)}</li>)}
            {!runs.length && <li>Never runs in the next year.</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
