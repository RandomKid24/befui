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

/** Finds the one number in a label like "₹4.2L" or "1,284 users". Null when there is none or more than one ("9:00", "3 / 10"). */
export function splitCount(text: string) {
  const found = text.match(/\d+(?:,\d+)*(?:\.\d+)?/g);
  if (found?.length !== 1 || /^0\d/.test(found[0])) return null;
  const raw = found[0];
  const at = text.indexOf(raw);
  const decimals = raw.split('.')[1]?.length ?? 0;
  // keep the grouping the text came with: 12,34,567 is Indian, 1,234,567 is not
  const locale = /\d,\d{2},\d{3}/.test(raw) ? 'en-IN' : 'en-US';
  return {
    prefix: text.slice(0, at),
    suffix: text.slice(at + raw.length),
    value: Number(raw.replace(/,/g, '')),
    format: (n: number) => n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: raw.includes(',') }),
  };
}

/** Already formatted text whose number counts up the first time it is seen, and eases to the new one when it changes. */
export function CountText({ children, duration = 900 }: { children: string | number; duration?: number }) {
  const text = String(children);
  const ref = React.useRef<HTMLSpanElement>(null);
  const shown = React.useRef<number | null>(null);
  const [frame, setFrame] = React.useState<string | null>(null);

  React.useEffect(() => {
    const parts = splitCount(text);
    const el = ref.current;
    // the real text is what renders unless we are sure we can animate it
    if (!parts || !el || typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return setFrame(null);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const from = shown.current ?? 0;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, Math.max(0, (now - t0) / duration));
        shown.current = from + (parts.value - from) * (1 - Math.pow(1 - p, 4));
        setFrame(p < 1 ? parts.prefix + parts.format(shown.current) + parts.suffix : null);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      tick(t0);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [text, duration]);

  return <span ref={ref} className="tabular-nums">{frame ?? text}</span>;
}
