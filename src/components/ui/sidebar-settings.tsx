'use client';

import * as React from 'react';
import { useStretch } from './motion-hooks';
import { cn } from '@/lib/utils';

export interface SettingsGroup { label: string; items: { id: string; label: string; /** Red text, for things like Delete account. */ danger?: boolean }[] }

/** The plain text menu beside a settings page: small group headings, one line per page, the current one filled. No icons, so long labels stay readable. */
export function SidebarSettings({ groups, value, onChange, title = 'Settings', className }: {
  groups: SettingsGroup[];
  value: string;
  onChange: (id: string) => void;
  title?: string;
  className?: string;
}) {
  const nav = React.useRef<HTMLElement>(null);
  const { edge, style } = useStretch(nav, (el) => el.querySelector<HTMLElement>('[aria-current="page"]'), 'y');
  return (
    <nav ref={nav} aria-label={title} className={cn('relative w-56 shrink-0 border-r bg-card p-4', className)}>
      {edge && <span aria-hidden className="pointer-events-none absolute motion-reduce:!transition-none rounded-md bg-secondary" style={{ ...style, left: edge.left, width: edge.width }} />}
      <h2 className="mb-4 px-2 text-base font-semibold">{title}</h2>
      {groups.map((g) => (
        <section key={g.label} className="mb-5 last:mb-0">
          <h3 className="mb-1 px-2 text-xs font-medium text-muted-foreground">{g.label}</h3>
          <ul className="grid gap-0.5">
            {g.items.map((it) => (
              <li key={it.id}>
                <button type="button" aria-current={it.id === value ? 'page' : undefined} onClick={() => onChange(it.id)} className={cn('relative w-full rounded-md px-2 py-1.5 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50', it.id === value ? cn('font-medium text-foreground', !edge && 'bg-secondary') : it.danger ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>{it.label}</button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
