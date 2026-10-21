'use client';

import * as React from 'react';
import * as P from '@radix-ui/react-popover';
import { Button } from './button';

/**
 * A single "new feature" hint pinned to one element: wrap the element, give a title and a line, and a small bubble with a Got it button
 * appears beside it once. Lighter than the tour. Pass `persistKey` to remember it was dismissed, so users only see it once.
 */
export function Coachmark({ title, description, persistKey, open: openProp, onDismiss, side = 'bottom', children }: { title: string; description?: string; persistKey?: string; open?: boolean; onDismiss?: () => void; side?: 'top' | 'right' | 'bottom' | 'left'; children: React.ReactNode }) {
  const store = persistKey ? `befui-coachmark:${persistKey}` : null;
  const [seen, setSeen] = React.useState(true); // hidden until we know, so it never flashes
  React.useEffect(() => {
    let was = false;
    try { was = !!(store && localStorage.getItem(store)); } catch { /* storage blocked: show it */ }
    setSeen(was);
  }, [store]);
  const open = (openProp ?? true) && !seen;
  const dismiss = () => { setSeen(true); try { if (store) localStorage.setItem(store, '1'); } catch { /* ignore */ } onDismiss?.(); };
  return (
    <P.Root open={open} onOpenChange={(o) => !o && dismiss()}>
      <P.Anchor asChild>{children}</P.Anchor>
      <P.Portal>
        <P.Content side={side} sideOffset={10} onOpenAutoFocus={(e) => e.preventDefault()} className="z-50 w-64 rounded-xl bg-primary p-3.5 text-primary-foreground shadow-lg animate-pop">
          <p className="text-sm font-semibold">{title}</p>
          {description ? <p className="mt-1 text-xs opacity-90">{description}</p> : null}
          <Button size="sm" variant="secondary" className="mt-3" onClick={dismiss}>Got it</Button>
          <P.Arrow className="fill-primary" />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
