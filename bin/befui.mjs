#!/usr/bin/env node
// befui add button       copy a component (and the components it needs) into your project
// befui add all            copy every component
// befui add block:sign-in copy a block
// befui init             add the theme CSS and cn() helper
// befui update           add animations (keyframes) that newer components need to your index.css; --check only reports
// befui list             show everything available
// befui diff <name...>   show how your copy of a component differs from the latest
// befui remove <name...> delete a component's files (refuses while other files import it, unless --force)
// befui mcp              run the MCP server (AI tools fetch exact component source)
// Flags: --dir <src>  --from <url-or-folder>  --css <file>  --force  --no-install  --check
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const VERSION = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
const DEFAULT_FROM = 'https://raw.githubusercontent.com/RandomKid24/befui/main/public/r';
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i < 0 ? d : argv[i + 1]; };
const has = (n) => argv.includes(`--${n}`);
const valueFlags = new Set(['--dir', '--from', '--css', '--theme']);
const pos = argv.filter((a, i) => !a.startsWith('--') && !valueFlags.has(argv[i - 1]));
const [cmd, ...names] = pos;

const from = (flag('from') ?? process.env.BEFUI_URL ?? DEFAULT_FROM).replace(/\/$/, '');
const dir = flag('dir', existsSync('src') ? 'src' : '.');

const die = (m) => { console.error(`\x1b[31m✗\x1b[0m ${m}`); process.exit(1); };
const ok = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);

async function load(name) {
  const file = `${name.replace(':', '-')}.json`;
  try {
    if (/^https?:/.test(from)) {
      const r = await fetch(`${from}/${file}`);
      if (!r.ok) throw new Error(String(r.status));
      return await r.json();
    }
    return JSON.parse(readFileSync(join(from, file), 'utf8'));
  } catch (e) {
    die(`Could not load "${name}" from ${from} (${e.message}). Run "befui list" to see names.`);
  }
}

/** Rewrites the five theme tokens inside the `:root, .light {` and `.dark {` blocks. Returns { css } or { error }; never writes. */
function themeCss(css, preset) {
  let out = css;
  for (const [mode, selector] of [['light', ':root, .light {'], ['dark', '.dark {']]) {
    const start = out.indexOf(selector);
    if (start < 0) return { error: `no "${selector}" block` };
    const end = out.indexOf('}', start);
    let block = out.slice(start, end);
    for (const [token, value] of Object.entries(preset[mode])) {
      const re = new RegExp(`(--${token}:\\s*)#[0-9a-fA-F]{3,8}`);
      if (!re.test(block)) return { error: `no --${token} in the "${selector}" block` };
      block = block.replace(re, `$1${value}`);
    }
    out = out.slice(0, start) + block + out.slice(end);
  }
  return { css: out };
}

/** Unified diff of two texts (line based, 3 lines of context). Empty when they match once CRLF is normalised. */
function unifiedDiff(a, b, labelA, labelB) {
  const x = a.replace(/\r\n/g, '\n').split('\n');
  const y = b.replace(/\r\n/g, '\n').split('\n');
  if (x.join('\n') === y.join('\n')) return '';
  const n = x.length;
  const m = y.length;
  const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) lcs[i][j] = x[i] === y[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  const ops = [];
  for (let i = 0, j = 0; i < n || j < m; ) {
    if (i < n && j < m && x[i] === y[j]) { ops.push([' ', x[i]]); i++; j++; }
    else if (i < n && (j === m || lcs[i + 1][j] >= lcs[i][j + 1])) ops.push(['-', x[i++]]);
    else ops.push(['+', y[j++]]);
  }
  const keep = ops.map(([t], k) => t !== ' ' || ops.slice(Math.max(0, k - 3), k + 4).some(([u]) => u !== ' '));
  const out = [`--- ${labelA}`, `+++ ${labelB}`];
  for (let k = 0; k < ops.length; ) {
    if (!keep[k]) { k++; continue; }
    let end = k;
    while (end < ops.length && keep[end]) end++;
    const hunk = ops.slice(k, end);
    const before = ops.slice(0, k);
    const aStart = before.filter(([t]) => t !== '+').length + 1;
    const bStart = before.filter(([t]) => t !== '-').length + 1;
    out.push(`@@ -${aStart},${hunk.filter(([t]) => t !== '+').length} +${bStart},${hunk.filter(([t]) => t !== '-').length} @@`);
    for (const [t, line] of hunk) out.push(t + line);
    k = end;
  }
  return out.join('\n');
}

/** A registry name: lower-case letters, digits and dashes, optionally prefixed block:. Anything else could point outside the folder. */
const validName = (n) => /^(block:)?[a-z0-9-]+$/.test(n);

function write(files) {
  const written = [];
  for (const f of files) {
    const dest = join(dir, f.path);
    if (existsSync(dest) && !has('force')) { console.log(`  skip ${dest} (exists, use --force)`); continue; }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, f.content);
    written.push(dest);
  }
  return written;
}

function install(deps) {
  const have = existsSync('package.json') ? JSON.parse(readFileSync('package.json', 'utf8')) : {};
  const installed = { ...have.dependencies, ...have.devDependencies };
  const need = [...deps].filter((d) => !installed[d]);
  if (!need.length) return;
  if (has('no-install')) return console.log(`  install: ${need.join(' ')}`);
  const pm = existsSync('pnpm-lock.yaml') ? ['pnpm', 'add'] : existsSync('yarn.lock') ? ['yarn', 'add'] : existsSync('bun.lockb') || existsSync('bun.lock') ? ['bun', 'add'] : ['npm', 'i'];
  console.log(`  ${pm.join(' ')} ${need.join(' ')}`);
  if (spawnSync(pm[0], [...pm.slice(1), ...need], { stdio: 'inherit' }).status !== 0) die('Dependency install failed.');
}


/** Pulls `--animate-*` theme lines and `@keyframes` blocks out of a stylesheet. */
function animationsIn(css) {
  const vars = new Map([...css.matchAll(/^\s*(--animate-([\w-]+)):[^;]+;/gm)].map((m) => [m[2], m[0].trim()]));
  const frames = new Map();
  for (const m of css.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    let i = m.index + m[0].length, depth = 1;
    while (i < css.length && depth) depth += css[i] === '{' ? 1 : css[i] === '}' ? -1 : 0, i++;
    frames.set(m[1], css.slice(m.index, i));
  }
  return { vars, frames };
}

/** Compares the project's CSS with befui's and returns the animations it is missing. */
async function missingAnimations() {
  const file = flag('css') ?? [join(dir, 'index.css'), join(dir, 'styles/globals.css'), 'src/index.css', 'app/globals.css'].find(existsSync);
  const reg = (await load('init')).files.find((f) => f.path === 'index.css')?.content ?? '';
  if (!file) return { file: null, missing: null, reg };
  const mine = animationsIn(readFileSync(file, 'utf8'));
  const want = animationsIn(reg);
  return {
    file,
    reg,
    missing: {
      vars: [...want.vars].filter(([k]) => !mine.vars.has(k)),
      frames: [...want.frames].filter(([k]) => !mine.frames.has(k)),
    },
  };
}

async function update() {
  const { file, missing } = await missingAnimations();
  if (!file) die('No index.css found. Run "befui init" first, or pass --css <file>.');
  const n = missing.vars.length + missing.frames.length;
  if (!n) return ok('Animations are up to date.');
  console.log(`  ${file} is missing ${missing.vars.length} animation${missing.vars.length === 1 ? '' : 's'}: ${missing.vars.map(([k]) => k).join(', ') || '(keyframes only)'}`);
  if (has('check')) { console.log('  Run "befui update" to add them.'); process.exit(1); }
  let css = readFileSync(file, 'utf8');
  if (missing.vars.length) {
    const lines = missing.vars.map(([, l]) => `  ${l}`).join('\n');
    const theme = /@theme[^{]*\{/.exec(css);
    if (theme) {
      let i = theme.index + theme[0].length, depth = 1;
      while (i < css.length && depth) depth += css[i] === '{' ? 1 : css[i] === '}' ? -1 : 0, i++;
      css = `${css.slice(0, i - 1).trimEnd()}\n${lines}\n${css.slice(i - 1)}`;
    } else css += `\n@theme inline {\n${lines}\n}\n`;
  }
  if (missing.frames.length) css += `\n/* added by befui update */\n${missing.frames.map(([, f]) => f).join('\n')}\n`;
  writeFileSync(file, css);
  ok(`Added ${n} animation rule${n === 1 ? '' : 's'} to ${file}.`);
}

/** After "add": warn when a copied component uses an animate-* class the project's CSS does not define. */
async function warnAnimations(items) {
  const used = new Set(items.flatMap((i) => i.files.flatMap((f) => [...f.content.matchAll(/animate-([\w-]+)/g)].map((m) => m[1]))));
  const { missing } = await missingAnimations().catch(() => ({ missing: null }));
  const need = missing?.vars.map(([k]) => k).filter((k) => used.has(k));
  if (need?.length) console.log(`\x1b[33m!\x1b[0m These components use animations your index.css does not have yet (${need.join(', ')}). Run "befui update".`);
}

/** Adds (or refreshes) a marked befui section in AGENTS.md so AI coding agents know how to use the library. */
async function writeAgentRules() {
  try {
    const text = /^https?:/.test(from) ? await (await fetch(`${from}/agents.md`)).text() : readFileSync(join(from, 'agents.md'), 'utf8');
    const block = `<!-- befui:start -->\n${text.trim()}\n<!-- befui:end -->\n`;
    const file = 'AGENTS.md';
    const old = existsSync(file) ? readFileSync(file, 'utf8') : '';
    const next = /<!-- befui:start -->[\s\S]*<!-- befui:end -->\n?/.test(old) ? old.replace(/<!-- befui:start -->[\s\S]*<!-- befui:end -->\n?/, block) : `${old}${old && !old.endsWith('\n\n') ? '\n' : ''}${block}`;
    writeFileSync(file, next);
    ok('AI rules written to AGENTS.md (Claude Code reads CLAUDE.md: add "@AGENTS.md" to it).');
  } catch {
    console.log('  skipped AGENTS.md (could not load the rules)');
  }
}

/** Registers the befui MCP server in .mcp.json so Claude Code, Cursor etc. can fetch exact component source. */
function writeMcpConfig() {
  const file = '.mcp.json';
  const cfg = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  cfg.mcpServers = { ...cfg.mcpServers, befui: { command: 'npx', args: ['-y', 'github:RandomKid24/befui', 'mcp'] } };
  writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n');
  ok('MCP server registered in .mcp.json (restart your AI tool to pick it up).');
}

/** Minimal MCP server over stdio (newline-delimited JSON-RPC): lets an AI list, read and add befui components. */
async function mcp() {
  const index = async () => /^https?:/.test(from) ? (await fetch(`${from}/index.json`)).json() : JSON.parse(readFileSync(join(from, 'index.json'), 'utf8'));
  const text = (t) => ({ content: [{ type: 'text', text: t }] });
  const tools = {
    list_components: {
      description: 'List every befui component and block with group and description.',
      schema: { type: 'object', properties: { query: { type: 'string', description: 'optional filter on name, group or description' } } },
      run: async ({ query }) => text((await index()).filter((i) => !query || `${i.name} ${i.group} ${i.description}`.toLowerCase().includes(query.toLowerCase())).map((i) => `${i.name} (${i.group}): ${i.description}`).join('\n')),
    },
    get_component: {
      description: 'Get the exact source, usage example, npm packages and import path of one befui component (blocks are "block:<name>").',
      schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
      run: async ({ name }) => {
        const c = await load(name);
        return text(`# ${c.title} (${c.name})\n${c.description}\n\nImport: import { ${(c.exports ?? []).join(', ')} } from '@/${c.name.startsWith('block:') ? `blocks/${c.name.slice(6)}` : `components/ui/${c.name}`}'\nAlso needs: ${c.requires.join(', ') || 'none'}\nnpm packages: ${c.deps.join(', ') || 'none'}\n\n## Example\n${c.example || '(none)'}\n\n## Source (${c.files[0].path})\n${c.files[0].content}`);
      },
    },
    add_components: {
      description: 'Copy befui components (and what they depend on) into the current project and install npm packages. Same as "befui add".',
      schema: { type: 'object', properties: { names: { type: 'array', items: { type: 'string' } }, force: { type: 'boolean' } }, required: ['names'] },
      run: async ({ names, force }) => {
        const r = spawnSync(process.execPath, [process.argv[1], 'add', ...names, ...(force ? ['--force'] : []), ...(has('from') ? ['--from', from] : []), ...(has('dir') ? ['--dir', dir] : [])], { encoding: 'utf8' });
        return { ...text((r.stdout + r.stderr).replace(/\x1b\[\d+m/g, '')), isError: r.status !== 0 };
      },
    },
  };
  const send = (m) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...m }) + '\n');
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (chunk) => {
    buf += chunk;
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      const { id, method, params } = JSON.parse(line);
      if (id === undefined) continue; // notifications
      try {
        if (method === 'initialize') send({ id, result: { protocolVersion: params?.protocolVersion ?? '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'befui', version: VERSION } } });
        else if (method === 'tools/list') send({ id, result: { tools: Object.entries(tools).map(([name, t]) => ({ name, description: t.description, inputSchema: t.schema })) } });
        else if (method === 'tools/call') send({ id, result: await tools[params.name].run(params.arguments ?? {}) });
        else send({ id, result: {} });
      } catch (e) {
        send({ id, error: { code: -32000, message: e.message } });
      }
    }
  });
}

if (has('version') || cmd === 'version') {
  console.log(VERSION);
} else if (cmd === 'mcp') {
  // load() calls die() (exit) on failure; keep the server alive instead
  process.exit = ((exit) => (c) => { if (c) throw new Error('component not found, call list_components'); exit(c); })(process.exit);
  console.error = () => {};
  await mcp();
} else if (cmd === 'list') {
  const idx = await (async () => /^https?:/.test(from) ? (await fetch(`${from}/index.json`)).json() : JSON.parse(readFileSync(join(from, 'index.json'), 'utf8')))();
  let g = '';
  for (const i of idx.sort((a, b) => a.group.localeCompare(b.group))) {
    if (i.group !== g) console.log(`\n\x1b[1m${(g = i.group)}\x1b[0m`);
    console.log(`  ${i.name.padEnd(22)} ${i.description}`);
  }
} else if (cmd === 'update') {
  await update();
} else if (cmd === 'init') {
  const themeName = flag('theme');
  if (has('theme') && (!themeName || themeName.startsWith('--'))) die('Usage: befui init --theme <name>  (see the Themes page for names)');
  const init = await load('init');
  let themed;
  if (has('theme')) {
    // Check everything before writing anything, so a bad name or an unusual index.css leaves the project untouched.
    const themes = await load('themes');
    if (!themes[themeName]) die(`Unknown theme "${themeName}". Choose one of: ${Object.keys(themes).join(', ')}.`);
    const target = join(dir, 'index.css');
    const base = existsSync(target) && !has('force') ? readFileSync(target, 'utf8') : init.files.find((f) => f.path === 'index.css').content;
    const result = themeCss(base, themes[themeName]);
    if (result.error) die(`Could not apply the theme to ${target}: ${result.error}. Run init --force to start from befui's index.css.`);
    themed = { target, css: result.css };
  }
  write(init.files);
  if (themed) { writeFileSync(themed.target, themed.css); ok(`Theme "${themeName}" applied to ${themed.target}.`); }
  install(new Set(init.deps));
  ok('Theme and helpers added.');
  await writeAgentRules();
  writeMcpConfig();
  console.log('  Remaining: import "./index.css" in your entry file and add the "@" alias to src (tsconfig paths + vite resolve.alias).');
} else if (cmd === 'diff' && names.length) {
  for (const n of names) if (!validName(n)) die(`"${n}" is not a component name. Run "befui list" to see names.`);
  for (const n of names) {
    const item = await load(n);
    let changed = false;
    for (const f of item.files) {
      const dest = join(dir, f.path);
      if (!existsSync(dest)) { console.log(`  ${n} is not installed (${dest} is missing)`); changed = true; continue; }
      const diff = unifiedDiff(readFileSync(dest, 'utf8'), f.content, `yours ${f.path}`, `latest ${f.path}`);
      if (diff) { console.log(diff); changed = true; }
    }
    if (!changed) ok(`${n} is up to date`);
  }
} else if (cmd === 'remove' && names.length) {
  for (const n of names) if (!validName(n)) die(`"${n}" is not a component name. Run "befui list" to see names.`);
  const plan = [];
  for (const n of names) {
    const item = await load(n);
    const own = item.files.map((f) => join(dir, f.path)).filter((p) => existsSync(p));
    if (!own.length) { console.log(`  ${n} is not installed, nothing to remove`); continue; }
    // Which other local files import this component? Blocks are leaves, so only components can be depended on.
    const slug = n.replace(/^block:/, '');
    const users = n.startsWith('block:') ? [] : ['components/ui', 'blocks'].flatMap((d) => (existsSync(join(dir, d)) ? readdirSync(join(dir, d)).filter((f) => f.endsWith('.tsx')).map((f) => join(dir, d, f)) : []))
      .filter((p) => !own.includes(p) && new RegExp(`from ['"](@/components/ui/|\\./)${slug}['"]`).test(readFileSync(p, 'utf8')));
    if (users.length && !has('force')) die(`${n} is still used by: ${users.map((p) => p.replace(`${dir}/`, '')).join(', ')}. Remove those first, or pass --force.`);
    plan.push({ n, own });
  }
  for (const { n, own } of plan) { for (const p of own) unlinkSync(p); ok(`${n} removed (${own.length} file${own.length > 1 ? 's' : ''}). Packages it needed are left alone.`); }
} else if (cmd === 'add' && names.length) {
  const seen = new Map();
  const visit = async (n) => {
    if (seen.has(n)) return;
    const item = await load(n);
    seen.set(n, item);
    for (const r of item.requires) await visit(r);
  };
  let wanted = names;
  if (names.includes('all')) {
    const idx = /^https?:/.test(from) ? await (await fetch(`${from}/index.json`)).json() : JSON.parse(readFileSync(join(from, 'index.json'), 'utf8'));
    wanted = idx.map((i) => i.name).filter((n) => !n.startsWith('block:'));
  }
  for (const n of wanted) await visit(n);
  const deps = new Set(['clsx', 'tailwind-merge', 'class-variance-authority']);
  for (const item of seen.values()) item.deps.forEach((d) => deps.add(d));
  if (!existsSync(join(dir, 'lib/utils.ts'))) write((await load('init')).files);
  for (const item of seen.values()) { const w = write(item.files); if (w.length) ok(`${item.name} → ${w[0]}`); }
  install(deps);
  await warnAnimations([...seen.values()]);
  ok(`Done. ${seen.size} file${seen.size > 1 ? 's' : ''} added.`);
} else {
  console.log('Usage: befui <add|diff|remove|init|update|list|mcp> [names] [--dir src] [--from url-or-folder] [--force] [--no-install] [--theme name (init)]');
}
