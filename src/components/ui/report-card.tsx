'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Subject { name: string; /** Marks out of 100, one per term. */ scores: number[]; remark?: string }
export interface ReportCardProps {
  school: string;
  year: string;
  student: { name: string; class: string; roll?: string };
  terms: string[];
  subjects: Subject[];
  attendance?: { present: number; total: number };
  teacherNote?: string;
  className?: string;
}

const grade = (p: number) => (p >= 90 ? 'A' : p >= 75 ? 'B' : p >= 60 ? 'C' : p >= 40 ? 'D' : 'F');
const tone = (g: string) => (g === 'A' || g === 'B' ? 'text-success' : g === 'C' ? 'text-foreground' : g === 'D' ? 'text-warning' : 'text-destructive');

/**
 * School report card with a double-ruled frame. Each subject shows its marks per term as small bars, the average and a letter grade
 * (A from 90, B from 75, C from 60, D from 40, F below). The overall grade is large on the left.
 */
export function ReportCard({ school, year, student, terms, subjects, attendance, teacherNote, className }: ReportCardProps) {
  const avg = (s: Subject) => s.scores.reduce((a, b) => a + b, 0) / s.scores.length;
  const overall = subjects.reduce((a, s) => a + avg(s), 0) / subjects.length;
  const og = grade(overall);
  return (
    <article className={cn('mx-auto w-full max-w-3xl border-4 border-double border-foreground/70 bg-card p-6 text-sm text-card-foreground sm:p-8 print:border-foreground', className)}>
      <header className="text-center">
        <p className="font-serif text-2xl font-semibold tracking-wide">{school}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">Report card, {year}</p>
      </header>
      <div className="mt-6 grid grid-cols-[auto_1fr] gap-6 border-y py-5">
        <div className="grid size-24 place-items-center border-2 border-foreground text-center">
          <div><p className={cn('font-serif text-5xl font-bold leading-none', tone(og))}>{og}</p><p className="mt-1 text-[11px] tabular-nums text-muted-foreground">{overall.toFixed(1)}%</p></div>
        </div>
        <dl className="grid content-center gap-x-8 gap-y-2 sm:grid-cols-2">
          {[['Student', student.name], ['Class', student.class], ['Roll no.', student.roll ?? '-'], ['Attendance', attendance ? `${Math.round((attendance.present / attendance.total) * 100)}% (${attendance.present} of ${attendance.total} days)` : '-']].map(([k, v]) => (
            <div key={k}><dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
        </dl>
      </div>
      <table className="mt-5 w-full">
        <thead>
          <tr className="border-b-2 border-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="py-2 text-start font-medium">Subject</th>
            {terms.map((t) => <th key={t} className="py-2 text-end font-medium">{t}</th>)}
            <th className="py-2 text-end font-medium">Average</th><th className="w-12 py-2 text-end font-medium">Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => {
            const a = avg(s), g = grade(a);
            return (
              <React.Fragment key={s.name}>
                <tr className={s.remark ? '' : 'border-b'}>
                  <td className="pt-2.5 font-medium">{s.name}</td>
                  {s.scores.map((v, i) => <td key={i} className="pt-2.5 text-end tabular-nums">{v}</td>)}
                  <td className="pt-2.5 text-end tabular-nums">{a.toFixed(1)}</td>
                  <td className={cn('pt-2.5 text-end font-serif text-xl font-bold', tone(g))}>{g}</td>
                </tr>
                {s.remark && <tr className="border-b"><td colSpan={terms.length + 3} className="pb-2 text-xs italic text-muted-foreground">{s.remark}</td></tr>}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {teacherNote && <p className="mt-5 border-s-2 border-foreground ps-3 leading-relaxed"><span className="block text-[11px] uppercase tracking-wider text-muted-foreground">Class teacher</span>{teacherNote}</p>}
      <div className="mt-8 grid grid-cols-3 gap-8 text-xs text-muted-foreground">
        {['Class teacher', 'Principal', 'Parent'].map((s) => <div key={s} className="border-t pt-1.5">{s}</div>)}
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">A 90 and above, B 75 to 89, C 60 to 74, D 40 to 59, F below 40</p>
    </article>
  );
}
