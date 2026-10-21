'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { SignaturePad } from './signature-pad';

/** Renders the typed name in a script font to a PNG data URL, the same kind of value the drawn pad gives. */
function typedToPng(text: string) {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 200;
  const g = c.getContext('2d')!;
  g.fillStyle = '#111';
  g.font = 'italic 64px "Snell Roundhand", "Brush Script MT", "Segoe Script", cursive';
  g.textBaseline = 'middle';
  g.fillText(text, 24, 100, 592);
  return c.toDataURL('image/png');
}

/**
 * A signature box that lets people sign either way: draw it with a mouse, finger or pen, or type their name and get it in a script font.
 * `onChange` gets a PNG data URL for both, or null when empty, so you store one kind of value.
 */
export function SignatureField({ onChange, className }: { onChange?: (dataUrl: string | null) => void; className?: string }) {
  const [mode, setMode] = React.useState<'draw' | 'type'>('draw');
  const [name, setName] = React.useState('');
  return (
    <div className={cn('grid gap-3', className)}>
      <div role="tablist" aria-label="How to sign" className="inline-flex w-fit rounded-lg bg-secondary p-1 text-sm">
        {(['draw', 'type'] as const).map((m) => (
          <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => { setMode(m); onChange?.(m === 'type' && name ? typedToPng(name) : null); }} className={cn('rounded-md px-3 py-1 capitalize transition-colors', mode === m ? 'bg-background font-medium shadow-sm' : 'text-muted-foreground')}>{m}</button>
        ))}
      </div>
      {mode === 'draw' ? (
        <SignaturePad onChange={onChange} />
      ) : (
        <div className="grid gap-2">
          <Input aria-label="Type your full name" placeholder="Type your full name" value={name} onChange={(e) => { setName(e.target.value); onChange?.(e.target.value.trim() ? typedToPng(e.target.value.trim()) : null); }} />
          <div className="grid h-24 place-items-center rounded-lg border bg-background px-4 text-center text-4xl text-foreground" style={{ fontFamily: '"Snell Roundhand", "Brush Script MT", "Segoe Script", cursive', fontStyle: 'italic' }}>
            {name || <span className="text-base text-muted-foreground/60" style={{ fontFamily: 'inherit', fontStyle: 'normal' }}>Your signature appears here</span>}
          </div>
        </div>
      )}
    </div>
  );
}
