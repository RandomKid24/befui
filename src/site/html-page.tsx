import * as React from 'react';

// Shows the HTML/htmx docs (dist/html, built by `npm run build:html`) inside the site shell. Delete this file, its route in App.tsx and the /html nav links to remove the tab.
export function HtmlPage({ slug }: { slug?: string }) {
  const frame = React.useRef<HTMLIFrameElement>(null);
  const isDark = () => document.documentElement.classList.contains('dark');
  const first = React.useRef({ dark: isDark(), slug });

  React.useEffect(() => {
    const el = document.documentElement;
    const send = () => frame.current?.contentWindow?.postMessage({ befuiTheme: isDark() ? 'dark' : 'light' }, '*');
    const ob = new MutationObserver(send);
    ob.observe(el, { attributes: true, attributeFilter: ['class'] });
    // The docs tell us which component is open, so the address bar stays shareable without reloading the frame.
    const onMsg = (e: MessageEvent) => {
      if (e.source === frame.current?.contentWindow && typeof e.data?.befuiSlug === 'string') history.replaceState(null, '', `#/html${e.data.befuiSlug ? `/${e.data.befuiSlug}` : ''}`);
    };
    window.addEventListener('message', onMsg);
    return () => { ob.disconnect(); window.removeEventListener('message', onMsg); };
  }, []);

  const { dark, slug: s } = first.current;
  return <iframe ref={frame} title="Use from HTML and htmx" src={`/html/index.html?embed&theme=${dark ? 'dark' : 'light'}#/${s ?? ''}`} className="block h-[calc(100vh-3.5rem)] w-full border-0" />;
}
