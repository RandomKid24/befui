'use client';

import * as React from 'react';
import * as D from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

type Side = 'bottom' | 'top' | 'left' | 'right';

const place: Record<Side, string> = {
  bottom: 'inset-x-0 bottom-0 mx-auto max-h-[85dvh] w-full max-w-lg rounded-t-2xl border-t',
  top: 'inset-x-0 top-0 mx-auto max-h-[85dvh] w-full max-w-lg rounded-b-2xl border-b',
  left: 'inset-y-0 left-0 w-[min(24rem,90vw)] rounded-r-2xl border-r',
  right: 'inset-y-0 right-0 w-[min(24rem,90vw)] rounded-l-2xl border-l',
};
const sign = { bottom: 1, right: 1, top: -1, left: -1 } as const;

/**
 * Drawer that slides in from any edge and follows your finger or mouse: drag the grip toward the edge to dismiss it.
 * On `side="bottom"`, `snapPoints` (fractions of its height, e.g. [0.4, 1]) let it rest half open and be dragged to full.
 * Radix Dialog underneath (focus trap, Escape, backdrop click). Keep a title for screen readers.
 */
export function Drawer({ open, onOpenChange, side = 'bottom', title, description, snapPoints = [1], children, className }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: Side;
  title: string;
  description?: string;
  /** Resting heights as fractions of the drawer, smallest first. Bottom only. */
  snapPoints?: number[];
  children?: React.ReactNode;
  className?: string;
}) {
  const snaps = side === 'bottom' ? snapPoints : [1];
  const [mounted, setMounted] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  const [snap, setSnap] = React.useState(0);
  const [drag, setDrag] = React.useState<number | null>(null);
  const start = React.useRef({ at: 0, size: 0 });
  const vertical = side === 'bottom' || side === 'top';

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      setSnap(0);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pct = shown ? (1 - snaps[snap]!) * 100 : 100;
  const move = vertical ? 'translateY' : 'translateX';
  const visibleNow = snaps[snap]! - (drag ?? 0) / (start.current.size || 1);
  const progress = shown ? Math.min(1, Math.max(0, visibleNow)) : 0;
  // drag is pixels toward the edge (positive closes); pulling the other way stops once fully open
  const onDrag = (d: number) => setDrag(Math.max(d, -(1 - snaps[snap]!) * start.current.size));

  const end = () => {
    if (drag === null) return;
    const visible = visibleNow; // fraction still showing
    const nearest = snaps.reduce((b, s, i) => (Math.abs(s - visible) < Math.abs(snaps[b]! - visible) ? i : b), 0);
    setDrag(null);
    if (visible < snaps[0]! * 0.6) onOpenChange(false);
    else setSnap(nearest);
  };

  return (
    <D.Root open={mounted} onOpenChange={(o) => !o && onOpenChange(false)}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" style={{ opacity: progress, transition: drag === null ? 'opacity 300ms' : 'none' }} />
        <D.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          style={{ transform: `${move}(calc(${pct * sign[side]}% + ${(drag ?? 0) * sign[side]}px))`, transition: drag === null ? 'transform 300ms cubic-bezier(0.22,1,0.36,1)' : 'none', ...(side === 'bottom' && snapPoints.length > 1 ? { height: '85dvh' } : null) }}
          className={cn('fixed z-50 flex flex-col border bg-popover shadow-xl outline-none', vertical ? 'pb-[max(1rem,env(safe-area-inset-bottom))]' : 'pt-4', place[side], className)}
        >
          {side === 'top' ? null : <Grip side={side} start={start} active={drag !== null} onDrag={onDrag} setDrag={setDrag} end={end} />}
          <div className={cn('grid gap-1 px-5 pb-3', side === 'top' && 'pt-4')}>
            <D.Title className="text-base font-semibold">{title}</D.Title>
            {description ? <D.Description className="text-[13px] text-muted-foreground">{description}</D.Description> : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5" style={side === 'bottom' && snapPoints.length > 1 ? { maxHeight: `calc(${snaps[snap]} * 85dvh - 6rem)`, transition: 'max-height 300ms' } : undefined}>{children}</div>
          {side === 'top' ? <Grip side={side} start={start} active={drag !== null} onDrag={onDrag} setDrag={setDrag} end={end} /> : null}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

/** The drag handle: a bar on bottom and top drawers, a vertical pill on the inner edge of side drawers. */
function Grip({ side, start, active, onDrag, setDrag, end }: { side: Side; start: React.MutableRefObject<{ at: number; size: number }>; active: boolean; onDrag: (n: number) => void; setDrag: (n: number | null) => void; end: () => void }) {
  const vertical = side === 'bottom' || side === 'top';
  const axis = (e: React.PointerEvent) => (vertical ? e.clientY : e.clientX);
  return (
    <div
      className={cn('grid cursor-grab touch-none place-items-center active:cursor-grabbing', vertical ? 'py-3' : 'absolute inset-y-0 w-5', side === 'left' && 'right-0', side === 'right' && 'left-0')}
      onPointerDown={(e) => {
        const panel = e.currentTarget.closest<HTMLElement>('[role="dialog"]')!;
        start.current = { at: axis(e), size: vertical ? panel.offsetHeight : panel.offsetWidth };
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(0);
      }}
      onPointerMove={(e) => active && onDrag((axis(e) - start.current.at) * sign[side])}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <span className={cn('rounded-full bg-muted-foreground/30', vertical ? 'h-1.5 w-10' : 'h-10 w-1.5')} />
    </div>
  );
}
