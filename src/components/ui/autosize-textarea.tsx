'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from './input';

/**
 * A textarea that grows with what is typed, up to `maxRows`, then scrolls. `maxLength` adds a live counter that turns red at the limit.
 * Works controlled (`value`) or not.
 */
export const AutosizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> & { minRows?: number; maxRows?: number; showCount?: boolean }
>(({ className, minRows = 2, maxRows = 10, showCount = true, maxLength, value, defaultValue, onChange, ...props }, ref) => {
  const inner = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => inner.current!);
  const [len, setLen] = React.useState(String(value ?? defaultValue ?? '').length);

  const fit = React.useCallback(() => {
    const el = inner.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 20;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    el.style.height = 'auto';
    const h = Math.min(Math.max(el.scrollHeight, line * minRows + pad), line * maxRows + pad);
    el.style.height = `${h}px`;
    el.style.overflowY = el.scrollHeight > h ? 'auto' : 'hidden';
  }, [minRows, maxRows]);

  React.useLayoutEffect(fit, [fit, value]);
  React.useEffect(() => {
    const el = inner.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let w = el.clientWidth;
    const ro = new ResizeObserver(() => { if (el.clientWidth !== w) { w = el.clientWidth; fit(); } });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  const count = maxLength !== undefined && showCount;
  return (
    <div className="relative">
      <Textarea
        ref={inner}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(e) => { setLen(e.target.value.length); fit(); onChange?.(e); }}
        className={cn('resize-none transition-[height] duration-(--dur-fast)', count && 'pb-7', className)}
        {...props}
      />
      {count && (
        <span aria-live="polite" className={cn('pointer-events-none absolute bottom-1.5 end-3 text-xs tabular-nums', len >= maxLength! ? 'text-destructive' : 'text-muted-foreground')}>
          {len}/{maxLength}
        </span>
      )}
    </div>
  );
});
AutosizeTextarea.displayName = 'AutosizeTextarea';
