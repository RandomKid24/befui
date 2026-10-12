import * as React from 'react';
import { Accordion, type AccordionItem } from './accordion';
import { cn } from '@/lib/utils';

/** Marketing page building blocks. Stack them in a page: Hero, LogoStrip, FeatureGrid, StatsStrip, Faq, CtaBanner, SiteFooter. */

export function Hero({ eyebrow, title, description, actions, media, align = 'center', className }: { eyebrow?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; media?: React.ReactNode; align?: 'center' | 'left'; className?: string }) {
  const center = align === 'center';
  return (
    <section className={cn('mx-auto max-w-5xl px-4 py-16 sm:py-24', center && 'text-center', className)}>
      <div className={cn('grid gap-5', center && 'justify-items-center')}>
        {eyebrow && <span className="inline-flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{eyebrow}</span>}
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">{description}</p>}
        {actions && <div className="flex flex-wrap items-center gap-3 pt-1">{actions}</div>}
      </div>
      {media && <div className="mt-12">{media}</div>}
    </section>
  );
}

export interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureGrid({ title, description, features, columns = 3, className }: { title?: string; description?: string; features: Feature[]; columns?: 2 | 3 | 4; className?: string }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
  return (
    <section className={cn('mx-auto max-w-6xl px-4 py-12 sm:py-16', className)}>
      {(title || description) && (
        <div className="mx-auto mb-10 grid max-w-2xl gap-2 text-center">
          {title && <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className={cn('grid gap-4', cols)}>
        {features.map((f) => (
          <div key={f.title} className="grid content-start gap-2 rounded-xl border bg-card p-5">
            {f.icon && <span className="mb-1 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4.5">{f.icon}</span>}
            <h3 className="text-sm font-semibold">{f.title}</h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LogoStrip({ title = 'Trusted by teams at', logos, className }: { title?: string; logos: string[]; className?: string }) {
  return (
    <section className={cn('mx-auto max-w-5xl px-4 py-8 text-center', className)}>
      <p className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {logos.map((l) => <span key={l} className="text-lg font-semibold tracking-tight text-muted-foreground/70">{l}</span>)}
      </div>
    </section>
  );
}

export function StatsStrip({ stats, className }: { stats: { value: string; label: string }[]; className?: string }) {
  return (
    <section className={cn('mx-auto max-w-5xl px-4 py-10', className)}>
      <dl className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="grid gap-1">
            <dd className="order-first text-3xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
            <dt className="text-[13px] text-muted-foreground">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Faq({ title = 'Frequently asked questions', items, className }: { title?: string; items: AccordionItem[]; className?: string }) {
  return (
    <section className={cn('mx-auto max-w-2xl px-4 py-12 sm:py-16', className)}>
      <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">{title}</h2>
      <Accordion items={items} />
    </section>
  );
}

export function CtaBanner({ title, description, actions, className }: { title: string; description?: string; actions?: React.ReactNode; className?: string }) {
  return (
    <section className={cn('mx-auto max-w-5xl px-4 py-12', className)}>
      <div className="grid justify-items-center gap-4 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
        <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="max-w-lg text-primary-foreground/80">{description}</p>}
        {actions && <div className="flex flex-wrap justify-center gap-3 pt-1">{actions}</div>}
      </div>
    </section>
  );
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export function SiteFooter({ brand, tagline, columns, legal, className }: { brand: React.ReactNode; tagline?: string; columns: FooterColumn[]; legal?: React.ReactNode; className?: string }) {
  return (
    <footer className={cn('border-t bg-muted/40', className)}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="grid content-start gap-2">
          <div className="flex items-center gap-2 font-semibold">{brand}</div>
          {tagline && <p className="max-w-xs text-[13px] text-muted-foreground">{tagline}</p>}
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="grid content-start gap-2 text-[13px]">
            <span className="font-semibold">{c.title}</span>
            {c.links.map((l) => <a key={l.label} href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">{l.label}</a>)}
          </nav>
        ))}
      </div>
      {legal && <div className="mx-auto max-w-6xl border-t px-4 py-4 text-xs text-muted-foreground">{legal}</div>}
    </footer>
  );
}
