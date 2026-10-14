import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CodeBlock } from './code';
import { Link } from './router';

// The HTML build of every component: <bef-*> tags that work in plain HTML and htmx. The examples are generated from the React ones (npm run html:demos),
// the CSS is cut out of the built stylesheet (npm run build:html). Delete this file and its uses in pages.tsx and App.tsx to remove the HTML tab.
const demos = import.meta.glob<string>('/src/html/demos/*.html', { query: '?raw', import: 'default' });
const styles = import.meta.glob<string>('/src/html/css/*.css', { query: '?raw', import: 'default' });

/** Loads a text file for a slug (null while loading, '' when there is none). */
function useText(files: Record<string, () => Promise<string>>, path: string) {
  const [text, setText] = React.useState<string | null>(null);
  React.useEffect(() => {
    let live = true;
    setText(null);
    (files[path]?.() ?? Promise.resolve('')).then((t) => live && setText(t));
    return () => { live = false; };
  }, [files, path]);
  return text;
}

/** Draws the example as real <bef-*> tags. The runtime (and each component's code) is only downloaded when this is on screen. */
function HtmlLive({ html, wide }: { html: string; wide?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    let live = true;
    import('@/html/entry').then(() => live && setReady(true));
    return () => { live = false; };
  }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!ready || !el) return;
    el.innerHTML = html;
    // innerHTML does not run scripts, so swap in fresh ones. As plain blocks they run right now, before the tags below get drawn,
    // so el.props is already there when a component first renders (a module script would run a moment later).
    el.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      s.textContent = `{\n${old.textContent}\n}`;
      old.replaceWith(s);
    });
    return () => { el.replaceChildren(); };
  }, [ready, html]);
  return (
    <div className={cn('rounded-xl border bg-background', wide ? 'bg-muted/40 p-4 sm:p-6' : 'bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-6 sm:p-10')}>
      <style>{'[data-bef]{display:contents}[data-bef][style]{display:block}'}</style>
      <div ref={ref} className={cn('mx-auto min-h-40', wide ? 'w-full max-w-6xl' : 'flex flex-wrap items-center justify-center gap-4')} />
    </div>
  );
}

/** "Use from HTML" block on a component page: the live tags, the HTML, and the CSS this component uses. */
export function HtmlSection({ slug, wide, h2 }: { slug: string; wide?: boolean; h2: string }) {
  const html = useText(demos, `/src/html/demos/${slug}.html`);
  const css = useText(styles, `/src/html/css/${slug}.css`);
  if (html === '') return null;
  return (
    <section aria-label="Use from HTML">
      <h2 className={h2}>Use from HTML</h2>
      <p className="mb-3 max-w-2xl text-[13px] text-muted-foreground">
        The same component as a <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">&lt;bef-*&gt;</code> tag, for plain HTML, htmx and server-rendered pages. No React in your app.{' '}
        <Link to="/html" className="font-medium text-primary hover:underline">How it works</Link>
      </p>
      <Tabs defaultValue="html" className="min-w-0">
        <TabsList variant="pill">
          <TabsTrigger value="html">HTML</TabsTrigger>
          {css !== '' && <TabsTrigger value="css">CSS</TabsTrigger>}
        </TabsList>
        <TabsContent value="html" className="mt-3 grid gap-3">
          {html !== null && <HtmlLive html={html} wide={wide} />}
          {html !== null && <CodeBlock html code={html} title={`${slug}.html`} maxHeight={420} />}
        </TabsContent>
        <TabsContent value="css" className="mt-3">
          {css && <CodeBlock code={css} title={`${slug}.css`} maxHeight={420} />}
        </TabsContent>
      </Tabs>
    </section>
  );
}
