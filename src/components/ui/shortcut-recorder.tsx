'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Kbd } from './kbd';
import { XIcon } from './icons';

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const NAMES: Record<string, string> = { ' ': 'Space', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Escape: 'Esc', Enter: 'Enter', Tab: 'Tab', Backspace: 'Backspace', Delete: 'Delete' };

/** What the key press is called in the saved value: `Mod+Shift+K`. Mod is Cmd on Mac and Ctrl elsewhere. */
function combo(e: React.KeyboardEvent): string | null {
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return null;
  const k = NAMES[e.key] ?? (e.key.length === 1 ? e.key.toUpperCase() : e.key);
  return [e.metaKey || e.ctrlKey ? 'Mod' : '', e.altKey ? 'Alt' : '', e.shiftKey ? 'Shift' : '', k].filter(Boolean).join('+');
}
const show = (v: string) => v.split('+').map((p) => (p === 'Mod' ? (isMac() ? '⌘' : 'Ctrl') : p === 'Alt' && isMac() ? '⌥' : p === 'Shift' && isMac() ? '⇧' : p));

/**
 * A field that records a keyboard shortcut: focus it, press the keys you want, and it shows them as keycaps. Esc cancels, Backspace
 * clears. `value` looks like `Mod+Shift+K` (Mod is Cmd on Mac, Ctrl elsewhere), so you can save it and match it the same everywhere.
 * `requireModifier` (on by default) refuses bare letters so typing is never hijacked.
 */
export function ShortcutRecorder({ value, onChange, requireModifier = true, placeholder = 'Click, then press keys', className }: { value?: string; onChange?: (v: string | undefined) => void; requireModifier?: boolean; placeholder?: string; className?: string }) {
  const [rec, setRec] = React.useState(false);
  const [hint, setHint] = React.useState('');
  const key = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!rec) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRec(true); } return; }
    e.preventDefault();
    if (e.key === 'Escape') { setRec(false); setHint(''); return; }
    if (e.key === 'Backspace' && !e.metaKey && !e.ctrlKey) { onChange?.(undefined); setRec(false); setHint(''); return; }
    const c = combo(e);
    if (!c) return;
    if (requireModifier && !/^(Mod|Alt)\+/.test(c) && !/^F\d+$/.test(c)) { setHint('Add Ctrl, Cmd or Alt so it does not clash with typing.'); return; }
    onChange?.(c); setRec(false); setHint('');
  };
  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="flex w-64 max-w-full items-center gap-1">
        <button
          type="button"
          aria-label={value ? `Shortcut ${show(value).join(' ')}. Press to change.` : 'Record shortcut'}
          aria-pressed={rec}
          onClick={() => setRec(true)}
          onBlur={() => { setRec(false); setHint(''); }}
          onKeyDown={key}
          className={cn('flex h-9 min-w-0 flex-1 items-center gap-1 rounded-md border border-input bg-background px-3 text-sm outline-none transition-[border,box-shadow] hover:border-muted-foreground/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15', rec && 'border-primary ring-3 ring-primary/20')}
        >
          {rec ? <span className="text-primary">Press keys...</span> : value ? show(value).map((p, i) => <Kbd key={i}>{p}</Kbd>) : <span className="text-muted-foreground/70">{placeholder}</span>}
        </button>
        {value && !rec && <button type="button" aria-label="Clear shortcut" onClick={() => onChange?.(undefined)} className="grid size-8 place-items-center rounded-md text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"><XIcon className="size-4" /></button>}
      </div>
      <p role="status" className="min-h-4 text-xs text-muted-foreground">{hint || (rec ? 'Esc to cancel, Backspace to clear.' : '')}</p>
    </div>
  );
}
