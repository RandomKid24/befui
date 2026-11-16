import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AttendanceRow {
  name: string;
  role?: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  /** Total hours worked. */
  hours: number;
}
export interface AttendanceReportProps extends ReportMeta {
  rows: AttendanceRow[];
  /** Working days in the period, to work out attendance percent. */
  workingDays: number;
  /** Names that sign off the sheet, e.g. ["Prepared by", "HR manager"]. */
  signatures?: string[];
}

/** Monthly attendance sheet: one row per person with present, absent, late, leave and hours, an attendance percent that turns red under 90, column totals and signature lines. */
export function AttendanceReport({ rows, workingDays, signatures = ['Prepared by', 'Approved by'], ...meta }: AttendanceReportProps) {
  const t = (k: keyof AttendanceRow) => rows.reduce((s, r) => s + (r[k] as number), 0);
  const cols = ['Present', 'Absent', 'Late', 'Leave', 'Hours', 'Attendance'];
  const pct = (r: { present: number; late: number }) => Math.round(((r.present + r.late) / workingDays) * 100);
  return (
    <Sheet {...meta} footer={`${rows.length} people, ${workingDays} working days`}>
      <table className="w-full">
        <thead><tr className="border-b"><th className={cn(th, 'text-start')}>Employee</th>{cols.map((c) => <th key={c} className={cn(th, 'text-end')}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => {
            const p = pct(r);
            return (
              <tr key={r.name} className="border-b">
                <td className="py-2"><span className="font-medium">{r.name}</span>{r.role && <span className="block text-xs text-muted-foreground">{r.role}</span>}</td>
                <td className="py-2 text-end tabular-nums">{r.present}</td>
                <td className={cn('py-2 text-end tabular-nums', r.absent > 0 && 'text-destructive')}>{r.absent}</td>
                <td className={cn('py-2 text-end tabular-nums', r.late > 2 && 'text-warning')}>{r.late}</td>
                <td className="py-2 text-end tabular-nums">{r.leave}</td>
                <td className="py-2 text-end tabular-nums">{r.hours}</td>
                <td className={cn('py-2 text-end font-medium tabular-nums', p < 90 && 'text-destructive')}>{p}%</td>
              </tr>
            );
          })}
          <tr className="font-semibold"><td className="py-2">Total</td>{(['present', 'absent', 'late', 'leave', 'hours'] as const).map((k) => <td key={k} className="py-2 text-end tabular-nums">{t(k)}</td>)}<td className="py-2 text-end tabular-nums">{Math.round((t('present') + t('late')) / (workingDays * rows.length) * 100)}%</td></tr>
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-10 pt-10">
        {signatures.map((s) => <div key={s} className="border-t pt-1.5 text-xs text-muted-foreground">{s}</div>)}
      </div>
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
