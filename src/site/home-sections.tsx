import * as React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import { CopyButton } from '@/components/ui/copy-button';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blocks, components, type Category } from '@/registry';
import { examples as flutterExamples } from './flutter-docs';
import { demos as htmlDemos } from './html-docs';
import { Link } from './router';
import { flutterSlugs, hasFlutter, hasHtml } from './platform-lists';

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
              <p className="py-10 text-sm text-muted-foreground">Loading {title}.</p>
            ) : (
              <CodeBlock code={text} title={title} lineNumbers maxHeight={420} />
            )}
          </div>
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
            {lines > 0 ? <><span className="tabular-nums">{lines}</span> lines. </> : null}
            {entry.requires.length > 0 ? `It also adds ${list(entry.requires)} from the library. ` : 'It needs no other library files. '}
            {entry.deps.length > 0 ? `npm packages: ${list(entry.deps)}.` : 'No extra npm packages.'}
          </p>
          <div className="mt-4 flex w-fit items-center gap-2 rounded-md border bg-background py-1 pl-3.5 pr-1">
            <code className="font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> npx befui add {slug}</code>
            <CopyButton value={`npx befui add ${slug}`} className="size-7" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Every family ----------------------------------------------------------------------------------------------

const FAMILY_ORDER: Category[] = ['Inputs', 'Data', 'Display', 'Navigation', 'AI', 'Feedback', 'Overlays', 'Time', 'Layout'];

/** The library as type: each family with its true counts and the first names in it. */
export function Families() {
  return (
    <section className={`${wrap} border-t py-20`} aria-labelledby="families">
      <h2 id="families" className={h2}>{components.length} components in {FAMILY_ORDER.length} families</h2>
      <p className={lede}>{flutterSlugs.length} of them also exist as Flutter widgets. Counts below are read from the registry, so they cannot drift.</p>
      <div className="mt-12 grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {FAMILY_ORDER.map((cat) => {
          const items = components.filter((c) => c.category === cat);
          const inFlutter = items.filter((c) => hasFlutter(c.slug)).length;
          const shown = items.slice(0, 14);
          return (
            <div key={cat} className="border-t pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-semibold tracking-tight">{cat}</h3>
                <p className="text-xs tabular-nums text-muted-foreground">{items.length} components, {inFlutter} in Flutter</p>
              </div>
              <div className="mt-2 h-0.5 bg-border" aria-hidden><div className="h-full bg-primary" style={{ width: `${(inFlutter / items.length) * 100}%` }} /></div>
              <ul className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] leading-relaxed">
                {shown.map((c, i) => (
                  <li key={c.slug} className={i >= 8 ? 'max-sm:hidden' : undefined}><Link to={`/components/${c.slug}`} className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">{c.name}</Link></li>
                ))}
                {items.length > shown.length && <li><Link to="/components" className="font-medium underline underline-offset-4">and {items.length - shown.length} more</Link></li>}
              </ul>
            </div>
          );
        })}
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
    <div ref={ref} className="relative overflow-hidden rounded-lg border bg-background" style={{ height }}>
      <div
        className="origin-top-left overflow-auto [transform:translateZ(0)]"
        style={scaled ? { width: DESIGN, height: height / scale, transform: `scale(${scale})` } : { width: '100%', height }}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const FEATURED = ['billing-page', 'checkout-page', 'user-management', 'profile-page', 'api-keys-page', 'inbox', 'project-overview', 'analytics-dashboard', 'ecommerce-dashboard', 'invoice-page'];

/** A list of whole screens with the chosen one running live beside it. */
export function BlocksViewer() {
  const featured = FEATURED.map((s) => blocks.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => !!x);
  const [slug, setSlug] = React.useState(featured[0]!.slug);
  const b = featured.find((x) => x.slug === slug)!;
  return (
    <section className={`${wrap} border-t py-20`} aria-labelledby="blocks">
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
          <ScaledFrame height={520}>
            <React.Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading {b.name}.</p>}>
              <b.Demo key={b.slug} />
            </React.Suspense>
          </ScaledFrame>
        </div>
      </div>
    </section>
  );
}

// ---- Questions and close ---------------------------------------------------------------------------------------

export function Faq() {
  return (
    <section className={`${wrap} border-t py-20`} aria-labelledby="faq">
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <h2 id="faq" className={h2}>Questions</h2>
        <Accordion
          defaultOpen={['own']}
          items={[
            { id: 'own', title: 'Is this an npm package?', content: 'No. You copy the file you need into your project, or let the CLI do it: npx befui add button. Nothing to version-lock.' },
            { id: 'deps', title: 'What does it depend on?', content: 'React, Tailwind 4, Radix primitives for behaviour, and our own icon set. The animated pieces use plain CSS and pointer events.' },
            { id: 'theme', title: 'How do I match my brand?', content: 'Paste a palette block into your CSS, as the controls at the top of this page show, and set --radius and data-density if you want them. Light and dark both follow.' },
            { id: 'platforms', title: 'Is there more than React?', content: `Every component also has a <bef-*> HTML tag, and ${flutterSlugs.length} of them are Flutter widgets for Android and iOS.` },
            { id: 'rtl', title: 'Does it work right to left, and in other languages?', content: 'Calendar and date pickers take a locale, and components use logical start and end spacing so they flip on right-to-left pages. Every docs preview has an RTL switch.' },
            { id: 'motion', title: 'Does it respect reduced motion?', content: 'Yes. Animations switch off for people who ask their system for less motion.' },
          ]}
        />
      </div>
    </section>
  );
}

export function Close() {
  return (
    <section className={`${wrap} border-t pb-28 pt-20`} aria-labelledby="close">
      <h2 id="close" className="font-display max-w-3xl text-balance text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl">Start with one file</h2>
      <p className={lede}>Run the command, open the file it adds, and change whatever you like. Nothing in your project depends on a befui package.</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button asChild size="lg"><Link to="/docs">Read the setup guide <ArrowRightIcon draw /></Link></Button>
        <div className="flex items-center gap-2 rounded-md border bg-background py-1 pl-3.5 pr-1">
          <code className="font-mono text-[13px] text-muted-foreground"><span className="text-primary">$</span> npx befui add button</code>
          <CopyButton value="npx befui add button" className="size-7" />
        </div>
      </div>
    </section>
  );
}
