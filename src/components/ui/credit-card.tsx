'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const look = {
  primary: 'bg-primary text-primary-foreground',
  contrast: 'bg-foreground text-background',
  light: 'border bg-card text-card-foreground',
};

/**
 * Payment card preview that flips in 3D to show the CVV (checkout, wallet page, add-card form). Feed it the form values and it formats them as you type.
 * Click or press Enter to flip, or control it with `flipped`. Shows the last 4 digits only when `mask` is on. Brand is guessed from the number.
 */
export function CreditCard({
  number = '',
  name = '',
  expiry = '',
  cvv = '',
  mask = false,
  flipped,
  onFlip,
  theme = 'contrast',
  className,
}: {
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
  mask?: boolean;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  theme?: keyof typeof look;
  className?: string;
}) {
  const [own, setOwn] = React.useState(false);
  const back = flipped ?? own;
  const digits = number.replace(/\D/g, '');
  const brand = /^4/.test(digits) ? 'VISA' : /^(5[1-5]|2[2-7])/.test(digits) ? 'Mastercard' : /^3[47]/.test(digits) ? 'AMEX' : /^(60|65|81|82)/.test(digits) ? 'RuPay' : '';
  const padded = digits.padEnd(16, '•').slice(0, 16);
  const groups = [0, 4, 8, 12].map((i) => padded.slice(i, i + 4));
  const shown = mask ? groups.map((g, i) => (i < 3 ? '••••' : g)) : groups;
  const flip = () => { const next = !back; setOwn(next); onFlip?.(next); };

  return (
    <div className={cn('aspect-[1.586] w-80 max-w-full [perspective:1000px]', className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label={back ? 'Show card front' : 'Show card back'}
        onClick={flip}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), flip())}
        className="relative size-full cursor-pointer rounded-2xl outline-none transition-transform duration-(--dur-slow) ease-[cubic-bezier(0.34,1.2,0.64,1)] [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-ring/50"
        style={{ transform: back ? 'rotateY(180deg)' : 'rotateY(0)' }}
      >
        <div className={cn('absolute inset-0 grid grid-rows-[auto_1fr_auto] rounded-2xl p-5 shadow-lg [backface-visibility:hidden]', look[theme])}>
          <div className="flex items-start justify-between">
            <span className="h-7 w-9 rounded-md bg-current opacity-30" aria-hidden />
            <span className="text-sm font-semibold italic tracking-wide opacity-90">{brand}</span>
          </div>
          <div className="self-center font-mono text-[17px] tracking-[0.12em] tabular-nums">{shown.join(' ')}</div>
          <div className="flex items-end justify-between gap-3 text-xs">
            <span className="grid min-w-0"><span className="text-[10px] uppercase opacity-60">Card holder</span><span className="truncate font-medium uppercase tracking-wide">{name || 'Your name'}</span></span>
            <span className="grid text-right"><span className="text-[10px] uppercase opacity-60">Expires</span><span className="font-medium tabular-nums">{expiry || 'MM/YY'}</span></span>
          </div>
        </div>
        <div className={cn('absolute inset-0 overflow-hidden rounded-2xl shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]', look[theme])}>
          <div className="mt-6 h-10 bg-black/70" />
          <div className="mx-5 mt-5 grid gap-1 text-right">
            <span className="text-[10px] uppercase opacity-60">CVV</span>
            <span className="rounded-md bg-background/90 px-3 py-1.5 font-mono text-sm tracking-widest text-foreground">{cvv ? (mask ? '•'.repeat(cvv.length) : cvv) : '•••'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
