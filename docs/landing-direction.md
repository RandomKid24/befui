# Landing page direction

Surface: befui home page. Purpose: choose (should I adopt this?) with a working proof. Scope: full overhaul of the home page. Kept as commitments: the name, the "Interfaces people actually enjoy using" line, the blue default theme, Inter inside the components (it is the library's own default, shipped to users).

## Product truth

Copy-paste React components. The CLI puts one file per component into your project and from then on it is yours. 271 registry components (the README counts 272), 37 page blocks, 121 also as Flutter widgets, 269 as `<bef-*>` HTML tags. One CSS block rebrands everything: ten palettes that pass WCAG AA, a radius, three densities, light and dark. Radix handles focus and keyboard. RTL and locale are supported.

## Governing idea

The page you are reading is the library, and it is themable. Three CSS lines are the whole theme, so the first frame hands you those lines. Change the palette, the radius or the density and the nav, the form, the approvals list and the rest of the page re-skin in the same moment, with the exact CSS you would paste into your project changing beside them.

Competitor swap test: a rival library has no single block of tokens that its own marketing page visibly obeys, and none can show the real file and the real CSS side by side with live output. The hierarchy (tokens first, then the file, then the screens) comes from befui's mechanism, not from its name.

## First frame

Headline left, the live CSS readout right, ruled with a hairline, no frame. Under them one control strip that edits those three lines. Under that a real composition from the library (leave request form, approvals, headcount, leave by month), all reading the same variables.

## Visual grammar

- Display type: Bricolage Grotesque for headings and site prose. Its optical-size axis and uneven letter shapes sit well beside the hand-drawn icon set. Inter stays inside components. JetBrains Mono for code.
- Geometry follows `--radius`, so the swatches, the controls and the composition all change together. No pill shapes anywhere on the page.
- Structure by rules and alignment: hairlines, columns of type, a master and detail view. A frame is used only around real objects: the live composition, the source file, the block preview.
- Colour comes from the theme tokens, so the page is never "one blue".

## Journey

1. Bench: headline, token lines, controls, live composition. Action: copy the CSS, get started.
2. Open the file: pick a component, read the exact source the CLI copies, its library parts, its npm packages, and its React, HTML and Flutter usage. Action: copy the install command.
3. Every family: the nine families as columns of real names with true counts, including how many exist in Flutter. Action: browse.
4. Blocks: a list of whole screens with the selected one running live beside it. Action: open the block.
5. Questions and close: the install line again.

## Keyboard, touch, motion

Every control is a native input or button. Swatches are a radio group. Reduced motion removes the line flash and the stroke draw. On a phone the strip wraps, the composition stacks, the file view stacks above its list.

## Honesty rules

Every number on the page is read from the registry. The file view shows `public/r/<name>.json`, the same files the CLI serves. No invented customers, metrics or testimonials.

## Acceptance

Screenshots at 1440, 1366x768, 834, 390 and 320 wide, plus a reduced-motion pass. Tests green, no sideways scroll, text contrast measured on the real backgrounds in light and dark and in a changed theme.
