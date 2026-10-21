'use client';

import * as React from 'react';
import { XIcon } from './icons';
import { cn } from '@/lib/utils';

/** Full-width announcement bar that collapses smoothly when dismissed. Pass `persistKey` to keep it dismissed across visits. */
export function Banner({ children, action, onDismiss, persistKey, className }: { children: React.ReactNode; action?: React.ReactNode; onDismiss?: () => void; /** Remember the dismissal in localStorage under this key, so the banner stays gone on the next visit. */ persistKey?: string; className?: string }) {
  const [open, setOpen] = React.useState(true);
  const store = persistKey ? `befui-banner:${persistKey}` : null;
  React.useEffect(() => {
    try { if (store && localStorage.getItem(store)) setOpen(false); } catch { /* storage blocked: show it every time */ }
  }, [store]);
  return (
    <div className={cn('grid transition-[grid-template-rows,opacity] duration-300', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0', className)}>
      <div className="overflow-hidden">
        <div className="relative flex items-center justify-center gap-3 bg-primary px-10 py-2 text-center text-[13px] font-medium text-primary-foreground">
          <span>{children}</span>
          {action}
          <button type="button" aria-label="Dismiss" onClick={() => { setOpen(false); try { if (store) localStorage.setItem(store, '1'); } catch { /* ignore */ } onDismiss?.(); }} className="absolute right-3 rounded p-1 hover:bg-primary-foreground/20">
            <XIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
