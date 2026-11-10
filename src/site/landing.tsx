import * as React from 'react';
import LeaveRequestForm from '@/blocks/leave-request-form';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { blocks, components } from '@/registry';
import { TokenControls, TokenReadout, useBench } from './bench';
import { Agents, Close, Faq, BlocksViewer, OpenTheFile } from './home-sections';
import { Shelf } from './shelf';
import { ApprovalsPanel } from './hero-workspace';
import { flutterSlugs } from './platform-lists';
import { Link } from './router';
import './site.css';

const INSTALL = 'npx github:RandomKid24/befui add button';

/**
 * The first frame is the claim and its proof side by side: the headline, and a working screen made of library parts.
 * The counts under the buttons are read from the registry, so they are never out of date.
 */
function Hero() {
  const facts: [number, string, string][] = [
    [components.length, 'components', '/components'],
    [blocks.length, 'whole screens', '/blocks'],
    [flutterSlugs.length, 'Flutter widgets', '/flutter'],
  ];
  return (
    <section className="mx-auto max-w-[88rem] px-4 pb-16 pt-10 sm:px-6 sm:pt-16" aria-labelledby="hero-title">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,33rem)] lg:items-center">
        <div className="hero-in min-w-0">
          <h1 id="hero-title" className="font-display text-balance text-[2.5rem] font-bold leading-[0.98] tracking-[-0.03em] sm:text-6xl xl:text-7xl">
            Interfaces people
            <br />
            actually{' '}
            <span className="relative inline-block text-primary">
              enjoy
              <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className="hero-stroke absolute -bottom-1 left-0 h-3 w-full overflow-visible">
                <path pathLength={1} d="M2 9 C 30 3, 52 12, 84 7 S 140 3, 198 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{' '}
            using
          </h1>
          <p className="font-display mt-7 max-w-lg text-pretty text-lg text-muted-foreground">
            Copy-paste React components with real motion, built on Radix and Tailwind. The CLI drops each one into your project as a single file, and from then on it is yours.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg"><Link to="/docs">Get started <ArrowRightIcon draw /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/components">Browse components</Link></Button>
          </div>
          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-md border bg-card py-1 pl-3.5 pr-1">
            <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> {INSTALL}</code>
            <CopyButton value={INSTALL} className="size-8 shrink-0" />
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 border-t pt-6">
            {facts.map(([n, label, to]) => (
              <Link key={label} to={to} className="group pe-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&+&]:border-s [&+&]:ps-4 sm:[&+&]:ps-6">
                <dd className="font-display text-3xl font-bold tabular-nums leading-none tracking-tight">{n}</dd>
                <dt className="mt-1.5 text-[13px] text-muted-foreground underline-offset-4 group-hover:text-foreground group-hover:underline">{label}</dt>
              </Link>
            ))}
          </dl>
        </div>
        <div className="hero-in min-w-0 [animation-delay:120ms]">
          <ApprovalsPanel />
        </div>
      </div>
    </section>
  );
}

/**
 * The theme as the thing itself: the controls, the CSS they write, and a form that follows them. The panel in the
 * hero and the nav follow too, because all of it reads the same variables.
 */
function Theme() {
  const bench = useBench();
  return (
    <section className="border-y bg-muted/40" aria-labelledby="theme">
      <div className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
        <h2 id="theme" className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-4xl">A few CSS lines are the whole theme</h2>
        <p className="font-display mt-3 max-w-xl text-pretty text-lg text-muted-foreground">
          Pick a colour, a corner and a density. The page you are reading restyles as you go, and the CSS on the left is all you paste into your project.
        </p>
        <div className="mt-8"><TokenControls bench={bench} /></div>
        <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <TokenReadout bench={bench} />
          <figure className="min-w-0 lg:justify-self-end lg:w-full lg:max-w-[34rem]">
            <LeaveRequestForm />
            <figcaption className="mt-3 text-[13px] text-muted-foreground">The leave request block, straight from the library. It validates for real.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Theme />
      <Shelf />
      <OpenTheFile />
      <BlocksViewer />
      <Agents />
      <Faq />
      <Close />
    </>
  );
}
