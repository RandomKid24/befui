'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

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
    <Sheet {...meta} footer={`${n.toLocaleString()} responses`}>
      <div className="grid gap-8 border-b pb-6 sm:grid-cols-[auto_1fr]">
        <div>
          <p className="font-mono text-5xl font-semibold tabular-nums">{avg.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">average of 5, {n.toLocaleString()} responses</p>
          {change !== undefined && <p className={cn('mt-1 text-xs font-medium', change >= 0 ? 'text-success' : 'text-destructive')}>{change >= 0 ? '+' : ''}{change.toFixed(2)} since last period</p>}
          {nps !== undefined && <p className="mt-3 text-xs text-muted-foreground">NPS <span className="font-mono text-base font-semibold text-foreground">{nps > 0 ? '+' : ''}{nps}</span></p>}
        </div>
        <ul className="grid content-center gap-1.5">
          {[5, 4, 3, 2, 1].map((s) => (
            <li key={s} className="flex items-center gap-3 text-xs"><span className="w-4 text-end font-mono text-muted-foreground">{s}</span><div className="h-2 flex-1 bg-muted"><div className="h-full bg-foreground" style={{ width: `${(ratings[s - 1] / max) * 100}%` }} /></div><span className="w-12 text-end tabular-nums text-muted-foreground">{ratings[s - 1].toLocaleString()}</span></li>
          ))}
        </ul>
      </div>
      <Section title="What people talk about">
        <ul className="divide-y border-y">
          {[...themes].sort((a, b) => b.mentions - a.mentions).map((t) => (
            <li key={t.theme} className="py-3">
              <div className="flex items-baseline justify-between gap-3"><span className="font-medium">{t.theme}</span><span className="text-xs text-muted-foreground"><span className="tabular-nums">{t.mentions}</span> mentions, <span className={cn('font-semibold tabular-nums', t.rating < 3 ? 'text-destructive' : t.rating >= 4 ? 'text-success' : 'text-foreground')}>{t.rating.toFixed(1)}</span> avg</span></div>
              {t.quote && <p className="mt-1 max-w-prose italic leading-relaxed text-muted-foreground">"{t.quote}"</p>}
            </li>
          ))}
        </ul>
      </Section>
      {summary && <Section title="Summary"><p className="max-w-prose leading-relaxed">{summary}</p></Section>}
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
