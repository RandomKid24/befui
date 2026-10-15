'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Text that arrives word by word, each word fading up out of a soft blur, with a caret that follows the last word.
 * Pass the whole `text` and a `speed` in words per second; or grow `text` yourself as tokens arrive and set `speed` high.
 * Screen readers get the full text at once, not the animation. Reduced motion shows everything immediately.
 */
export function StreamingText({
  text,
  speed = 14,
  caret = true,
  onDone,
  className,
}: {
  text: string;
  /** Words per second. */
  speed?: number;
  caret?: boolean;
  onDone?: () => void;
  className?: string;
}) {
  const words = React.useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [shown, setShown] = React.useState(reduce ? words.length : 0);
  const done = shown >= words.length;
  React.useEffect(() => {
    if (reduce) { setShown(words.length); return; }
    if (shown >= words.length) { onDone?.(); return; }
    // spaces are tokens too, so a word is two steps
    const id = setTimeout(() => setShown((n) => Math.min(words.length, n + 2)), 1000 / speed);
    return () => clearTimeout(id);
  }, [shown, words.length, speed, reduce, onDone]);
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.slice(0, shown).map((w, i) => (
          <span key={i} className={/^\s+$/.test(w) ? undefined : 'animate-stream-in inline-block motion-reduce:animate-none'} style={{ whiteSpace: 'pre-wrap' }}>{w}</span>
        ))}
        {caret && !done && <span className="ms-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] animate-pulse bg-primary" />}
      </span>
    </span>
  );
}
