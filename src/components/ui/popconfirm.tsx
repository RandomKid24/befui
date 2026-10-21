'use client';

import * as React from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * A small "are you sure?" bubble anchored to the button that was pressed, lighter than an alert dialog. Wrap the trigger; `onConfirm`
 * runs when the user agrees and the bubble closes. Use `destructive` for deletes.
 */
export function Popconfirm({ title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', destructive, onConfirm, children }: { title: string; description?: string; confirmLabel?: string; cancelLabel?: string; destructive?: boolean; onConfirm: () => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-3.5" role="alertdialog" aria-label={title}>
        <p className="text-sm font-medium">{title}</p>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        <div className="mt-3 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>{cancelLabel}</Button>
          <Button size="sm" variant={destructive ? 'destructive' : 'primary'} onClick={() => { setOpen(false); onConfirm(); }}>{confirmLabel}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
