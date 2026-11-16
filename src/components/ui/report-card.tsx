'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ReportSection, ReportView, rv } from './report-view';

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
 * School report card. Marks per term for each subject with the average and a letter grade (A from 90, B from 75, C from 60, D from 40,
 * F below), headline overall grade and attendance above, and the class teacher's note below.
 */
export function ReportCard({ school, year, student, terms, subjects, attendance, teacherNote, className }: ReportCardProps) {
  const avg = (s: Subject) => s.scores.reduce((a, b) => a + b, 0) / s.scores.length;
  const overall = subjects.reduce((a, s) => a + avg(s), 0) / subjects.length;
  const og = grade(overall);
  const att = attendance ? Math.round((attendance.present / attendance.total) * 100) : undefined;
  return (
    <ReportView
      organization={school} title="Report card" period={year} className={className}
      footer="A 90 and above, B 75 to 89, C 60 to 74, D 40 to 59, F below 40"
      stats={[
        { label: 'Student', value: <span className="text-sm">{student.name}</span>, hint: `Class ${student.class}${student.roll ? ` · Roll ${student.roll}` : ''}` },
        { label: 'Overall', value: <span className={tone(og)}>{og}</span>, hint: `${overall.toFixed(1)}%` },
        ...(attendance ? [{ label: 'Attendance', value: `${att}%`, hint: `${attendance.present} of ${attendance.total} days`, tone: att! < 75 ? 'bad' as const : undefined }] : []),
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={rv.th}>Subject</TableHead>
            {terms.map((t) => <TableHead key={t} className={cn(rv.th, 'text-end')}>{t}</TableHead>)}
            <TableHead className={cn(rv.th, 'text-end')}>Average</TableHead><TableHead className={cn(rv.th, 'w-16 text-end')}>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((s) => {
            const a = avg(s), g = grade(a);
            return (
              <TableRow key={s.name}>
                <TableCell className={rv.td}><span className="font-medium">{s.name}</span>{s.remark && <span className="block text-xs text-muted-foreground">{s.remark}</span>}</TableCell>
                {s.scores.map((v, i) => <TableCell key={i} className={cn(rv.td, rv.num)}>{v}</TableCell>)}
                <TableCell className={cn(rv.td, rv.num)}>{a.toFixed(1)}</TableCell>
                <TableCell className={cn(rv.td, 'text-end text-base font-bold', tone(g))}>{g}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {teacherNote && <ReportSection title="Class teacher"><p className="max-w-prose leading-relaxed">{teacherNote}</p></ReportSection>}
    </ReportView>
  );
}
