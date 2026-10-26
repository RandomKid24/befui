import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { TokenControls, TokenReadout, useBench } from './bench';
import { Close, Faq, BlocksViewer, Families, OpenTheFile } from './home-sections';
import { HeroWorkspace } from './hero-workspace';
import { Link } from './router';
import './site.css';

const INSTALL = 'npx befui add button';

/**
 * The first frame is the theme. Three CSS lines rebrand the library, and everything on this page reads them, so the
 * headline sits beside the live CSS and the controls under it edit those lines for the whole page. Below that is a
 * working screen made of library parts that follows the same lines.
 */
function Hero() {
  const bench = useBench();
  return (
    <section className="mx-auto max-w-[88rem] px-4 pb-20 pt-10 sm:px-6 sm:pt-14" aria-labelledby="hero-title">
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
        <div>
          <Reveal>
            <h1 id="hero-title" className="font-display text-balance text-5xl font-bold leading-[0.98] tracking-[-0.03em] sm:text-6xl">
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
          </Reveal>
          <div>
            <p className="font-display mt-7 max-w-lg text-pretty text-lg text-muted-foreground">
              Copy-paste React components with real motion, built on Radix and Tailwind. The CLI drops each one into your project as a single file, and from then on it is yours.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button asChild size="lg"><Link to="/docs">Get started <ArrowRightIcon draw /></Link></Button>
              <div className="flex items-center gap-2 rounded-md border bg-background py-1 pl-3.5 pr-1">
                <code className="font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> {INSTALL}</code>
                <CopyButton value={INSTALL} className="size-7" />
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:border-s lg:ps-8">
          <TokenReadout bench={bench} />
        </div>
      </div>

      <div className="mt-8">
        <TokenControls bench={bench} />
      </div>

      <div className="mt-10">
        <HeroWorkspace />
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <OpenTheFile />
      <Families />
      <BlocksViewer />
      <Faq />
      <Close />
    </>
  );
}
