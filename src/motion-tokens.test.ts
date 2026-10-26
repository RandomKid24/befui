import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : f.endsWith('.tsx') ? [join(d, f)] : []));

describe('motion tokens', () => {
  it('components never use transition-all', () => {
    expect(walk('src/components').filter((f) => /\btransition-all\b/.test(readFileSync(f, 'utf8')))).toEqual([]);
  });

  it('components use duration-(--dur-*) instead of hard-coded common durations', () => {
    const bad = walk('src/components').filter((f) => /\bduration-(100|150|200|300|500|600|700|1000)\b/.test(readFileSync(f, 'utf8')));
    expect(bad).toEqual([]);
  });
});

describe('reduced motion', () => {
  it("JS smooth scrolling checks prefers-reduced-motion (CSS media query cannot reach it)", () => {
    const bad = walk('src/components').filter((f) => {
      const s = readFileSync(f, 'utf8');
      return /behavior:\s*'smooth'/.test(s) && !/prefers-reduced-motion/.test(s);
    });
    expect(bad).toEqual([]);
  });
});
