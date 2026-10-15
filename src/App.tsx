import { Shell } from '@/site/layout';
import { BlockPage, BlocksIndex, ComponentPage, ComponentsIndex, GettingStarted, NotFound } from '@/site/pages';
import { Home } from '@/site/landing';
import { IconsPage } from '@/site/icons-page';
import { ThemesPage } from '@/site/themes-page';
import { AiPage } from '@/site/ai-page';
import { ChangelogPage } from '@/site/changelog-page';
import { HtmlPage } from '@/site/html-page';
import { FlutterComponentPage, HtmlComponentPage } from '@/site/platform';
import { FlutterPage } from '@/site/flutter-page';
import { useRoute } from '@/site/router';

export default function App() {
  const path = useRoute();
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
      <div data-page key={path} className="animate-[page-in_0.28s_cubic-bezier(0.22,1,0.36,1)]">{page}</div>
    </Shell>
  );
}
