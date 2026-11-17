'use client';

import * as React from 'react';
import { Avatar } from './avatar';
import { ChevronRightIcon, SearchIcon, SettingsIcon } from './icons';
import { Kbd } from './kbd';
import { cn } from '@/lib/utils';

export interface WorkspaceItem { id: string; label: string; icon?: React.ReactNode; /** Unread or open count. */ count?: number }
export interface WorkspaceGroup { id: string; label: string; items: WorkspaceItem[]; /** Start collapsed. */ collapsed?: boolean }

/**
 * The everyday app sidebar: your workspace on top (pass `header`, e.g. an OrgSwitcher), a search button, collapsible groups
 * like Favorites and Projects with counts, and you plus settings at the bottom.
 */
export function SidebarWorkspace({ header, groups, value, onChange, onSearch, user, onSettings, className }: {
  header?: React.ReactNode;
  groups: WorkspaceGroup[];
  value: string;
  onChange: (id: string) => void;
  onSearch?: () => void;
  user?: { name: string; email?: string };
  onSettings?: () => void;
  className?: string;
}) {
  const [shut, setShut] = React.useState(() => new Set(groups.filter((g) => g.collapsed).map((g) => g.id)));
  const flip = (id: string) => setShut((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <nav aria-label="Workspace" className={cn('flex w-64 shrink-0 flex-col border-r bg-card', className)}>
      {header && <div className="p-3 pb-0">{header}</div>}
      {onSearch && (
        <button type="button" onClick={onSearch} className="mx-3 mt-3 flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-[13px] text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
          <SearchIcon className="size-4" /> Search <Kbd className="ml-auto">⌘K</Kbd>
        </button>
      )}
      <div className="flex-1 overflow-y-auto p-3">
        {groups.map((g) => {
          const closed = shut.has(g.id);
          return (
            <section key={g.id} className="mb-3">
              <button type="button" aria-expanded={!closed} onClick={() => flip(g.id)} className="flex w-full items-center gap-1 rounded px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">
                <ChevronRightIcon className={cn('size-3 transition-transform', !closed && 'rotate-90')} /> {g.label}
              </button>
              {!closed && (
                <ul className="mt-0.5 grid gap-0.5">
                  {g.items.map((it) => (
                    <li key={it.id}>
                      <button type="button" aria-current={it.id === value ? 'page' : undefined} onClick={() => onChange(it.id)} className={cn('flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4 [&_svg]:shrink-0', it.id === value ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                        {it.icon}
                        <span className="min-w-0 flex-1 truncate">{it.label}</span>
                        {!!it.count && <span className="rounded-full bg-primary/10 px-1.5 text-[11px] font-medium tabular-nums text-primary">{it.count}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
      {user && (
        <div className="flex items-center gap-2.5 border-t p-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium">{user.name}</p>
            {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
          </div>
          {onSettings && <button type="button" aria-label="Settings" onClick={onSettings} className="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"><SettingsIcon className="size-4" /></button>}
        </div>
      )}
    </nav>
  );
}
