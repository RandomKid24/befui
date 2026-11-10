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
const Thumb = named(pages, 'Thumb');
const DashboardsIndex = named(pages, 'DashboardsIndex');
const DashboardPage = named(pages, 'DashboardPage');
const IconsPage = named(() => import('@/site/icons-page'), 'IconsPage');
const ThemesPage = named(() => import('@/site/themes-page'), 'ThemesPage');
const AiPage = named(() => import('@/site/ai-page'), 'AiPage');
const ChangelogPage = named(() => import('@/site/changelog-page'), 'ChangelogPage');
const HtmlPage = named(() => import('@/site/html-page'), 'HtmlPage');
const RecipesIndex = named(() => import('@/site/recipes-page'), 'RecipesIndex');
const RecipePage = named(() => import('@/site/recipes-page'), 'RecipePage');
const FlutterPage = named(() => import('@/site/flutter-page'), 'FlutterPage');
const FlutterComponentPage = named(() => import('@/site/platform'), 'FlutterComponentPage');
const HtmlComponentPage = named(() => import('@/site/platform'), 'HtmlComponentPage');

const chunks: Record<string, () => Promise<unknown>> = {
  icons: () => import('@/site/icons-page'), themes: () => import('@/site/themes-page'), ai: () => import('@/site/ai-page'),
  changelog: () => import('@/site/changelog-page'), html: () => import('@/site/html-page'), recipes: () => import('@/site/recipes-page'),
  flutter: () => import('@/site/flutter-page'),
};

const fallback = <div className="h-64 animate-pulse rounded-xl bg-muted/50" aria-hidden />;

export default function App() {
  const path = useRoute();
  // fetch the docs pages while the browser is idle on the home page
  React.useEffect(() => {
    const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1500));
    idle(() => { void pages(); });
    // and fetch a section's code as soon as the pointer or focus reaches a link to it
    const warm = (e: Event) => {
      const to = (e.target as Element).closest?.('a[href^="#/"]')?.getAttribute('href')?.split('/')[1];
      if (to) void (chunks[to] ?? pages)();
    };
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('focusin', warm);
    return () => { document.removeEventListener('pointerover', warm); document.removeEventListener('focusin', warm); };
  }, []);
  const [, section, slug] = path.split('/');
  const home = path === '/';

  // bare demo for scripts/gen-thumbs.mjs to photograph, no site chrome
  if (section === 'thumb') return <React.Suspense fallback={null}><Thumb slug={slug} /></React.Suspense>;

  let page;
  if (home) page = <Home />;
  else if (section === 'docs') page = <GettingStarted />;
  else if (section === 'components') page = slug ? <ComponentPage slug={slug} /> : <ComponentsIndex />;
  else if (section === 'ai') page = <AiPage />;
  else if (section === 'recipes') page = slug ? <RecipePage slug={slug} /> : <RecipesIndex />;
  else if (section === 'html') page = slug ? <HtmlComponentPage slug={slug} /> : <HtmlPage />;
  else if (section === 'flutter') page = slug ? <FlutterComponentPage slug={slug} /> : <FlutterPage />;
  else if (section === 'changelog') page = <ChangelogPage />;
  else if (section === 'icons') page = <IconsPage />;
  else if (section === 'themes') page = <ThemesPage />;
  else if (section === 'dashboards') page = slug ? <DashboardPage slug={slug} /> : <DashboardsIndex />;
  else if (section === 'blocks') page = slug ? <BlockPage slug={slug} /> : <BlocksIndex />;
  else page = <NotFound />;

  return (
    <Shell path={path} wide={section === 'blocks' && !!slug} docs={!home && section !== 'icons' && section !== 'themes' && section !== 'recipes' && section !== 'dashboards'}>
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(10px) scale(0.995) } to { opacity: 1; transform: none } }
        /* a page's sections rise in one after the other, and a demo fades up when it has loaded */
        [data-page] article > * { animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both }
        [data-page] article > :nth-child(2) { animation-delay: 40ms } [data-page] article > :nth-child(3) { animation-delay: 80ms }
        [data-page] article > :nth-child(4) { animation-delay: 120ms } [data-page] article > :nth-child(5) { animation-delay: 160ms }
        [data-page] article > :nth-child(n+6) { animation-delay: 200ms }
        [data-stage] > * { animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both }
        @keyframes page-in { from { opacity: 0 } to { opacity: 1 } }
        [data-page] { animation: page-in 0.28s ease-out both }
        /* a slow page shows a thin bar under the header after a short wait, and nothing at all when it is quick */
        @keyframes routing { 0% { transform: scaleX(0); opacity: 1 } 60% { transform: scaleX(0.7) } 100% { transform: scaleX(0.92); opacity: 1 } }
        html[data-routing]::before { content: ''; position: fixed; inset: 0 0 auto 0; z-index: 60; height: 2px; background: var(--primary); transform-origin: left; opacity: 0; animation: routing 2.4s 0.18s cubic-bezier(0.22, 1, 0.36, 1) forwards }
        @media (prefers-reduced-motion: reduce) { [data-page], [data-page] article > *, [data-stage] > * { animation: none !important } }
      `}</style>
      <React.Suspense fallback={fallback}><div data-page key={path}>{page}</div></React.Suspense>
    </Shell>
  );
}
