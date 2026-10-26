import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : f.endsWith('.tsx') ? [join(d, f)] : []));

describe('motion tokens', () => {
  it('components use duration-(--dur-*) instead of hard-coded common durations', () => {
    const bad = walk('src/components').filter((f) => /\bduration-(100|150|200|300|700)\b/.test(readFileSync(f, 'utf8')));
    expect(bad).toEqual([]);
  });
});
