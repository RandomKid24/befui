import * as React from 'react';
import { ArrowRightIcon, BlocksIcon, LayersIcon, PackageIcon, PaletteIcon, SparkleIcon } from '@/components/ui/icons';
import { Accordion } from '@/components/ui/accordion';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { CopyButton } from '@/components/ui/copy-button';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Rating } from '@/components/ui/rating';
import { Reveal, TextReveal } from '@/components/ui/reveal';
import { Slider } from '@/components/ui/slider';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Switch } from '@/components/ui/switch';
import { TiltCard } from '@/components/ui/tilt-card';
import { blocks, components } from '@/registry';
import { BlockGrid, HeroCollage } from './home-parts';
import { Link } from './router';
import { flutterSlugs } from './platform-lists';

const INSTALL = 'npx befui add button';

const HeroActive = React.createContext(true);

/** Cycles a value on a timer (only used by the hero backdrop, so every floating piece is alive). */
function useCycle<T>(values: T[], every: number, offset = 0) {
  const [i, setI] = React.useState(0);
  const active = React.useContext(HeroActive);
  React.useEffect(() => {
    if (!active || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => {
      const id = setInterval(() => setI((n) => (n + 1) % values.length), every);
      cleanup = () => clearInterval(id);
    }, offset);
    let cleanup = () => {};
    return () => { clearTimeout(t); cleanup(); };
  }, [every, offset, values.length, active]);
  return values[i]!;
}

function LiveSwitch({ offset }: { offset: number }) {
  const on = useCycle([false, true, true, false], 1700, offset);
  return <div className="flex items-center gap-2.5"><Switch checked={on} aria-label="Demo switch" tabIndex={-1} /><span className="text-xs font-medium">Auto-approve</span></div>;
}
function LiveProgress({ offset }: { offset: number }) {
  const v = useCycle([12, 38, 64, 88, 100, 64, 30], 1100, offset);
  return <div className="w-40 grid gap-1.5"><div className="flex justify-between text-xs"><span className="font-medium">Payroll run</span><span className="tabular-nums text-muted-foreground">{v}%</span></div><Progress value={v} tone={v === 100 ? 'success' : undefined} /></div>;
}
function LiveRating({ offset }: { offset: number }) {
  const v = useCycle([3, 4, 5, 4, 2, 5], 1200, offset);
  return <Rating value={v} />;
}
function LiveStat({ offset }: { offset: number }) {
  const v = useCycle([142, 145, 151, 149, 158], 1500, offset);
  return <div className="grid gap-0.5"><span className="text-[11px] text-muted-foreground">Headcount</span><span className="text-2xl font-semibold tabular-nums tracking-tight">{v}</span></div>;
}
function LiveChips({ offset }: { offset: number }) {
  const v = useCycle([0, 1, 2], 1400, offset);
  return <div className="flex gap-1.5">{['Design', 'Sales', 'People'].map((l, i) => <span key={l} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-300 ${i === v ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground'}`}>{l}</span>)}</div>;
}
function LiveAvatars() {
  return <div className="flex items-center -space-x-2">{['Aarav Mehta', 'Diya Rao', 'Kabir Shah', 'Isha Nair'].map((n) => <Avatar key={n} name={n} size="sm" className="ring-2 ring-card" />)}<span className="grid size-8 place-items-center rounded-full bg-secondary text-[11px] font-medium ring-2 ring-card">+8</span></div>;
}

// where each floating piece sits (percent of the hero), how far it is (depth 1 near .. 0 far) and its drift timing
const PIECES: { at: string; depth: number; rot: number; delay: number; node: (o: number) => React.ReactNode; hide?: boolean }[] = [
  { at: 'left-[3%] top-[14%]', depth: 0.9, rot: -5, delay: 0, node: (o) => <LiveProgress offset={o} /> },
  { at: 'left-[12%] top-[56%]', depth: 0.5, rot: 4, delay: 1.2, node: (o) => <LiveChips offset={o} /> },
  { at: 'left-[2%] top-[78%]', depth: 0.3, rot: -3, delay: 2.1, hide: true, node: () => <LiveAvatars /> },
  { at: 'right-[4%] top-[12%]', depth: 0.8, rot: 5, delay: 0.6, node: (o) => <LiveSwitch offset={o} /> },
  { at: 'right-[10%] top-[44%]', depth: 0.55, rot: -4, delay: 1.7, node: (o) => <LiveStat offset={o} /> },
  { at: 'right-[3%] top-[72%]', depth: 0.35, rot: 3, delay: 2.6, hide: true, node: (o) => <LiveRating offset={o} /> },
];

/**
 * Hero background: real befui components floating in a perspective grid, each one running its own tiny animation
 * (a switch flipping, a progress bar filling, a headcount ticking). The layers shift with the cursor by depth.
 * The grid below them rolls forward like a floor. Static for reduced motion.
 */
let PIECES_ON: typeof PIECES = PIECES; // the pieces currently on screen, read by the pointer loop

function HeroBackdrop({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const root = React.useRef<HTMLDivElement>(null);
  const layers = React.useRef<(HTMLDivElement | null)[]>([]);
  const [wide, setWide] = React.useState(false); // the floating pieces only exist on wide screens, so small ones never render them
  const [xl, setXl] = React.useState(false);
  const [onScreen, setOnScreen] = React.useState(true);
  React.useEffect(() => {
    const a = matchMedia('(min-width: 1024px)');
    const b = matchMedia('(min-width: 1280px)');
    const sync = () => { setWide(a.matches); setXl(b.matches); };
    sync();
    a.addEventListener('change', sync);
    b.addEventListener('change', sync);
    return () => { a.removeEventListener('change', sync); b.removeEventListener('change', sync); };
  }, []);
  // nothing runs while the hero is scrolled out of view
  React.useEffect(() => {
    const host = target.current;
    if (!host) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting));
    io.observe(host);
    return () => io.disconnect();
  }, [target]);
  React.useEffect(() => {
    const host = target.current;
    const el = root.current;
    if (!host || !el || !wide || !onScreen || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      // one transform write per piece, no style recalculation of the subtree
      layers.current.forEach((l, i) => {
        const d = PIECES_ON[i]?.depth ?? 0;
        if (l) l.style.transform = `translate3d(${(x * d * -34).toFixed(1)}px, ${(y * d * -22).toFixed(1)}px, 0)`;
      });
      // stop the loop once it has settled; the next pointer move starts it again
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    };
    const leave = () => { tx = 0; ty = 0; kick(); };
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); };
  }, [target, wide, onScreen]);
  const pieces = PIECES.filter((p) => wide && (xl || !p.hide));
  PIECES_ON = pieces;
  return (
    <HeroActive.Provider value={onScreen}>
      <div ref={root} aria-hidden data-paused={!onScreen} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <style>{`
          @keyframes hero-floor { to { transform: translate3d(0, 48px, 0) } }
          @keyframes hero-bob { 0%,100% { translate: 0 0 } 50% { translate: 0 -12px } }
          [data-paused="true"] .hero-anim { animation-play-state: paused !important }
          @media (prefers-reduced-motion: reduce) { .hero-anim { animation: none !important } }
        `}</style>
        {/* rolling perspective floor: the grid slides with a transform (compositor only), nothing repaints */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden [mask-image:linear-gradient(to_top,#000_10%,transparent_90%)]">
          <div className="absolute inset-0 origin-bottom [perspective:520px]">
            <div className="absolute -inset-x-[40%] bottom-0 h-[200%] origin-bottom [transform:rotateX(62deg)]">
              <div className="hero-anim absolute -top-12 bottom-0 inset-x-0 [animation:hero-floor_2.4s_linear_infinite] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px]" />
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-[34%] h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_14%,transparent),transparent)]" />
        {pieces.map((p, i) => (
          <div
            key={i}
            ref={(n) => { layers.current[i] = n; }}
            className={`absolute ${p.at} [will-change:transform]`}
          >
            <div
              className="hero-anim rounded-xl border bg-card px-3.5 py-3 shadow-lg shadow-black/5 [animation:hero-bob_6s_ease-in-out_infinite]"
              style={{ rotate: `${p.rot}deg`, scale: `${0.82 + p.depth * 0.3}`, opacity: 0.5 + p.depth * 0.45, animationDelay: `${p.delay}s` }}
            >
              {p.node(p.delay * 500)}
            </div>
          </div>
        ))}
      </div>
    </HeroActive.Provider>
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
