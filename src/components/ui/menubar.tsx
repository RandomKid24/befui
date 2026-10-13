'use client';

import * as React from 'react';
import * as M from '@radix-ui/react-menubar';
import { CheckIcon } from './icons';
import { cn } from '@/lib/utils';

export const MenubarMenu = M.Menu;

/** Desktop-app style bar of menus (File, Edit, View). Item styles match dropdown-menu. */
export const Menubar = React.forwardRef<React.ElementRef<typeof M.Root>, React.ComponentPropsWithoutRef<typeof M.Root>>(
  ({ className, ...props }, ref) => (
    <M.Root ref={ref} className={cn('flex h-9 items-center gap-1 rounded-lg border bg-background p-1', className)} {...props} />
  ),
);
Menubar.displayName = 'Menubar';

export const MenubarTrigger = React.forwardRef<React.ElementRef<typeof M.Trigger>, React.ComponentPropsWithoutRef<typeof M.Trigger>>(
  ({ className, ...props }, ref) => (
    <M.Trigger
      ref={ref}
      className={cn('flex cursor-pointer select-none items-center rounded-md px-3 py-1 text-sm font-medium outline-none hover:bg-secondary focus-visible:bg-secondary data-[state=open]:bg-secondary', className)}
      {...props}
    />
  ),
);
MenubarTrigger.displayName = 'MenubarTrigger';

export const MenubarContent = React.forwardRef<React.ElementRef<typeof M.Content>, React.ComponentPropsWithoutRef<typeof M.Content>>(
  ({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }, ref) => (
    <M.Portal>
      <M.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn('z-50 min-w-[12rem] overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg animate-pop', className)}
        {...props}
      />
    </M.Portal>
  ),
);
MenubarContent.displayName = 'MenubarContent';

export const MenubarItem = React.forwardRef<
  React.ElementRef<typeof M.Item>,
  React.ComponentPropsWithoutRef<typeof M.Item> & { destructive?: boolean }
>(({ className, destructive, ...props }, ref) => (
  <M.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-[13px] outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-secondary [&_svg]:size-4 [&_svg]:text-muted-foreground',
      destructive && 'text-destructive data-[highlighted]:bg-destructive/10 [&_svg]:text-destructive',
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = 'MenubarItem';

export const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof M.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof M.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <M.CheckboxItem
    ref={ref}
    className={cn('relative flex cursor-pointer select-none items-center rounded-md py-1.5 ps-8 pe-2 text-[13px] outline-none data-[highlighted]:bg-secondary', className)}
    {...props}
  >
    <span className="absolute start-2 grid size-4 place-items-center">
      <M.ItemIndicator>
        <CheckIcon className="size-3.5 text-primary" strokeWidth={3} />
      </M.ItemIndicator>
    </span>
    {children}
  </M.CheckboxItem>
));
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export const MenubarSeparator = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof M.Separator>) => (
  <M.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
);

export const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('ms-auto ps-4 font-mono text-[11px] text-muted-foreground', className)} {...props} />
);
