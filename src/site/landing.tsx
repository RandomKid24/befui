import * as React from 'react';
import LeaveRequestForm from '@/blocks/leave-request-form';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { blocks, components } from '@/registry';
import { TokenControls, TokenDetails, TokenReadout, useBench } from './bench';
import { SheetHead } from './sheet';
import { Close, Faq, BlocksViewer } from './home-sections';
import { Shelf } from './shelf';
import { Showcase } from './home-showcase';
import { flutterSlugs } from './platform-lists';
import { Link } from './router';
import './site.css';

/**
 * The first frame says what befui is in one line, gives the two ways in, and puts a real component on stage next to it.
 * The counts are read from the registry, so they are never out of date.
 */
function Hero() {
  const facts: [number, string, string][] = [
    [components.length, 'components', '/components'],
    [blocks.length, 'whole screens', '/blocks'],
    [flutterSlugs.length, 'Flutter widgets', '/flutter'],
  ];
  const intro = (
    <>
      <h1 id="hero-title" className="font-display text-[2.75rem] font-bold leading-[0.96] tracking-[-0.035em] sm:text-6xl xl:text-[4.5rem]">
        Components you copy,
        <br />
        then{' '}
        <span className="relative inline-block text-primary">
          own
          <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className="hero-stroke absolute -bottom-1 left-0 h-3 w-full overflow-visible">
            <path pathLength={1} d="M2 9 C 30 3, 52 12, 84 7 S 140 3, 198 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
        .
      </h1>
      <p className="font-display mt-5 text-pretty text-lg text-muted-foreground">
        {components.length} React components built on Radix and Tailwind. Each one is a single file that goes into your project, so you change it like your own code.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild size="lg"><Link to="/docs">Get started <ArrowRightIcon draw /></Link></Button>
        <Button asChild size="lg" variant="outline"><Link to="/components">Browse components</Link></Button>
      </div>
    </>
  );
  return (
    <section className="hero-sheet relative overflow-hidden border-b" aria-labelledby="hero-title">
      <div className="relative mx-auto max-w-[88rem] px-4 pb-10 pt-10 sm:px-6 sm:pt-14">
        <div className="hero-in"><Showcase intro={intro} /></div>
        <dl className="mt-12 grid max-w-xl grid-cols-3 border-t pt-6">
          {facts.map(([n, label, to]) => (
            <Link key={label} to={to} className="group pe-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&+&]:border-s [&+&]:ps-4 sm:[&+&]:ps-6">
              <dd className="font-display text-3xl font-bold tabular-nums leading-none tracking-tight">{n}</dd>
              <dt className="mt-1.5 text-[13px] text-muted-foreground underline-offset-4 group-hover:text-foreground group-hover:underline">{label}</dt>
            </Link>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** How it works, as three plain steps. No tiles: numerals, a rule between them, and the real command. */
function Steps() {
  const steps: [string, string, React.ReactNode][] = [
    ['Pick one', `Browse the library or search it. Every page runs the real component, with its variants and a playground.`, <Link to="/components" className="font-medium underline underline-offset-4">Browse components</Link>],
    ['Copy it', 'One command adds the file, plus anything it needs, to src/components/ui. Or paste the source by hand.', <code className="block overflow-x-auto whitespace-nowrap rounded border bg-background px-2.5 py-1.5 font-mono text-[12px]"><span className="text-primary">$</span> npx github:RandomKid24/befui add date-picker</code>],
    ['Change it', 'From here it is your code. Edit the markup, the classes or the motion. There is no package to upgrade and no props to fight.', <Link to="/docs" className="font-medium underline underline-offset-4">Setup guide</Link>],
  ];
  return (
    <section className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6" aria-labelledby="steps">
      <SheetHead n={2} tag="three steps" />
      <h2 id="steps" className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-4xl">From the page to your project in a minute</h2>
      <ol className="mt-10 grid gap-y-10 md:grid-cols-3">
        {steps.map(([title, body, extra], i) => (
          <li key={title} className="sec-in border-t pt-5 md:pe-8 md:[&+&]:border-s md:[&+&]:ps-8" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="font-display text-5xl font-bold tabular-nums leading-none text-primary/80">{i + 1}</span>
            <h3 className="font-display mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-pretty text-[15px] leading-relaxed text-muted-foreground">{body}</p>
            <div className="mt-4 text-[13px]">{extra}</div>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-[13px] text-muted-foreground">Working with an AI coding tool? <Link to="/ai" className="font-medium text-foreground underline underline-offset-4">It can install these for you</Link>.</p>
    </section>
  );
}

/**
 * The theme as the thing itself: the controls, the CSS they write, and a form that follows them. The screen in the
 * hero and the nav follow too, because all of it reads the same variables.
 */
function Theme() {
  const bench = useBench();
  return (
    <section className="border-b bg-muted/40" aria-labelledby="theme">
      <div className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
        <SheetHead n={5} tag="src/index.css" />
        <h2 id="theme" className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-4xl">A few CSS lines are the whole theme</h2>
        <p className="font-display mt-3 max-w-xl text-pretty text-lg text-muted-foreground">
          Pick a colour, a corner and a density. The page you are reading restyles as you go, and the CSS on the left is all you paste into your project.
        </p>
        <div className="mt-8"><TokenControls bench={bench} /></div>
        <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <div className="min-w-0"><TokenReadout bench={bench} /><TokenDetails bench={bench} /></div>
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
      <Steps />
      <Shelf />
      <BlocksViewer />
      <Theme />
      <Faq />
      <Close />
    </>
  );
}
