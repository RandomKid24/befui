# befui 1.8.0 and 1.9.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Next.js support, 108 new stroke icons, brand icons, ten theme presets, ten new blocks and CLI `diff`/`remove` as releases 1.8.0 and 1.9.0.

**Architecture:** Each sub-project is independent and ends in a green `npm run build && npm test`. Shared guard rails: a `use-client` rules module used by the build and a test, a `themes.json` that feeds the CLI, a docs page and a contrast test, and the existing axe scan extended to blocks.

**Tech Stack:** React 19, Tailwind 4, Radix, TypeScript strict, Vite 6, vitest 3 + jsdom + vitest-axe, Node ESM CLI (`bin/befui.mjs`).

**Spec:** `docs/superpowers/specs/2026-10-13-1-8-and-1-9-reach-icons-themes-blocks-cli-design.md`

## Global Constraints

- Out of scope: npm publishing, a Slack logo, multi-colour brand logos, new non-block components, animation changes to existing icons, non-React ports.
- `'use client'` is required on a file iff `needsClient(source)` is true: a React hook call (`React.use…(` or any `use[A-Z]\w*(` call), `createContext`, an `@radix-ui/` or `cmdk` import, a JSX event-handler prop (`\bon[A-Z]\w*=`), or `window.` / `document.` / `localStorage` / `navigator.`. Pure presentational files (icons, format helpers) stay without it.
- Stroke icons: 24px grid, `make(name, shapes)` with `['path'|'circle'|'rect', …]`, round caps and joins, every icon added to the `icons` map as well as exported. Brand icons: filled, `viewBox="0 0 24 24"`, `fill="currentColor"`, decorative (`aria-hidden`) unless an `aria-label` is passed, plus `brandColors: Record<string, string>` of hex values. Source for brand paths: Simple Icons (CC0-1.0). Microsoft and LinkedIn are built from simple geometry; Slack is left out.
- Themes: ten presets (blue, indigo, violet, rose, red, emerald, teal, amber, orange, slate), each with light and dark `primary`, `primary-foreground`, `accent`, `accent-foreground`, `ring`. WCAG AA 4.5:1 for `primary` on `primary-foreground` and `accent` on `accent-foreground`, both modes. `blue` equals today's tokens in `src/index.css`.
- Blocks: `src/blocks/<slug>.tsx` with a default export, built from existing components with mock data, registered in `bMeta` in `src/registry/index.ts` (copy an existing entry's shape), and passing axe. New blocks can never be added to `src/a11y-baseline.json`.
- CLI: `diff` and `remove` work against a local folder through `--from` as well as the default URL, and respect `--dir`.
- Tests: vitest 3, explicit imports from `vitest`, axe asserted as `expect((await scan(node)).violations).toEqual([])` with `color-contrast` and `region` rules off.
- Registry: after any change under `src/components/ui`, `src/blocks`, `src/examples`, `src/registry` or `scripts/`, run `npm run registry:build` and commit the regenerated `public/`, `src/registry/requires.json`, `CHANGELOG.md` and `README.md` with it. CI fails if they are stale.
- After each task: `npm run registry:build && npm run typecheck && npm test` pass, then commit and `git push origin main`. Never force-push. Releases (Tasks 9 and 15) add a changelog entry to `src/registry/changelog.json`, run `npm version minor` and push with `--follow-tags` only after build, typecheck and tests pass.

## Review Focus

1. `needsClient` must catch a custom hook call, a handler prop, a Radix-only file and a browser-global-only file, and must not flag a pure icon file (Task 1).
2. `befui init --theme` with an unknown name, with no value, and against an `index.css` that lacks the token blocks must fail loudly and leave the file untouched (Task 7).
3. `befui remove` must refuse when another local file imports the component, reject names that are not `[a-z0-9-]` (no path traversal), and never touch `index.css` (Task 14).
4. `befui diff` must treat CRLF and LF copies of the same file as identical and handle a component that is not installed locally (Task 14).
5. A brand icon is decorative by default and becomes a labelled image only when `aria-label` is given; a caller's `className` and `style` must still apply (Task 5).

---

### Task 1: `'use client'` rules, guard and codemod

**Files:**
- Create: `scripts/use-client.mjs`, `scripts/add-use-client.mjs`, `src/use-client.test.ts`
- Modify: `scripts/build-registry.mjs` (guard), `README.md` (Next.js note), every `src/components/ui/*.tsx` and `src/blocks/*.tsx` that `needsClient` selects

**Interfaces:**
- Produces: `export function needsClient(source: string): boolean` and `export function hasDirective(source: string): boolean` (true when the first non-blank line is `'use client'` with either quote style) in `scripts/use-client.mjs`.

- [ ] **Step 1: Write the failing test `src/use-client.test.ts`**

`needsClient` is true for: `const [a] = useState(0)`, `const x = useInView()` (custom hook), `<button onClick={f} />`, `import * as D from '@radix-ui/react-dialog'` with no hooks, `window.matchMedia('(x)')`, `createContext`. False for the pure `export const SearchIcon = make('SearchIcon', [...])` shape and for plain `export const formatPercent = (n: number) => `${n}%``. `hasDirective` is true for `'use client';\nimport x` and `"use client"\n…`, false when it is not the first statement. A final test reads every file in `src/components/ui/*.tsx` and `src/blocks/*.tsx` (`import.meta.glob(..., { query: '?raw', import: 'default', eager: true })`) and expects the list of files where `needsClient(src) && !hasDirective(src)` to equal `[]`.

- [ ] **Step 2: Run it, expect FAIL**

Run: `npm test -- use-client`. Expected: FAIL (module missing), then after Step 3, FAIL on the real-files test listing the files that lack the directive.

- [ ] **Step 3: Implement `scripts/use-client.mjs`** per the Global Constraints rule list; strip comments and string literals before testing so a doc comment mentioning `window.` does not count.

- [ ] **Step 4: Write `scripts/add-use-client.mjs`**

Prepends `'use client';\n\n` to each selected file in the two directories that lacks it; prints the count. Run it once: `node scripts/add-use-client.mjs`. Then run `npm test -- use-client`. Expected: PASS.

- [ ] **Step 5: Add the build guard and README note**

In `scripts/build-registry.mjs`, before generating, import the rules and throw `Error('Missing "use client" in: <files>. Run node scripts/add-use-client.mjs')` when any `src/components/ui` or `src/blocks` file needs it and lacks it. Add a short "Next.js" bullet to README "Using components" (components are marked for the App Router, nothing to configure).

- [ ] **Step 6: Verify**

Run: `npm run registry:build && npm run typecheck && npm test && npm run build`. Expected: all pass, and `npm run build` prints no new warnings about module-level directives (if it does, note them in the ledger and keep going). Delete the directive from one component temporarily and confirm `npm run registry:build` fails with the file named, then restore it.

- [ ] **Step 7: Commit and push**

```bash
git add scripts src public README.md
git commit -m "feat: mark client components with 'use client' for Next.js, with a build guard"
git push origin main
```

---

### Task 2: Icon test harness and batch 1 (health, finance, charts: 28 icons)

**Files:**
- Create: `src/icons.test.tsx`
- Modify: `src/components/ui/icons.tsx` (28 icons, each exported and added to the `icons` map)

**Interfaces:**
- Produces: `src/icons.test.tsx` with a `const BATCHES: Record<string, string[]>` that Tasks 3 and 4 extend, and two standing tests (map completeness, every icon renders a shape).
- Names (final, none exist today): Health: `Stethoscope, Syringe, HeartPulse, Brain, Bandage, Dna, Microscope, Ambulance, Hospital, Tooth, MedicalCross, Bed`. Finance: `Euro, Pound, Yen, Bitcoin, PiggyBank, Safe, Handshake, Invoice`. Charts: `ScatterChart, Funnel, Sigma, RadarChart, CandlestickChart, DonutChart, StackedBar, Histogram`. Each is `<Name>Icon`.

- [ ] **Step 1: Write the failing tests in `src/icons.test.tsx`**

```tsx
import * as mod from '@/components/ui/icons';
const { icons } = mod as unknown as { icons: Record<string, unknown> } & Record<string, unknown>;
const BATCHES: Record<string, string[]> = { 'health, finance, charts': [/* the 28 names with the Icon suffix */] };
it('every exported *Icon is in the icons map', () => {
  const exported = Object.keys(mod).filter((k) => k.endsWith('Icon')).sort();
  expect(exported.filter((k) => !(k in icons))).toEqual([]);
});
it('every icon renders an svg with at least one shape', () => { /* render each from `icons`, expect svg and a path|circle|rect child */ });
it.each(Object.entries(BATCHES))('batch %s exists', (_, names) => { expect(names.filter((n) => !(n in icons))).toEqual([]); });
```

- [ ] **Step 2: Run, expect FAIL**: `npm test -- icons`. Expected: the batch test lists all 28 missing names.

- [ ] **Step 3: Draw the 28 icons** in `icons.tsx` in the existing style (view neighbours like `TruckIcon` for the idiom), exporting each and adding it to the `icons` map. Keep strokes simple: 1 to 4 shapes each.

- [ ] **Step 4: Verify**: `npm test -- icons` passes; `npm run typecheck`.

- [ ] **Step 5: Look at them**: start the dev server, open `#/icons`, search each group, and check the 28 at the default size and enlarged; redraw any that is unreadable or off-grid.

- [ ] **Step 6: Commit and push**

```bash
git add src public README.md
git commit -m "feat: 28 health, finance and chart icons"
git push origin main
```

---

### Task 3: Icon batch 2 (weather, transport: 20 icons)

**Files:** Modify `src/icons.test.tsx` (add batch), `src/components/ui/icons.tsx`.

**Interfaces:** Names: Weather `CloudRain, CloudSnow, CloudLightning, CloudSun, CloudFog, Wind, Sunrise, Sunset, Umbrella, Snowflake`. Transport `Bus, Train, Bike, Ship, Plane, Fuel, Parking, Anchor, Scooter, Road`. Each `<Name>Icon`.

- [ ] **Step 1:** Add `'weather, transport': [20 names]` to `BATCHES`. Run `npm test -- icons`, expect FAIL listing the 20.
- [ ] **Step 2:** Draw the 20 icons as in Task 2 and add them to the map.
- [ ] **Step 3:** `npm test -- icons` passes; visual check on `#/icons` as in Task 2.
- [ ] **Step 4:** Commit and push: `git add src public README.md && git commit -m "feat: 20 weather and transport icons" && git push origin main`.

---

### Task 4: Icon batch 3 (UI and frontend essentials: 60 icons)

The user redirected this batch from everyday objects to icons that frontend UIs actually use.

**Files:** Modify `src/icons.test.tsx`, `src/components/ui/icons.tsx`.

**Interfaces:** Names (none exist today), each `<Name>Icon`: Arrows `ArrowLeftRight, ArrowUpDown, ChevronsUp, ChevronsDown, CornerUpLeft, CornerUpRight, CornerDownLeft, ArrowDownToLine, ArrowUpFromLine`. Layout `PanelLeftClose, PanelLeftOpen, Expand, Shrink, Fullscreen, SidebarRight, LayoutTemplate`. Text editor `AlignJustify, ListOrdered, Heading1, Heading2, Heading3, Indent, Outdent, Highlighter, Pilcrow`. Files `FileImage, FileVideo, FileAudio, FileX, FileDown, FileUp, FileArchive, FileJson`. Developer `Braces, Brackets, Webhook, Puzzle, GitCommit, GitPullRequest, GitFork, Binary`. Actions `Unlink, PinOff, ThumbsDown, GripVertical, GripHorizontal, ToggleRight, Crosshair, Dot, Equal`. People and calendar `UserCog, CalendarPlus, CalendarDays, CalendarX, ReplyAll`. Devices that appear in UIs `Keyboard, Cast, SignalBars, BatteryCharging, Fingerprint`.

- [ ] **Step 1:** Add the batch `'ui and frontend essentials'` to `BATCHES`; run, expect FAIL.
- [ ] **Step 2:** Draw and register the 60 icons (`ThumbsDown` is `ThumbsUp` flipped vertically).
- [ ] **Step 3:** Tests pass; visual check; `npm run registry:build` (README icon count 389).
- [ ] **Step 4:** Commit and push: `git add src public README.md && git commit -m "feat: 55 UI and frontend icons" && git push origin main`.

---

### Task 5: Brand icons and social sign-in buttons

**Files:**
- Create: `src/components/ui/brand-icons.tsx`, `src/examples/brand-icons.tsx`, `src/brand-icons.test.tsx`
- Modify: `src/registry/index.ts` (entry + `NEW_SLUGS`), `src/blocks/sign-in.tsx`, `src/blocks/sign-up.tsx`

**Interfaces:**
- Produces: one component per brand named `<Brand>Icon` for Google, Github, Gitlab, Apple, X (named `XBrandIcon` to avoid the existing `XIcon`), Facebook, Instagram, Youtube, Tiktok, Reddit, Twitch, Discord, Whatsapp, Telegram, Spotify, Figma, Notion, Dropbox, GoogleDrive, Zoom, Atlassian, Jira, Trello, Shopify, Stripe, Paypal, Visa, Mastercard, plus hand-built `MicrosoftIcon` and `LinkedinIcon`; `export interface BrandIconProps extends React.SVGProps<SVGSVGElement>`; `export const brandColors: Record<string, string>` keyed by the lower-case brand slug (`google`, `github`, …); `export const brandIcons` map for the docs page.

- [ ] **Step 1: Write the failing tests**

```tsx
it('renders one filled path, decorative by default', () => {
  const { container } = render(<GoogleIcon />);
  const svg = container.querySelector('svg')!;
  expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  expect(svg).toHaveAttribute('fill', 'currentColor');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
});
it('becomes a labelled image when given aria-label, and keeps className and style', () => {
  render(<GithubIcon aria-label="GitHub" className="size-8" style={{ color: 'red' }} />);
  const img = screen.getByRole('img', { name: 'GitHub' });
  expect(img).toHaveClass('size-8');
  expect(img).not.toHaveAttribute('aria-hidden');
});
it('every brand has a hex colour', () => { /* every key of brandIcons exists in brandColors and matches /^#[0-9A-F]{6}$/i */ });
```

- [ ] **Step 2: Run, expect FAIL** (module missing).

- [ ] **Step 3: Extract paths**: in a scratch dir outside the repo, `npm pack simple-icons`, unpack, read each listed brand's `icons/<slug>.svg` path data and hex from the package's data file. Write `brand-icons.tsx` with a small `brand(name, path)` factory (same spread order as `icons.tsx`: defaults, then caller props), the `brandColors` record, and the hand-built Microsoft (four squares) and LinkedIn (rounded square with an "in") marks. Add a doc comment on the trademark and "Sign in with Google/Apple" button-rule caveat. Do not commit the scratch files.

- [ ] **Step 4: Example, registry and sign-in/up buttons**

`src/examples/brand-icons.tsx`: a grid of every brand icon with its name beneath (text labels, icons decorative) and a toggle that colours them with `brandColors`. Registry `m('brand-icons', 'Brand icons', 'Display', 'Logos of popular services as single-colour SVGs, for sign-in buttons and integrations lists.', { keywords: ['logo','google','github','social','login','payment'] })`; prepend to `NEW_SLUGS`. In `sign-in.tsx` and `sign-up.tsx`, add a "Continue with Google" and a "Continue with GitHub" `Button variant="outline"` (icon + text) above an "or" divider.

- [ ] **Step 5: Verify**: `npm run registry:build && npm run typecheck && npm test` pass (the all-examples axe scan covers the new example); look at the brand-icons page and the two blocks in the browser.

- [ ] **Step 6: Commit and push**: `git add src public README.md && git commit -m "feat: brand icons and social sign-in buttons" && git push origin main`.

---

### Task 6: Theme presets data, contrast test, build output

**Files:**
- Create: `src/registry/themes.json`, `src/themes.test.ts`
- Modify: `scripts/build-registry.mjs` (copy to `public/r/themes.json`)

**Interfaces:**
- Produces: `themes.json` shaped `{ "<name>": { "label": string, "light": Tokens, "dark": Tokens } }` with `Tokens = { "primary": "#rrggbb", "primary-foreground": "#rrggbb", "accent": "#rrggbb", "accent-foreground": "#rrggbb", "ring": "#rrggbb" }`, keys in the order blue, indigo, violet, rose, red, emerald, teal, amber, orange, slate.

- [ ] **Step 1: Write the failing test `src/themes.test.ts`**

Imports `themes` from `@/registry/themes.json`; a `contrast(hexA, hexB)` helper implementing the WCAG relative-luminance ratio. Tests: the ten names in the order above; every token is `#rrggbb` and all five keys exist in both modes; `primary` vs `primary-foreground` and `accent` vs `accent-foreground` ≥ 4.5 for every preset in both modes; `blue` equals the values parsed from `:root, .light {` and `.dark {` in `src/index.css` (import it with `?raw`).

- [ ] **Step 2: Run, expect FAIL** (file missing).

- [ ] **Step 3: Write `themes.json`** with ten presets: keep blue exactly as today, derive the other nine in the same lightness pattern, and give amber and orange a dark `primary-foreground` so they pass. Iterate until the test passes.

- [ ] **Step 4: Emit `public/r/themes.json`** from `scripts/build-registry.mjs` (plain copy), run `npm run registry:build`, and confirm the file exists and the drift check stays clean after committing.

- [ ] **Step 5: Verify and commit**: `npm run typecheck && npm test`, then `git add src public scripts && git commit -m "feat: ten theme presets with a WCAG contrast test" && git push origin main`.

---

### Task 7: `befui init --theme`

**Files:**
- Create: `src/cli-theme.test.ts`
- Modify: `bin/befui.mjs`

**Interfaces:**
- Consumes: `public/r/themes.json` and `public/r/init.json`.
- Produces: `befui init --theme <name>` (and the `--theme` value flag registered in `valueFlags`).

- [ ] **Step 1: Write the failing tests in `src/cli-theme.test.ts`** (spawn `node bin/befui.mjs` with `spawnSync`, `cwd` a fresh temp dir, `--from <abs path to public/r>`, `--dir <temp>/src`, `--no-install`)

- `init --theme rose` exits 0; `<temp>/src/index.css` has rose's light `primary` inside the `:root, .light {` block and rose's dark `primary` inside `.dark {`, and does not contain blue's light `primary` any more.
- `init` with no `--theme` leaves blue's values.
- `init --theme nope` exits non-zero, prints the ten valid names, and writes no `index.css`.
- `init --theme` with no value exits non-zero with a usage message.
- With an existing `index.css` that has no `:root` or `.dark` token blocks, `init --theme rose` exits non-zero and leaves that file byte-for-byte unchanged.

- [ ] **Step 2: Run, expect FAIL** (`--theme` is ignored today).

- [ ] **Step 3: Implement** in `bin/befui.mjs`: add `'--theme'` to `valueFlags`; `async function applyTheme(cssPath, name)` that loads `themes` through the existing `load` mechanism (a `load('themes')` call reads `themes.json`), validates the name before writing anything, then replaces the five `--<token>: <value>;` lines inside each of the `:root, .light {…}` and `.dark {…}` blocks, dying with a clear message when a block or token is missing and leaving the file untouched. In the `init` branch, validate `--theme` first, write the init files, then apply to `join(dir, 'index.css')`.

- [ ] **Step 4: Verify**: `npm test -- cli-theme` passes; `npm run typecheck`.

- [ ] **Step 5: Commit and push**: `git add bin src && git commit -m "feat: befui init --theme" && git push origin main`.

---

### Task 8: Themes page on the docs site

**Files:**
- Create: `src/site/themes-page.tsx`
- Modify: `src/App.tsx` (route `themes`, hide the docs sidebar like `icons`), `src/site/layout.tsx` (nav entry `['/themes', 'Themes', PaletteIcon]` and a command-palette item)

**Interfaces:**
- Consumes: `themes` from `@/registry/themes.json`.
- Produces: `export function ThemesPage()`; a helper `themeCss(name: string): string` returning the `:root, .light {…}` and `.dark {…}` text used by both Apply and Copy CSS.

- [ ] **Step 1: Write the failing test** `src/themes-page.test.tsx`: `themeCss('rose')` contains rose's light and dark `primary`; `render(<ThemesPage />)` shows ten theme cards (buttons named for each label), clicking Apply on one adds a `<style id="befui-theme">` to `document.head` containing that preset's CSS and replaces (does not duplicate) it on a second click; the page passes axe.

- [ ] **Step 2: Run, expect FAIL** (module missing).

- [ ] **Step 3: Implement** the page: a card per preset (swatches of primary and accent for the current mode, a mini preview of a `Button`, `Badge` and `Progress`, an Apply button, a Copy CSS button using the existing `CopyButton` pattern), an `npx github:RandomKid24/befui init --theme <name>` line, and a Reset button that removes the style tag. Wire the route and nav entries.

- [ ] **Step 4: Verify in the browser**: open `#/themes`, apply three presets in light and dark and check the rest of the site recolours, no console errors, layout fine at mobile width.

- [ ] **Step 5: Commit and push**: `git add src && git commit -m "feat: themes page with live apply and copy css" && git push origin main`.

---

### Task 9: Release 1.8.0

**Files:** Modify `src/registry/changelog.json`.

- [ ] **Step 1:** Add a `1.8.0` entry dated today titled "Next.js support, 108 more icons, brand logos and ten themes" with `added`/`changed` notes in the house style: Next.js (`changed`, slug-less), the icon batches (`added`, slug `icons`), brand icons (`added`, slug `brand-icons`), themes (`added`, slug-less), sign-in/sign-up social buttons (`changed`, slugs `block:sign-in`, `block:sign-up`).
- [ ] **Step 2:** `npm run registry:build && npm run typecheck && npm test && npm run build`. Expected: all pass; the generated-files check `test -z "$(git status --porcelain -- public src/registry CHANGELOG.md README.md)"` is clean after committing.
- [ ] **Step 3:** `git add -A src public CHANGELOG.md README.md && git commit -m "docs: 1.8.0 changelog" && npm version minor && git push origin main --follow-tags`; confirm CI is green with `gh run list --branch main --limit 1`.

---

### Task 10: Extend the axe scan to blocks

**Files:** Modify `src/examples.a11y.test.tsx`, `src/a11y-baseline.json`.

**Interfaces:** Baseline keys for blocks are `block:<slug>`.

- [ ] **Step 1:** Extend the loaders to also glob `/src/blocks/*.tsx`, naming those entries `block:<slug>`; the "baseline lists only real examples" test accepts both kinds; the "never baselined" list will gain the ten new block slugs as `block:<slug>` in Tasks 11 to 13 (add the names now so they are enforced from the start).
- [ ] **Step 2:** Run `npm test`. Expected: FAIL for existing blocks that violate axe (possibly none).
- [ ] **Step 3:** Run `UPDATE_BASELINE=1 npm test` then `npm test`; review each recorded reason and fix any that is a one-line demo or component bug instead of baselining it. Expected: PASS.
- [ ] **Step 4:** Commit and push: `git add src && git commit -m "test: scan blocks with axe too" && git push origin main`.

---

### Task 11: Blocks group 1 (`otp-verify`, `onboarding-wizard`, `notifications-page`, `server-error-page`)

**Files:** Create the four `src/blocks/*.tsx`, `src/blocks.test.tsx`; modify `src/registry/index.ts` (four `bMeta` entries; add `'Messaging' | 'Productivity'` to the `module` union now for Task 13).

**Interfaces:** Entries: `otp-verify` (Auth), `onboarding-wizard` (Account), `notifications-page` (Account), `server-error-page` (Layout). Descriptions as in the spec table.

- [ ] **Step 1: Write the failing tests in `src/blocks.test.tsx`**

- `otp-verify`: typing six digits into the code input enables the Verify button and a wrong code shows an error message (the block's mock accepts `123456`); a resend control is disabled while the countdown runs and re-enables when it reaches zero (use fake timers).
- `onboarding-wizard`: starts at step 1 of 4; Next is blocked with a visible error until the required field is filled; Back returns to the previous step with its values kept; the last step shows a completion message.
- `notifications-page`: the unread tab lists only unread items; "Mark all read" empties it.
- `server-error-page`: renders a heading containing "500" and a Try again button that calls its handler path (shows a loading state).

- [ ] **Step 2: Run, expect FAIL** (modules missing).
- [ ] **Step 3: Build the four blocks** from existing components (`otp-input`, `stepper`, `card`, `tabs`, `notification-center`-style items, `timeline`, `button`, `alert`, `empty-state` as fit), registered with names, modules and descriptions from the spec; add their `block:<slug>` names to the "never baselined" list if not already there.
- [ ] **Step 4: Verify**: `npm run registry:build && npm run typecheck && npm test` (axe passes for the four with no baseline entries); then browser-check each at desktop and mobile width (no horizontal scroll, no console errors).
- [ ] **Step 5: Commit and push**: `git add src public README.md && git commit -m "feat: otp verify, onboarding wizard, notifications and server error blocks" && git push origin main`.

---

### Task 12: Blocks group 2 (`team-page`, `contact-page`, `finance-dashboard`)

**Files:** Create three `src/blocks/*.tsx`; modify `src/registry/index.ts`, `src/blocks.test.tsx`.

**Interfaces:** `team-page` (Marketing), `contact-page` (Marketing), `finance-dashboard` (Dashboard).

- [ ] **Step 1: Failing tests:** `contact-page`: submitting empty shows field errors and no success message; a valid submit shows a confirmation; an FAQ item expands on click. `team-page`: renders at least six members each with a name and role. `finance-dashboard`: renders balances and a transactions table with at least five rows.
- [ ] **Step 2:** Run, expect FAIL. **Step 3:** Build the three blocks from existing parts (`stat-card`, the chart components, `data-table`/`table`, `accordion`, `avatar`, `card`, `field`/`input`/`textarea`), register them.
- [ ] **Step 4:** Verify as in Task 11 (axe, tests, browser at both widths).
- [ ] **Step 5:** Commit and push: `git add src public README.md && git commit -m "feat: team, contact and finance dashboard blocks" && git push origin main`.

---

### Task 13: Blocks group 3 (`kanban-board-page`, `chat-app`, `calendar-app`)

**Files:** Create three `src/blocks/*.tsx`; modify `src/registry/index.ts`, `src/blocks.test.tsx`.

**Interfaces:** `kanban-board-page` (Dashboard), `chat-app` (Messaging), `calendar-app` (Productivity).

- [ ] **Step 1: Failing tests:** `chat-app`: selecting another conversation switches the thread; sending a message appends it and clears the composer; an empty composer cannot send. `calendar-app`: switching between Month and Week changes the view; clicking a day opens the event dialog; saving adds an event that appears on that day. `kanban-board-page`: moving a card with the keyboard-friendly move button changes the column totals; the filter narrows the cards.
- [ ] **Step 2:** Run, expect FAIL. **Step 3:** Build from existing parts (`kanban`, `chat`, `event-calendar`, `dialog`, `filter-bar`, `avatar`, `tabs`, `segmented`), register them.
- [ ] **Step 4:** Verify as in Task 11.
- [ ] **Step 5:** Commit and push: `git add src public README.md && git commit -m "feat: kanban page, chat app and calendar app blocks" && git push origin main`.

---

### Task 14: CLI `diff` and `remove`

**Files:** Create `src/cli-diff-remove.test.ts`; modify `bin/befui.mjs`, `README.md` (CLI table), the usage line.

**Interfaces:**
- Produces: `befui diff <name…>` and `befui remove <name…> [--force]`. Inside `bin/befui.mjs`: `function unifiedDiff(a: string, b: string, labelA: string, labelB: string): string` (empty string when equal after normalising `\r\n` to `\n`; 3 lines of context; LCS on lines).

- [ ] **Step 1: Write the failing tests** (`spawnSync` as in Task 7; a helper installs `button` and `password-input` into a temp `--dir` with `add … --from <abs public/r> --no-install`)

- `diff button` on an untouched copy prints `button is up to date` and exits 0.
- After appending a comment line to the local `button.tsx`, `diff button` prints a line starting `-` for the removed/added content and a line starting `+` for the latest line, and exits 0.
- A CRLF copy of the untouched file counts as up to date.
- `diff` for a component not installed locally prints "not installed" and exits 0; `diff nope` (unknown to the registry) exits non-zero.
- `remove button` deletes `components/ui/button.tsx` and exits 0, and leaves `index.css` and `lib/utils.ts` alone.
- `remove input` while `password-input.tsx` is installed exits non-zero and lists `password-input.tsx`; with `--force` it removes `input.tsx`.
- `remove ../../x` and `remove "Button"` exit non-zero (name must match `^[a-z0-9-]+$`, optionally prefixed `block:`) and delete nothing.

- [ ] **Step 2: Run, expect FAIL** (commands unknown).
- [ ] **Step 3: Implement** both commands in `bin/befui.mjs`, reusing `load(name)` for the latest files; `remove` scans local `components/ui/*.tsx` and `blocks/*.tsx` under `--dir` for `from '@/components/ui/<name>'` or `from './<name>'` imports before deleting. Update the usage line and the README CLI table.
- [ ] **Step 4: Verify**: `npm test -- cli-diff-remove` passes; `npm run typecheck`.
- [ ] **Step 5: Commit and push**: `git add bin src README.md && git commit -m "feat: befui diff and remove" && git push origin main`.

---

### Task 15: Release 1.9.0

**Files:** Modify `src/registry/changelog.json`.

- [ ] **Step 1:** Add a `1.9.0` entry dated today titled "Ten new page blocks and befui diff and remove": an `added` note listing the ten blocks (slugs `block:<slug>` each), an `added` note for the CLI commands (slug-less), a `changed` note that blocks are now checked for accessibility (slug-less).
- [ ] **Step 2:** `npm run registry:build && npm run typecheck && npm test && npm run build`; drift check clean after committing.
- [ ] **Step 3:** `git add -A src public CHANGELOG.md README.md && git commit -m "docs: 1.9.0 changelog" && npm version minor && git push origin main --follow-tags`; confirm CI is green.
