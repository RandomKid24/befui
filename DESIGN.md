# Design

How befui looks and why. Read this before adding a component, a variant or a page, so it matches the rest.

## Principles

1. **Quiet by default.** Hairline borders, small shadows, one accent colour. A screen built from befui should look calm; the content is the loudest thing on it.
2. **One variable rebrands everything.** Every colour is a CSS variable. Change `--primary` and links, focus rings, active states, charts and buttons follow, in light and dark. Components never hard-code a colour, except a few on purpose (brand logos, code highlighting, the `brutal` button).
3. **Motion explains, it does not decorate.** Things move to show cause and effect: a panel opening, a number counting to its value, a toast arriving. Everything stops for `prefers-reduced-motion`. Nothing loops without a reason (loaders, live data).
4. **Real states, not just the happy path.** Every input has invalid, disabled and loading. Every list has empty and error.
5. **Same design on every platform.** React, the `<bef-*>` HTML tags and the Flutter widgets share the same tokens, sizes and radii. A change to a token goes to all three.
6. **Accessible first.** Radix handles focus, keyboard and ARIA for overlays and menus. The rest follow the same rules, and the test suite runs an accessibility check on every example (`src/examples.a11y.test.tsx`).

## Colour

Tokens live in `src/index.css` (`:root` for light, `.dark` for dark). Eleven ready palettes are in `src/registry/themes.json` and on the Themes page.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--background` | `#ffffff` | `#080c0e` | page |
| `--foreground` | `#0f172a` | `#e6eaec` | text |
| `--card` | `#ffffff` | `#0d1316` | raised surfaces |
| `--primary` | `#0a6f8c` | `#2fb1d1` | the one accent: buttons, links, focus, active |
| `--secondary` | `#f1f5f9` | `#151c20` | quiet fills, hover |
| `--muted` / `--muted-foreground` | `#f8fafc` / `#5b6b80` | `#0f1518` / `#8a979d` | backgrounds and secondary text |
| `--accent` | `#e4f4f8` | `#0e2a33` | selected rows, soft highlights |
| `--border` / `--input` | `#e2e8f0` | `#1c262b` / `#253137` | hairlines and field borders |
| `--ring` | `#1593b6` | `#1c9dbd` | focus ring |
| `--destructive` / `--success` / `--warning` / `--info` | rose, emerald, amber, blue | brighter | status |

Full token list (from `src/index.css`):

| Token | Light | Dark |
|---|---|---|
| `--primary-foreground` | `#ffffff` | `#071013` |
| `--card-foreground` / `--popover` / `--popover-foreground` | `#ffffff`, `#0f172a` | `#0d1316`, `#e6eaec` |
| `--secondary-foreground` | `#0f172a` | `#e6eaec` |
| `--accent-foreground` | `#0a5a72` | `#8ad8ea` |
| `--destructive` | `#e11d48` | `#f43f5e` |
| `--success` | `#059669` | `#10b981` |
| `--warning` | `#d97706` | `#f59e0b` |
| `--info` | `#2563eb` | `#60a5fa` |

The primary is petrol, befui's own colour, not a Tailwind scale: `#0a6f8c` (light primary), `#2fb1d1` (dark primary), `#e4f4f8` and `#0e2a33` (accent), `#1593b6` and `#1c9dbd` (ring). Status blue (`--info`) stays separate from it. Light neutrals are slate; dark neutrals are an ink tinted toward the primary (`#080c0e`, `#0d1316`, `#151c20`).

Rules: text on `--primary` is `--primary-foreground`; status colours always come with an icon or label, never colour alone; primary text on the page background must pass 4.5:1 (the tests check this for every palette).

## Type

Onest for text and headings, JetBrains Mono for code and keys. The scale follows Tailwind: 11 (labels, uppercase with tracking), 12, 13 (dense UI), 14 (default), 16, 18, 20, 24, 30, 36+. Weights: 400 body, 500 labels and buttons, 600 titles. Headlines use tight tracking (`-0.02em` and up). Numbers in tables and stats use tabular figures.

## Shape and space

- **Radius:** `--radius` is 8px. Small is 6, large 10, cards and dialogs 14, pills fully round. Inputs, buttons and menus are 8.
- **Borders:** 1px, `--border`. Focus is a 2px `--ring` at 40–50% opacity, never removed.
- **Shadow:** `sm` for cards at rest, `md` for hover and popovers. Dark mode leans on borders more than shadows.
- **Density:** controls are 36px tall (32 small, 40 large); touch targets on mobile are at least 40.
- **Spacing:** a 4px grid. Cards pad 20, dense lists 12–16, page gutters 16 on mobile and 24+ on desktop.

## Motion

| What | Timing |
|---|---|
| hover, press, colour changes | 150ms ease |
| menus, popovers, dropdowns | 150ms fade + 2px rise |
| accordion, collapsible, panels | 200–300ms, height via grid rows |
| drawers, sheets, toasts | 250–280ms `cubic-bezier(0.22, 1, 0.36, 1)` |
| number tickers, progress, chart draw-in | 700–1200ms ease-out, once |
| page change | 280ms fade and 6px rise |

Only `transform` and `opacity` are animated in loops or on scroll, so nothing repaints per frame. Components that run on a timer (clocks, live charts, typewriter, marquee) pause when off screen or when the user prefers reduced motion.

## Components

- **Variants over props soup.** A `Button` has `variant`, `size`, `shape`. Add a variant before adding a boolean.
- **Compose, do not configure.** Cards are `Card` + `CardHeader` + `CardContent`; menus are items you pass in. A component takes children before it takes a config object.
- **One file each.** A component is a single file you can copy; shared pieces (`cn`, icons) are the only imports across files.
- **Logical spacing.** `ms-*`, `ps-*`, `start-*` instead of left and right, so components flip in right-to-left pages.
- **Icons:** our own set (`src/components/ui/icons.tsx`), 24px grid, 1.75 stroke, `currentColor`, optional draw animation. No icon package.

## The docs site

The site is built from the library, so it is the first test of every component.

- **Home:** headline, two buttons, the install line, then a sheet of real components (buttons, badges, controls) that fills in diagonally once. No decorative animation loops.
- **Per component:** React, HTML and Flutter tabs, each on its own page with its own sidebar. Flutter pages have a working preview at phone width and a phone-frame view.
- **Speed budget:** the first load is the shell and the home page; every other page loads on demand. Long lists use `content-visibility` and lazy-mounted previews so they stay smooth.

## Flutter

The same tokens, as a `BefTheme` extension (`context.bef.primary`). Widgets use custom-styled Material parts: hover, press (scale 0.97) and focus ring are drawn by `BefPressable`; icons are painted from the same SVG paths. Never hard-code a colour in a widget, use `context.bef`. Dark mode follows `Theme.of(context).brightness`.

## Adding something new

1. Does an existing component with a new variant cover it? Add the variant.
2. Build it with tokens only. Check light, dark, a custom palette and RTL.
3. Add an example in `src/examples/<name>.tsx` with the empty/loading/error states that apply.
4. Run `npm run registry:build` (updates the catalog, `llms.txt`, README counts and `COMPONENTS.md`) and `npm test`.
5. If it makes sense on a phone, add the Flutter widget and example (see `flutter/`).

## Tokens added for motion, depth and density

- **Motion:** `--dur-fast` 150ms, `--dur-base` 250ms, `--dur-spring` 400ms, `--dur-slow` 700ms; `--ease-out`, `--ease-spring` (a `linear()` curve with a small overshoot, for toasts, pops and the switch thumb). Use `duration-(--dur-base)` and `ease-spring`; `src/motion-tokens.test.ts` fails on hard-coded `duration-150/200/300/700`. Transitions (not keyframes) are what stay interruptible, so prefer them for anything the user can reverse mid-flight.
- **Elevation:** `--elev-1..3` are layered shadows; dark mode adds a 1px inner highlight. Tailwind's `shadow-xs/sm/md/lg/xl` map to them.
- **Accent steps:** `bg-primary-soft` (10%) and `ring-primary-ring` (35%) follow `--primary`.
- **Press:** `--press` (0.97) on buttons, toggles and switches; hoverable cards use 0.99.
- **Density:** `--control-h`, `-sm`, `-lg` drive buttons, inputs and selects. Set `data-density="compact"` or `"comfortable"` on any ancestor.
- **Loading:** `Spinner` appears after 150ms; `SkeletonText`, `SkeletonAvatar` and `SkeletonCard` match real layouts.
- **Checks:** `src/contrast.test.ts` (muted text >= 4.5:1 on every surface, both modes) and `npm run test:visual` (Playwright screenshots: light, dark, RTL, custom palette; baselines are per platform).
