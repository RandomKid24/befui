import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { CheckIcon, SparkleIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { loadStepSource, recipes, stepDemo, type Recipe } from '@/recipes';
import { Command } from './code';
import { highlight } from './code';
import { Link } from './router';

const h1 = 'text-3xl font-semibold tracking-tight sm:text-4xl';

/* ----------------------------------------------------------------- index */

export function RecipesIndex() {
  return (
    <div>
      <h1 className={h1}>Recipes</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Whole features, built up one step at a time. Scroll a recipe and the preview and the code grow with it: new lines are highlighted, and every step is a real file you can copy.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recipes.map((r, i) => (
          <Link key={r.slug} to={`/recipes/${r.slug}`} className="group flex flex-col rounded-xl border bg-card p-5 outline-none transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50">
            <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, '0')} · {r.steps.length} steps · {r.minutes} min</span>
            <h2 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-primary">{r.title}</h2>
            <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">{r.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {r.components.slice(0, 5).map((c) => <span key={c} className="rounded-full border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">{c}</span>)}
              {r.components.length > 5 && <span className="px-1 py-0.5 text-[11px] text-muted-foreground">+{r.components.length - 5}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

function useSources(slug: string, count: number) {
  const [src, setSrc] = React.useState<string[]>([]);
  React.useEffect(() => {
    let live = true;
    setSrc([]);
    Promise.all(Array.from({ length: count }, (_, i) => loadStepSource(slug, i + 1))).then((s) => live && setSrc(s));
    return () => { live = false; };
  }, [slug, count]);
  return src;
}

/** The source with the lines that are new in this step marked, so you can see exactly what each step adds. */
function StepCode({ code, previous }: { code: string; previous?: string }) {
  const [copied, setCopied] = React.useState(false);
  const lines = React.useMemo(() => code.replace(/\n$/, '').split('\n'), [code]);
  const before = React.useMemo(() => new Set((previous ?? '').split('\n').map((l) => l.trim())), [previous]);
  const rendered = React.useMemo(() => lines.map((l) => highlight(l || ' ', 'tsx')), [lines]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const added = previous ? lines.filter((l) => l.trim() && !before.has(l.trim())).length : 0;
  return (
    <figure className="overflow-hidden rounded-lg border bg-muted/60">
      <figcaption className="flex h-9 items-center justify-between border-b bg-muted px-3">
        <span className="font-mono text-xs text-muted-foreground">{previous ? `${added} new line${added === 1 ? '' : 's'}` : 'step 1'}</span>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-xs text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40">
          {copied ? <><CheckIcon className="size-3.5 text-success" /> Copied</> : 'Copy file'}
        </button>
      </figcaption>
      <pre className="max-h-[26rem] overflow-auto py-3 font-mono text-[12.5px] leading-6">
        <code className="block min-w-max">
          {rendered.map((nodes, i) => {
            const isNew = previous !== undefined && lines[i]!.trim() !== '' && !before.has(lines[i]!.trim());
            return (
              <span key={i} className={cn('block border-l-2 px-4', isNew ? 'border-primary bg-primary/10' : 'border-transparent')}>{nodes}</span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}

function Stage({ slug, step }: { slug: string; step: number }) {
  const Demo = React.useMemo(() => stepDemo(slug, step), [slug, step]);
  return (
    <div className="grid place-items-center rounded-xl border bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-4 sm:p-6">
      <div data-stage className="w-full min-w-0 max-w-full [&>*]:mx-auto">
        <React.Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-muted/60" />}>
          <Demo />
        </React.Suspense>
      </div>
    </div>
  );
}

function aiPrompt(r: Recipe, finalSource: string) {
  return `Build "${r.title}" with befui (React, Tailwind, Radix).\n\nInstall: npx github:RandomKid24/befui add ${r.components.join(' ')}\n\nSteps:\n${r.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join('\n')}\n\nFinal component:\n\`\`\`tsx\n${finalSource}\`\`\`\n`;
}

export function RecipePage({ slug }: { slug: string }) {
  const r = recipes.find((x) => x.slug === slug);
  const count = r?.steps.length ?? 0;
  const sources = useSources(slug, count);
  const [active, setActive] = React.useState(0);
  const blocks = React.useRef<(HTMLElement | null)[]>([]);
  const [aiCopied, setAiCopied] = React.useState(false);

  React.useEffect(() => {
    setActive(0);
    const els = blocks.current.filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step)); }),
      { rootMargin: '-30% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug, count]);

  if (!r) {
    return (
      <div className="py-16 text-center">
        <h1 className={h1}>Recipe not found</h1>
        <Button asChild className="mt-6"><Link to="/recipes">All recipes</Link></Button>
      </div>
    );
  }
  const i = recipes.indexOf(r);
  const next = recipes[i + 1];
  const copyAi = async () => {
    try { await navigator.clipboard.writeText(aiPrompt(r, sources[count - 1] ?? '')); } catch { return; }
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  return (
    <article className="max-w-6xl">
      <Breadcrumb className="mb-4" items={[{ label: 'Recipes', href: '#/recipes' }, { label: r.title }]} />
      <h1 className={h1}>{r.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{r.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex h-10 items-center rounded-lg bg-secondary px-3 text-[13px] text-muted-foreground">{count} steps · about {r.minutes} min</span>
        <Button variant="outline" className="h-10" onClick={copyAi} disabled={!sources.length}>{aiCopied ? <CheckIcon /> : <SparkleIcon />} {aiCopied ? 'Copied for AI' : 'Copy for AI'}</Button>
      </div>

      <h2 className="mb-3 mt-10 text-sm font-semibold text-muted-foreground">Install what it uses</h2>
      <Command>{`npx github:RandomKid24/befui add ${r.components.join(' ')}`}</Command>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {r.components.map((c) => <Link key={c} to={`/components/${c}`} className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">{c}</Link>)}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
        <ol className="grid gap-4 lg:gap-0">
          {r.steps.map((s, n) => (
            <li key={n} ref={(el) => { blocks.current[n] = el; }} data-step={n} className={cn('scroll-mt-24 lg:min-h-[22rem]', n === count - 1 && 'lg:min-h-[14rem]')}>
              <button
                type="button"
                onClick={() => { setActive(n); blocks.current[n]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                className="group flex w-full items-start gap-3 text-start outline-none"
                aria-current={active === n ? 'step' : undefined}
              >
                <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-colors', active === n ? 'border-primary bg-primary text-primary-foreground' : n < active ? 'border-primary/40 bg-primary/10 text-primary' : 'text-muted-foreground')}>
                  {n < active ? <CheckIcon className="size-3.5" /> : n + 1}
                </span>
                <span className={cn('transition-opacity duration-300', active === n ? 'opacity-100' : 'lg:opacity-45')}>
                  <span className="block text-base font-semibold tracking-tight">{s.title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-muted-foreground">{s.text}</span>
                </span>
              </button>
              {/* on a phone there is no side panel, so each step carries its own preview */}
              <div className="mt-4 grid gap-3 lg:hidden">
                <Stage slug={slug} step={n + 1} />
                {sources[n] && <StepCode code={sources[n]!} previous={sources[n - 1]} />}
              </div>
            </li>
          ))}
        </ol>

        <div className="hidden lg:block">
          <div className="sticky top-20 grid gap-3">
            <div key={active} className="animate-[rise_0.45s_cubic-bezier(0.22,1,0.36,1)_both]">
              <Stage slug={slug} step={active + 1} />
            </div>
            {sources[active] && <StepCode code={sources[active]!} previous={sources[active - 1]} />}
          </div>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between gap-3 border-t pt-6">
        <Button asChild variant="outline"><Link to="/recipes">← All recipes</Link></Button>
        {next ? <Button asChild variant="outline"><Link to={`/recipes/${next.slug}`}>{next.title} →</Link></Button> : <span />}
      </div>
    </article>
  );
}
