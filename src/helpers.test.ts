import { describe, expect, it } from 'vitest';
import { nextRuns } from '@/components/ui/cron-builder';
import { formatDuration, parseDuration } from '@/components/ui/duration-input';
import { parseEnv } from '@/components/ui/kv-editor';

describe('cron-builder nextRuns', () => {
  const from = new Date(2026, 9, 23, 10, 0); // Fri 23 Oct 2026 10:00
  it('finds the next weekly run', () => {
    const [a, b] = nextRuns('0 9 * * 1', 2, from)!;
    expect([a!.getDay(), a!.getHours(), a!.getDate()]).toEqual([1, 9, 26]);
    expect(b!.getDate()).toBe(2);
  });
  it('handles steps and rejects junk', () => {
    expect(nextRuns('*/15 * * * *', 2, from)!.map((d) => d.getMinutes())).toEqual([15, 30]);
    expect(nextRuns('nope', 1, from)).toBeNull();
    expect(nextRuns('61 * * * *', 1, from)).toBeNull();
  });
});

describe('duration-input', () => {
  it('reads how people say it', () => {
    expect(parseDuration('1h 30m')).toBe(5400);
    expect(parseDuration('1h30m')).toBe(5400);
    expect(parseDuration('90m')).toBe(5400);
    expect(parseDuration('45')).toBe(2700);
    expect(parseDuration('2d')).toBe(172800);
    expect(parseDuration('1.5h')).toBe(5400);
    expect(parseDuration('soon')).toBeNull();
    expect(parseDuration('1h later')).toBeNull();
  });
  it('formats back', () => expect(formatDuration(5400)).toBe('1h 30m'));
});

describe('kv-editor parseEnv', () => {
  it('reads .env text', () => {
    expect(parseEnv('# c\nexport A=1\nB="two words"\n\nbad\nC=')).toEqual([{ key: 'A', value: '1' }, { key: 'B', value: 'two words' }, { key: 'C', value: '' }]);
  });
});
