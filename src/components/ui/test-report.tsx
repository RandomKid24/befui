'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

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
    <ReportView {...meta} stats={[{ label: 'Pass rate', value: `${rate.toFixed(1)}%`, tone: ok ? 'good' : 'bad', hint: ok ? 'Passed' : `${failed} failed` }, { label: 'Passed', value: passed }, { label: 'Failed', value: failed, tone: failed ? 'bad' : undefined }, { label: 'Skipped', value: skipped }, ...facts.map((f) => ({ label: f.label, value: <span className="font-mono text-sm font-medium">{f.value}</span> }))]} footer={`${total} tests, ${suites.length} suites`}>
      <ReportSection flush title="Suites">
        <table className="w-full">
          <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Suite</th><th className={cn(th, 'w-40 ps-4 text-start')}>Result</th><th className={cn(th, 'text-end')}>Passed</th><th className={cn(th, 'text-end')}>Failed</th><th className={cn(th, 'text-end')}>Time</th></tr></thead>
          <tbody>
            {suites.map((s) => {
              const n = s.passed + s.failed + (s.skipped ?? 0);
              return (
                <tr key={s.name} className="border-b">
                  <td className="px-5 py-2.5">{s.name}</td>
                  <td className="px-5 py-2.5 ps-4"><div className="flex h-1.5 overflow-hidden bg-muted"><div className="bg-success" style={{ width: `${(s.passed / n) * 100}%` }} /><div className="bg-destructive" style={{ width: `${(s.failed / n) * 100}%` }} /></div></td>
                  <td className="px-5 py-2.5 text-end tabular-nums">{s.passed}</td>
                  <td className={cn('px-5 py-2.5 text-end tabular-nums', s.failed > 0 && 'font-semibold text-destructive')}>{s.failed}</td>
                  <td className="px-5 py-2.5 text-end tabular-nums text-muted-foreground">{s.duration !== undefined ? `${s.duration}s` : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ReportSection>
      {failures && failures.length > 0 && (
        <ReportSection flush title="Failures">
          <ul className="divide-y border-t">
            {failures.map((f) => (
              <li key={f.test} className="border-s-2 border-s-destructive px-5 py-3">
                <p className="font-medium">{f.test}</p>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">{f.message}</p>
                {f.where && <p className="font-mono text-xs text-muted-foreground">{f.where}</p>}
              </li>
            ))}
          </ul>
        </ReportSection>
      )}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
