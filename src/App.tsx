import * as React from 'react';
import { Shell } from '@/site/layout';
import { Home } from '@/site/landing';
import { useRoute } from '@/site/router';

// Every page except the home page loads when it is first visited, so the first paint only needs the shell and the hero.
const pages = () => import('@/site/pages');
const named = <K extends string>(load: () => Promise<Record<K, React.ComponentType<any>>>, key: K) => React.lazy(() => load().then((m) => ({ default: m[key] })));
const GettingStarted = named(pages, 'GettingStarted');
const ComponentsIndex = named(pages, 'ComponentsIndex');
const ComponentPage = named(pages, 'ComponentPage');
const BlocksIndex = named(pages, 'BlocksIndex');
const BlockPage = named(pages, 'BlockPage');
const NotFound = named(pages, 'NotFound');
const IconsPage = named(() => import('@/site/icons-page'), 'IconsPage');
const ThemesPage = named(() => import('@/site/themes-page'), 'ThemesPage');
const AiPage = named(() => import('@/site/ai-page'), 'AiPage');
const ChangelogPage = named(() => import('@/site/changelog-page'), 'ChangelogPage');
const HtmlPage = named(() => import('@/site/html-page'), 'HtmlPage');
const FlutterPage = named(() => import('@/site/flutter-page'), 'FlutterPage');
const FlutterComponentPage = named(() => import('@/site/platform'), 'FlutterComponentPage');
const HtmlComponentPage = named(() => import('@/site/platform'), 'HtmlComponentPage');

const fallback = <div className="h-64 animate-pulse rounded-xl bg-muted/50" aria-hidden />;

export default function App() {
  const path = useRoute();
  // fetch the docs pages while the browser is idle on the home page
  React.useEffect(() => {
    const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1500));
    idle(() => { void pages(); });
  }, []);
  const [, section, slug] = path.split('/');
  const home = path === '/';

  let page;
  if (home) page = <Home />;
  else if (section === 'docs') page = <GettingStarted />;
  else if (section === 'components') page = slug ? <ComponentPage slug={slug} /> : <ComponentsIndex />;
  else if (section === 'ai') page = <AiPage />;
  else if (section === 'html') page = slug ? <HtmlComponentPage slug={slug} /> : <HtmlPage />;
  else if (section === 'flutter') page = slug ? <FlutterComponentPage slug={slug} /> : <FlutterPage />;
  else if (section === 'changelog') page = <ChangelogPage />;
  else if (section === 'icons') page = <IconsPage />;
  else if (section === 'themes') page = <ThemesPage />;
  else if (section === 'blocks') page = slug ? <BlockPage slug={slug} /> : <BlocksIndex />;
  else page = <NotFound />;

  return (
    <Shell path={path} docs={!home && section !== 'icons' && section !== 'themes'}>
      <style>{'@keyframes page-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } } @media (prefers-reduced-motion: reduce) { [data-page] { animation: none !important } }'}</style>
      <div data-page key={path} className="animate-[page-in_0.28s_cubic-bezier(0.22,1,0.36,1)]"><React.Suspense fallback={fallback}>{page}</React.Suspense></div>
    </Shell>
  );
}
