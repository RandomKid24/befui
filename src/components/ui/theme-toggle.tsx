'use client';

import * as React from 'react';
import { flushSync } from 'react-dom';
import { MoonIcon, SunIcon } from './icons';
import { Button } from './button';

type ViewTransitions = Document & { startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void> } };

/** Runs `apply` so the new theme grows as a circle from (x, y). Instant where unsupported or when the person prefers reduced motion.
 *  The animation is the ::view-transition rules in befui's index.css; without them the browser cross-fades. */
function revealFrom(x: number, y: number, apply: () => void) {
  const doc = document as ViewTransitions;
  if (!doc.startViewTransition || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return apply();
  const root = document.documentElement.style;
  root.setProperty('--vt-x', `${x}px`);
  root.setProperty('--vt-y', `${y}px`);
  root.setProperty('--vt-r', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  const t = doc.startViewTransition(() => flushSync(apply));
  // a skipped transition rejects these; the theme has still changed
  for (const p of [t.ready, t.finished, t.updateCallbackDone]) p.catch(() => {});
}

/** Current theme and a setter. Toggles the `dark` class on <html> and remembers the choice in localStorage under "theme".
 *  Pass the click event to `toggle` and the new theme spreads from the clicked element. */
export function useTheme() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  const set = React.useCallback((next: boolean) => {
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* private mode */ }
    setDark(next);
  }, []);
  const toggle = (e?: React.MouseEvent) => {
    const box = e?.currentTarget.getBoundingClientRect();
    if (!box) return set(!dark);
    revealFrom(box.left + box.width / 2, box.top + box.height / 2, () => set(!dark));
  };
  return { dark, setDark: set, toggle };
}

/** Icon button that flips light and dark mode with a circular reveal. Drop it in a Topbar. */
export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon-sm" className={className} onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
