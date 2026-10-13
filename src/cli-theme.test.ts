// Runs the real CLI against the generated registry in public/r, inside a throwaway project folder.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const from = join(root, 'public/r');
const themes = JSON.parse(readFileSync(join(from, 'themes.json'), 'utf8'));

function init(args: string[], css?: string) {
  const project = mkdtempSync(join(tmpdir(), 'befui-theme-'));
  const src = join(project, 'src');
  if (css !== undefined) { mkdirSync(src, { recursive: true }); writeFileSync(join(src, 'index.css'), css); }
  const run = spawnSync(process.execPath, [join(root, 'bin/befui.mjs'), 'init', ...args, '--from', from, '--dir', src, '--no-install'], { cwd: project, encoding: 'utf8' });
  const file = join(src, 'index.css');
  return { ...run, file, css: existsSync(file) ? readFileSync(file, 'utf8') : undefined };
}

const block = (css: string, selector: string) => css.slice(css.indexOf(selector), css.indexOf('}', css.indexOf(selector)));
const token = (css: string, selector: string, name: string) => new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block(css, selector))?.[1];

describe('befui init --theme', () => {
  it('rewrites the five tokens in both the light and dark blocks', () => {
    const r = init(['--theme', 'rose']);
    expect(r.status).toBe(0);
    for (const [mode, selector] of [['light', ':root, .light {'], ['dark', '.dark {']] as const)
      for (const t of ['primary', 'primary-foreground', 'accent', 'accent-foreground', 'ring'])
        expect(token(r.css!, selector, t), `${mode} ${t}`).toBe(themes.rose[mode][t]);
    expect(token(r.css!, ':root, .light {', 'primary')).not.toBe(themes.blue.light.primary);
  });

  it('keeps the default (blue) when no theme is given', () => {
    const r = init([]);
    expect(r.status).toBe(0);
    expect(token(r.css!, ':root, .light {', 'primary')).toBe(themes.blue.light.primary);
    expect(token(r.css!, '.dark {', 'primary-foreground')).toBe(themes.blue.dark['primary-foreground']);
  });

  it('rejects an unknown name, lists the valid ones and writes nothing', () => {
    const r = init(['--theme', 'nope']);
    expect(r.status).not.toBe(0);
    for (const name of Object.keys(themes)) expect(r.stderr).toContain(name);
    expect(r.css).toBeUndefined();
  });

  it('rejects --theme with no value', () => {
    for (const args of [['--theme'], ['--theme', '--force']]) {
      const r = init(args);
      expect(r.status).not.toBe(0);
      expect(r.stderr).toMatch(/--theme/);
      expect(r.css).toBeUndefined();
    }
  });

  it('refuses an index.css without the token blocks and leaves it untouched', () => {
    const mine = '/* my own styles */\nbody { margin: 0; }\n';
    const r = init(['--theme', 'rose'], mine);
    expect(r.status).not.toBe(0);
    expect(r.css).toBe(mine);
  });
});
