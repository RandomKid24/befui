// Runs the real CLI against the generated registry in public/r, inside a throwaway project folder.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const from = join(root, 'public/r');

function project() {
  const dir = mkdtempSync(join(tmpdir(), 'befui-cli-'));
  const src = join(dir, 'src');
  const cli = (...args: string[]) => spawnSync(process.execPath, [join(root, 'bin/befui.mjs'), ...args, '--from', from, '--dir', src, '--no-install'], { cwd: dir, encoding: 'utf8' });
  const file = (rel: string) => join(src, rel);
  return { cli, file, src };
}

describe('befui diff', () => {
  it('says an untouched component is up to date', () => {
    const p = project();
    p.cli('add', 'button');
    const r = p.cli('diff', 'button');
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('button is up to date');
  });

  it('prints a unified diff with the local line as - and the latest line as +', () => {
    const p = project();
    p.cli('add', 'button');
    const path = p.file('components/ui/button.tsx');
    const latest = readFileSync(path, 'utf8');
    writeFileSync(path, latest.replace("'use client';", "'use client'; // my edit"));
    const r = p.cli('diff', 'button');
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/^-'use client'; \/\/ my edit$/m);
    expect(r.stdout).toMatch(/^\+'use client';$/m);
    expect(r.stdout).toContain('@@');
  });

  it('treats a CRLF copy of the same file as up to date', () => {
    const p = project();
    p.cli('add', 'button');
    const path = p.file('components/ui/button.tsx');
    writeFileSync(path, readFileSync(path, 'utf8').replace(/\n/g, '\r\n'));
    expect(p.cli('diff', 'button').stdout).toContain('button is up to date');
  });

  it('reports a component that is not installed, and fails for one the registry does not know', () => {
    const p = project();
    const missing = p.cli('diff', 'button');
    expect(missing.status).toBe(0);
    expect(missing.stdout).toMatch(/button.*not installed/);
    expect(p.cli('diff', 'definitely-not-a-component').status).not.toBe(0);
  });
});

describe('befui remove', () => {
  it('deletes the component file and leaves index.css and lib/utils.ts alone', () => {
    const p = project();
    p.cli('add', 'button');
    const utils = p.file('lib/utils.ts');
    expect(existsSync(utils)).toBe(true);
    const r = p.cli('remove', 'button');
    expect(r.status).toBe(0);
    expect(existsSync(p.file('components/ui/button.tsx'))).toBe(false);
    expect(existsSync(utils)).toBe(true);
  });

  it('refuses while another file imports it, and --force removes it', () => {
    const p = project();
    p.cli('add', 'password-input');
    const blocked = p.cli('remove', 'input');
    expect(blocked.status).not.toBe(0);
    expect(blocked.stderr + blocked.stdout).toContain('password-input.tsx');
    expect(existsSync(p.file('components/ui/input.tsx'))).toBe(true);
    expect(p.cli('remove', 'input', '--force').status).toBe(0);
    expect(existsSync(p.file('components/ui/input.tsx'))).toBe(false);
  });

  it('rejects names that could escape the folder or are not registry names, and deletes nothing', () => {
    const p = project();
    p.cli('add', 'button');
    for (const bad of ['../../etc/passwd', 'Button', 'a/b', '..']) expect(p.cli('remove', bad).status, bad).not.toBe(0);
    expect(existsSync(p.file('components/ui/button.tsx'))).toBe(true);
  });

  it('also refuses when a page outside components/ui imports it (absolute or relative), and removes two names that use each other', () => {
    const p = project();
    p.cli('add', 'button', 'input', 'input-group');
    writeFileSync(p.file('App.tsx'), "import { Button } from '@/components/ui/button';\nexport default () => <Button />;\n");
    const blocked = p.cli('remove', 'button');
    expect(blocked.status).not.toBe(0);
    expect(blocked.stderr + blocked.stdout).toContain('App.tsx');
    writeFileSync(p.file('App.tsx'), "import { Input } from '../ui/input';\n");
    expect(p.cli('remove', 'input').status).not.toBe(0);
    writeFileSync(p.file('App.tsx'), 'export {};\n');
    expect(p.cli('remove', 'input', 'input-group').status).toBe(0);
  });
});
