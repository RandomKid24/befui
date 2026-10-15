import { Link } from './router';
import { CodeBlock } from './code';
import { htmlSlugs } from './platform-lists';
import { components } from '@/registry';

const START = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/RandomKid24/befui@main/cdn/befui.css">
<script type="module" src="https://cdn.jsdelivr.net/gh/RandomKid24/befui@main/cdn/befui.js"></script>

<bef-button variant="soft">Hello</bef-button>`;

const RULES: [string, string][] = [
  ['Props are attributes', 'variant="soft", default-value="x". A bare attribute is true.'],
  ['JSON with a colon', ':value="40", :items=\'[...]\'. A tag inside a JSON string becomes content.'],
  ['Slots', 'slot="action" on a child passes it as that prop.'],
  ['Events', 'emit="value-change" fires bef:value-change. Controlled values update themselves.'],
  ['Dates', '~selected="now", ~to="2026-12-31", ~at="now-14m".'],
  ['Functions in script', 'el.props = { columns, onSubmit } from a <script type="module">.'],
];

/** The /html page: how the <bef-*> build works. Each component has its own HTML page. */
export function HtmlPage() {
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Use from HTML and htmx</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every component is also a custom element, <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">&lt;bef-button&gt;</code>, <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">&lt;bef-dialog&gt;</code>, <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">&lt;bef-data-table&gt;</code>.
        One stylesheet and one script, no React in your app. It works with htmx, Django, Rails, PHP and static pages. Components load on demand, so a page with a button and a dialog downloads about 120 KB gzipped.
      </p>
      <section aria-label="All HTML components" className="mt-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">{htmlSlugs.length} components</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {components.filter((c) => htmlSlugs.includes(c.slug)).map((c) => (
            <Link key={c.slug} to={`/html/${c.slug}`} className="flex items-baseline justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-sm transition-colors hover:bg-secondary">
              <span className="font-medium">{c.name}</span>
              <code className="truncate font-mono text-[11px] text-muted-foreground">&lt;bef-{c.slug}&gt;</code>
            </Link>
          ))}
        </div>
      </section>
      <div className="max-w-3xl">
      <h2 className="mb-4 mt-14 text-xl font-semibold tracking-tight">Quick start</h2>
      <CodeBlock html title="index.html" code={START} />
      <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight">How props map</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {RULES.map(([title, text]) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <h3 className="text-[13px] font-semibold">{title}</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Every component above has its own page with the live tags, the HTML and the CSS it uses. The examples there are generated from the React ones, so they render the same markup.
      </p>
      </div>
    </article>
  );
}
