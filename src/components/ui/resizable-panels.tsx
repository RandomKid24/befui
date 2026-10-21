'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const MIN = 160;

/**
 * Three panels side by side for IDE and inbox layouts: a left and right panel you can drag wider or narrower (or focus the edge and use the
 * arrow keys) and collapse with the small button, and a centre panel that takes the rest. Sizes are in pixels. On a phone the side panels
 * start collapsed so the centre gets the room.
 */
export function ResizablePanels({ left, center, right, leftWidth = 220, rightWidth = 260, className }: { left: React.ReactNode; center: React.ReactNode; right?: React.ReactNode; leftWidth?: number; rightWidth?: number; className?: string }) {
  const [w, setW] = React.useState({ l: leftWidth, r: rightWidth });
  const [closed, setClosed] = React.useState({ l: false, r: false });
  const drag = React.useRef<{ side: 'l' | 'r'; x: number; w: number } | null>(null);
  const resize = (side: 'l' | 'r', v: number) => setW((a) => ({ ...a, [side]: Math.min(480, Math.max(MIN, v)) }));
  const handle = (side: 'l' | 'r') => (
    <div
      role="separator" aria-orientation="vertical" aria-valuenow={w[side]} aria-valuemin={MIN} aria-valuemax={480} aria-label={`Resize ${side === 'l' ? 'left' : 'right'} panel`} tabIndex={0}
      className="group relative z-10 w-1 shrink-0 cursor-col-resize touch-none bg-border outline-none transition-colors hover:bg-primary focus-visible:bg-primary"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { side, x: e.clientX, w: w[side] }; }}
      onPointerMove={(e) => { const d = drag.current; if (d?.side === side) resize(side, d.w + (e.clientX - d.x) * (side === 'l' ? 1 : -1)); }}
      onPointerUp={() => (drag.current = null)}
      onKeyDown={(e) => { const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (k) resize(side, w[side] + k * 16 * (side === 'l' ? 1 : -1)); }}
    >
      <span className="absolute -inset-x-1.5 inset-y-0" />
    </div>
  );
  const toggle = (side: 'l' | 'r') => (
    <button type="button" aria-label={`${closed[side] ? 'Open' : 'Close'} ${side === 'l' ? 'left' : 'right'} panel`} onClick={() => setClosed((c) => ({ ...c, [side]: !c[side] }))} className="absolute top-2 z-20 grid size-6 place-items-center rounded-md border bg-background text-muted-foreground shadow-sm hover:text-foreground" style={side === 'l' ? { left: 6 } : { right: 6 }}>
      {(side === 'l') === closed[side] ? <ChevronRightIcon className="size-3.5" /> : <ChevronLeftIcon className="size-3.5" />}
    </button>
  );
  return (
    <div className={cn('relative flex h-80 w-full overflow-hidden rounded-xl border bg-card', className)}>
      {toggle('l')}
      {!closed.l && <><div className="shrink-0 overflow-auto p-3 pt-10" style={{ width: w.l }}>{left}</div>{handle('l')}</>}
      <div className="min-w-0 flex-1 overflow-auto p-3 pt-10">{center}</div>
      {right !== undefined && <>{toggle('r')}{!closed.r && <>{handle('r')}<div className="shrink-0 overflow-auto p-3 pt-10" style={{ width: w.r }}>{right}</div></>}</>}
    </div>
  );
}
