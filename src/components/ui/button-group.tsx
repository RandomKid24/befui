import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

/** Joins buttons into one row or column: shared borders, rounded outer corners only. */
export function ButtonGroup({ orientation = 'horizontal', className, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex [&>*]:relative [&>*]:focus-visible:z-10',
        orientation === 'horizontal'
          ? '[&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none'
          : 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
        className,
      )}
      {...props}
    />
  );
}
