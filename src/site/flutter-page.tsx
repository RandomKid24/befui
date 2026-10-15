import { CodeBlock, Command } from './code';
import { FlutterShot, flutterSlugs } from './flutter-docs';
import { Link } from './router';

const title = (slug: string) => slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

const THEME = `import 'befui/theme.dart';

MaterialApp(
  theme: BefTheme.data(),
  darkTheme: BefTheme.data(brightness: Brightness.dark),
  themeMode: ThemeMode.system,
  home: const MyScreen(),
);`;

const USE = `import 'befui/button.dart';
import 'befui/badge.dart';
import 'befui/icons.dart';

BefButton(
  label: 'Export',
  leading: const BefIcon(BefIcons.download),
  variant: BefButtonVariant.soft,
  onPressed: () {},
)`;

const RULES: [string, string][] = [
  ['You own the files', 'The CLI copies one Dart file per widget into lib/befui. Edit them freely, there is no package to upgrade.'],
  ['Same design as the web', 'The colour tokens, radii, sizes and the ten palettes come from the same source as the React components. Light and dark both follow.'],
  ['Props match the React ones', 'variant, size and shape are enums (BefButtonVariant.soft), plus loading, onPressed and so on.'],
  ['Our own icons', 'BefIcon(BefIcons.search) paints the same hand-drawn set. No icon package.'],
  ['Colours from the theme', 'context.bef.primary, context.bef.mutedForeground. Never hard-code a colour.'],
  ['Built for AI too', 'befui init --flutter writes the rules into AGENTS.md, and the whole list is in llms-flutter.txt.'],
];

/** The /flutter page: how to use the Flutter widgets. Each widget has its own Flutter page. */
export function FlutterPage() {
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Use in Flutter</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The befui components as Flutter widgets, for your Android and iOS apps. Copy-paste, like the React ones: one Dart file per widget, the same design, and from then on the file is yours.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90">How to add one</button>
        <span className="inline-flex h-9 items-center text-sm text-muted-foreground">{flutterSlugs.length} widgets, rendered by Flutter</span>
      </div>
      <section aria-label="All Flutter widgets" className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {flutterSlugs.map((slug) => (
          <Link key={slug} to={`/flutter/${slug}`} className="group grid justify-items-center gap-3 rounded-xl border bg-muted/30 p-4 pb-5 transition-colors [contain-intrinsic-size:auto_560px] [content-visibility:auto] hover:bg-muted/60">
            <FlutterShot slug={slug} width={230} live="click" />
            <span className="text-sm font-medium group-hover:text-primary">{title(slug)}</span>
          </Link>
        ))}
      </section>
      <div id="get-started" className="max-w-3xl scroll-mt-20">
      <h2 className="mb-4 mt-14 text-xl font-semibold tracking-tight">1. Add a widget</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">In the folder with your pubspec.yaml. It also copies the shared theme, core and icon files the widget needs:</p>
      <Command>{'npx github:RandomKid24/befui add button badge --flutter'}</Command>
      <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight">2. Set the theme once</h2>
      <CodeBlock dart title="main.dart" code={THEME} />
      <p className="mt-3 text-[13px] text-muted-foreground">Pick a palette with <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">BefTheme.data(palette: BefPalette.rose)</code>. The font is Inter: add it with google_fonts or as an asset and pass <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">fontFamily</code>. Without it the platform font is used.</p>
      <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight">3. Use it</h2>
      <CodeBlock dart title="my_screen.dart" code={USE} />
      <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight">How it works</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {RULES.map(([title, text]) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <h3 className="text-[13px] font-semibold">{title}</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Every widget above has its own page with the phone preview, example, source and properties. Run <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">npx github:RandomKid24/befui list --flutter</code> for the list.
      </p>
      </div>
    </article>
  );
}
