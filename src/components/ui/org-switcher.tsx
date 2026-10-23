'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from './icons';

export interface Org { id: string; name: string; plan?: string; logo?: string }

/**
 * The workspace dropdown at the top of a sidebar: current workspace with its plan, a menu to switch, and an optional
 * "Create workspace" row. Controlled with `value` (the id) and `onChange`.
 */
export function OrgSwitcher({
  orgs,
  value,
  onChange,
  onCreate,
  className,
}: {
  orgs: Org[];
  value: string;
  onChange: (id: string) => void;
  onCreate?: () => void;
  className?: string;
}) {
  const cur = orgs.find((o) => o.id === value) ?? orgs[0];
  if (!cur) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={`Workspace: ${cur.name}`} className={cn('flex w-64 max-w-full items-center gap-2.5 rounded-lg border bg-card p-2 text-start outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-secondary', className)}>
          <Avatar name={cur.name} src={cur.logo} shape="square" size="sm" />
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium leading-tight">{cur.name}</span>{cur.plan && <span className="block truncate text-xs text-muted-foreground">{cur.plan}</span>}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="px-2 py-1 text-xs font-normal text-muted-foreground">Workspaces</DropdownMenuLabel>
        {orgs.map((o) => (
          <DropdownMenuItem key={o.id} onSelect={() => onChange(o.id)}>
            <Avatar name={o.name} src={o.logo} shape="square" size="xs" />
            <span className="flex-1 truncate">{o.name}</span>
            {o.id === cur.id && <CheckIcon className="!text-primary" />}
          </DropdownMenuItem>
        ))}
        {onCreate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onCreate}><PlusIcon />Create workspace</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
