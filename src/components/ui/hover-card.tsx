'use client';

import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';

/**
 * Preview card that opens on hover or keyboard focus. Opens after 200 ms and closes after 100 ms unless you pass other delays.
 * The card itself cannot be reached with the keyboard or announced reliably by screen readers, so keep links, buttons and
 * anything essential out of it: the trigger must already carry the same information or action.
 */
export function HoverCard({ openDelay = 200, closeDelay = 100, ...props }: HoverCardPrimitive.HoverCardProps) {
  return <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}

export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 8, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn('z-50 w-64 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg outline-none animate-pop', className)}
      {...props}
    />
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = 'HoverCardContent';
