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
export const flutterSlugs = Object.keys(widgets)
  .map((p) => p.split('/').pop()!.replace('.dart', '').replace(/_/g, '-'))
  .filter((n) => !['theme', 'core', 'icons'].includes(n))
  .sort();
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
export function FlutterShot({ slug, width = 300, className }: { slug: string; width?: number; className?: string }) {
  const [missing, setMissing] = React.useState(false);
  if (missing) return null;
  return (
    <div className={cn('flex justify-center', className)}>
      <div className="relative" style={{ width: `min(100%, ${width}px)` }}>
        {/* side buttons: action, volume up/down, power */}
        <span aria-hidden className="absolute -left-[3px] top-[88px] h-6 w-[3px] rounded-l bg-neutral-500" />
        <span aria-hidden className="absolute -left-[3px] top-[132px] h-11 w-[3px] rounded-l bg-neutral-500" />
        <span aria-hidden className="absolute -left-[3px] top-[184px] h-11 w-[3px] rounded-l bg-neutral-500" />
        <span aria-hidden className="absolute -right-[3px] top-[148px] h-16 w-[3px] rounded-r bg-neutral-500" />
        {/* titanium rim, black bezel, screen */}
        <div className="rounded-[3.1rem] bg-gradient-to-b from-neutral-300 via-neutral-500 to-neutral-400 p-[2px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)]">
          <div className="rounded-[3rem] bg-black p-[8px]">
            <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.4rem] bg-background">
              <div className="relative flex h-12 shrink-0 items-center justify-between px-7 pt-2 text-[12px] font-semibold">
                <span>9:41</span>
                <span aria-hidden className="absolute left-1/2 top-2.5 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
                <span aria-hidden className="flex items-center gap-1">
                  <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 3.8a9 9 0 0 1 13 0M3.2 6.2a5.8 5.8 0 0 1 8.6 0" /><circle cx="7.5" cy="9" r="1" fill="currentColor" stroke="none" /></svg>
                  <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="18" height="8" rx="2.2" fill="currentColor" /><path d="M23 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity=".45" /></svg>
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              <div aria-hidden className="mx-auto mb-2 mt-1 h-[5px] w-[100px] shrink-0 rounded-full bg-foreground" />
            </div>
          </div>
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
      <FlutterShot slug={slug} className="mb-4 rounded-xl border bg-muted/40 px-4 py-10" />
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
