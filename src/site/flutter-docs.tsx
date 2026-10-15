import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CodeBlock, Command } from './code';
import { Link } from './router';

// The Flutter (Android and iOS) version of every component: one Dart file per widget in flutter/lib/befui, with an example in flutter/lib/examples.
// Delete this file and its uses in pages.tsx, App.tsx and layout.tsx to remove the Flutter section.
const widgets = import.meta.glob<string>('/flutter/lib/befui/*.dart', { query: '?raw', import: 'default' });
const examples = import.meta.glob<string>('/flutter/lib/examples/*.dart', { query: '?raw', import: 'default' });

const snake = (slug: string) => slug.replace(/-/g, '_');
export const hasFlutter = (slug: string) => `/flutter/lib/befui/${snake(slug)}.dart` in widgets;

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

/** The widget as rendered by Flutter (flutter test renders every example to a PNG, light and dark), shown inside an iPhone frame. */
function FlutterShot({ slug }: { slug: string }) {
  const [missing, setMissing] = React.useState(false);
  if (missing) return null;
  return (
    <div className="mb-4 flex justify-center rounded-xl border bg-muted/40 px-4 py-8">
      <div className="w-[min(100%,300px)] rounded-[3rem] bg-neutral-900 p-[9px] shadow-xl ring-1 ring-black/20 dark:ring-white/15">
        <div className="relative flex min-h-[460px] flex-col overflow-hidden rounded-[2.5rem] bg-background">
          <div className="flex h-11 shrink-0 items-center justify-between px-7 pt-1 text-[11px] font-semibold">
            <span>9:41</span>
            <span aria-hidden className="absolute left-1/2 top-2 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-neutral-900" />
            <span className="tracking-tight">5G ▮▮▮</span>
          </div>
          <div className="max-h-[640px] flex-1 overflow-y-auto">
            {(['light', 'dark'] as const).map((m) => (
              <img
                key={m}
                src={`${import.meta.env.BASE_URL}flutter/${slug}-${m}.png`}
                alt={`${slug} widget in Flutter, ${m} theme`}
                width={390}
                loading="lazy"
                onError={() => setMissing(true)}
                className={cn('w-full', m === 'light' ? 'dark:hidden' : 'hidden dark:block')}
              />
            ))}
          </div>
          <div aria-hidden className="mx-auto my-2 h-1 w-24 shrink-0 rounded-full bg-foreground/80" />
        </div>
      </div>
    </div>
  );
}

/** "Use in Flutter" block on a component page: how to add it, an example and the widget source. */
export function FlutterSection({ slug, h2 }: { slug: string; h2: string }) {
  const file = snake(slug);
  const example = useText(examples, `/flutter/lib/examples/${file}.dart`);
  const source = useText(widgets, `/flutter/lib/befui/${file}.dart`);
  const [tab, setTab] = React.useState('example');
  if (!hasFlutter(slug)) return null;
  // in an app the example sits next to befui/, not in a sibling folder
  const code = example?.replace(/'\.\.\/befui\//g, "'befui/");
  return (
    <section aria-label="Use in Flutter">
      <h2 className={h2}>Use in Flutter</h2>
      <p className="mb-3 max-w-2xl text-[13px] text-muted-foreground">
        The same component as a Flutter widget for Android and iOS, with the same colours, radii and dark mode. Copy-paste like the React one: the file is yours.{' '}
        <Link to="/flutter" className="font-medium text-primary hover:underline">How it works</Link>
      </p>
      <FlutterShot slug={slug} />
      <Command>{`npx github:RandomKid24/befui add ${slug} --flutter`}</Command>
      <Tabs value={tab === 'example' && !code ? 'source' : tab} onValueChange={setTab} className="mt-4 min-w-0">
        <TabsList variant="pill">
          {code && <TabsTrigger value="example">Example</TabsTrigger>}
          <TabsTrigger value="source">Widget source</TabsTrigger>
        </TabsList>
        {code && (
          <TabsContent value="example" className="mt-3">
            <CodeBlock dart code={code} title={`${file}_example.dart`} maxHeight={420} />
          </TabsContent>
        )}
        <TabsContent value="source" className="mt-3">
          {source !== null && <CodeBlock dart code={source} title={`lib/befui/${file}.dart`} maxHeight={420} />}
        </TabsContent>
      </Tabs>
    </section>
  );
}
