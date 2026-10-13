import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from './button';
import { Popover, PopoverAnchor, PopoverContent } from './popover';

export interface TourStep {
  /** A CSS selector or a ref to the element to spotlight. Steps whose element is not on the page are skipped. */
  target: string | React.RefObject<HTMLElement | null>;
  title: string;
  body?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export interface TourProps {
  steps: TourStep[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when the last step's Done button is pressed (not on Skip or Escape). */
  onFinish?: () => void;
}

/** The element if it is on the page and rendered (not display:none); null for a missing target or a selector that is not valid CSS. */
const resolve = (target: TourStep['target']): HTMLElement | null => {
  try {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target.current;
    return el && el.getClientRects().length > 0 ? el : null;
  } catch {
    return null;
  }
};

const typing = (e: KeyboardEvent) => (e.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable]') != null;

/** Spotlights parts of the real page one step at a time, with a card anchored to each. Arrow keys step, Escape closes. */
export function Tour({ steps, open, onOpenChange, onFinish }: TourProps) {
  const [index, setIndex] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const titleId = React.useId();
  const primary = React.useRef<HTMLButtonElement>(null);

  // Targets are looked up after every commit, not during render: when the Tour renders in the same pass as its targets, they are not in the DOM yet.
  // setVisible keeps the old array when nothing changed, so this does not loop.
  const [visible, setVisible] = React.useState<TourStep[]>([]);
  React.useLayoutEffect(() => {
    const next = open ? steps.filter((s) => resolve(s.target)) : [];
    setVisible((prev) => (prev.length === next.length && prev.every((s, k) => s === next[k]) ? prev : next));
  });
  const i = Math.min(index, visible.length - 1);
  const step = open ? visible[i] : undefined;
  const el = step ? resolve(step.target) : null;
  const active = Boolean(step && el);
  const last = i === visible.length - 1;

  React.useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  // Remember where focus was, and give it back when the tour ends. Radix cannot: there is no trigger.
  React.useLayoutEffect(() => {
    if (!active) return;
    const before = document.activeElement as HTMLElement | null;
    return () => before?.focus?.();
  }, [active]);

  // After each step change the pressed button unmounts or changes meaning; keep focus on the primary action so Enter moves on.
  React.useEffect(() => {
    if (active) primary.current?.focus();
  }, [active, i]);

  React.useEffect(() => {
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    const measure = () => setRect(el.getBoundingClientRect());
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      observer.disconnect();
    };
  }, [el]);

  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (typing(e)) return;
      if (e.key === 'ArrowRight') setIndex(() => Math.min(i + 1, visible.length - 1));
      if (e.key === 'ArrowLeft') setIndex(() => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, i, visible.length]);

  if (!step || !el) return null;

  return (
    <>
      {/* Portalled so a transformed ancestor cannot turn position:fixed into position relative to itself. */}
      {createPortal(
        <div
          aria-hidden
          data-tour-spotlight
          className="pointer-events-none fixed z-40 rounded-lg shadow-[0_0_0_9999px_rgb(0_0_0/0.5)] transition-[top,left,width,height] duration-200"
          style={rect ? { top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 } : undefined}
        />,
        document.body,
      )}
      <Popover open onOpenChange={onOpenChange}>
        <PopoverAnchor virtualRef={{ current: el }} />
        <PopoverContent side={step.side ?? 'bottom'} aria-labelledby={titleId}
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            primary.current?.focus();
          }}
        >
          <div aria-live="polite">
            <p id={titleId} className="text-sm font-semibold">{step.title}</p>
            {step.body && <div className="mt-1 text-[13px] text-muted-foreground">{step.body}</div>}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{i + 1} of {visible.length}</span>
            <div className="ms-auto flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Skip</Button>
              {i > 0 && <Button variant="outline" size="sm" onClick={() => setIndex(i - 1)}>Back</Button>}
              {last ? (
                <Button ref={primary} size="sm" onClick={() => { onFinish?.(); onOpenChange(false); }}>Done</Button>
              ) : (
                <Button ref={primary} size="sm" onClick={() => setIndex(i + 1)}>Next</Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
