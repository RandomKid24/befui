'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ResizableColumn<T> {
  key: keyof T & string;
  header: string;
  /** Starting width in pixels. Default 160. */
  width?: number;
  align?: 'left' | 'right';
}

/**
 * Table whose columns you can resize by dragging the edge of a header (or focusing the edge and using the arrow keys). Widths are in pixels,
 * never go below 60, and the table scrolls sideways when the columns add up wider than the card.
 */
export function ResizableTable<T extends Record<string, React.ReactNode>>({ columns, rows, className }: { columns: ResizableColumn<T>[]; rows: T[]; className?: string }) {
  const [w, setW] = React.useState(() => columns.map((c) => c.width ?? 160));
  const drag = React.useRef<{ i: number; x: number; w: number } | null>(null);
  const resize = (i: number, v: number) => setW((a) => a.map((x, k) => (k === i ? Math.max(60, v) : x)));
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border', className)}>
      <table className="text-[13px]" style={{ width: w.reduce((a, b) => a + b, 0), tableLayout: 'fixed' }}>
        <colgroup>{w.map((x, i) => <col key={i} style={{ width: x }} />)}</colgroup>
        <thead>
          <tr className="border-b bg-muted/40">
            {columns.map((c, i) => (
              <th key={c.key} className={cn('relative truncate px-3 py-2.5 text-xs font-medium text-muted-foreground', c.align === 'right' ? 'text-right' : 'text-left')}>
                {c.header}
                <span
                  role="separator" aria-orientation="vertical" aria-valuenow={w[i]} aria-valuemin={60} aria-label={`Resize ${c.header}`} tabIndex={0}
                  className="absolute inset-y-0 right-0 w-2 cursor-col-resize touch-none select-none after:absolute after:inset-y-2 after:right-0.5 after:w-px after:bg-border hover:after:bg-primary focus-visible:after:bg-primary focus-visible:outline-none"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { i, x: e.clientX, w: w[i]! }; }}
                  onPointerMove={(e) => drag.current?.i === i && resize(i, drag.current.w + e.clientX - drag.current.x)}
                  onPointerUp={() => (drag.current = null)}
                  onKeyDown={(e) => { if (e.key === 'ArrowLeft') resize(i, w[i]! - 12); if (e.key === 'ArrowRight') resize(i, w[i]! + 12); }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b last:border-0 hover:bg-muted/50">
              {columns.map((c) => <td key={c.key} className={cn('truncate px-3 py-2.5', c.align === 'right' && 'text-right tabular-nums')}>{r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
