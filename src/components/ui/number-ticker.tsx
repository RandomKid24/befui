'use client';

import * as React from 'react';

/** Shows `value` from the first paint and eases to the new number when it changes. Pass `countUp` to also count from 0 once it scrolls into view. */
export function NumberTicker({
  value,
  duration = 1200,
  decimals = 0,
  countUp = false,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  countUp?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const from = React.useRef(countUp ? 0 : value);
  const [shown, setShown] = React.useState(countUp ? 0 : value);
  const [seen, setSeen] = React.useState(!countUp);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !countUp) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()));
    io.observe(el);
    return () => io.disconnect();
  }, [countUp]);

  React.useEffect(() => {
    if (!seen || from.current === value) return;
    const start = from.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min((now - t0) / duration, 1);
      const v = start + (value - start) * (1 - Math.pow(1 - p, 4));
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {shown.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
