'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from './icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ReportSection, ReportView, rv } from './report-view';

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

const label = { pass: 'Pass', fail: 'Fail', na: 'N/A' };

/**
 * Site or safety inspection report. Headline result and counts, then one table per area with a pass, fail or N/A mark and a note
 * for each check. Any failed check turns the result to Failed.
 */
export function InspectionReport({ title, site, date, inspector, number, sections, className }: InspectionReportProps) {
  const all = sections.flatMap((s) => s.items);
  const fails = all.filter((i) => i.result === 'fail').length;
  const counted = all.filter((i) => i.result !== 'na').length;
  return (
    <ReportView
      organization={site} title={title} period={date} number={number} className={className}
      footer={`Inspected by ${inspector}`}
      stats={[
        { label: 'Result', value: fails ? 'Failed' : 'Passed', tone: fails ? 'bad' : 'good' },
        { label: 'Checks passed', value: `${counted - fails} / ${counted}` },
        { label: 'Failed', value: fails, tone: fails ? 'bad' : undefined },
        { label: 'Inspector', value: <span className="text-sm">{inspector}</span> },
      ]}
    >
      {sections.map((s) => (
        <ReportSection key={s.title} flush title={s.title} aside={`${s.items.filter((i) => i.result === 'fail').length} failed`}>
          <Table className="table-fixed">
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead className={cn(rv.th, 'w-[45%]')}>Check</TableHead><TableHead className={cn(rv.th, 'w-28')}>Result</TableHead><TableHead className={rv.th}>Note</TableHead></TableRow></TableHeader>
            <TableBody>
              {s.items.map((i) => (
                <TableRow key={i.check}>
                  <TableCell className={cn(rv.td, i.result === 'na' && 'text-muted-foreground')}>{i.check}</TableCell>
                  <TableCell className={rv.td}>
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide', i.result === 'pass' && 'text-success', i.result === 'fail' && 'text-destructive', i.result === 'na' && 'text-muted-foreground')}>
                      {i.result === 'pass' && <CheckIcon className="size-3.5" />}{i.result === 'fail' && <XIcon className="size-3.5" />}{i.result === 'na' && <span aria-hidden className="w-3.5 text-center">-</span>}
                      {label[i.result]}
                    </span>
                  </TableCell>
                  <TableCell className={cn(rv.td, 'text-muted-foreground')}>{i.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ReportSection>
      ))}
    </ReportView>
  );
}
