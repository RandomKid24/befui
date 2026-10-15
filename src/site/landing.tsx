import * as React from 'react';
import { ArrowRightIcon, BlocksIcon, LayersIcon, PackageIcon, PaletteIcon, SparkleIcon } from '@/components/ui/icons';
import { Accordion } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { CopyButton } from '@/components/ui/copy-button';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Rating } from '@/components/ui/rating';
import { Reveal, TextReveal } from '@/components/ui/reveal';
import { Slider } from '@/components/ui/slider';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Switch } from '@/components/ui/switch';
import { TiltCard } from '@/components/ui/tilt-card';
import { blocks, components } from '@/registry';
import { BlockGrid, HeroCollage } from './pages';
import { Link } from './router';
import { flutterSlugs } from './flutter-docs';

const INSTALL = 'npx befui add button';

/**
 * Hero background: a dot grid that lights up under the cursor (and drifts by itself on touch screens or when the mouse is still),
 * with two slow aurora blobs and a sweeping beam behind it. Pure CSS variables plus one rAF loop; static for reduced motion.
 */
function HeroBackdrop({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const lit = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const host = target.current;
    const el = lit.current;
    if (!host || !el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 50, y = 30, tx = 50, ty = 30, last = 0, raf = 0, auto = true;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      auto = false;
      last = performance.now();
    };
    host.addEventListener('pointermove', move);
    const tick = (t: number) => {
      if (!auto && t - last > 2500) auto = true;
      if (auto) { tx = 50 + Math.sin(t / 2600) * 34; ty = 36 + Math.cos(t / 3400) * 22; }
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); host.removeEventListener('pointermove', move); };
  }, [target]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <style>{`
        @keyframes hero-drift-a { 0%,100% { transform: translate3d(-8%, -6%, 0) scale(1) } 50% { transform: translate3d(10%, 8%, 0) scale(1.18) } }
        @keyframes hero-drift-b { 0%,100% { transform: translate3d(10%, 4%, 0) scale(1.1) } 50% { transform: translate3d(-12%, -8%, 0) scale(0.92) } }
        @keyframes hero-beam { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (prefers-reduced-motion: reduce) { .hero-anim { animation: none !important } }
      `}</style>
      <div className="hero-anim absolute -left-[10%] -top-[30%] h-[70%] w-[55%] rounded-full bg-primary/20 blur-[90px] [animation:hero-drift-a_16s_ease-in-out_infinite]" />
      <div className="hero-anim absolute -right-[8%] top-[5%] h-[60%] w-[48%] rounded-full bg-[color-mix(in_srgb,var(--primary)_55%,#a855f7)]/20 blur-[100px] [animation:hero-drift-b_20s_ease-in-out_infinite]" />
      <div className="hero-anim absolute left-1/2 top-[30%] aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-[0.18] [animation:hero-beam_28s_linear_infinite] [background:conic-gradient(from_0deg,transparent_0deg,var(--primary)_28deg,transparent_62deg)] [mask-image:radial-gradient(circle,transparent_14%,#000_60%,transparent_72%)]" />
      <div className="absolute inset-0 [background-size:22px_22px] [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(75%_65%_at_50%_30%,#000,transparent)]" />
      <div
        ref={lit}
        style={{ '--mx': '50%', '--my': '30%' } as React.CSSProperties}
        className="absolute inset-0 [background-size:22px_22px] [background-image:radial-gradient(var(--primary)_1.4px,transparent_1.6px)] [mask-image:radial-gradient(220px_circle_at_var(--mx)_var(--my),#000,transparent_70%)]"
      />
    </div>
  );
}

function Hero() {
  const host = React.useRef<HTMLElement>(null);
  return (
    <section ref={host} className="relative isolate overflow-hidden">
      <HeroBackdrop target={host} />
      <div className="mx-auto max-w-[88rem] px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <Reveal>
          <Badge variant="outline" className="mb-6 bg-background/60 py-1 pl-1 pr-3 backdrop-blur">
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">New</span>
            {components.length} components, {blocks.length} blocks, {flutterSlugs.length} Flutter widgets
          </Badge>
        </Reveal>
        <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-7xl sm:leading-[1.02]">
          <TextReveal text="Interfaces people" className="inline" />
          <br />
          <span className="text-primary">actually enjoy using</span>
        </h1>
        <Reveal delay={300}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Copy-paste React components with real motion, built on Radix and Tailwind. Plus ready-made HRMS and marketing screens.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" shape="pill"><Link to="/docs">Get started <ArrowRightIcon draw /></Link></Button>
            <Button asChild size="lg" variant="outline" shape="pill"><Link to="/components">Browse components</Link></Button>
          </div>
          <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border bg-background/70 py-1.5 pl-4 pr-1.5 backdrop-blur">
            <code className="font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> {INSTALL}</code>
            <CopyButton value={INSTALL} className="size-7 rounded-full" />
          </div>
        </Reveal>
        <Reveal delay={450} y={32}>
          <HeroCollage />
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
    <section className="border-y bg-muted/40">
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
    <section className="py-16">
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
    <section className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
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
    <section className="border-y bg-muted/40">
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
    <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
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
      <section className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
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
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
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
