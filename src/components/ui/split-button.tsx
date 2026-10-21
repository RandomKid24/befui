'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import { ChevronDownIcon } from './icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

export interface SplitAction {
  label: string;
  onSelect: () => void;
}

/** A button with a menu of related actions attached: the main part runs the usual action, the arrow opens the others (Save, Save as draft). */
export function SplitButton({ children, onClick, actions, variant = 'primary', size = 'md', className }: { children: React.ReactNode; onClick?: () => void; actions: SplitAction[]; variant?: ButtonProps['variant']; size?: ButtonProps['size']; className?: string }) {
  return (
    <div className={cn('inline-flex', className)}>
      <Button variant={variant} size={size} onClick={onClick} className="rounded-r-none">{children}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} aria-label="More actions" className="rounded-l-none border-l border-l-background/25 px-2"><ChevronDownIcon className="size-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((a) => <DropdownMenuItem key={a.label} onSelect={a.onSelect}>{a.label}</DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
