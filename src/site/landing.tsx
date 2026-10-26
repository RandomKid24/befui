import * as React from 'react';
import { ArrowRightIcon, BlocksIcon, LayersIcon, PackageIcon, PaletteIcon, SparkleIcon } from '@/components/ui/icons';
import { Accordion } from '@/components/ui/accordion';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { CopyButton } from '@/components/ui/copy-button';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Rating } from '@/components/ui/rating';
import { Reveal } from '@/components/ui/reveal';
import { Slider } from '@/components/ui/slider';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Switch } from '@/components/ui/switch';
import { TiltCard } from '@/components/ui/tilt-card';
import LeaveRequestForm from '@/blocks/leave-request-form';
import { blocks, components } from '@/registry';
import { BlockGrid } from './home-parts';
import { Link } from './router';
import { flutterSlugs } from './platform-lists';

const INSTALL = 'npx befui add button';

/**
 * The hero is a working screen from the library, not a picture of one: the leave request block, with its real
 * date range picker, comboboxes and validation. The headline sits beside it, left-aligned, in a display face
 * (Bricolage Grotesque) so the site's voice is not the same Inter every component library uses.
 */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <style>{`
        .hero-display { font-family: 'Bricolage Grotesque', 'Avenir Next', ui-sans-serif, system-ui, sans-serif; font-optical-sizing: auto; }
        .hero-stroke path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hero-draw 0.9s 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes hero-draw { to { stroke-dashoffset: 0 } }
        @media (prefers-reduced-motion: reduce) { .hero-stroke path { animation: none; stroke-dashoffset: 0 } }
      `}</style>
      <div className="mx-auto grid max-w-[88rem] gap-12 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_32rem] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <h1 className="hero-display text-balance text-5xl font-bold leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
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
          <Reveal delay={200}>
            <p className="hero-display mt-7 max-w-md text-pretty text-lg text-muted-foreground">
              Copy-paste React components with real motion, built on Radix and Tailwind. The CLI drops each one into your project as a single file, and from then on it is yours.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg"><Link to="/docs">Get started <ArrowRightIcon draw /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/components">Browse components</Link></Button>
            </div>
            <div className="mt-5 flex w-fit items-center gap-2 rounded-md border bg-background py-1 pl-3.5 pr-1">
              <code className="font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> {INSTALL}</code>
              <CopyButton value={INSTALL} className="size-7" />
            </div>
            <p className="mt-8 max-w-md text-[13px] leading-relaxed text-muted-foreground tabular-nums">
              {components.length} components and {blocks.length} full-page blocks, {flutterSlugs.length} of them also as Flutter widgets.
            </p>
          </Reveal>
        </div>
        <Reveal delay={350} y={24}>
          <figure className="min-w-0">
            <LeaveRequestForm />
            <figcaption className="mx-auto mt-4 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
              Live, not a screenshot. This is the <Link to="/blocks" className="font-medium text-foreground underline underline-offset-4">leave request block</Link>: pick dates, choose an approver, press submit. Every field is a component from the library.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function Stats() {
  const cats = new Set(components.map((c) => c.category)).size;
  const stats = [
    { v: components.length, l: 'Components' },
    { v: blocks.length, l: 'Full-page blocks' },
    { v: cats, l: 'Categories' },
    { v: 1, l: 'File per component' },
  ];
  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:auto_640px] border-y bg-muted/40">
      <div className="mx-auto grid max-w-[88rem] grid-cols-2 gap-8 px-4 py-12 text-center sm:px-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l}>
            <NumberTicker value={s.v} className="text-4xl font-semibold tracking-tight sm:text-5xl" />
            <p className="mt-1 text-[13px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Everything() {
  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:auto_640px] py-16">
      <Reveal className="mx-auto mb-8 max-w-[88rem] px-4 sm:px-6">
        <h2 className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">Everything you need, one file at a time</h2>
      </Reveal>
      <Marquee speed={60} className="py-1">
        {components.map((c) => (
          <Link key={c.slug} to={`/components/${c.slug}`} className="rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
            {c.name}
          </Link>
        ))}
      </Marquee>
    </section>
  );
}

function Playground() {
  const [on, setOn] = React.useState(true);
  const [v, setV] = React.useState(65);
  const [r, setR] = React.useState(4);
  const [chips, setChips] = React.useState(['Remote']);
  const tog = (c: string) => setChips((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]));
  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:auto_640px] mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
      <Reveal className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Try them right here</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Every control below is a real component from the library. Hover, drag, click.</p>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-2"><SpotlightCard className="h-full">
          <p className="text-sm font-semibold">Progress ring</p>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={v} />
            <p className="text-xs text-muted-foreground">Drag the slider and watch it ease.</p>
          </div>
          <Slider className="mt-4" value={v} onValueChange={setV} />
        </SpotlightCard></Reveal>
        <Reveal delay={100} className="md:col-span-2"><SpotlightCard className="h-full">
          <p className="text-sm font-semibold">Rating and switch</p>
          <div className="mt-5 grid gap-5">
            <Rating value={r} onValueChange={setR} />
            <label className="flex items-center justify-between text-sm">Email me weekly <Switch checked={on} onCheckedChange={setOn} /></label>
          </div>
        </SpotlightCard></Reveal>
        <Reveal delay={200} className="md:col-span-2"><SpotlightCard className="h-full">
          <p className="text-sm font-semibold">Filter chips</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Remote', 'Full-time', 'Design', 'Engineering', 'Contract'].map((c) => <Chip key={c} selected={chips.includes(c)} onClick={() => tog(c)}>{c}</Chip>)}
          </div>
        </SpotlightCard></Reveal>
        <Reveal className="md:col-span-3"><TiltCard className="h-full bg-primary text-primary-foreground">
          <SparkleIcon draw className="size-5" />
          <p className="mt-6 text-xl font-semibold">Tilt me</p>
          <p className="mt-1 max-w-xs text-sm text-primary-foreground/80">3D tilt with a moving sheen. Zero dependencies, pointer events only.</p>
        </TiltCard></Reveal>
        <Reveal delay={100} className="md:col-span-3">
          <BorderBeam className="h-full">
            <div className="grid h-full content-between gap-6 p-6">
              <div>
                <p className="text-sm font-semibold">Border beam</p>
                <p className="mt-1 text-sm text-muted-foreground">For pricing cards and anything that should get noticed.</p>
              </div>
              <Button asChild shape="pill" variant="shine" className="w-fit"><Link to="/components/border-beam">See it <ArrowRightIcon draw /></Link></Button>
            </div>
          </BorderBeam>
        </Reveal>
      </div>
    </section>
  );
}

function Why() {
  const features = [
    { icon: PackageIcon, title: 'You own the code', body: 'Each component is one file. Copy it, edit it. No package to upgrade or fight.' },
    { icon: PaletteIcon, title: 'One variable rebrands it', body: 'Change --primary once and everything follows, in light and dark.' },
    { icon: LayersIcon, title: 'Radix underneath', body: 'Dialogs, menus, selects and tabs get focus handling and keyboard support.' },
    { icon: BlocksIcon, title: 'Real screens included', body: 'Directory, approvals, pipeline, campaign report. Drop in and wire up.' },
  ];
  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:auto_640px] border-y bg-muted/40">
      <div className="mx-auto grid max-w-[88rem] gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 80} className="grid content-start gap-2">
            <span className="grid size-9 place-items-center rounded-lg border bg-background text-primary"><f.icon className="size-4" /></span>
            <h3 className="mt-1 text-sm font-semibold">{f.title}</h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:auto_640px] mx-auto max-w-2xl px-4 pb-16 sm:px-6">
      <Reveal>
        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">Questions</h2>
        <Accordion
          defaultOpen={['own']}
          items={[
            { id: 'own', title: 'Is this an npm package?', content: 'No. You copy the file you need into your project, or let the CLI do it: npx befui add button. Nothing to version-lock.' },
            { id: 'deps', title: 'What does it depend on?', content: 'React, Tailwind 4, Radix primitives for behaviour, and our own icon set. The animated pieces use plain CSS and pointer events.' },
            { id: 'theme', title: 'How do I match my brand?', content: 'Change --primary, --ring and the two accent variables in your CSS. Light and dark both follow.' },
            { id: 'motion', title: 'Does it respect reduced motion?', content: 'Yes. Animations switch off for people who ask their system for less motion.' },
          ]}
        />
      </Reveal>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Everything />
      <Playground />
      <Why />
      <section className="[content-visibility:auto] [contain-intrinsic-size:auto_640px] mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
        <Reveal className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Blocks</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Whole screens built from the components.</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/blocks">All blocks <ArrowRightIcon draw /></Link></Button>
        </Reveal>
        <BlockGrid items={blocks.slice(0, 3)} />
      </section>
      <Faq />
      <section className="[content-visibility:auto] [contain-intrinsic-size:auto_640px] mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <Reveal>
          <BorderBeam>
            <div className="grid justify-items-center gap-4 px-6 py-12 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Ship your next screen today</h2>
              <p className="max-w-md text-muted-foreground">Pick a component, copy the file, done. No account, no lock-in.</p>
              <Button asChild size="lg" shape="pill"><Link to="/docs">Get started <ArrowRightIcon draw /></Link></Button>
            </div>
          </BorderBeam>
        </Reveal>
      </section>
    </>
  );
}
