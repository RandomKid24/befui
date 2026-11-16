'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReportSection, ReportView, type ReportMeta } from './report-view';

export interface FeedbackTheme { theme: string; mentions: number; /** Average rating for responses that mention it, 1 to 5. */ rating: number; quote?: string }
export interface FeedbackReportProps extends ReportMeta {
  /** Count of responses by rating, index 0 is 1 star. */
  ratings: [number, number, number, number, number];
  /** Previous period average, for the change. */
  previousAverage?: number;
  /** Net promoter score, -100 to 100. */
  nps?: number;
  themes: FeedbackTheme[];
  summary?: string;
}

/** Customer feedback report: average rating with change, response count, a 5-to-1 star distribution, NPS, themes with mentions and a quote, and a summary. */
export function FeedbackReport({ ratings, previousAverage, nps, themes, summary, ...meta }: FeedbackReportProps) {
  const n = ratings.reduce((s, v) => s + v, 0);
  const avg = n ? ratings.reduce((s, v, i) => s + v * (i + 1), 0) / n : 0;
  const max = Math.max(...ratings, 1);
  const change = previousAverage ? avg - previousAverage : undefined;
  return (
    <ReportView {...meta} stats={[{ label: 'Average rating', value: `${avg.toFixed(2)} / 5`, hint: change !== undefined ? `${change >= 0 ? '+' : ''}${change.toFixed(2)} since last period` : undefined, tone: change === undefined ? undefined : change >= 0 ? 'good' : 'bad' }, { label: 'Responses', value: n.toLocaleString() }, ...(nps !== undefined ? [{ label: 'NPS', value: `${nps > 0 ? '+' : ''}${nps}` }] : [])]} footer={`${n.toLocaleString()} responses`}>
      <ReportSection title="Rating distribution">
        <ul className="grid max-w-xl gap-1.5">
          {[5, 4, 3, 2, 1].map((s) => (
            <li key={s} className="flex items-center gap-3 text-xs"><span className="w-4 text-end font-mono text-muted-foreground">{s}</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${(ratings[s - 1] / max) * 100}%` }} /></div><span className="w-12 text-end tabular-nums text-muted-foreground">{ratings[s - 1].toLocaleString()}</span></li>
          ))}
        </ul>
      </ReportSection>
      <ReportSection flush title="What people talk about">
        <ul className="divide-y border-t">
          {[...themes].sort((a, b) => b.mentions - a.mentions).map((t) => (
            <li key={t.theme} className="px-5 py-3">
              <div className="flex items-baseline justify-between gap-3"><span className="font-medium">{t.theme}</span><span className="text-xs text-muted-foreground"><span className="tabular-nums">{t.mentions}</span> mentions, <span className={cn('font-semibold tabular-nums', t.rating < 3 ? 'text-destructive' : t.rating >= 4 ? 'text-success' : 'text-foreground')}>{t.rating.toFixed(1)}</span> avg</span></div>
              {t.quote && <p className="mt-1 max-w-prose italic leading-relaxed text-muted-foreground">"{t.quote}"</p>}
            </li>
          ))}
        </ul>
      </ReportSection>
      {summary && <ReportSection title="Summary"><p className="max-w-prose leading-relaxed">{summary}</p></ReportSection>}
    </ReportView>
  );
}

const th = 'h-8 px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground';
