import * as React from 'react';

/** Tiny hash router so the site deploys to any static host with no rewrite rules. */
const read = () => (window.location.hash.replace(/^#/, '') || '/').split('?')[0];

export function useRoute() {
  const [path, setPath] = React.useState(read);
  // a transition keeps the page you are on until the next one has loaded, instead of flashing a placeholder
  const [pending, start] = React.useTransition();
  React.useEffect(() => {
    const on = () => start(() => setPath(read()));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  // scroll once the new page is on screen, not while the old one is still showing
  const first = React.useRef(true);
  React.useLayoutEffect(() => {
    if (first.current) first.current = false;
    else window.scrollTo({ top: 0 });
  }, [path]);
  // the shell draws a thin bar from this while a slow page loads
  React.useEffect(() => { document.documentElement.toggleAttribute('data-routing', pending); }, [pending]);
  return path;
}

export const go = (to: string) => {
  window.location.hash = to;
};

export function Link({ to, ...props }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }) {
  return <a href={`#${to}`} {...props} />;
}
