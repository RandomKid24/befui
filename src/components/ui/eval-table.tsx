'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, XCircleIcon } from './icons';

export interface EvalCase {
  id: string;
  /** What was asked. */
  input: string;
  expected?: string;
  /** What each model or prompt version answered, by column key. */
  runs: Record<string, { output: string; pass: boolean; score?: number }>;
}
export interface EvalColumn { key: string; label: string }

/**
 * Side-by-side results of test questions run against several models or prompt versions. The header gives each column's pass rate,
 * each cell shows pass or fail and a score, and a click on a row opens every answer in full. "Failing only" hides the rows that all pass.
 */
export function EvalTable({ columns, cases, className }: { columns: EvalColumn[]; cases: EvalCase[]; className?: string }) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [onlyFail, setOnlyFail] = React.useState(false);
  const stats = columns.map((c) => {
    const rs = cases.map((x) => x.runs[c.key]).filter(Boolean);
    const pass = rs.filter((r) => r!.pass).length;
    const scored = rs.filter((r) => r!.score !== undefined);
    return { ...c, pass, total: rs.length, avg: scored.length ? scored.reduce((n, r) => n + r!.score!, 0) / scored.length : undefined };
  });
  const best = Math.max(...stats.map((s) => (s.total ? s.pass / s.total : 0)));
  const shown = onlyFail ? cases.filter((c) => columns.some((k) => c.runs[k.key] && !c.runs[k.key]!.pass)) : cases;

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card text-sm', className)}>
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <p className="text-xs text-muted-foreground">{cases.length} test cases</p>
        <label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={onlyFail} onChange={(e) => setOnlyFail(e.target.checked)} className="size-3.5 accent-primary" />Failing only</label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead>
            <tr className="border-b text-start">
              <th scope="col" className="w-[40%] px-3 py-2 text-start text-xs font-medium text-muted-foreground">Input</th>
              {stats.map((s) => {
                const rate = s.total ? s.pass / s.total : 0;
                return (
                  <th key={s.key} scope="col" className="px-3 py-2 text-start align-top">
                    <p className="font-medium">{s.label}</p>
                    <p className={cn('text-xs font-normal tabular-nums', rate === best ? 'text-success' : 'text-muted-foreground')}>{s.pass}/{s.total} pass ({Math.round(rate * 100)}%){s.avg !== undefined && ` · avg ${s.avg.toFixed(2)}`}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => {
              const isOpen = open === c.id;
              return (
                <React.Fragment key={c.id}>
                  <tr className={cn('border-b last:border-b-0 hover:bg-muted/40', isOpen && 'bg-muted/40')}>
                    <td className="px-3 py-2">
                      <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.id)} className="flex w-full items-start gap-1.5 rounded text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                        {isOpen ? <ChevronUpIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" /> : <ChevronDownIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
                        <span className="line-clamp-2">{c.input}</span>
                      </button>
                    </td>
                    {columns.map((k) => {
                      const r = c.runs[k.key];
                      return (
                        <td key={k.key} className="px-3 py-2">
                          {r ? (
                            <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', r.pass ? 'text-success' : 'text-destructive')}>
                              {r.pass ? <CheckCircleIcon className="size-4" /> : <XCircleIcon className="size-4" />}
                              {r.pass ? 'Pass' : 'Fail'}
                              {r.score !== undefined && <span className="font-normal tabular-nums text-muted-foreground">{r.score.toFixed(2)}</span>}
                            </span>
                          ) : <span className="text-muted-foreground">-</span>}
                        </td>
                      );
                    })}
                  </tr>
                  {isOpen && (
                    <tr className="border-b bg-muted/20 last:border-b-0">
                      <td colSpan={columns.length + 1} className="px-4 py-3">
                        <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
                          {c.expected && <Out title="Expected" tone="muted">{c.expected}</Out>}
                          {columns.map((k) => c.runs[k.key] && <Out key={k.key} title={k.label} tone={c.runs[k.key]!.pass ? 'pass' : 'fail'}>{c.runs[k.key]!.output}</Out>)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {!shown.length && <tr><td colSpan={columns.length + 1} className="px-3 py-8 text-center text-muted-foreground">Everything passes.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Out({ title, tone, children }: { title: string; tone: 'pass' | 'fail' | 'muted'; children: React.ReactNode }) {
  return (
    <div className={cn('min-w-0 rounded-lg border bg-background p-2.5 text-xs', tone === 'pass' && 'border-success/40', tone === 'fail' && 'border-destructive/40')}>
      <p className="mb-1 font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="whitespace-pre-wrap break-words leading-relaxed">{children}</p>
    </div>
  );
}
