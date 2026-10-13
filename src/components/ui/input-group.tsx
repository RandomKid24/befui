import * as React from 'react';
import { cn } from '@/lib/utils';

/** One bordered field that holds addons and an input, with a single focus ring around the row. Put children in reading order. */
export function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-9 w-full items-stretch overflow-hidden rounded-md border border-input bg-background text-sm shadow-[0_1px_1px_rgb(0_0_0/0.02)] transition-[border,box-shadow] hover:border-muted-foreground/40 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/15 has-[input:disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

/** Borderless input for use inside InputGroup. */
export const InputGroupInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn('min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed', className)}
      {...props}
    />
  ),
);
InputGroupInput.displayName = 'InputGroupInput';

export interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which edge of the field it sits on, so the divider goes on the inner side. */
  side?: 'start' | 'end';
}

/** Text, an icon or a small button attached to one end of an InputGroup. */
export function InputAddon({ side = 'start', className, ...props }: InputAddonProps) {
  return (
    <div
      className={cn('flex shrink-0 items-center gap-1.5 bg-muted px-3 text-muted-foreground [&_svg]:size-4', side === 'start' ? 'border-e' : 'border-s', className)}
      {...props}
    />
  );
}
