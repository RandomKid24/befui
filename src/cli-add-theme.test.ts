import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { expect, it } from 'vitest';

it('add --force never replaces an existing index.css', () => {
  const app = mkdtempSync(join(tmpdir(), 'befui-add-'));
  mkdirSync(join(app, 'src'));
  writeFileSync(join(app, 'package.json'), '{"name":"t"}');
  writeFileSync(join(app, 'src/index.css'), '/* my theme */\n');
  execFileSync('node', [resolve('bin/befui.mjs'), 'add', 'checkbox', '--force', '--no-install', '--from', resolve('public/r')], { cwd: app });
  expect(readFileSync(join(app, 'src/index.css'), 'utf8')).toBe('/* my theme */\n');
  expect(readFileSync(join(app, 'src/lib/utils.ts'), 'utf8')).toContain('cn');
  rmSync(app, { recursive: true, force: true });
});
