# befui 1.7.0: missing basics and a CI gate

Date: 2026-10-13. Status: draft for review.

## Goal

Make befui the copy-paste React library people pick for quality and coverage, not component count. 1.7.0 closes the real gaps in the core primitives and adds the first automated check that backs the "accessible by default" claim.

Audience: the author's own projects, and other developers who install via the CLI.

## What exists today (checked in the repo)

- 192 components in `src/components/ui`, 27 blocks, an icon set, a CLI, an MCP server, `llms.txt`.
- Adding a component costs three files plus one changelog entry: `src/components/ui/<slug>.tsx`, `src/examples/<slug>.tsx`, one `m(...)` line in `src/registry/index.ts`. `npm run registry:build` generates the CLI JSON in `public/r`, `llms.txt`, `llms-full.txt`, `requires.json` and `CHANGELOG.md`. `npm run stories:gen` makes the Storybook stories from the examples.
- No tests, no CI, no lint. `public/` is tracked in git, so generated files can go stale unnoticed. The README is already inconsistent: the headline says 192 components, the catalog heading says 141, and icon counts say both 280 and 189.
- Storybook already has `@storybook/addon-a11y`, but nothing runs it automatically.

## Scope

### 1. Seven new components (qr-code was dropped by the user before execution)

Candidates I rejected because they already exist or the platform does it: `multi-select` and `autocomplete` (combobox), `drawer` and `sheet` (dialog), `textarea` (input), `field` (label), date range (date-picker), `sparkline` (charts), `resizable` (split-pane), `aspect-ratio` (Tailwind `aspect-video`), `masonry` (CSS `columns`), `scroll-area` (`scrollbar-width: thin`).

All seven follow the existing conventions: one file, `cn` for class merging, `cva` for variants, logical start/end spacing so they flip in RTL, motion disabled under `prefers-reduced-motion`, a typed props interface with a one-line doc comment.

| Slug | Category | Exports | Packages |
|---|---|---|---|
| `hover-card` | Overlays | `HoverCard`, `HoverCardTrigger`, `HoverCardContent` | `@radix-ui/react-hover-card` (new) |
| `button-group` | Inputs | `ButtonGroup` (`orientation` horizontal or vertical) | none |
| `input-group` | Inputs | `InputGroup`, `InputGroupInput`, `InputAddon` | none |
| `toggle-group` | Inputs | `ToggleGroup` (`type` single or multiple, `variant`, `size`), `ToggleGroupItem` | `@radix-ui/react-toggle-group` (already installed) |
| `navigation-menu` | Navigation | `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink` | `@radix-ui/react-navigation-menu` (new) |
| `menubar` | Navigation | `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarSeparator`, `MenubarShortcut` | `@radix-ui/react-menubar` (new) |
| `tour` | Overlays | `Tour` | `@radix-ui/react-popover` (already installed) |

Behavior notes per component:

- **hover-card**: opens after 200 ms, closes after 100 ms, content styled to match `popover`. Keyboard users open it with focus on the trigger (Radix behavior).
- **button-group**: `role="group"`; children keep their own variants; inner corners squared and inner borders collapsed with a negative logical margin.
- **input-group**: one border and one focus-within ring around the whole row. `InputAddon` takes text, an icon or a button and has a `side` of `start` or `end`. `InputGroupInput` is a plain borderless `<input>`, so the file has no dependency on `input.tsx`.
- **toggle-group**: `type="multiple"` is the reason it exists, for formatting toolbars. `segmented` stays the single-select control and is unchanged.
- **navigation-menu**: desktop mega-menu with the Radix shared viewport. Small screens are the `navbar`'s job and are out of scope. Content enters with the existing `animate-pop`, so there are no new keyframes and `befui update` has nothing new to append.
- **menubar**: item styling copied from `dropdown-menu.tsx` so the two look identical.
- **tour**: props `steps` (`{ target: string | RefObject<HTMLElement>; title; body; side? }[]`), `open`, `onOpenChange`, `onFinish`. It dims the page with a cut-out around the target, anchors a card with `PopoverAnchor`, and shows "2 of 5", Back, Next, Skip and a final Done. Escape closes. Arrow keys step. Focus moves into the card and returns to where it was on close. The target scrolls into view and the cut-out re-measures on resize and scroll. A step whose target is not in the DOM is skipped. This is the only component with real new logic, so it gets the most test coverage.

Each component gets a demo in `src/examples/<slug>.tsx` that shows its main use, a registry `m(...)` line with description and search keywords, and an entry in `NEW_SLUGS` so the docs site marks it New.

### 2. CI gate

`.github/workflows/ci.yml`, on pushes to `main` and on pull requests, Node 22:

1. `npm ci`
2. `npm run build` (registry build, `tsc --noEmit`, `vite build`)
3. `test -z "$(git status --porcelain -- public src/registry CHANGELOG.md README.md)"`: fails if the committed generated files are stale after the build, including generated files that were never committed.
4. `npm test`

Test setup, adding four devDependencies: `vitest` (3.x, matches Vite 6), `jsdom`, `@testing-library/react`, `vitest-axe`. `"test": "vitest run"` in `package.json`. Tests import from `vitest` explicitly, with no globals, and assert `expect(results.violations).toEqual([])` rather than using axe's custom matcher, so no type augmentation is needed.

Two test files:

- **`src/examples.a11y.test.tsx`**: for every file in `src/examples`, render the default export inside `Suspense`, fail on any thrown error, and run axe. The `color-contrast` rule is off because jsdom has no layout. Slugs that fail axe today, or cannot render in jsdom even with the stubs, are recorded in `src/a11y-baseline.json` as slug to one-line reason. The test fails if a slug outside the baseline fails, and also fails if a baseline slug now passes, so the list can only shrink. `UPDATE_BASELINE=1 npm test` rewrites the file from the current results. A new component can never be added to the baseline.
- **`src/new-components.test.tsx`**: the all-examples test only sees overlays in their closed state, so this file covers the open state of the seven new components: hover-card on pointer enter, menubar and navigation-menu opened, and tour stepping through Next, Back, Skip and a missing target. Each is also run through axe while open. It also holds a deterministic check that `QRCode value="hello" level="M"` yields a 21-module code (viewBox `0 0 29 29`).

Shared setup in `vitest.setup.ts` stubs what jsdom lacks: `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `Element.prototype.scrollIntoView`, pointer-capture methods Radix calls, and `HTMLCanvasElement.prototype.getContext` (signature pad).

Known limits, stated so they are not mistaken for coverage:

- Contrast and layout are not checked.
- Overlay contents of the existing 192 components are not scanned in the open state. Only the seven new components get that.
- Blocks are not scanned directly. They are built from the components that are.

### 3. README and release

- Replace the hand-kept catalog in the README ("Components (141)" and the category lists) with a block between `<!-- components:start -->` and `<!-- components:end -->` markers, written by `scripts/build-registry.mjs` from the registry. The headline component count is generated the same way. Step 3 of the CI job then catches drift.
- Count the real icon exports and make every mention agree (the README currently says both 280 and 189).
- Add a 1.7.0 entry to `src/registry/changelog.json` with "Added" notes for the seven components (the CI gate is not user-facing, so it is not listed), then `npm version minor` per the README's Releasing section. Per the repo's working agreement, commit and push to `main` after build, typecheck and tests pass.

## Out of scope

Publishing to npm, tests or fixes for existing components beyond baselining their axe results, new chart types, a Playwright suite, linting, scanning blocks, and any change to `segmented`.

## Success criteria

- `npm run build` and `npm test` pass locally and in the CI workflow.
- All seven components have a working docs-site page, a Code tab, a generated `public/r/<slug>.json` and a Storybook story.
- `src/a11y-baseline.json` exists, contains no new component, and the all-examples test passes against it.
- A deliberate accessibility regression (for example removing an `aria-label` from a new component's demo) makes `npm test` fail.
- README counts match the registry and CI fails if they drift.
