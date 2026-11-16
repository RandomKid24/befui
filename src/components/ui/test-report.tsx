'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TestSuite { name: string; passed: number; failed: number; skipped?: number; /** Seconds. */ duration?: number }
export interface TestFailure { test: string; message: string; where?: string }
export interface TestReportProps extends ReportMeta {
  /** Build, branch and environment facts shown at the top. */
  facts: { label: string; value: string }[];
  suites: TestSuite[];
  failures?: TestFailure[];
}

/** Test run report: pass rate and verdict, a table per suite with a pass bar, the build facts, and each failure with its message and location. */
export function TestReport({ facts, suites, failures, ...meta }: TestReportProps) {
  const sum = (k: 'passed' | 'failed' | 'skipped') => suites.reduce((s, x) => s + (x[k] ?? 0), 0);
  const passed = sum('passed'), failed = sum('failed'), skipped = sum('skipped');
  const total = passed + failed + skipped;
  const rate = total - skipped ? (passed / (total - skipped)) * 100 : 0;
  const ok = failed === 0;
  return (
    <Sheet {...meta} footer={`${total} tests, ${suites.length} suites`}>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-b pb-6">
        <div><p className={cn('font-mono text-4xl font-semibold tabular-nums', ok ? 'text-success' : 'text-destructive')}>{rate.toFixed(1)}%</p><p className="text-xs text-muted-foreground">pass rate</p></div>
        <div><p className={cn('text-base font-semibold', ok ? 'text-success' : 'text-destructive')}>{ok ? 'Passed' : `${failed} failed`}</p><p className="text-xs text-muted-foreground">{passed} passed, {skipped} skipped</p></div>
        {facts.map((f) => <div key={f.label}><p className="text-xs text-muted-foreground">{f.label}</p><p className="mt-0.5 font-mono text-[13px]">{f.value}</p></div>)}
      </div>
      <Section title="Suites">
        <table className="w-full">
          <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Suite</th><th className={cn(th, 'w-40 ps-4 text-start')}>Result</th><th className={cn(th, 'text-end')}>Passed</th><th className={cn(th, 'text-end')}>Failed</th><th className={cn(th, 'text-end')}>Time</th></tr></thead>
          <tbody>
            {suites.map((s) => {
              const n = s.passed + s.failed + (s.skipped ?? 0);
              return (
                <tr key={s.name} className="border-b">
                  <td className="py-2">{s.name}</td>
                  <td className="py-2 ps-4"><div className="flex h-1.5 overflow-hidden bg-muted"><div className="bg-success" style={{ width: `${(s.passed / n) * 100}%` }} /><div className="bg-destructive" style={{ width: `${(s.failed / n) * 100}%` }} /></div></td>
                  <td className="py-2 text-end tabular-nums">{s.passed}</td>
                  <td className={cn('py-2 text-end tabular-nums', s.failed > 0 && 'font-semibold text-destructive')}>{s.failed}</td>
                  <td className="py-2 text-end tabular-nums text-muted-foreground">{s.duration !== undefined ? `${s.duration}s` : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>
      {failures && failures.length > 0 && (
        <Section title="Failures">
          <ul className="grid gap-3">
            {failures.map((f) => (
              <li key={f.test} className="border-s-2 border-destructive ps-3">
                <p className="font-medium">{f.test}</p>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">{f.message}</p>
                {f.where && <p className="font-mono text-xs text-muted-foreground">{f.where}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </Sheet>
  );
}

export interface ReportMeta {
  organization: string;
  title: string;
  /** e.g. "1 to 31 October 2026" */
  period: string;
  /** Report number or reference. */
  number?: string;
  generated?: string;
  className?: string;
}

function Sheet({ organization, title, period, number, generated, className, children, footer }: ReportMeta & { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <article className={cn('mx-auto w-full max-w-3xl rounded-lg border bg-card p-6 text-sm text-card-foreground shadow-sm sm:p-10 print:border-0 print:shadow-none', className)}>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{organization}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        </div>
        <dl className="text-end text-xs text-muted-foreground">
          <dd className="font-medium text-foreground">{period}</dd>
          {number && <dd className="font-mono">{number}</dd>}
        </dl>
      </header>
      <div className="grid gap-8 py-6">{children}</div>
      <footer className="flex justify-between gap-4 border-t pt-3 text-xs text-muted-foreground">
        <span>{footer}</span>
        {generated && <span>Generated {generated}</span>}
      </footer>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

const th = 'py-2 text-xs font-medium text-muted-foreground';
