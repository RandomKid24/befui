import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const itemVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:bg-secondary hover:text-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        outline: 'border text-muted-foreground hover:bg-secondary hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: { sm: 'h-8 px-2.5', md: 'h-9 px-3', icon: 'size-9' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

type Look = { variant: 'default' | 'outline'; size: 'sm' | 'md' | 'icon' };
const LookContext = React.createContext<Look>({ variant: 'default', size: 'md' });

export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & Partial<Look>;

/** Row of toggle buttons. `type="multiple"` lets several be pressed at once (formatting toolbars); `type="single"` keeps one. */
export const ToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => (
    <LookContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive.Root ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props} />
    </LookContext.Provider>
  ),
);
ToggleGroup.displayName = 'ToggleGroup';

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { variant, size } = React.useContext(LookContext);
  return <ToggleGroupPrimitive.Item ref={ref} className={cn(itemVariants({ variant, size }), className)} {...props} />;
});
ToggleGroupItem.displayName = 'ToggleGroupItem';
