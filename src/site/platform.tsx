import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { components } from '@/registry';
import { cn } from '@/lib/utils';
import { CodeBlock, Command } from './code';
import { Link } from './router';
import { FlutterShot, examples, flutterSlugs, hasFlutter, snake, useText, widgets } from './flutter-docs';
import { HtmlLive, demos, hasHtml, htmlSlugs, styles } from './html-docs';

const h1 = 'text-3xl font-semibold tracking-tight sm:text-4xl';
const h2 = 'mt-12 mb-4 scroll-mt-20 text-xl font-semibold tracking-tight';

export type Platform = 'react' | 'html' | 'flutter';

/** React, HTML and Flutter versions of one component, side by side as page tabs. */
/** Start downloading what the other tab needs as soon as the pointer is near it, so the switch feels instant. */
function warm(id: Platform, slug: string) {
  if (id === 'html') {
    void import('@/html/entry');
    demos[`/src/html/demos/${slug}.html`]?.();
  } else if (id === 'flutter') {
    for (const m of ['light', 'dark']) new Image().src = `${import.meta.env.BASE_URL}flutter/${slug}-${m}.webp`;
    widgets[`/flutter/lib/befui/${snake(slug)}.dart`]?.();
    examples[`/flutter/lib/examples/${snake(slug)}.dart`]?.();
  }
}

export function PlatformTabs({ slug, active }: { slug: string; active: Platform }) {
  const items: [Platform, string, string, boolean][] = [
    ['react', 'React', `/components/${slug}`, true],
    ['html', 'HTML', `/html/${slug}`, hasHtml(slug)],
    ['flutter', 'Flutter', `/flutter/${slug}`, hasFlutter(slug)],
  ];
  return (
    <nav aria-label="Platform" className="mt-5 inline-flex gap-1 rounded-lg bg-secondary p-1">
      {items.filter((i) => i[3]).map(([id, label, to]) => (
        <Link
          key={id}
          to={to}
          aria-current={id === active ? 'page' : undefined}
          onPointerEnter={() => warm(id, slug)}
          onTouchStart={() => warm(id, slug)}
          onFocus={() => warm(id, slug)}
          className={cn('rounded-md px-3 py-1 text-[13px] font-medium transition-colors', id === active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function PrevNext({ list, slug, base }: { list: { slug: string; name: string }[]; slug: string; base: string }) {
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

/** Components that have a version on this platform, in site order. */
export function platformList(platform: 'html' | 'flutter') {
  const have = new Set(platform === 'html' ? htmlSlugs : flutterSlugs);
  return components.filter((c) => have.has(c.slug));
}

/* --------------------------------------------------------------- Flutter */

interface Prop { name: string; type: string; doc: string }

/** Reads the widget's own constructor fields and their doc comments out of the Dart source: the props table. */
function parseProps(src: string): { doc: string; className: string; props: Prop[] } {
  const lines = src.split('\n');
  const start = lines.findIndex((l) => /^class Bef\w+ extends (StatelessWidget|StatefulWidget)/.test(l));
  if (start < 0) return { doc: '', className: '', props: [] };
  const className = lines[start].match(/^class (\w+)/)![1];
  let doc: string[] = [];
  for (let i = start - 1; i >= 0 && lines[i].startsWith('///'); i--) doc.unshift(lines[i].replace(/^\/\/\/ ?/, ''));
  const props: Prop[] = [];
  let pending = '';
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^\}/.test(l) || /@override/.test(l)) break;
    const d = l.match(/^\s*\/\/\/ ?(.*)/);
    if (d) { pending += (pending ? ' ' : '') + d[1]; continue; }
    const f = l.match(/^\s*final\s+(.+?)\s+([\w, ]+);\s*$/);
    if (f) {
      for (const name of f[2].split(',').map((n) => n.trim())) props.push({ name, type: f[1].trim(), doc: pending });
    }
    pending = '';
  }
  return { doc: doc.join(' ').replace(/\[([^\]]+)\]/g, '$1'), className, props };
}

export function FlutterComponentPage({ slug }: { slug: string }) {
  const c = components.find((x) => x.slug === slug);
  const file = snake(slug);
  const example = useText(examples, `/flutter/lib/examples/${file}.dart`);
  const source = useText(widgets, `/flutter/lib/befui/${file}.dart`);
  const [tab, setTab] = React.useState('example');
  if (!c || !hasFlutter(slug)) return <NotFoundPlatform name="Flutter" />;
  // in an app the example sits next to befui/, not in a sibling folder
  const code = example?.replace(/'\.\.\/befui\//g, "'befui/");
  const info = source ? parseProps(source) : null;
  const list = platformList('flutter');
  return (
    <article className="max-w-4xl">
      <Breadcrumb className="mb-4" items={[{ label: 'Flutter', href: '#/flutter' }, { label: c.category }, { label: c.name }]} />
      <h1 className={h1}>{c.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{info?.doc || c.description}</p>
      <PlatformTabs slug={slug} active="flutter" />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        <div className="min-w-0">
          <h2 className={cn(h2, 'mt-0')}>Add it</h2>
          <p className="mb-3 text-[13px] text-muted-foreground">In the folder with your pubspec.yaml. It also copies the theme, core and icon files this widget needs:</p>
          <Command>{`npx github:RandomKid24/befui add ${slug} --flutter`}</Command>
          <p className="mt-3 text-[13px] text-muted-foreground">
            New to befui on Flutter? <Link to="/flutter" className="font-medium text-primary hover:underline">Set the theme once</Link>, then every widget works.
          </p>
        </div>
        <FlutterShot slug={slug} width={300} className="min-w-0 rounded-xl border bg-muted/40 px-4 py-8" />
      </div>

      <h2 className={h2}>Use it</h2>
      <Tabs value={tab === 'example' && !code ? 'source' : tab} onValueChange={setTab} className="min-w-0">
        <TabsList variant="pill">
          {code && <TabsTrigger value="example">Example</TabsTrigger>}
          <TabsTrigger value="source">Widget source</TabsTrigger>
        </TabsList>
        {code && (
          <TabsContent value="example" className="mt-3">
            <CodeBlock dart code={code} title={`${file}_example.dart`} maxHeight={460} />
          </TabsContent>
        )}
        <TabsContent value="source" className="mt-3">
          {source !== null && <CodeBlock dart code={source} title={`lib/befui/${file}.dart`} maxHeight={460} />}
        </TabsContent>
      </Tabs>

      {info && info.props.length > 0 && (
        <>
          <h2 className={h2}>{info.className} properties</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b bg-muted/50 text-xs text-muted-foreground">
                <tr><th className="px-3 py-2 font-medium">Name</th><th className="px-3 py-2 font-medium">Type</th><th className="px-3 py-2 font-medium">What it does</th></tr>
              </thead>
              <tbody>
                {info.props.map((p) => (
                  <tr key={p.name} className="border-b last:border-b-0 align-top">
                    <td className="px-3 py-2 font-mono text-xs font-medium">{p.name}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.type}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.doc.replace(/\[([^\]]+)\]/g, '$1') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <PrevNext list={list} slug={slug} base="/flutter" />
    </article>
  );
}

/* ------------------------------------------------------------------ HTML */

export function HtmlComponentPage({ slug }: { slug: string }) {
  const c = components.find((x) => x.slug === slug);
  const html = useText(demos, `/src/html/demos/${slug}.html`);
  const css = useText(styles, `/src/html/css/${slug}.css`);
  if (!c || !hasHtml(slug)) return <NotFoundPlatform name="HTML" />;
  const tag = `bef-${slug}`;
  const list = platformList('html');
  return (
    <article className="max-w-4xl">
      <Breadcrumb className="mb-4" items={[{ label: 'HTML', href: '#/html' }, { label: c.category }, { label: c.name }]} />
      <h1 className={h1}>{c.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{c.description}</p>
      <PlatformTabs slug={slug} active="html" />

      <div className="mt-8">
        {html !== null && <HtmlLive html={html} wide={c.wide} />}
      </div>

      <h2 className={h2}>Add it</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">
        One stylesheet and one script on the page, then use the <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">&lt;{tag}&gt;</code> tag. The component's code loads only when it is on screen.{' '}
        <Link to="/html" className="font-medium text-primary hover:underline">How props map</Link>
      </p>
      <CodeBlock
        html
        title="index.html"
        code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/RandomKid24/befui@main/cdn/befui.css">\n<script type="module" src="https://cdn.jsdelivr.net/gh/RandomKid24/befui@main/cdn/befui.js"></script>`}
      />

      <h2 className={h2}>Use it</h2>
      <Tabs defaultValue="html" className="min-w-0">
        <TabsList variant="pill">
          <TabsTrigger value="html">HTML</TabsTrigger>
          {css !== '' && <TabsTrigger value="css">CSS</TabsTrigger>}
        </TabsList>
        <TabsContent value="html" className="mt-3">
          {html !== null && <CodeBlock html code={html} title={`${slug}.html`} maxHeight={460} />}
        </TabsContent>
        <TabsContent value="css" className="mt-3">
          {css && <CodeBlock code={css} title={`${slug}.css`} maxHeight={460} />}
        </TabsContent>
      </Tabs>
      <PrevNext list={list} slug={slug} base="/html" />
    </article>
  );
}

function NotFoundPlatform({ name }: { name: string }) {
  return (
    <div className="py-16 text-center">
      <h1 className={h1}>Not available in {name}</h1>
      <p className="mt-3 text-muted-foreground">This component has no {name} version yet.</p>
      <Button asChild className="mt-6"><Link to={name === 'HTML' ? '/html' : '/flutter'}>See what is available</Link></Button>
    </div>
  );
}
