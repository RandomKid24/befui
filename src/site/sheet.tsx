import * as React from 'react';

/** The strip over each home page section: sheet number, the file or folder the section is about, and a rule. */
export function SheetHead({ n, tag }: { n: number; tag: string }) {
  return (
    <p className="mb-7 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
      <span className="font-medium tabular-nums text-primary">{String(n).padStart(2, '0')}</span>
      <span>{tag}</span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </p>
  );
}

const arm = 'relative h-2.5 flex-1 border-foreground/40 after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-foreground/40';

/** A dimension line as on a drawing: end ticks, and the measurement in the middle. */
export function Dim({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[11px] tabular-nums text-muted-foreground ${className}`}>
      <span aria-hidden className={`${arm} border-s`} />
      <span>{children}</span>
      <span aria-hidden className={`${arm} border-e`} />
    </p>
  );
}
