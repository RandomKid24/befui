# Components

Every befui component and block. **207 React components**, **206 with an HTML tag** (`<bef-*>`), **116 Flutter widgets**, and **37 page blocks**.
(Generated from the registry by `npm run registry:build`. Do not edit by hand.)

Install a React component with `npx github:RandomKid24/befui add <name>`, the Flutter version with `npx github:RandomKid24/befui add <name> --flutter`.

## Layout (5)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `app-shell` | Sidebar, topbar and scrolling content area, plus a page header. | ✓ |  |
| `landing-sections` | Marketing page parts: Hero, LogoStrip, FeatureGrid, StatsStrip, Faq, CtaBanner and SiteFooter. Stack them with a Navbar. | ✓ |  |
| `settings-layout` | Settings page frame: vertical section list on the left, SettingsSection rows (title and help on the left, controls on the right). | ✓ |  |
| `sidebar` | Collapsible nav with groups, nested links and badges. Icon rail on desktop, slide-over on mobile. | ✓ |  |
| `split-pane` | Two resizable panels with a draggable divider. Keyboard resizable. Horizontal or vertical. | ✓ |  |

## Navigation (15)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `bottom-nav` | Mobile tab bar with icons, labels, an active pill and count badges. | ✓ | ✓ |
| `breadcrumb` | Trail of parent pages. | ✓ |  |
| `dock` | Icons that grow toward the pointer, like the macOS dock. | ✓ |  |
| `menubar` | Desktop-app style bar of menus (File, Edit, View) with shortcuts and checkable items. | ✓ |  |
| `navbar` | Top bar with brand, links and actions that folds into a menu on small screens. | ✓ | ✓ |
| `navigation-menu` | Desktop top-bar menu whose items open mega-menu panels, with keyboard and focus handled. | ✓ |  |
| `onboarding-carousel` | Mobile first-run intro with swipeable slides, dots, Skip and a final Get started button. | ✓ | ✓ |
| `order-tracker` | Delivery progress as steps joined by a line that fills up to the current one. Horizontal on wide screens, vertical on phones. | ✓ | ✓ |
| `pagination` | Page buttons with ellipsis for long ranges. | ✓ | ✓ |
| `scroll-progress` | Thin bar that fills as you scroll the page or a container. | ✓ |  |
| `stepper` | Horizontal steps for multi-step forms and onboarding. | ✓ | ✓ |
| `table-of-contents` | On this page list that highlights the section currently in view. | ✓ |  |
| `tabs` | Underline or pill tabs on Radix Tabs. | ✓ | ✓ |
| `tree-view` | Nested expandable list with animated open and close. | ✓ | ✓ |
| `user-menu` | Avatar button for the topbar that opens a menu with name, email, your links and Sign out. | ✓ | ✓ |

## Inputs (42)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `avatar-upload` | Click-to-change profile picture with instant preview, size and type checks, and a Remove link. | ✓ |  |
| `button` | Thirteen variants from plain to glow, shine and 3D press, pill shape, five sizes, loading state, and asChild for links. | ✓ | ✓ |
| `button-group` | Buttons joined into one row or column with shared borders and rounded outer corners. | ✓ | ✓ |
| `calendar` | Month grid for one day or a range. Arrow keys, Page Up/Down, Home and End work. | ✓ | ✓ |
| `checkbox` | Checked, unchecked and indeterminate. Works for select-all rows. | ✓ | ✓ |
| `chip` | Toggleable filter chips, single or multi select. | ✓ | ✓ |
| `color-picker` | Swatches, hex field and the native picker. Always returns a six-digit hex. | ✓ | ✓ |
| `combobox` | Searchable select, single or multiple, with descriptions under each option. | ✓ |  |
| `copy-button` | Copies text and morphs to a check. | ✓ | ✓ |
| `coupon-input` | Promo code field with async validation, an error message and a removable applied chip. | ✓ | ✓ |
| `currency-input` | Money field that groups digits as you type (1,25,000) and hands you a plain number. | ✓ | ✓ |
| `date-picker` | Date and date range fields that open a calendar. The range picker has optional quick presets (Last 7 days, This month...) and a day count. Closes on pick. | ✓ | ✓ |
| `datetime-picker` | One field for a day and a time: calendar on top, time picker below. | ✓ | ✓ |
| `dropzone` | Drag and drop file area with size check and removable file list. | ✓ |  |
| `fab` | Round primary action, extended with a label, or a speed dial that fans out actions. | ✓ | ✓ |
| `file-uploader` | Multi-file drop area with a progress bar per file, cancel, retry and a concurrency limit. You supply the upload function. | ✓ |  |
| `image-upload` | Thumbnail grid with remove buttons, a cover label and a drop tile. Limits count, type and size. | ✓ |  |
| `inline-edit` | Text that becomes a field on click. Enter saves, Escape cancels. | ✓ | ✓ |
| `input` | Text input and textarea with icon, trailing slot, and invalid state. | ✓ | ✓ |
| `input-group` | One field with text, icons or buttons attached at the start or end, like https:// or .com. | ✓ | ✓ |
| `label` | Label with required marker, plus Field for label, control and hint or error. | ✓ | ✓ |
| `mention-input` | Textarea that suggests people when you type @. Arrow keys and Enter pick. | ✓ |  |
| `notification-preferences` | Grid of events by channel (email, push, SMS, in-app) with a switch per cell and a switch per channel. | ✓ | ✓ |
| `number-stepper` | Number field with plus and minus buttons and arrow keys. | ✓ | ✓ |
| `otp-input` | Code boxes with paste, backspace, arrow keys, autofill and a shake on error. | ✓ | ✓ |
| `password-input` | Show and hide toggle with an optional strength meter. | ✓ | ✓ |
| `phone-input` | Phone field with a country picker. Groups digits as you type and hands back the E.164 number and whether it is complete. | ✓ | ✓ |
| `radio-group` | Native radios as selectable cards with descriptions. | ✓ | ✓ |
| `rating` | Star rating with hover preview. Read-only when no handler is given. | ✓ | ✓ |
| `rich-text-editor` | Small editor with bold, italic, underline, heading, lists, quote and link. Value is HTML. Built on contentEditable, no dependency. | ✓ |  |
| `schema-form` | Build a form from a description: text, email, number, date, select, textarea and checkbox fields, validation, and optional multi-step wizard with a stepper. | ✓ |  |
| `search-bar` | Search field with live results, highlighted matches, recent searches and full keyboard control. | ✓ | ✓ |
| `search-input` | Search field with a clear button, Escape to clear and a slash shortcut to focus. | ✓ | ✓ |
| `segmented` | Pick one of a few views or ranges. Smaller than tabs. | ✓ | ✓ |
| `select` | Styled dropdown with groups, built on Radix Select. | ✓ | ✓ |
| `signature-pad` | Draw-your-signature canvas for mouse, touch and pen. Sharp on retina screens, exports a PNG. | ✓ | ✓ |
| `slider` | Native range input with a filled track and floating value bubble. | ✓ | ✓ |
| `switch` | On/off toggle for settings that apply immediately. | ✓ | ✓ |
| `tag-input` | Type and press Enter to add chips. Backspace removes the last. | ✓ | ✓ |
| `theme-toggle` | Icon button that flips light and dark mode and remembers the choice. Also exports a useTheme hook. | ✓ | ✓ |
| `toggle` | Two-state button for favourite, bold or mute. Announces its state to screen readers. | ✓ | ✓ |
| `toggle-group` | A row of toggles where one or several can be pressed, for formatting toolbars. | ✓ | ✓ |

## Display (44)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `accordion` | Collapsible sections with a smooth height animation. Single or multiple open. | ✓ | ✓ |
| `activity-feed` | Who did what and when, grouped under Today and Yesterday, with live relative times and an optional quoted detail. | ✓ | ✓ |
| `approval-flow` | Chain of approvers with decisions, comments and times. The current approver gets Approve and Reject buttons. | ✓ |  |
| `avatar` | Image with initials fallback in a stable color. Five sizes, circle or square, presence dot (online, away, busy, offline), a stacked group with hover names, and UserInfo for avatar plus name and subtitle. | ✓ | ✓ |
| `badge` | Status pill with semantic colors and an optional dot. | ✓ | ✓ |
| `border-beam` | A light beam that circles the border. For pricing cards and featured content. | ✓ |  |
| `brand-icons` | Logos of popular services as single-colour SVGs that follow the text colour, for sign-in buttons and integration lists. | ✓ |  |
| `card` | Bordered surface with header, content and footer parts. | ✓ | ✓ |
| `carousel` | Scroll-snap slides with arrows and animated dots. | ✓ | ✓ |
| `changelog` | Release notes: version and date on the left, tagged New, Improved, Fixed or Removed changes on the right. | ✓ |  |
| `chat` | Message bubbles with avatars, timestamps, a typing indicator and a composer. Enter sends. | ✓ | ✓ |
| `code-block` | Code with a title, optional line numbers and a copy button. No highlighter dependency. | ✓ | ✓ |
| `collapsible` | One section that opens with a smooth height animation. | ✓ | ✓ |
| `comment-thread` | Nested comments with inline reply boxes, three levels deep. | ✓ | ✓ |
| `compare` | Before and after slider. Drag or use arrow keys. | ✓ |  |
| `credit-card` | Payment card preview that flips in 3D to show the CVV. Formats as the user types, guesses Visa, Mastercard, AmEx or RuPay, and can mask the number. | ✓ | ✓ |
| `description-list` | Label and value pairs for a details panel, in one to three columns, optionally with dividers. | ✓ | ✓ |
| `diff-viewer` | Before and after text as a unified diff: red removed lines, green added lines, line numbers, and unchanged stretches folded. | ✓ |  |
| `empty-state` | Dashed placeholder with icon, text and an action. | ✓ | ✓ |
| `format` | formatCurrency, formatCompact, formatPercent, formatBytes, formatDuration and a signed Currency component. Indian rupees by default. | ✓ |  |
| `invoice` | Printable invoice with number, status, from and bill-to, line items, tax and total computed from the lines. | ✓ |  |
| `kbd` | Keyboard key hint. | ✓ |  |
| `marquee` | Endless logo or tag scroll with edge fade. Pauses on hover. | ✓ | ✓ |
| `onboarding-checklist` | Getting-started card with a progress bar, tick-off items, short help text and actions. Collapsible. | ✓ | ✓ |
| `order-summary` | Cart lines with subtotal, discount, shipping, tax and total computed for you. Slots for a coupon field and a checkout button. | ✓ | ✓ |
| `pricing-card` | Plan card whose price counts to the new value. The highlighted plan gets a travelling border beam. | ✓ | ✓ |
| `product-card` | Product tile with image, rating, price with strike-through, discount tag, wishlist heart and Add button. Also exports Price. | ✓ | ✓ |
| `profile-card` | Person card with banner, avatar, role, stats and an actions slot. | ✓ | ✓ |
| `rating-breakdown` | Review summary: big average, stars and a bar per star level. Rows can act as filters. Bars fill in on scroll. | ✓ | ✓ |
| `reveal` | Scroll-in fade-up wrapper and a blur-in headline. One IntersectionObserver each. | ✓ |  |
| `separator` | Horizontal or vertical divider. | ✓ | ✓ |
| `shimmer-text` | Text with a light sweep passing over it. | ✓ | ✓ |
| `sortable-list` | Reorder rows by dragging, or with arrow keys on the grip. Controlled, no drag library. | ✓ | ✓ |
| `spotlight-card` | Card with a glow and border highlight that follow the cursor. | ✓ |  |
| `status-dot` | Small status light with an optional pulse and label. | ✓ | ✓ |
| `swipe-actions` | List row you swipe left to reveal action buttons. Touch, mouse drag and keyboard. | ✓ | ✓ |
| `table` | Dense table parts with hover rows, a selected state, footer and caption. | ✓ | ✓ |
| `tag-manager` | Create, rename, recolor and delete labels, with usage counts. | ✓ |  |
| `terminal` | Dark terminal window with prompt lines and output. Optional typing animation. | ✓ |  |
| `testimonial-card` | Customer quote with avatar, role and optional star rating. | ✓ | ✓ |
| `tilt-card` | 3D card that tilts toward the cursor with a moving sheen. | ✓ |  |
| `timeline` | Vertical activity feed with tone-colored markers. | ✓ | ✓ |
| `typewriter` | Types, holds and deletes phrases in a loop. Static for reduced motion. | ✓ | ✓ |
| `version-log` | Animated version history: the rail draws and dots pop as releases scroll in, entries slide in one by one, releases fold open, with a version jump strip and a kind filter. | ✓ |  |

## AI (7)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `ai-message` | One message in an AI chat: a right-aligned user bubble, or an assistant answer with copy, regenerate and thumbs actions and a blinking caret while it streams. | ✓ | ✓ |
| `prompt-input` | The box you type a prompt into: grows with the text, Enter sends, Shift+Enter adds a line, and the send button turns into Stop while a reply streams. | ✓ | ✓ |
| `prompt-suggestions` | Starter prompts for an empty chat, as two-line cards or compact chips. Selecting one fills the prompt box. | ✓ | ✓ |
| `sources` | Numbered citation chips (Cite) to drop inside an answer, and a SourceList of cards with title and site under it. | ✓ | ✓ |
| `thinking` | A shimmering "Thinking" status with bouncing dots, or a collapsible list of the steps the model is working through that settles into "Thought for 4s". | ✓ | ✓ |
| `token-meter` | How much of a model context window is used: a bar that turns amber and red as it fills, token counts, an optional cost, and a split by prompt, files and reply. | ✓ | ✓ |
| `tool-call` | A card for one tool or function call an AI made: name, running, done or failed, how long it took, and its input and output to expand. | ✓ | ✓ |

## Data (61)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `area-chart` | Smooth gradient areas, stacked or overlapping, that wipe in on scroll. Hover for a readout across series. | ✓ |  |
| `audit-log` | Who changed what and when, with expandable before and after values. | ✓ |  |
| `bar-list` | Ranked list with a bar behind each row: top pages, products, sources, countries. | ✓ | ✓ |
| `box-plot-chart` | Spread per group: box for the middle half, median line, whiskers and outlier dots. Boxes open from the median; hover for the five numbers. | ✓ |  |
| `bullet-chart` | A KPI against its target in one thin row, with shaded bands for poor, ok and good. The bar slides in on scroll. | ✓ |  |
| `bump-chart` | Rank over time as smooth lines that swap places. Lines draw in one by one; hover a line or name to follow it. | ✓ |  |
| `butterfly-chart` | Two bar sets back to back around shared rows, like a population pyramid. Bars grow outward from the middle. | ✓ |  |
| `candlestick-chart` | Open, high, low and close per period. Green closed up, red closed down. Candles grow from their midpoint in sequence; hover for the four numbers. | ✓ |  |
| `charts` | Sparkline, bar chart and donut in plain SVG. No chart library. | ✓ | ✓ |
| `chord-chart` | Flow between every pair of items around a circle. Arcs sweep in, then ribbons fade in; hover an item to keep only its ribbons. | ✓ |  |
| `circle-pack-chart` | One bubble per item, area by value, packed into a cluster. Bubbles pop out from the center biggest first; hover for the share. | ✓ |  |
| `comparison-table` | Plans across the top, features down the side, a check, dash or text in each cell. For pricing pages. | ✓ |  |
| `countdown` | Live countdown with flipping digits. | ✓ | ✓ |
| `data-table` | Sortable columns, a search box and pagination, with optional row selection and bulk actions, column visibility menu, sticky header, toolbar slot, row action menus and clickable rows. You pass rows and column definitions. | ✓ |  |
| `dumbbell-chart` | Change per item as two dots joined by a line: before and after, plan and actual. Green when good, red when bad. | ✓ |  |
| `file-manager` | Folder browser with breadcrumb, list and grid views, selection and double-click or Enter to open. | ✓ |  |
| `filter-bar` | Removable filter chips with an Add filter menu: pick a field, then a value. | ✓ |  |
| `forecast-chart` | Solid line for what happened, dashed line inside a shaded band for what is expected. The band is the likely range. | ✓ |  |
| `funnel-chart` | Conversion funnel with a bar per stage and the step-to-step rate. | ✓ | ✓ |
| `gantt` | Schedule view with a bar per task, progress fill, weekend shading and a today line. | ✓ |  |
| `gauge` | Half-circle meter with a needle that swings to the value. | ✓ | ✓ |
| `half-donut-chart` | A semicircle split into parts with a total under the arch. Half the height of a donut, so it fits dashboard cards. | ✓ |  |
| `heatmap` | Contribution-style grid for daily activity. Cells pop in column by column. | ✓ |  |
| `histogram-chart` | Counts how many values fall in each range from raw data, with a smooth curve over the bars. Bars rise in turn. | ✓ |  |
| `kanban` | Columns of draggable cards. Drag with the mouse or move a focused card with Alt and the arrow keys. Controlled, no drag library. | ✓ | ✓ |
| `leaderboard` | Ranked people or teams with avatars, score bars, gold, silver and bronze badges and place changes. Sorted for you; bars fill in on scroll. | ✓ | ✓ |
| `line-chart` | Multi-series line or area chart in plain SVG with grid, axis labels, legend and a hover readout. | ✓ | ✓ |
| `live-chart` | Streaming line chart that slides left as new values arrive. You give it a function for the next value; pause it any time. | ✓ |  |
| `lollipop-chart` | A bar chart as a thin stick with a dot on the end, sorted largest first. Lighter than bars when there are many items. | ✓ |  |
| `marimekko-chart` | Stacked 100% bars whose widths also mean something: column width is group size, block height is mix. Columns grow up on scroll. | ✓ |  |
| `matrix-heatmap` | Rows by columns shaded by value: traffic by hour and weekday, cohort retention. Cells fade in as a wave; hover lights up the row and column. | ✓ |  |
| `number-ticker` | Counts up to a value with easing once it scrolls into view. | ✓ | ✓ |
| `org-chart` | Reporting tree with connector lines and collapsible teams. | ✓ |  |
| `pareto-chart` | Causes sorted by size as bars plus a running-total line with an 80% mark. Shows which few causes matter most. | ✓ |  |
| `permission-matrix` | Roles by permissions grid of checkboxes with per-column toggle and locked roles. | ✓ |  |
| `pie-chart` | Slices of one whole that sweep around on scroll. Hover a slice or legend row and it pulls out. | ✓ |  |
| `pivot-table` | Cross-tab of your rows: one field down the side, another across the top, sum, count, average, min or max in each cell, with totals and heat shading. | ✓ |  |
| `progress` | Thin progress bar with four tones. | ✓ | ✓ |
| `progress-ring` | Circular progress with an eased stroke animation. | ✓ | ✓ |
| `punch-card-chart` | A grid of dots where dot size is the value, like commits by weekday and hour. Dots pop in on a diagonal wave. | ✓ |  |
| `radar-chart` | Spider chart for several scores on the same axes: a pentagon with five, a hexagon with six. Shapes grow from the center on scroll; hover a legend name to highlight a series. | ✓ | ✓ |
| `radial-bar-chart` | Concentric rings, one per goal, that sweep in on scroll. Legend hover highlights a ring; the middle takes any content. | ✓ |  |
| `radial-line-chart` | A line chart bent into a circle for things that repeat: 24 hours, 12 months. A smooth closed shape grows from the middle. | ✓ |  |
| `ridgeline-chart` | One smooth curve per row, overlapping like mountain ridges on a shared scale. Ridges rise in turn; hover one to bring it forward. | ✓ |  |
| `rose-chart` | Polar area chart: equal-angle petals whose length is the value. Petals bloom from the center in turn; hover one to read it. | ✓ |  |
| `sankey-chart` | Flow diagram where ribbon width is the amount: traffic to page to outcome, budget to team. Ribbons draw in; hover follows a flow. | ✓ |  |
| `saved-views` | Menu of saved table setups: pick one, save the current one under a name, delete. | ✓ |  |
| `scatter-chart` | Scatter and bubble chart with axis labels, groups by color and a nearest-point hover. Points pop in one by one on scroll. | ✓ |  |
| `slope-chart` | One line per item between two moments. Steep means big change, crossing means swapped places. Green rose, red fell. | ✓ |  |
| `stacked-bar-chart` | Bars split into colored segments that grow in on scroll, with a hover breakdown and legend. Sessions by device, revenue by plan. | ✓ | ✓ |
| `stat-card` | KPI tile with value, trend delta and a sparkline slot. | ✓ | ✓ |
| `stream-chart` | Streamgraph: smooth stacked flows around a center line to show shifts in mix over time. Ripples in from the left; hover a flow to focus it. | ✓ |  |
| `sunburst-chart` | A hierarchy as concentric rings: each ring splits its parent. Rings sweep outward; hover a slice to light up its parents and children. | ✓ |  |
| `tree-table` | Table whose rows have child rows. Expand and collapse branches by click or arrow keys. | ✓ |  |
| `treemap` | Tiles sized by value, packed to stay square. Budget by team, revenue by product. Spring in on scroll; hover lifts one tile and dims the rest. | ✓ |  |
| `uptime-bar` | Status-page strip with one tick per day in green, amber or red, the uptime percentage and an incident note on hover. | ✓ | ✓ |
| `venn-chart` | Two or three overlapping circles with a count in every region: who is in one group, who is in several. | ✓ |  |
| `virtual-list` | Windowed list that renders only the visible rows. 100,000 items stay smooth. | ✓ |  |
| `waffle-chart` | A grid of 100 squares, each one percent of the whole. Squares pop in as a wave; hover a legend row to light up its squares. | ✓ |  |
| `waterfall-chart` | How a start number becomes an end number: green adds, red subtracts, blue totals. Bars drop in one after another with connector lines. | ✓ |  |
| `word-cloud` | Words sized by how often they appear, biggest in the middle. Words grow in; hover to focus one, or make them clickable filters. | ✓ |  |

## Feedback (11)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `alert` | Inline message in info, success, warning and danger. | ✓ | ✓ |
| `banner` | Announcement bar that collapses smoothly when dismissed. | ✓ | ✓ |
| `confetti` | Burst of confetti from any button, or call fireConfetti(x, y) yourself. | ✓ |  |
| `cookie-consent` | Bottom-left consent card that remembers Accept or Decline. | ✓ |  |
| `error-state` | Full-section error or not found screen with a code or icon, explanation and retry actions. | ✓ | ✓ |
| `loader` | Six loading animations (ring, dots, bars, pulse, orbit, dual), an indeterminate or determinate bar loader, and a loading overlay. | ✓ | ✓ |
| `notification-center` | Bell with an unread count and a popover list. Click marks read, Mark all read clears it. | ✓ | ✓ |
| `pull-to-refresh` | Scroll area you pull down from the top to refresh, with a spinner until your promise settles. | ✓ | ✓ |
| `skeleton` | Shimmering placeholder for content that is loading. | ✓ | ✓ |
| `spinner` | Tiny CSS spinner that inherits text color. | ✓ | ✓ |
| `toast` | Call toast.success() from anywhere. No provider needed. | ✓ | ✓ |

## Overlays (12)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `alert-dialog` | Confirm before something destructive. Cancel and confirm, controlled by you. | ✓ | ✓ |
| `bottom-sheet` | Sheet that rises from the bottom, with a drag handle to dismiss. Radix Dialog underneath. | ✓ | ✓ |
| `command` | Searchable palette on cmdk. Bind it to Ctrl or Cmd K. | ✓ |  |
| `context-menu` | Right-click menu with items, shortcuts, checkbox items, labels and nested submenus. | ✓ |  |
| `dialog` | Centered modal and edge-docked sheet on Radix Dialog. | ✓ | ✓ |
| `dropdown-menu` | Action menu with checkbox items, shortcuts and destructive items. | ✓ | ✓ |
| `hover-card` | Rich preview that opens when you hover or focus a link, for profiles and references. | ✓ |  |
| `image-viewer` | Lightbox with arrows, click to zoom and keyboard control. | ✓ | ✓ |
| `popover` | Floating panel anchored to a trigger. | ✓ | ✓ |
| `shortcuts-dialog` | Keyboard cheat sheet that opens on ? and shows grouped shortcuts as keycaps. | ✓ |  |
| `tooltip` | Hint on hover and focus. Optional title, keyboard shortcut, light style and arrow, plus an (i) InfoTip and a TruncatedText that only shows a tooltip when cut off. | ✓ | ✓ |
| `tour` | Spotlight a part of the page and step through it with a card, for product walkthroughs. | ✓ |  |

## Time (9)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `analog-clock` | SVG clock for any time zone, with a second hand that ticks with a small bounce. | ✓ |  |
| `day-agenda` | One day as a time grid: events sit at their time, overlapping ones share the width, a red now-line marks the time. | ✓ | ✓ |
| `event-calendar` | Month view with events on their days, multi-day spans, +n more overflow, locale-aware names and RTL arrows. | ✓ |  |
| `relative-time` | "3 minutes ago", kept live. Hover for the full date. Uses Intl, so it speaks your locale. | ✓ | ✓ |
| `stopwatch` | Start, pause, lap and reset, down to hundredths of a second. | ✓ | ✓ |
| `time-picker` | Hour, minute and AM/PM segments you type into or step with arrow keys. 12 or 24 hour. | ✓ | ✓ |
| `timer` | Countdown with a ring that drains smoothly, presets and an onDone callback. | ✓ | ✓ |
| `week-strip` | Seven day pills with previous and next week arrows, a selected day and dots under days that have something. Arrow keys move the day. | ✓ | ✓ |
| `world-clock` | Cities with live local time, a day or night icon and the hour difference from you. | ✓ |  |

## Other (1)

| Component | What it is | HTML | Flutter |
|---|---|:-:|:-:|
| `icons` |  |  |  |

## Blocks (37)

Full screens built from the components, with mock data you swap for your own API.

| Block | Module | What it is |
|---|---|---|
| `admin-shell` | Layout | Full app frame: grouped sidebar with nested links, topbar with search, alerts and user menu, and a dashboard page. |
| `analytics-dashboard` | Dashboard | Visitors, page views, session time and conversion KPIs, a traffic area chart, device donut, top pages bar list and weekday bars. |
| `api-keys-page` | Account | Create, reveal, copy and revoke keys, with a masked secret and an empty state. |
| `billing-page` | Account | Current plan with seat and storage usage bars, payment method card and an invoice history table. |
| `calendar-app` | Productivity | Month and week calendar where you click a day or press New event to add an event in a dialog. |
| `campaign-performance` | Marketing | Channel KPIs, weekly leads chart and a campaign budget table. |
| `chat-app` | Messaging | Conversation list with unread badges beside a thread with a composer and a typing indicator. |
| `checkout-page` | Commerce | Delivery address form with validation, shipping options, coupon code and a live order summary. |
| `contact-page` | Marketing | Contact form with validation and a confirmation, beside an FAQ accordion. |
| `ecommerce-dashboard` | Commerce | Sales, orders, customers and to-ship KPIs, revenue chart, top products and a recent orders table with status badges. |
| `employee-directory` | HRMS | Searchable table with status filter, row selection, actions and pagination. |
| `finance-dashboard` | Dashboard | Balance, income, spending and savings rate, a cash-flow chart, spending by category and recent transactions. |
| `hrms-overview` | HRMS | Headcount, attendance, department split and activity feed. |
| `inbox` | Layout | Two-pane mail view: searchable list with unread dots, message reader with reply, archive and delete. Single pane on mobile. |
| `invoice-page` | Commerce | A full invoice with print, download and send actions. |
| `kanban-board-page` | Dashboard | Full-page board with search, a priority filter, column totals and a dialog for each task. Drag a card or move it with Alt and the arrow keys. |
| `landing-page` | Landing | Whole marketing page: navbar, hero, logos, feature grid, stats, FAQ, call to action and footer. |
| `lead-pipeline` | Marketing | Drag-and-drop board with column totals and a keyboard-friendly move button. |
| `leave-approvals` | HRMS | Manager inbox with tabs, balance bars and approve or reject toasts. |
| `leave-request-form` | HRMS | Date range, approver combobox, multi-select notify list, working-day count and field validation. |
| `not-found-page` | Layout | Full-page 404 with search and two ways out. Reuse for 403 and 500. |
| `notifications-page` | Account | Full-page inbox with All and Unread tabs, mark as read and mark all read. |
| `onboarding-wizard` | Account | Four-step setup (profile, team, preferences, done) with a stepper, validation and values kept when you go back. |
| `otp-verify` | Auth | Six-digit code entry with a resend countdown, an error state and a success screen. |
| `pricing-page` | Marketing | Headline, monthly or yearly switch, three plan cards with a highlighted one, and an FAQ. |
| `profile-page` | Account | Cover and avatar header with actions, then About (details list) and Activity (timeline) tabs. |
| `project-overview` | Dashboard | Project header with status and team, progress ring with phase bars, task list and a milestone timeline. |
| `reports-table` | Reports | Searchable, filterable, sortable reports table with row action menus and a details drawer. |
| `reset-password` | Auth | Four steps: ask for email, check your inbox with a resend timer, choose a new password, done. |
| `sales-dashboard` | Marketing | KPI cards, revenue line chart against target, pipeline funnel and a top deals table. |
| `server-error-page` | Layout | A 500 page with a retry that loads, a status link and a short incident timeline. |
| `settings-page` | Account | Profile form with photo and phone number, notification switches and language and time zone, in tabs. |
| `sign-in` | Auth | Login card with validation, loading button and an error alert. |
| `sign-up` | Auth | Registration card with name, email, password strength meter, terms checkbox, validation and a check-your-inbox confirmation. |
| `team-page` | Marketing | Heading, a grid of team members with roles and short bios, and a hiring call to action. |
| `top-nav-layout` | Layout | App frame with a top navigation bar instead of a sidebar, with notifications, theme toggle and user menu. |
| `user-management` | Account | Team members table with search, sort, role and status, row actions (suspend, remove) and an invite dialog with validation. |
