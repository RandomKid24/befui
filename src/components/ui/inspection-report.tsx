'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from './icons';

export type CheckResult = 'pass' | 'fail' | 'na';
export interface InspectionSection { title: string; items: { check: string; result: CheckResult; note?: string }[] }
export interface InspectionReportProps {
  title: string;
  site: string;
  date: string;
  inspector: string;
  number?: string;
  sections: InspectionSection[];
  className?: string;
}

/**
 * Site or safety inspection report. Each check is a square mark (tick, cross or dash) in a grid, grouped by area. Any failed check
 * turns the rotated stamp to FAILED and lists the deficiencies with their notes; otherwise it reads PASSED.
 */
export function InspectionReport({ title, site, date, inspector, number, sections, className }: InspectionReportProps) {
  const all = sections.flatMap((s) => s.items.map((i) => ({ ...i, area: s.title })));
  const fails = all.filter((i) => i.result === 'fail');
  const ok = fails.length === 0;
  const counted = all.filter((i) => i.result !== 'na').length;
  return (
    <article className={cn('relative mx-auto w-full max-w-3xl border border-foreground/40 bg-card text-sm text-card-foreground print:border-foreground', className)}>
      <header className="grid grid-cols-[1fr_auto] gap-4 border-b-4 border-foreground px-6 pb-4 pt-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Inspection report{number ? `, ${number}` : ''}</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight tracking-tight">{title}</h2>
          <p className="mt-2 text-muted-foreground">{site}</p>
        </div>
        <div aria-label={ok ? 'Passed' : 'Failed'} className={cn('-rotate-6 self-start border-[3px] px-3 py-1.5 text-center font-mono text-lg font-black uppercase leading-none tracking-widest', ok ? 'border-success text-success' : 'border-destructive text-destructive')}>
          {ok ? 'Passed' : 'Failed'}
          <span className="mt-1 block text-[10px] font-semibold tracking-wider">{counted - fails.length} of {counted} checks</span>
        </div>
      </header>
      <dl className="grid grid-cols-2 border-b text-[13px]">
        <div className="border-e px-6 py-2.5"><dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Date</dt><dd className="font-medium">{date}</dd></div>
        <div className="px-6 py-2.5"><dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Inspector</dt><dd className="font-medium">{inspector}</dd></div>
      </dl>
      <div className="grid gap-x-8 gap-y-6 px-6 py-5 sm:grid-cols-2">
        {sections.map((s) => (
          <section key={s.title}>
            <h3 className="mb-1.5 text-xs font-bold uppercase tracking-widest">{s.title}</h3>
            <ul className="border-t border-foreground">
              {s.items.map((i) => (
                <li key={i.check} className="flex items-start gap-2.5 border-b py-1.5">
                  <span aria-label={i.result} className={cn('mt-0.5 grid size-4 shrink-0 place-items-center border', i.result === 'pass' && 'border-foreground', i.result === 'fail' && 'border-destructive bg-destructive text-background', i.result === 'na' && 'border-dashed border-muted-foreground/50 text-muted-foreground')}>
                    {i.result === 'pass' && <CheckIcon className="size-3" />}{i.result === 'fail' && <XIcon className="size-3" />}{i.result === 'na' && <span className="text-[10px] leading-none">-</span>}
                  </span>
                  <span className={cn(i.result === 'na' && 'text-muted-foreground line-through decoration-muted-foreground/40')}>{i.check}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {!ok && (
        <section className="mx-6 mb-6 border-2 border-destructive p-4">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-destructive">Deficiencies to fix, {fails.length}</h3>
          <ol className="grid list-decimal gap-1.5 ps-5">
            {fails.map((f) => <li key={f.check}><span className="font-medium">{f.check}</span> <span className="text-muted-foreground">({f.area})</span>{f.note && <span className="block text-muted-foreground">{f.note}</span>}</li>)}
          </ol>
        </section>
      )}
      <footer className="grid grid-cols-2 gap-10 border-t px-6 pb-5 pt-8 text-xs text-muted-foreground">
        <div className="border-t pt-1.5">Inspector signature</div><div className="border-t pt-1.5">Site manager signature</div>
      </footer>
    </article>
  );
}
