// Builds public/r/*.json: one self-contained file per component and block, plus index.json.
// The CLI (bin/befui.mjs) reads these. Dependencies come from each file's real imports.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { hasDirective, needsClient } from './use-client.mjs';

// Next.js App Router: a component with state, context, Radix, handlers or browser globals must say 'use client'.
const lacking = ['src/components/ui', 'src/blocks'].flatMap((dir) =>
  readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => `${dir}/${f}`).filter((path) => { const src = readFileSync(path, 'utf8'); return needsClient(src) && !hasDirective(src); }),
);
if (lacking.length) throw new Error(`Missing 'use client' in: ${lacking.join(', ')}. Run node scripts/add-use-client.mjs`);

const out = 'public/r';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const reg = readFileSync('src/registry/index.ts', 'utf8');
const info = {};
for (const [, slug, name, cat, desc] of reg.matchAll(/^\s*m\('([^']+)', '([^']+)', '([^']+)', '((?:[^'\\]|\\.)*)'/gm)) info[`ui/${slug}`] = { name, group: cat, description: desc.replace(/\\'/g, "'") };
for (const [, slug, name, module, desc] of reg.matchAll(/slug: '([^']+)', name: '([^']+)', module: '([^']+)', description: '((?:[^'\\]|\\.)*)'/g)) info[`blocks/${slug}`] = { name, group: module, description: desc.replace(/\\'/g, "'") };

// Changelog: src/registry/changelog.json is the source for the docs page and CHANGELOG.md. Every slug must exist.
const releases = JSON.parse(readFileSync('src/registry/changelog.json', 'utf8'));
const nameOf = (slug) => (slug.startsWith('block:') ? info[`blocks/${slug.slice(6)}`] : info[`ui/${slug}`])?.name;
for (const r of releases) for (const e of r.entries) for (const slug of e.slugs ?? []) if (!nameOf(slug)) throw new Error(`changelog ${r.version}: unknown component "${slug}"`);
writeFileSync('CHANGELOG.md', `# Changelog

All notable changes to befui. Versions follow [semver](https://semver.org): new components are minor releases, breaking prop changes are major. The same list, with links to each component, is on the docs site under Changelog.
(Generated from src/registry/changelog.json by \`npm run registry:build\`. Edit the JSON, not this file.)

${releases.map((r) => `## ${r.version} - ${r.date}\n\n${r.title}\n\n${r.entries.map((e) => `- **${e.kind[0].toUpperCase()}${e.kind.slice(1)}:** ${e.text}${e.slugs?.length ? ` (${e.slugs.map(nameOf).join(', ')})` : ''}`).join('\n')}\n`).join('\n')}`);

const HELPERS = new Set(['react', 'react-dom', 'clsx', 'tailwind-merge', 'class-variance-authority']);

function analyse(src) {
  const deps = new Set();
  const requires = new Set();
  for (const [, spec] of src.matchAll(/from '([^']+)'/g)) {
    const ui = spec.match(/^(?:@\/components\/ui|\.)\/([\w-]+)$/);
    if (ui) requires.add(ui[1]);
    else if (!spec.startsWith('.') && !spec.startsWith('@/') && !HELPERS.has(spec)) deps.add(spec);
  }
  return { deps: [...deps].sort(), requires: [...requires].sort() };
}

const items = [];
const docs = [];
for (const [kind, dir, prefix] of [['ui', 'src/components/ui', ''], ['blocks', 'src/blocks', 'block:']]) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.tsx')) continue;
    const slug = f.replace('.tsx', '');
    const content = readFileSync(`${dir}/${f}`, 'utf8');
    const meta = info[`${kind}/${slug}`] ?? { name: slug, group: kind, description: '' };
    const a = analyse(content);
    const entry = {
      name: `${prefix}${slug}`,
      title: meta.name,
      group: meta.group,
      description: meta.description,
      deps: a.deps,
      requires: a.requires,
      files: [{ path: `${kind === 'ui' ? 'components/ui' : 'blocks'}/${f}`, content }],
    };
    const exportsList = [...content.matchAll(/^export (?:async )?(?:function|const|class) (\w+)/gm)].map((m) => m[1]);
    let example = '';
    try { example = readFileSync(`src/examples/${slug}.tsx`, 'utf8'); } catch { /* blocks have no separate example */ }
    if (slug === 'icons') example = `import { SearchIcon, ArrowRightIcon } from '@/components/ui/icons';\n\n<SearchIcon />                 // 16px, follows text color, static\n<SearchIcon className="size-6" />\n<ArrowRightIcon draw />        // opt-in: redraws on hover\n<SearchIcon weight={2.5} />     // heavier stroke\n\n// All ${exportsList.filter((e) => /^[A-Z]/.test(e) && e !== 'icons').length} icons: ${exportsList.filter((e) => /^[A-Z]/.test(e)).join(', ')}`;
    let htmlExample = '';
    try { htmlExample = readFileSync(`src/html/demos/${slug}.html`, 'utf8').trim(); } catch { /* blocks and the odd component have none */ }
    const tag = (n) => `bef-${n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()}`;
    const tags = htmlExample ? exportsList.filter((e) => /^[A-Z]/.test(e)).map(tag) : [];
    writeFileSync(`${out}/${prefix.replace(':', '-')}${slug}.json`, JSON.stringify({ ...entry, exports: exportsList, example: example.trim(), ...(htmlExample && { htmlExample, tags }) }));
    docs.push({ ...entry, kind, exports: exportsList, example });
    items.push({ name: entry.name, title: entry.title, group: entry.group, description: entry.description });
  }
}

// Flutter: the widgets in flutter/lib/befui are added to the same registry. flutter-theme / flutter-core / flutter-icons are the shared files; each component's JSON gets a `flutter` object.
const FL = 'flutter/lib/befui';
const SHARED = { theme: 'Theme and colours', core: 'Core helpers', icons: 'Icons' };
const flutterItems = [];
if (existsSync(FL)) {
  const dartRequires = (src, self) => [...src.matchAll(/^import '([\w]+)\.dart';/gm)].map((m) => m[1]).filter((n) => n !== self).map((n) => (SHARED[n] ? `flutter-${n}` : n.replace(/_/g, '-')));
  for (const f of readdirSync(FL).filter((x) => x.endsWith('.dart')).sort()) {
    const base = f.replace(/\.dart$/, '');
    const content = readFileSync(`${FL}/${f}`, 'utf8');
    const requires = [...new Set(dartRequires(content, base))].sort();
    if (SHARED[base]) {
      writeFileSync(`${out}/flutter-${base}.json`, JSON.stringify({ name: `flutter-${base}`, title: SHARED[base], requires, files: [{ path: `befui/${f}`, content }] }));
      continue;
    }
    const slug = base.replace(/_/g, '-');
    const file = `${out}/${slug}.json`;
    if (!existsSync(file)) { console.warn(`flutter: no React component named ${slug}, skipped`); continue; }
    let example = '';
    try { example = readFileSync(`flutter/lib/examples/${base}.dart`, 'utf8').trim().replace(/'\.\.\/befui\//g, "'befui/"); } catch { /* no example yet */ } // the gallery lives one folder away from befui/; in an app the path is whatever suits the file
    const j = JSON.parse(readFileSync(file, 'utf8'));
    const classes = [...content.matchAll(/^(?:abstract |final )?class (Bef\w+)/gm)].map((m) => m[1]);
    j.flutter = { files: [{ path: `befui/${f}`, content }], requires, classes, example };
    writeFileSync(file, JSON.stringify(j));
    flutterItems.push({ slug, title: j.title, group: j.group, description: j.description, ...j.flutter });
  }
  for (const it of items) if (flutterItems.some((x) => x.slug === it.name)) it.flutter = true;
}

// The docs site lists "copy these files" from real imports, not hand-kept metadata (they drifted: 29 components were missing icons).
writeFileSync('src/registry/requires.json', JSON.stringify(Object.fromEntries(docs.filter((d) => d.kind === 'ui').map((d) => [d.name, d.requires]).sort(([a], [b]) => a.localeCompare(b))), null, 2) + '\n');
writeFileSync(`${out}/index.json`, JSON.stringify(items));
// Theme presets: read by `befui init --theme` and the docs Themes page.
writeFileSync(`${out}/themes.json`, JSON.stringify(JSON.parse(readFileSync('src/registry/themes.json', 'utf8'))));
writeFileSync(`${out}/init.json`, JSON.stringify({
  name: 'init',
  deps: ['clsx', 'tailwind-merge', 'class-variance-authority', 'tailwindcss', '@tailwindcss/vite'],
  files: [
    { path: 'lib/utils.ts', content: readFileSync('src/lib/utils.ts', 'utf8') },
    { path: 'index.css', content: readFileSync('src/index.css', 'utf8') },
  ],
}));

// Agent-facing docs: a short index and a full catalog with a working example per component.
const RAW = 'https://raw.githubusercontent.com/RandomKid24/befui/main/public';
const ui = docs.filter((d) => d.kind === 'ui');
const bl = docs.filter((d) => d.kind === 'blocks');
const head = `# befui

> Copy-paste React components (Radix + Tailwind 4 + CSS variables) with real motion, plus HRMS and marketing blocks. You own the files: add them with the CLI, then import from \`@/components/ui/<name>\`.

## Setup
- One time: \`npx github:RandomKid24/befui init\` (theme CSS, cn helper, AGENTS.md rules, .mcp.json)
- Add: \`npx github:RandomKid24/befui add <name> [name...]\` or \`add all\`; blocks are \`block:<name>\`. It also installs npm packages and any befui files a component imports. (There is no \`befui\` package on npm: \`npx befui\` will fail, always use the \`github:\` form.)
- CLI blocked or GitHub unreachable? Do not retype components and never swap in another icon package. Fetch the JSON for the component (${RAW}/r/<name>.json, or the same \`/r/<name>.json\` path on the docs site), write every \`files[].content\` to \`src/<path>\`, do the same for every name in its \`requires\` (\`icons\` is the common one: r/icons.json, it holds every icon), \`npm i\` its \`deps\`, and merge \`r/init.json\` (cn helper, theme CSS) once.
- Exact source of any component as JSON (files, npm deps, requires, example): ${RAW}/r/<name>.json (blocks: block-<name>.json). Every name below works in that URL.
- MCP: \`npx github:RandomKid24/befui mcp\` gives tools list_components, get_component (format "html" for plain HTML/htmx), get_html_rules, add_components
- Icons: our own set in \`@/components/ui/icons\`, e.g. \`import { SearchIcon } from '@/components/ui/icons'\`; no icon package needed
- Theme: CSS variables in index.css (--primary, --ring, --accent...). Dark mode = \`dark\` class on <html>. Use tokens (\`bg-primary\`, \`text-muted-foreground\`, \`border\`), never hard-coded colors.
- Full catalog with a working example per component: ${RAW}/llms-full.txt
- Building a mobile app in Flutter (Android and iOS)? The same components exist as Flutter widgets, copy-paste with \`npx github:RandomKid24/befui add <name> --flutter\`. Rules and an example for every widget: ${RAW}/llms-flutter.txt
- Not using React (plain HTML, htmx, Django, Rails, PHP)? Every component is also a custom element, \`<bef-button>\`, \`<bef-dialog>\`... Rules and an HTML example for every component: ${RAW}/llms-html.txt

## Rules that save a debugging round
- Wrap the app once in \`<TooltipProvider>\` (tooltip) and render \`<Toaster />\` once, then call \`toast.success('Saved')\` anywhere (toast).
- Sidebar, AppShell: put \`SidebarProvider\` above them. Dialog and Sheet are the same primitive; use \`SheetContent\` for a side drawer.
- Stateful inputs are controlled: pass \`value\` and \`onChange\` (or \`checked\` / \`onCheckedChange\` for checkbox and switch).
- Tables: \`table\` is bare parts for static layouts. \`data-table\` adds sort, filter, pagination, row selection (\`selectable\`, \`bulkActions\`), a column menu (\`columnMenu\`) and a sticky header (\`maxHeight\`); you pass rows and \`Column[]\`.
- Animated components need keyframes from index.css: run \`npx github:RandomKid24/befui update\` after adding (\`--check\` to only report).
- Fixed colors on purpose: terminal (always dark), avatar and tag-manager (per-name tints). Everything else follows theme tokens.
- Merge classes with \`cn\` from \`@/lib/utils\`. Edit copied files freely; \`add <name> --force\` overwrites local edits.

## Which component for what
${[
  ['Dates, delivery and changes', 'week-strip (pick a day), day-agenda (one day as a time grid), order-tracker (delivery steps), diff-viewer (before and after text), event-calendar (month and week), countdown'],
  ['Status, ranking and reviews', 'uptime-bar (status page), leaderboard (ranked people), rating-breakdown (review summary), credit-card (card preview that flips, for checkout and add-card forms)'],
  ['Draw a chart', 'trend over time: line-chart or area-chart (stacked); compare categories: charts BarChart or stacked-bar-chart; share of whole: DonutChart or radial-bar-chart; correlation or outliers: scatter-chart; day-by-hour or cohort grid: matrix-heatmap; yearly activity: heatmap; tiny trend in a card: Sparkline; live feed: live-chart; stages: funnel-chart; scores on axes: radar-chart; parts of a budget: treemap; start-to-end bridge (profit): waterfall-chart; flow between stages: sankey-chart; mix shifting over time: stream-chart; price range per period: candlestick-chart; rank changes: bump-chart; seasonal cycle: rose-chart; KPI vs target: bullet-chart; before vs after per item: dumbbell-chart; percent of 100 as squares: waffle-chart; nested breakdown: sunburst-chart; per-row curves: ridgeline-chart; spread and outliers: box-plot-chart; flow between every pair: chord-chart; parts of a whole: pie-chart (3 to 5 slices) or half-donut-chart (short card); cyclic data like 24 hours: radial-line-chart; distribution of raw values: histogram-chart; few causes behind most of a problem: pareto-chart; two moments per item: slope-chart or dumbbell-chart; two groups back to back: butterfly-chart; many ranked items: lollipop-chart; bubbles by size: circle-pack-chart; share by size and group: marimekko-chart; dots sized by value in a grid: punch-card-chart; projection with a likely range: forecast-chart; overlap of two or three groups: venn-chart; frequent words: word-cloud. Five to eight scores as a pentagon or hexagon: radar-chart. The explanation of each chart (what it shows, how to read it, when to use or skip it) is in llms-full.txt; give it to the user when they ask what a chart means. All animate in on scroll.'],
  ['Show tabular data', 'table (static), data-table (sort/filter/select/paginate), permission-matrix (roles by permissions), kanban (cards in columns), heatmap, charts, line-chart, radar-chart, funnel-chart, gantt (schedule), org-chart, saved-views (table presets), audit-log (who changed what), file-manager'],
  ['Hint or explain on hover', 'tooltip (title, shortcut, arrow), InfoTip and TruncatedText (both exported by tooltip), popover for richer content, hover-card (rich preview that opens on hover or focus, e.g. a profile)'],
  ['Pick a value', 'select, combobox, radio-group, segmented, chip, switch, checkbox, slider, calendar, date-picker, time-picker, color-picker, toggle-group (several buttons can stay pressed, formatting toolbars), button-group (joined buttons)'],
  ['Type text or numbers', 'input, search-input, search-bar, password-input, otp-input, currency-input, number-stepper, tag-input, inline-edit, datetime-picker, image-upload, rich-text-editor (HTML), schema-form (form from a JSON-like description, wizard with steps), notification-preferences, mention-input (@ people), coupon-input, input-group (a field with prefix or suffix addons like https:// or .com)'],
  ['Confirm, ask, or show a form on top', 'dialog, alert-dialog (destructive), dialog\'s Sheet (side drawer), popover, context-menu (right click), image-viewer (lightbox), bottom-sheet (mobile)'],
  ['Loading and failure states', 'loader (ring/dots/bars/pulse/orbit/dual, BarLoader, LoadingOverlay), skeleton, spinner, empty-state, error-state (404/500), pull-to-refresh'],
  ['Workflows and settings', 'approval-flow (approver chain), onboarding-checklist, tag-manager, notification-preferences, shortcuts-dialog (press ?), permission-matrix'],
  ['Guide a new user', 'tour (spotlight walkthrough of the real page), onboarding-checklist, onboarding-carousel (mobile intro)'],
  ['Format numbers', 'format (formatCurrency, formatCompact, formatPercent, formatBytes, formatDuration, Currency); defaults to INR and en-IN'],
  ['Online shop and checkout', 'product-card (and Price), order-summary, coupon-input, number-stepper (quantity), rating'],
  ['Reorder or resize', 'sortable-list (rows), kanban (cards across columns), split-pane (resizable panels)'],
  ['Tell the user something', 'toast (transient), alert (inline), banner (page-wide), notification-center (inbox), cookie-consent'],
  ['Navigate', 'sidebar, app-shell, navbar (top bar), user-menu (avatar menu), theme-toggle (dark mode), settings-layout (side nav for settings), bottom-nav (mobile), swipe-actions (row gestures), tabs, breadcrumb, pagination, stepper, command (Ctrl K), table-of-contents, fab, navigation-menu (desktop mega menu in a top bar), menubar (File, Edit, View bar)'],
  ['Show KPIs and status', 'stat-card, bar-list (ranked bars), description-list (details), invoice, gauge, progress, progress-ring, number-ticker, badge, status-dot, charts (Sparkline, BarChart, DonutChart)'],
  ['Show people and activity', 'avatar, profile-card, activity-feed, timeline, chat, comment-thread, changelog, testimonial-card, rating, terminal (CLI output)'],
  ['Time', 'time-picker, analog-clock, world-clock, stopwatch, timer, countdown, relative-time'],
  ['Whole pages', 'see Page recipes below; all blocks are listed under Blocks'],
].map(([task, use]) => `- ${task}: ${use}`).join('\n')}

## Page recipes (start from a block, then edit it)
Add the block with \`add block:<name>\`; it pulls in everything it uses. Layout frames: wrap pages in \`app-shell\` (sidebar), or use \`block:top-nav-layout\` (navbar, no sidebar).
${[
  ['Admin app frame (sidebar + topbar)', 'block:admin-shell. Topbar extras: theme-toggle, user-menu, notification-center, command (Ctrl K)'],
  ['Analytics / traffic dashboard', 'block:analytics-dashboard (stat-card, line-chart, donut, bar-list)'],
  ['Sales or CRM dashboard', 'block:sales-dashboard, block:lead-pipeline, block:campaign-performance'],
  ['Online store admin', 'block:ecommerce-dashboard, block:checkout-page, block:invoice-page'],
  ['Project or team dashboard', 'block:project-overview, kanban, gantt, org-chart'],
  ['HR / people', 'block:hrms-overview, block:employee-directory, block:leave-approvals, block:leave-request-form'],
  ['Users, roles, API keys', 'block:user-management (invite dialog + table), permission-matrix, block:api-keys-page'],
  ['Account area', 'block:settings-page (tabs) or settings-layout (side nav), block:profile-page, block:billing-page'],
  ['Sign in / sign up / reset', 'block:sign-in, block:sign-up, block:reset-password'],
  ['Marketing site', 'block:landing-page (landing-sections: Hero, FeatureGrid, StatsStrip, Faq, CtaBanner, SiteFooter + navbar), block:pricing-page, comparison-table'],
  ['Mail or messages', 'block:inbox, chat, comment-thread'],
  ['Error pages', 'block:not-found-page or error-state (code 403, 404, 500)'],
  ['Details panel for one record', 'description-list inside a card, plus timeline or audit-log for history'],
].map(([task, use]) => `- ${task}: ${use}`).join('\n')}
`;
const iconNames = [...readFileSync('src/components/ui/icons.tsx', 'utf8').matchAll(/^export const (\w+Icon) = make/gm)].map((m) => m[1]);
const iconSection = `## Icons (${iconNames.length})\nImport from \`@/components/ui/icons\`. Use only these names; do not guess or add an icon package. Props: className (size-4 default, e.g. size-5), weight, draw.\n${iconNames.join(', ')}\n`;
const ORDER = ['Layout', 'Navigation', 'Inputs', 'Display', 'AI', 'Data', 'Feedback', 'Overlays', 'Time'];
const rank = (g) => (ORDER.includes(g) ? ORDER.indexOf(g) : ORDER.length);
const byGroup = [...ui].sort((x, y) => rank(x.group) - rank(y.group) || x.name.localeCompare(y.name));
// README: the component catalog and the headline counts come from the registry so they cannot drift (CI fails if they do).
const catalog = ORDER.concat([...new Set(ui.map((d) => d.group))].filter((g) => !ORDER.includes(g)))
  .map((g) => ({ g, list: byGroup.filter((d) => d.group === g) }))
  .filter((x) => x.list.length)
  .map((x) => `<details>\n<summary><b>${ORDER.includes(x.g) ? x.g : 'Other'}</b> (${x.list.length})</summary>\n\n${x.list.map((d) => `\`${d.name}\``).join(' · ')}\n\n</details>`)
  .join('\n\n');
const readmeOld = readFileSync('README.md', 'utf8');
const icons = iconNames.length;
let readmeNew = readmeOld;
for (const [pattern, text] of [
  [/<!-- components:start -->[\s\S]*<!-- components:end -->/, `<!-- components:start -->\n### Components (${ui.length})\n\n${catalog}\n<!-- components:end -->`],
  [/<!-- blocks:start -->[\s\S]*<!-- blocks:end -->/, `<!-- blocks:start -->\n### Blocks (${bl.length})\n\nFull screens built from the components, with mock data you swap for your own API.\n\n| Block | Module | What it is |\n|---|---|---|\n${bl.map((d) => `| \`${d.name}\` | ${d.group} | ${d.description.replace(/\|/g, '\\|')} |`).join('\n')}\n<!-- blocks:end -->`],
  [/\d+ copy-paste React components, \d+ hand-drawn icons and \d+ full-page blocks/, `${ui.length} copy-paste React components, ${icons} hand-drawn icons and ${bl.length} full-page blocks`],
  [/Plus \*\*\d+ Flutter widgets\*\*/, `Plus **${flutterItems.length} Flutter widgets**`],
  [/### Use in Flutter \(\d+ widgets\)/, `### Use in Flutter (${flutterItems.length} widgets)`],
  [/\d+ icons on one grid/, `${icons} icons on one grid`],
  [/### \d+ icons, drawn by us/, `### ${icons} icons, drawn by us`],
  [/Icons page with \d+ icons/, `Icons page with ${icons} icons`],
  [/### Icons \(\d+\)/, `### Icons (${icons})`],
]) {
  // A silent no-op here would let the README drift again, so a reworded line is an error, not a skip.
  if (!pattern.test(readmeNew)) throw new Error(`README.md has no text matching ${pattern}. Restore it, or update the pattern in scripts/build-registry.mjs.`);
  readmeNew = readmeNew.replace(pattern, () => text);
}
if (readmeNew !== readmeOld) writeFileSync('README.md', readmeNew);
// COMPONENTS.md: every component and block in one readable list, with which platforms have it. Generated, so it cannot drift.
{
  const fl = new Set(flutterItems.map((x) => x.slug));
  const cell = (d) => d.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const groups = ORDER.concat([...new Set(ui.map((d) => d.group))].filter((g) => !ORDER.includes(g)));
  const htmlCount = ui.filter((d) => existsSync(`src/html/demos/${d.name}.html`)).length;
  const md = [
    '# Components',
    '',
    `Every befui component and block. **${ui.length} React components**, **${htmlCount} with an HTML tag** (\`<bef-*>\`), **${flutterItems.length} Flutter widgets**, and **${bl.length} page blocks**.`,
    '(Generated from the registry by `npm run registry:build`. Do not edit by hand.)',
    '',
    'Install a React component with `npx github:RandomKid24/befui add <name>`, the Flutter version with `npx github:RandomKid24/befui add <name> --flutter`.',
    '',
    ...groups.flatMap((g) => {
      const list = byGroup.filter((d) => d.group === g);
      if (!list.length) return [];
      return [
        `## ${ORDER.includes(g) ? g : 'Other'} (${list.length})`,
        '',
        '| Component | What it is | HTML | Flutter |',
        '|---|---|:-:|:-:|',
        ...list.map((d) => `| \`${d.name}\` | ${cell(d)} | ${existsSync(`src/html/demos/${d.name}.html`) ? '✓' : ''} | ${fl.has(d.name) ? '✓' : ''} |`),
        '',
      ];
    }),
    `## Blocks (${bl.length})`,
    '',
    'Full screens built from the components, with mock data you swap for your own API.',
    '',
    '| Block | Module | What it is |',
    '|---|---|---|',
    ...bl.map((d) => `| \`${d.name.replace(/^block:/, '')}\` | ${d.group} | ${cell(d)} |`),
    '',
  ].join('\n');
  writeFileSync('COMPONENTS.md', md);
}
const importOf = (d) => d.exports.filter((e) => !/Variants$/.test(e));
const line = (d) => `- \`${d.name}\`: ${d.description} Exports: ${importOf(d).slice(0, 8).join(', ')}${importOf(d).length > 8 ? ', ...' : ''}.${d.requires.length ? ` Needs: ${d.requires.join(', ')}.` : ''}`;
const sections = ORDER.concat([...new Set(ui.map((d) => d.group))].filter((g) => !ORDER.includes(g)))
  .map((g) => ({ g, list: byGroup.filter((d) => d.group === g) }))
  .filter((x) => x.list.length)
  .map((x) => `### ${x.g} (${x.list.length})\n${x.list.map(line).join('\n')}`)
  .join('\n\n');
writeFileSync('public/llms.txt', `${head}\n${iconSection}\n## Components (${ui.length})\n\n${sections}\n\n## Blocks\n${bl.map((d) => `- \`${d.name}\`: ${d.description} Uses: ${d.requires.join(', ')}.`).join('\n')}\n`);
const guides = JSON.parse(readFileSync('src/registry/chart-guides.json', 'utf8'));
const guideText = (name) => (guides[name] ? `- What it shows: ${guides[name].what}\n- How to read it: ${guides[name].read}\n- Use it for: ${guides[name].use}\n- Skip it when: ${guides[name].avoid}\n` : '');
const full = byGroup.map((d) => `## ${d.title} (\`${d.name}\`)\n${d.description}\n- Group: ${d.group}\n${guideText(d.name)}- Add: \`npx github:RandomKid24/befui add ${d.name}\`\n- Import: \`import { ${importOf(d).join(', ')} } from '@/components/ui/${d.name}'\`\n${d.requires.length ? `- Also needs: ${d.requires.join(', ')}\n` : ''}${d.deps.length ? `- npm packages: ${d.deps.join(', ')}\n` : ''}\nExample:\n\n\`\`\`tsx\n${d.example.trim()}\n\`\`\`\n`).join('\n');
writeFileSync('public/llms-full.txt', `${head}\n${iconSection}\n# Components\n\n${full}`);
// HTML/htmx build: tags, prop rules and the example from src/html/demos for every component
const htmlRules = `# befui for HTML and htmx

> Every befui component is a custom element in a plain HTML page: one CSS file and one script, no React in your app. Build them with \`npm run build:html\` (dist/html/befui.css and befui.js).

\`\`\`html
<link rel="stylesheet" href="/befui.css">
<script type="module" src="/befui.js"></script>
<bef-button variant="soft">Save</bef-button>
\`\`\`

## Rules
- Tag = \`bef-\` + kebab-case export name: Button -> <bef-button>, DataTable -> <bef-data-table>, DialogTrigger -> <bef-dialog-trigger>. Icons too: <bef-home-icon>.
- Props are attributes in kebab-case (default-value, as-child). A bare attribute is true. Strings are the default.
- JSON props use a colon: :value="40", :items='[{"id":"a","title":"T"}]'. Inside that JSON, a string that starts with a tag becomes content: {"icon":"<bef-home-icon></bef-home-icon>"}. A string like "~2026-12-31" becomes a Date.
- A child with slot="name" becomes the prop \`name\` (<bef-button slot="action">Undo</bef-button>). Other children are the component's children.
- Dates as plain attributes: ~to="2026-12-31T09:00", ~selected="now", ~at="now-14m" (also as "~now-14m" strings inside :json).
- Callbacks: emit="value-change open-change" fires bubbling events bef:value-change and bef:open-change (value in event.detail). The tag also writes the new value back to itself (:value, :open...), so controlled components work with no script; set :open="true" to open a controlled dialog.
- Props that are functions or JSX (render, columns, onSubmit, onApply) cannot be attributes: set them from a <script type="module">, element.props = { columns: [...], onSubmit: fn }. It also works on a tag inside another tag, and attribute changes on nested tags redraw them. A render function can return markup: befui.h('bef-badge', { variant: 'success' }, 'Active') or an HTML string.
- Content React draws outside the tag (dialogs, menus, sheets) is not inside it in the DOM: use befui.on(el, 'click', (e) => ...) for page-level listeners that go away with el.
- Always load befui.js as <script type="module">.
- style works on the outer tag. Do not invent Tailwind classes in HTML (they are not in the CSS); use inline style for layout.
- Works with htmx: elements added by a swap upgrade by themselves and hx-* attributes inside are processed. Radix inputs submit with the surrounding <form>.
- Dark mode: the dark class on <html>. Theme: the same CSS variables (--primary, ...).
- window.befui.toast.success('Saved') shows a toast when <bef-toaster> is on the page.

# Examples
`;
const demoDir = 'src/html/demos';
const htmlExamples = existsSync(demoDir) ? ui.filter((d) => existsSync(`${demoDir}/${d.name}.html`)).map((d) => `## ${d.title} (${d.name})\n${d.description}\n\`\`\`html\n${readFileSync(`${demoDir}/${d.name}.html`, 'utf8').trim()}\n\`\`\`\n`).join('\n') : '';
writeFileSync('public/llms-html.txt', htmlRules + '\n' + htmlExamples);
writeFileSync(`${out}/html.md`, htmlRules.replace(/\n# Examples\n$/, ''));
// Flutter (Android and iOS): rules plus every widget's example, for AI tools and for people.
const flutterRules = `# befui for Flutter

> The befui components as Flutter widgets for Android and iOS: the same design as the React ones (same colour tokens, radii, sizes, dark mode and ten palettes). Copy-paste: the CLI puts one Dart file per widget in your app and from then on it is yours. No package to depend on, no Tailwind, no React.

## Setup
- \`npx github:RandomKid24/befui add button --flutter\` copies \`lib/befui/button.dart\` plus the shared files it needs (\`theme.dart\`, \`core.dart\`, \`icons.dart\`). Several names are allowed. Run it in the folder with your \`pubspec.yaml\`.
- Wire the theme once, in your \`MaterialApp\`: \`theme: BefTheme.data()\`, \`darkTheme: BefTheme.data(brightness: Brightness.dark)\`, \`themeMode: ThemeMode.system\`. Pick a palette with \`BefTheme.data(palette: BefPalette.rose)\` (blue, indigo, violet, rose, red, emerald, teal, amber, orange, slate).
- Browse every widget with its example: ${RAW}/llms-flutter.txt (this file) or the Flutter section on each component page of the docs site.

## Rules
- Widgets are named \`Bef<Name>\` (BefButton, BefBadge) and their props mirror the React ones: \`variant\`, \`size\`, \`shape\` are enums (\`BefButtonVariant.soft\`), \`loading\`, \`onPressed\`.
- Colours come from the theme, never hard-coded: \`context.bef.primary\`, \`context.bef.mutedForeground\`, \`context.bef.border\` (same names as the CSS variables, camelCased). Text: \`BefText.style(context, size: 14, weight: FontWeight.w500)\`. Radii: \`BefRadius.md\`.
- Icons are our own set, painted without any package: \`BefIcon(BefIcons.search, size: 16)\`. Do not add an icon package.
- The font is Inter. Add it with google_fonts or as an asset and pass \`fontFamily\` to \`BefTheme.data\`; without it the platform font is used and everything still works.
- Edit the copied files freely, they belong to your app. To get the latest version of one: \`add <name> --flutter --force\` (overwrites your edits).
- Need a widget that has no Flutter version yet? Say so rather than rebuilding it from Material defaults: the design would drift from the React and web versions.

## Widgets
`;
const flutterBody = flutterItems.map((w) => `### ${w.title} (\`${w.slug}\`)\n${w.description}\n- Add: \`npx github:RandomKid24/befui add ${w.slug} --flutter\`\n- Import: \`import 'befui/${w.slug.replace(/-/g, '_')}.dart';\` (classes: ${w.classes.join(', ')})\n${w.requires.length ? `- Also copies: ${w.requires.map((r) => (r.startsWith('flutter-') ? r.slice(8) + '.dart' : r.replace(/-/g, '_') + '.dart')).join(', ')}\n` : ''}${w.example ? `\nExample:\n\n\`\`\`dart\n${w.example}\n\`\`\`\n` : ''}`).join('\n');
writeFileSync('public/llms-flutter.txt', flutterRules + '\n' + flutterBody);
writeFileSync(`${out}/agents-flutter.md`, `## UI components (befui for Flutter)

This app uses [befui](https://github.com/RandomKid24/befui) for Flutter: copy-paste widgets (one Dart file each, in \`lib/befui/\`) with the same design as the befui React components.

Rules:
- Before building any UI, check whether a befui widget exists: ${RAW}/llms-flutter.txt (every widget with a working example). Browse them on the docs site too, in the Flutter section of each component page.
- Add a widget with the CLI, never by retyping it: \`npx github:RandomKid24/befui add <name> --flutter\` (run in the folder with pubspec.yaml). It also copies the shared \`theme.dart\`, \`core.dart\` and \`icons.dart\` when needed.
- Theme once in MaterialApp: \`theme: BefTheme.data()\`, \`darkTheme: BefTheme.data(brightness: Brightness.dark)\`. Read colours with \`context.bef.primary\` (never hard-code colours), text with \`BefText.style(context, size: 14)\`, icons with \`BefIcon(BefIcons.search)\`.
- If a befui MCP server is connected, use \`get_component\` with \`format: "flutter"\` and \`get_flutter_rules\` instead of guessing.
- Edit the copied files freely; they belong to this app. \`add <name> --flutter --force\` overwrites local edits.
`);
writeFileSync(`${out}/agents.md`, readFileSync('scripts/agents-snippet.md', 'utf8'));
console.log(`registry: ${items.length} items, llms.txt for ${ui.length} components`);
