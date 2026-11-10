import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/charts';

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

/**
 * The live panel beside the headline: an approvals list and a chart made only of library parts. Every control works,
 * and it follows the theme controls in the band below, which is the page's proof that three CSS lines restyle real parts.
 */
export function ApprovalsPanel() {
  const [status, setStatus] = React.useState<Record<string, Status>>({});
  const open = REQUESTS.filter((r) => !status[r.id] || status[r.id] === 'open').length;
  const set = (id: string, s: Status) => setStatus((x) => ({ ...x, [id]: s }));
  return (
    <figure className="rounded-xl border bg-card shadow-xl shadow-black/[0.06] dark:shadow-black/40">
      <figcaption className="flex items-center justify-between gap-4 border-b px-5 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" aria-hidden />Running here, built from befui parts</span>
        <span>Demo data</span>
      </figcaption>
      <div className="px-5 pb-5 pt-4">
        <header className="flex items-end justify-between gap-6 border-b pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Approvals</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground" aria-live="polite">{open === 0 ? 'Nothing waiting for you' : `${open} waiting for you`}</p>
          </div>
          <p className="text-right">
            <span className="font-display text-4xl font-semibold tabular-nums leading-none">142</span>
            <span className="mt-1 block text-xs text-muted-foreground">people, 6 away today</span>
          </p>
        </header>
        <ul className="divide-y">
          {REQUESTS.map((r) => {
            const s = status[r.id] ?? 'open';
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <Avatar name={r.name} size="sm" />
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-sm font-medium">{r.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{r.what}, {r.when}, {r.days} {r.days === 1 ? 'day' : 'days'}</span>
                </div>
                {s === 'open' ? (
                  <div className="flex gap-1.5">
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
          <BarChart height={120} data={MONTHS} />
        </section>
      </div>
    </figure>
  );
}
