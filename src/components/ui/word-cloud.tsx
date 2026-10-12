import * as React from 'react';
import { cn } from '@/lib/utils';
import { useChartIn } from './charts';

const palette = ['text-primary', 'text-success', 'text-warning', 'text-info', 'text-destructive'];
const W = 600;

/**
 * Word cloud: words sized by how often they appear (survey answers, support topics, search terms). Biggest words sit in the middle.
 * Words fade and grow in biggest first on scroll; hover one to see its count and dim the rest. Pass `onSelect` to make words clickable filters.
 */
export function WordCloud({ words, height = 300, onSelect, className }: { words: { text: string; value: number; color?: string }[]; height?: number; onSelect?: (word: string) => void; className?: string }) {
  const [ref, on] = useChartIn<HTMLDivElement>();
  const [hover, setHover] = React.useState<string | null>(null);
  const placed = React.useMemo(() => {
    const sorted = [...words].sort((a, b) => b.value - a.value);
    const max = sorted[0]?.value ?? 1, min = sorted[sorted.length - 1]?.value ?? 0;
    const size = (v: number) => 14 + (max === min ? 1 : (v - min) / (max - min)) * 34;
    const boxes: { x: number; y: number; w: number; h: number }[] = [];
    return sorted.map((word, i) => {
      const fs = size(word.value);
      const w = word.text.length * fs * 0.56 + 8, h = fs * 1.05;
      let t = 0, x = 0, y = 0;
      for (; t < 3000; t++) {
        const a = t * 0.35, rad = 1.6 * t * 0.3;
        x = Math.cos(a) * rad * 1.5; y = Math.sin(a) * rad * 0.75; // wider than tall, like the frame
        if (boxes.every((b) => Math.abs(b.x - x) >= (b.w + w) / 2 || Math.abs(b.y - y) >= (b.h + h) / 2)) break;
      }
      boxes.push({ x, y, w, h });
      return { ...word, fs, x: W / 2 + x, y: height / 2 + y, i };
    });
  }, [words, height]);

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Word cloud: ${placed.slice(0, 5).map((p) => p.text).join(', ')}`} onMouseLeave={() => setHover(null)}>
        {placed.map((p, k) => (
          <text
            key={p.text}
            x={p.x}
            y={p.y}
            dy="0.35em"
            textAnchor="middle"
            fontSize={p.fs}
            fontWeight={p.fs > 30 ? 700 : 500}
            className={cn(p.color ?? palette[p.i % palette.length], onSelect && 'cursor-pointer')}
            fill="currentColor"
            onMouseEnter={() => setHover(p.text)}
            onClick={() => onSelect?.(p.text)}
            style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: on ? (hover === p.text ? 'scale(1.12)' : 'scale(1)') : 'scale(0.4)', opacity: on ? (hover && hover !== p.text ? 0.3 : 1) : 0, transition: `transform 600ms cubic-bezier(0.34,1.56,0.64,1) ${on && !hover ? k * 45 : 0}ms, opacity 400ms ease-out ${on && !hover ? k * 45 : 0}ms` }}
          >
            {p.text}
            {hover === p.text && <title>{`${p.text}: ${p.value}`}</title>}
          </text>
        ))}
      </svg>
    </div>
  );
}
