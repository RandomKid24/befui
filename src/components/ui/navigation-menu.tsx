'use client';

import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from './icons';
import { cn } from '@/lib/utils';

/** Top-bar menu whose triggers open panels in one shared, resizing viewport. Small screens are the navbar's job. */
export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root ref={ref} className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center self-center', className)} {...props}>
    {children}
    <div className="absolute start-0 top-full flex w-full justify-center">
      <NavigationMenuPrimitive.Viewport className="relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg transition-[width,height] duration-(--dur-base) md:w-[var(--radix-navigation-menu-viewport-width)]" />
    </div>
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List ref={ref} className={cn('flex flex-1 list-none items-center justify-center gap-1', className)} {...props} />
));
NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

const triggerStyle =
  'group inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-secondary data-[state=open]:text-foreground';

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger ref={ref} className={cn(triggerStyle, className)} {...props}>
    {children}
    <ChevronDownIcon className="size-3.5 transition-transform duration-(--dur-base) group-data-[state=open]:rotate-180" aria-hidden />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content ref={ref} className={cn('w-full p-3 animate-pop md:w-max', className)} {...props} />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

/** A link inside a panel, or a plain top-level link (pass `className={navigationMenuTriggerStyle}` for one that looks like a trigger). */
export const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={cn('block rounded-md p-3 text-sm outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary data-[active]:bg-accent', className)}
    {...props}
  />
));
NavigationMenuLink.displayName = 'NavigationMenuLink';

export const navigationMenuTriggerStyle = triggerStyle;
