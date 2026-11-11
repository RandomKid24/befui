import * as React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import { CopyButton } from '@/components/ui/copy-button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blocks, components } from '@/registry';
import { examples as flutterExamples } from './flutter-docs';
import { demos as htmlDemos } from './html-docs';
import { Link } from './router';
import { flutterSlugs, hasFlutter, hasHtml } from './platform-lists';
import { Dim, SheetHead } from './sheet';

const h2 = 'font-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-4xl';
const lede = 'font-display mt-3 max-w-xl text-pretty text-lg text-muted-foreground';
const wrap = 'mx-auto max-w-[88rem] px-4 sm:px-6';

const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** Text of an async source, with a status so the panel can say what happened. */
function useText(load: (() => Promise<string>) | undefined, key: string) {
  const [state, setState] = React.useState<{ key: string; text: string; failed: boolean }>({ key: '', text: '', failed: false });
  React.useEffect(() => {
    let live = true;
    if (!load) return;
    load().then((text) => live && setState({ key, text, failed: false })).catch(() => live && setState({ key, text: '', failed: true }));
    return () => { live = false; };
  }, [load, key]);
  const ready = state.key === key;
  return { text: ready ? state.text : '', loading: !!load && !ready, failed: ready && state.failed };
}

// ---- Open the file ---------------------------------------------------------------------------------------------

const PICKS = ['button', 'input', 'combobox', 'date-picker', 'data-table', 'dialog', 'tabs', 'area-chart'];
type View = 'file' | 'react' | 'html' | 'flutter';

/**
 * The claim "one file, and it is yours" shown as the thing itself: the source the CLI copies, what else it pulls in,
 * and the same component as React usage, an HTML tag and a Flutter widget.
 */
export function OpenTheFile() {
  const picks = PICKS.map((s) => components.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => !!c);
  const [slug, setSlug] = React.useState(picks[0]!.slug);
  const [view, setView] = React.useState<View>('file');
  const entry = picks.find((p) => p.slug === slug)!;
  const snake = slug.replace(/-/g, '_');
  const html = hasHtml(slug) ? htmlDemos[`/src/html/demos/${slug}.html`] : undefined;
  const flutter = hasFlutter(slug) ? flutterExamples[`/flutter/lib/examples/${snake}.dart`] : undefined;
  const available: Record<View, boolean> = { file: true, react: true, html: !!html, flutter: !!flutter };
  const current = available[view] ? view : 'file';

  const loader = { file: entry.loadSource, react: entry.loadDemoSource, html, flutter }[current];
  const { text, loading, failed } = useText(loader, `${slug}:${current}`);
  const fileText = useText(entry.loadSource, `${slug}:file`);
  const lines = fileText.text ? fileText.text.replace(/\n$/, '').split('\n').length : 0;
  const title = { file: `src/components/ui/${slug}.tsx`, react: `usage in your app`, html: `${slug}.html`, flutter: `${snake}.dart` }[current];

  return (
    <section className={`${wrap} border-t py-20`} aria-labelledby="open-file">
      <SheetHead n={4} tag={`ui/${slug}.tsx`} />
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div>
          <h2 id="open-file" className={h2}>Open the file you would own</h2>
          <p className={lede}>
            Add a component with the CLI and it lands in your project as plain source. Below is that file for real, what else it pulls in, and the same
            component as React, an HTML tag and a Flutter widget.
          </p>
          <ul className="mt-8 border-t">
            {picks.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  aria-current={p.slug === slug}
                  onClick={() => setSlug(p.slug)}
                  className="relative flex w-full items-baseline justify-between gap-4 border-b py-2.5 text-start text-sm text-muted-foreground outline-none transition-[color,padding] duration-(--dur-fast) before:absolute before:start-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:bg-primary before:opacity-0 before:transition-opacity hover:text-foreground focus-visible:bg-muted aria-[current=true]:ps-3 aria-[current=true]:font-semibold aria-[current=true]:text-foreground aria-[current=true]:before:opacity-100"
                >
                  <span>{p.name}</span>
                  <span className="font-mono text-xs font-normal text-muted-foreground">{p.slug}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <Tabs value={current} onValueChange={(v) => setView(v as View)}>
            <TabsList aria-label={`${entry.name} in each form`}>
              <TabsTrigger value="file">The file</TabsTrigger>
              <TabsTrigger value="react">React usage</TabsTrigger>
              <TabsTrigger value="html" disabled={!available.html} title={available.html ? undefined : 'No HTML tag for this one yet'}>HTML tag</TabsTrigger>
              <TabsTrigger value="flutter" disabled={!available.flutter} title={available.flutter ? undefined : 'No Flutter widget for this one yet'}>Flutter</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4 min-h-[26rem]" aria-live="polite">
            {failed ? (
              <p className="py-10 text-sm text-muted-foreground">
                This file could not be loaded. <Link to={`/components/${slug}`} className="font-medium text-foreground underline underline-offset-4">Open the {entry.name} page</Link> to read it there.
              </p>
            ) : loading ? (
              <Skeleton className="h-[26rem] w-full" aria-label={`Loading ${title}`} />
            ) : (
              <CodeBlock code={text} title={title} lineNumbers maxHeight={420} />
            )}
          </div>
          <dl className="mt-5 border-t font-mono text-[12px]" aria-label={`What adding ${entry.name} puts in your project`}>
            {([
              ['file', `src/components/ui/${slug}.tsx`],
              ['lines', lines > 0 ? String(lines) : '...'],
              ['also adds', entry.requires.length > 0 ? list(entry.requires) : 'no other library files'],
              ['npm', entry.deps.length > 0 ? list(entry.deps) : 'no extra packages'],
            ] as const).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-b py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="min-w-0 break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex w-fit items-center gap-2 rounded-md border bg-background py-1 pl-3.5 pr-1">
            <code className="font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> npx github:RandomKid24/befui add {slug}</code>
            <CopyButton value={`npx github:RandomKid24/befui add ${slug}`} className="size-7" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Blocks ----------------------------------------------------------------------------------------------------

/** Renders children at a laptop width and scales the frame to fit when the page is wide enough; on a phone it renders at its own width. */
function ScaledFrame({ children, height }: { children: React.ReactNode; height: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const DESIGN = 1200;
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(window.innerWidth >= 1024 ? Math.min(1, el.clientWidth / DESIGN) : 1);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scaled = scale < 1;
  return (
    <>
    <Dim className="mb-2 max-lg:hidden">{DESIGN}px wide, shown at {Math.round(scale * 100)}%</Dim>
    <div ref={ref} className="relative overflow-hidden rounded-lg border bg-background" style={{ height }}>
      <div
        className="origin-top-left overflow-auto [transform:translateZ(0)]"
        style={scaled ? { width: DESIGN, height: height / scale, transform: `scale(${scale})` } : { width: '100%', height }}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
    </>
  );
}

const FEATURED = ['analytics-dashboard', 'sales-dashboard', 'project-overview', 'finance-dashboard', 'ecommerce-dashboard', 'hrms-overview', 'campaign-performance', 'lead-pipeline', 'billing-page', 'checkout-page'];

/** A list of whole screens with the chosen one running live beside it. */
export function BlocksViewer() {
  const featured = FEATURED.map((s) => blocks.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => !!x);
  const [slug, setSlug] = React.useState(featured[0]!.slug);
  // the screen on show stays (dimmed) until the next one has loaded
  const shown = React.useDeferredValue(slug);
  const b = featured.find((x) => x.slug === shown)!;
  return (
    <section className={`${wrap} border-t py-20`} aria-labelledby="blocks">
      <SheetHead n={4} tag="src/blocks/" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="blocks" className={h2}>{blocks.length} whole screens</h2>
          <p className={lede}>Pick one and it runs here, built only from the components above, with mock data you swap for your own API.</p>
        </div>
        <Button asChild variant="ghost" size="sm"><Link to="/blocks">All {blocks.length} blocks <ArrowRightIcon draw /></Link></Button>
      </div>
      <div className="mt-10 grid gap-x-10 gap-y-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <ul className="grid max-lg:grid-flow-col max-lg:overflow-x-auto max-lg:border-b lg:border-t">
          {featured.map((x) => (
            <li key={x.slug} className="max-lg:shrink-0">
              <button
                type="button"
                aria-current={x.slug === slug}
                onClick={() => setSlug(x.slug)}
                className="relative w-full whitespace-nowrap px-1 py-2.5 text-start text-sm text-muted-foreground outline-none transition-[color,padding] duration-(--dur-fast) before:absolute before:start-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:bg-primary before:opacity-0 before:transition-opacity hover:text-foreground focus-visible:bg-muted aria-[current=true]:font-semibold aria-[current=true]:text-foreground aria-[current=true]:before:opacity-100 max-lg:px-3 max-lg:before:hidden lg:border-b lg:whitespace-normal lg:aria-[current=true]:ps-3"
              >
                {x.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">{b.name}.</span> {b.description} <span className="text-muted-foreground">Built from {list(b.uses)}.</span></p>
            <Link to={`/blocks/${b.slug}`} className="text-[13px] font-medium underline underline-offset-4">Open the block</Link>
          </div>
          <div className={shown === slug ? 'transition-opacity duration-200' : 'opacity-50 transition-opacity delay-150 duration-200'} aria-busy={shown !== slug}>
          <ScaledFrame height={640}>
            <React.Suspense fallback={<Skeleton className="h-[36rem] w-full" aria-label={`Loading ${b.name}`} />}>
              <b.Demo key={b.slug} />
            </React.Suspense>
          </ScaledFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Agents ------------------------------------------------------------------------------------------------------

const TOOLS = [
  ['list_components', 'Browse or search every component and block.'],
  ['get_component', 'The exact source, import path, npm packages and a working example.'],
  ['add_components', 'Copy components, and what they need, into the project.'],
  ['get_design_rules', 'How to compose a screen so it looks designed, not assembled.'],
];
const INIT = 'npx github:RandomKid24/befui init';

/** What an AI agent gets: one command, then real tools instead of guessed props. */
export function Agents() {
  return (
    <section className="border-y bg-muted/40" aria-labelledby="agents">
      <div className={`${wrap} pt-20`}><SheetHead n={6} tag="AGENTS.md" /></div>
      <div className={`${wrap} grid gap-x-16 gap-y-10 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-center`}>
        <div className="min-w-0">
          <h2 id="agents" className={h2}>Your coding agent reads the real source</h2>
          <p className={lede}>
            One command writes the befui rules into AGENTS.md and connects an MCP server. After that Claude Code, Cursor and Copilot reuse what exists and add what is missing, instead of retyping a button from memory.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex max-w-full items-center gap-2 rounded-md border bg-card py-1 pl-3.5 pr-1">
              <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> {INIT}</code>
              <CopyButton value={INIT} className="size-8 shrink-0" />
            </div>
            <Link to="/ai" className="text-sm font-medium underline underline-offset-4">How it works with AI</Link>
          </div>
        </div>
        <div>
          <p className="pb-2.5 font-mono text-[11px] text-muted-foreground">befui mcp, {TOOLS.length} tools</p>
          <dl className="border-t">
            {TOOLS.map(([name, what], i) => (
              <div key={name} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 border-b py-3.5 sm:grid-cols-[1.75rem_11rem_minmax(0,1fr)] sm:items-baseline">
                <span aria-hidden className="font-mono text-[11px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <dt className="font-mono text-[13px] font-medium">{name}</dt>
                <dd className="text-sm text-muted-foreground max-sm:col-start-2">{what}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ---- Questions and close ---------------------------------------------------------------------------------------

export function Faq() {
  return (
    <section className={`${wrap} py-20`} aria-labelledby="faq">
      <SheetHead n={6} tag="questions" />
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <h2 id="faq" className={h2}>Questions</h2>
        <Accordion
          defaultOpen={['own']}
          items={[
            { id: 'own', title: 'Is this an npm package?', content: 'No. You copy the file you need into your project, or let the CLI do it: npx github:RandomKid24/befui add button. Nothing to version-lock.' },
            { id: 'deps', title: 'What does it depend on?', content: 'React, Tailwind 4, Radix primitives for behaviour, and our own icon set. The animated pieces use plain CSS and pointer events.' },
            { id: 'theme', title: 'How do I match my brand?', content: 'Paste a palette block into your CSS, as the theme controls on this page show, and set --radius and data-density if you want them. Light and dark both follow.' },
            { id: 'platforms', title: 'Is there more than React?', content: `Every component also has a <bef-*> HTML tag, and ${flutterSlugs.length} of them are Flutter widgets for Android and iOS.` },
            { id: 'rtl', title: 'Does it work right to left, and in other languages?', content: 'Calendar and date pickers take a locale, and components use logical start and end spacing so they flip on right-to-left pages. Every docs preview has an RTL switch.' },
            { id: 'motion', title: 'Does it respect reduced motion?', content: 'Yes. Animations switch off for people who ask their system for less motion.' },
          ]}
        />
      </div>
    </section>
  );
}

/** The page ends the way a drawing does, with a title block: what the library is, counted from the registry. */
export function Close() {
  const block: [string, React.ReactNode][] = [
    ['library', 'befui'],
    ['licence', 'MIT'],
    ['components', components.length],
    ['whole screens', blocks.length],
    ['flutter widgets', flutterSlugs.length],
    ['sheet', '07 of 07'],
  ];
  return (
    <section className="hero-sheet relative overflow-hidden border-t" aria-labelledby="close">
      <div className={`${wrap} relative pb-24 pt-20`}>
        <SheetHead n={7} tag="your project" />
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
          <div className="min-w-0">
            <h2 id="close" className="font-display text-5xl font-bold leading-[0.96] tracking-[-0.035em] sm:text-7xl xl:text-[5.5rem]">Start with one file</h2>
            <p className={lede}>Run the command, open the file it adds, and change whatever you like. Nothing in your project depends on a befui package.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg"><Link to="/docs">Read the setup guide <ArrowRightIcon draw /></Link></Button>
              <div className="flex max-w-full items-center gap-2 rounded-md border bg-background py-1 pl-3.5 pr-1">
                <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> npx github:RandomKid24/befui add button</code>
                <CopyButton value="npx github:RandomKid24/befui add button" className="size-7 shrink-0" />
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-2 border-s border-t border-foreground/70 bg-background font-mono text-[12px]">
            {block.map(([k, v]) => (
              <div key={k} className="border-b border-e border-foreground/70 px-3.5 py-2.5">
                <dt className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 text-[15px] font-medium tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
