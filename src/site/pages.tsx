import * as React from 'react';
import { Github } from 'lucide-react';
import { ArrowRightIcon, CheckIcon, EyeIcon, LightbulbIcon, SearchIcon, SparkleIcon, TargetIcon, XCircleIcon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { ChipGroup } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Reveal } from '@/components/ui/reveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { BarChart, Sparkline } from '@/components/ui/charts';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Users, IndianRupee } from 'lucide-react';
import { blocks, categories, NEW_SLUGS, components, globalCss, useSource, utilsSource, type ChartGuide } from '@/registry';
import { cn } from '@/lib/utils';
import { Command, CodeBlock } from './code';
import { Link } from './router';
import { Preview } from './preview';
import { Playground, hasPlayground } from './playground';
import { Gallery, hasGallery } from './gallery';
import { PlatformTabs } from './platform';
import { BlockGrid } from './home-parts';

const h1 = 'text-3xl font-semibold tracking-tight sm:text-4xl';
const h2 = 'mt-12 mb-4 scroll-mt-20 text-xl font-semibold tracking-tight';

/* ------------------------------------------------------------------ home */


/* ----------------------------------------------------------- getting started */

const ACCENTS = [
  { name: 'Blue', value: '#2563eb', ring: '#3b82f6', tint: '#eff6ff', fg: '#1d4ed8' },
  { name: 'Violet', value: '#7c3aed', ring: '#8b5cf6', tint: '#f5f3ff', fg: '#6d28d9' },
  { name: 'Emerald', value: '#059669', ring: '#10b981', tint: '#ecfdf5', fg: '#047857' },
  { name: 'Rose', value: '#e11d48', ring: '#f43f5e', tint: '#fff1f2', fg: '#be123c' },
  { name: 'Slate', value: '#0f172a', ring: '#475569', tint: '#f1f5f9', fg: '#0f172a' },
];

function AccentPicker() {
  const [active, setActive] = React.useState('Blue');
  const apply = (a: (typeof ACCENTS)[number]) => {
    setActive(a.name);
    const s = document.documentElement.style;
    if (a.name === 'Blue') ['--primary', '--ring', '--accent', '--accent-foreground'].forEach((k) => s.removeProperty(k));
    else {
      s.setProperty('--primary', a.value);
      s.setProperty('--ring', a.ring);
      s.setProperty('--accent', a.tint);
      s.setProperty('--accent-foreground', a.fg);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ACCENTS.map((a) => (
        <button
          key={a.name}
          onClick={() => apply(a)}
          aria-label={a.name}
          aria-pressed={active === a.name}
          className={cn('grid size-8 place-items-center rounded-full border-2 border-transparent outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:border-foreground/70')}
          style={{ background: a.value }}
        >
          {active === a.name && <CheckIcon className="size-3.5 text-white" strokeWidth={3} />}
        </button>
      ))}
      <span className="ml-1 text-xs text-muted-foreground">Accent applies to this tab only.</span>
    </div>
  );
}

export function GettingStarted() {
  const step = (n: number, title: string) => (
    <h2 className={h2}>
      <span className="mr-2.5 inline-grid size-6 place-items-center rounded-full bg-secondary align-middle text-xs font-semibold text-muted-foreground">{n}</span>
      {title}
    </h2>
  );
  return (
    <article className="max-w-3xl">
      <Breadcrumb className="mb-4" items={[{ label: 'Docs', href: '#/docs' }, { label: 'Getting started' }]} />
      <h1 className={h1}>Getting started</h1>
      <p className="mt-3 text-muted-foreground">
        befui is not an npm package. You copy the files you need into your own project, so there is nothing to version-lock. Setup takes five minutes the first time.
      </p>

      {step(1, 'Install Tailwind 4')}
      <p className="mb-3 text-[13px] text-muted-foreground">With Vite. Other bundlers work too, see the Tailwind docs.</p>
      <Command>npm i tailwindcss @tailwindcss/vite</Command>

      {step(2, 'Install the shared helpers')}
      <Command>npm i clsx tailwind-merge class-variance-authority lucide-react</Command>

      {step(3, 'Add the cn helper')}
      <p className="mb-3 text-[13px] text-muted-foreground">Merges class names and lets your overrides win over defaults.</p>
      <CodeBlock code={utilsSource} title="src/lib/utils.ts" />

      {step(4, 'Add the theme')}
      <p className="mb-3 text-[13px] text-muted-foreground">
        Paste this into your global CSS. Colors live in variables, so a theme is a handful of lines. Dark mode switches when the <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">dark</code> class is on <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">&lt;html&gt;</code>.
      </p>
      <CodeBlock code={globalCss} title="src/index.css" maxHeight={320} />

      {step(5, 'Set up the @ alias')}
      <p className="mb-3 text-[13px] text-muted-foreground">Components import each other and the helper through <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">@/</code>.</p>
      <CodeBlock title="vite.config.ts" code={`import path from 'path';\nimport tailwindcss from '@tailwindcss/vite';\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },\n});`} />

      {step(6, 'Copy a component')}
      <p className="text-[13px] text-muted-foreground">
        Open any <Link to="/components" className="font-medium text-primary hover:underline">component page</Link>, install the packages it lists, and paste the file into <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">src/components/ui</code>.
      </p>

      <h2 className={h2}>Theming</h2>
      <p className="mb-4 text-[13px] text-muted-foreground">
        Every color is a variable. To rebrand, change <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">--primary</code>, <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">--ring</code> and the two accent values. Try it:
      </p>
      <Preview title="Theme preview" code={`:root {\n  --primary: #7c3aed;\n  --ring: #8b5cf6;\n  --accent: #f5f3ff;\n  --accent-foreground: #6d28d9;\n}`}>
        <div className="grid w-full max-w-md gap-5">
          <AccentPicker />
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button><Button variant="outline">Outline</Button><Badge variant="primary">Badge</Badge>
          </div>
          <Progress value={66} />
        </div>
      </Preview>

      <Alert variant="info" title="Why not an npm package?" className="mt-12">
        Dashboards need small changes everywhere: a denser row, a different empty state. Owning the file beats wrapping a library with overrides.
      </Alert>
    </article>
  );
}

/* ------------------------------------------------------------ components */

const ComponentCard = React.memo(function ComponentCard({ c }: { c: (typeof components)[number]; i?: number }) {
  // no per-card observer or entrance animation: 199 of them made this page slow, and the browser skips drawing cards that are off screen
  return (
    <Link to={`/components/${c.slug}`} className="group block h-full rounded-xl outline-none [contain-intrinsic-size:auto_96px] [content-visibility:auto] focus-visible:ring-2 focus-visible:ring-ring/50">
      <SpotlightCard className="h-full p-4 hover:translate-y-0">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold">{c.name}{c.isNew && <Badge variant="primary">New</Badge>}</p>
          <ArrowRightIcon className="size-4 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{c.description}</p>
      </SpotlightCard>
    </Link>
  );
});

export function ComponentsIndex() {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState<string[]>([]);
  const term = React.useDeferredValue(q.trim().toLowerCase()); // typing stays instant, the grid catches up a beat later
  const match = (c: (typeof components)[number]) =>
    (!cat.length || cat.includes(c.category)) &&
    (!term || `${c.name} ${c.description} ${c.keywords.join(' ')}`.toLowerCase().includes(term));
  const shown = components.filter(match);
  const [allNew, setAllNew] = React.useState(false);
  const order = [...NEW_SLUGS];
  const fresh = shown.filter((c) => c.isNew).sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  const filtering = !!term || cat.length > 0;
  const freshShown = allNew || filtering ? fresh : fresh.slice(0, 6); // the full list is already under its categories
  return (
    <div>
      <h1 className={h1}>Components <Badge variant="outline" className="ml-2 align-middle">{shown.length}</Badge></h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Each is a single file with a live example.</p>
      <div className="sticky top-14 z-10 -mx-1 mt-6 grid gap-3 bg-background/85 px-1 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <Input leftIcon={<SearchIcon />} placeholder="Filter by name or keyword" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <ChipGroup options={categories} value={cat} onValueChange={setCat} />
      </div>
      {shown.length === 0 && (
        <EmptyState className="mt-10" icon={<SearchIcon />} title="Nothing matches" description="Try a different word, or clear the category filters." action={<Button variant="outline" size="sm" onClick={() => { setQ(''); setCat([]); }}>Clear filters</Button>} />
      )}
      {fresh.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            Newly added <Badge variant="primary">{fresh.length}</Badge>
            {!filtering && fresh.length > 6 && (
              <button type="button" onClick={() => setAllNew((v) => !v)} className="ms-auto rounded text-xs font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50">
                {allNew ? 'Show fewer' : `Show all ${fresh.length}`}
              </button>
            )}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {freshShown.map((c) => <ComponentCard key={c.slug} c={c} />)}
          </div>
        </section>
      )}
      {categories.filter((k) => shown.some((c) => c.category === k)).map((k) => (
        <section key={k} className="mt-10">
          <h2 className="mb-3 flex items-center gap-2 border-b pb-2 text-sm font-semibold">{k} <span className="text-xs font-normal text-muted-foreground">{shown.filter((c) => c.category === k).length}</span></h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shown.filter((c) => c.category === k).map((c, i) => <ComponentCard key={c.slug} c={c} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

const demoFallback = <div className="h-24 w-full animate-pulse rounded-lg bg-muted/60" aria-label="Loading example" />;

/** Preview whose code text loads on demand. */
function LazyPreview({ load, ...rest }: Omit<React.ComponentProps<typeof Preview>, 'code'> & { load: () => Promise<string> }) {
  return <Preview {...rest} code={useSource(load)} />;
}
function LazyCode({ load, title, maxHeight }: { load: () => Promise<string>; title: string; maxHeight?: number }) {
  return <CodeBlock code={useSource(load)} title={title} maxHeight={maxHeight} />;
}

function PrevNext<T extends { slug: string; name: string }>({ list, slug, base }: { list: T[]; slug: string; base: string }) {
  const i = list.findIndex((x) => x.slug === slug);
  const prev = list[i - 1];
  const next = list[i + 1];
  return (
    <div className="mt-16 flex items-center justify-between gap-3 border-t pt-6">
      {prev ? <Button asChild variant="outline"><Link to={`${base}/${prev.slug}`}>← {prev.name}</Link></Button> : <span />}
      {next ? <Button asChild variant="outline"><Link to={`${base}/${next.slug}`}>{next.name} →</Link></Button> : <span />}
    </div>
  );
}

/** Copies a ready-to-paste prompt (install command, usage example and full source) for an AI coding tool. */
function CopyForAI({ c }: { c: (typeof components)[number] }) {
  const [state, setState] = React.useState<'idle' | 'busy' | 'done'>('idle');
  React.useEffect(() => setState('idle'), [c.slug]);
  const copy = async () => {
    setState('busy');
    const [src, demo] = await Promise.all([c.loadSource(), c.loadDemoSource()]);
    const text = `Use the befui "${c.name}" component (${c.description})\n\nInstall: npx github:RandomKid24/befui add ${c.slug}\nIt lives at src/${c.path}; import it from '@/components/ui/${c.slug}'.\n\nExample:\n\`\`\`tsx\n${demo}\`\`\`\n\nSource:\n\`\`\`tsx\n${src}\`\`\`\n`;
    try { await navigator.clipboard.writeText(text); setState('done'); setTimeout(() => setState('idle'), 2000); } catch { setState('idle'); }
  };
  return (
    <Button variant="outline" size="sm" onClick={copy} loading={state === 'busy'} className="h-10">
      {state === 'done' ? <CheckIcon /> : <SparkleIcon />} {state === 'done' ? 'Copied for AI' : 'Copy for AI'}
    </Button>
  );
}

/** Plain-language help under a chart: what it shows, how to read it, when to use it and when not to. */
function GuidePanel({ guide }: { guide: ChartGuide }) {
  const rows = [
    { icon: <LightbulbIcon />, title: 'What it shows', text: guide.what, tone: 'text-primary bg-primary/10' },
    { icon: <EyeIcon />, title: 'How to read it', text: guide.read, tone: 'text-info bg-info/10' },
    { icon: <TargetIcon />, title: 'Use it for', text: guide.use, tone: 'text-success bg-success/10' },
    { icon: <XCircleIcon />, title: 'Skip it when', text: guide.avoid, tone: 'text-warning bg-warning/10' },
  ];
  return (
    <section aria-label="How to read this chart" className="mt-8">
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">New to this chart? Start here</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.title} className="flex gap-3 rounded-xl border bg-card p-4">
            <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4', r.tone)}>{r.icon}</span>
            <div className="grid content-start gap-1">
              <h3 className="text-[13px] font-semibold">{r.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ComponentPage({ slug }: { slug: string }) {
  const c = components.find((x) => x.slug === slug);
  if (!c) return <NotFound />;
  const packages = ['clsx', 'tailwind-merge', 'class-variance-authority', ...c.deps];
  const needs = c.requires.map((r) => (r === 'icons' ? { slug: 'icons', name: 'Icons', to: '/icons' } : { slug: r, name: components.find((x) => x.slug === r)!.name, to: `/components/${r}` }));
  return (
    <article className="max-w-4xl">
      <Breadcrumb className="mb-4" items={[{ label: 'Components', href: '#/components' }, { label: c.category }, { label: c.name }]} />
      <h1 className={h1}>{c.name}{c.isNew && <Badge variant="primary" className="ml-3 align-middle">New</Badge>}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{c.description}</p>
      <PlatformTabs slug={slug} active="react"><CopyForAI c={c} /></PlatformTabs>

      <div className="mt-8">
        {hasGallery(slug) ? (
          <div className="grid gap-8">
            {hasPlayground(slug) && <Playground slug={slug} />}
            <Gallery slug={slug} />
          </div>
        ) : (
          <LazyPreview bleed={c.wide} title={`examples/${c.slug}.tsx`} load={c.loadDemoSource} playground={hasPlayground(c.slug) ? <Playground slug={c.slug} /> : undefined}><React.Suspense fallback={demoFallback}><c.Demo /></React.Suspense></LazyPreview>
        )}
      </div>

      {c.guide && <GuidePanel guide={c.guide} />}

      <h2 className={h2}>Install</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">With the CLI. It installs packages and adds any components this one needs:</p>
      <Command>{`npx github:RandomKid24/befui add ${c.slug}`}</Command>
      <p className="mb-3 mt-6 text-[13px] text-muted-foreground">Or by hand. Packages (skip any you already have):</p>
      <Command>{`npm i ${[...new Set(packages)].join(' ')}`}</Command>
      <p className="mb-3 mt-6 text-[13px] text-muted-foreground">
        Copy this file to <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">src/{c.path}</code>
        {needs.length > 0 && (
          <>
            , along with {needs.map((n, i) => (
              <React.Fragment key={n.slug}>{i > 0 && ', '}<Link to={n.to} className="font-medium text-primary hover:underline">{n.name}</Link></React.Fragment>
            ))}
          </>
        )}
        .
      </p>
      <h2 className={h2}>Source</h2>
      <LazyCode load={c.loadSource} title={c.path} maxHeight={420} />

      <PrevNext list={components} slug={slug} base="/components" />
    </article>
  );
}

/* ---------------------------------------------------------------- blocks */

export function BlocksIndex() {
  return (
    <div>
      <h1 className={h1}>Blocks</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Full screens for HR and marketing tools. They use mock data, so swap in your own API calls.</p>
      <div className="mt-8"><BlockGrid items={blocks} /></div>
    </div>
  );
}

export function BlockPage({ slug }: { slug: string }) {
  const b = blocks.find((x) => x.slug === slug);
  if (!b) return <NotFound />;
  return (
    <article>
      <Breadcrumb className="mb-4" items={[{ label: 'Blocks', href: '#/blocks' }, { label: b.module }, { label: b.name }]} />
      <h1 className={h1}>{b.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{b.description}</p>
      <div className="mt-8"><LazyPreview bleed title={b.path} load={b.loadSource}><React.Suspense fallback={demoFallback}><b.Demo /></React.Suspense></LazyPreview></div>

      <h2 className={h2}>Uses</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">Copy these components first, then paste the block.</p>
      <div className="flex flex-wrap gap-2">
        {b.uses.map((u) => {
          const c = components.find((x) => x.slug === u);
          return c ? (
            <Link key={u} to={`/components/${u}`}><Badge variant="outline" className="px-2.5 py-1 text-xs transition-colors hover:bg-secondary">{c.name}</Badge></Link>
          ) : null;
        })}
      </div>
      <PrevNext list={blocks} slug={slug} base="/blocks" />
    </article>
  );
}

export function NotFound() {
  return (
    <div className="mx-auto max-w-md py-24">
      <EmptyState icon={<SearchIcon />} title="404, that page does not exist" description="It may have moved. Try the component list." action={<Button asChild variant="outline"><Link to="/components">See all components</Link></Button>} />
    </div>
  );
}
