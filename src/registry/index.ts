import { lazy, useEffect, useState, type ComponentType } from 'react';

import guides from './chart-guides.json';
import realRequires from './requires.json';

export interface ChartGuide { what: string; read: string; use: string; avoid: string }

export type Category = 'Inputs' | 'Display' | 'Feedback' | 'Overlays' | 'Navigation' | 'Data' | 'Layout' | 'Time' | 'AI';

export interface Entry {
  slug: string;
  name: string;
  description: string;
  category: Category;
  /** npm packages the file imports, besides react, clsx, tailwind-merge and class-variance-authority. */
  deps: string[];
  /** Other befui files this one imports. */
  requires: string[];
  keywords: string[];
  /** Recently added: shown first and marked "New" on the docs site. */
  isNew: boolean;
  /** Example needs the full page width, so skip the centered dotted frame. */
  wide: boolean;
  /** Lazy: render it inside a Suspense boundary. */
  Demo: ComponentType;
  loadDemoSource: () => Promise<string>;
  loadSource: () => Promise<string>;
  path: string;
  /** For charts: plain-language help on what it shows and how to read it. */
  guide?: ChartGuide;
}

type Meta = Omit<Entry, 'Demo' | 'loadDemoSource' | 'loadSource' | 'path' | 'isNew'>;

/** Resolves a lazy source loader to its text ('' while loading). */
export function useSource(load: () => Promise<string>): string {
  const [text, setText] = useState('');
  useEffect(() => {
    let live = true;
    setText('');
    load().then((t) => live && setText(t));
    return () => { live = false; };
  }, [load]);
  return text;
}

/** Slugs shown as "New", newest first. Trim this list when a release is no longer recent. */
export const NEW_SLUGS = new Set(['markdown', 'log-viewer', 'kv-editor', 'nps-survey', 'shortcut-recorder', 'duration-input', 'cron-builder', 'json-tree', 'feature-flag-table', 'token-usage-chart', 'org-switcher', 'year-heatmap', 'timezone-picker', 'autosize-textarea', 'transfer-list', 'cascader', 'file-tree', 'parallel-coordinates', 'network-graph', 'swimlane-timeline', 'bar-race', 'agent-trace', 'citation-popover', 'message-feedback', 'eval-table', 'artifact-panel', 'api-key-manager', 'webhook-log', 'team-invite', 'status-page', 'usage-meter']);

const m = (
  slug: string,
  name: string,
  category: Category,
  description: string,
  extra: { deps?: string[]; requires?: string[]; keywords?: string[]; wide?: boolean } = {},
): Meta => ({ slug, name, category, description, deps: extra.deps ?? [], requires: extra.requires ?? [], keywords: extra.keywords ?? [], wide: extra.wide ?? false });

const metas: Meta[] = [
  m('button', 'Button', 'Inputs', 'Thirteen variants from plain to glow, shine and 3D press, pill shape, five sizes, loading state, and asChild for links.', { deps: ['@radix-ui/react-slot'], keywords: ['cta', 'action', 'submit'] }),
  m('input', 'Input', 'Inputs', 'Text input and textarea with icon, trailing slot, and invalid state.', { keywords: ['text', 'field', 'form', 'textarea', 'search'] }),
  m('label', 'Label and Field', 'Inputs', 'Label with required marker, plus Field for label, control and hint or error.', { deps: ['@radix-ui/react-label'], keywords: ['form', 'error', 'hint'] }),
  m('checkbox', 'Checkbox', 'Inputs', 'Checked, unchecked and indeterminate. Works for select-all rows.', { deps: ['@radix-ui/react-checkbox'], keywords: ['select', 'check', 'form'] }),
  m('switch', 'Switch', 'Inputs', 'On/off toggle for settings that apply immediately.', { deps: ['@radix-ui/react-switch'], keywords: ['toggle', 'setting'] }),
  m('select', 'Select', 'Inputs', 'Styled dropdown with groups, built on Radix Select.', { deps: ['@radix-ui/react-select'], keywords: ['dropdown', 'picker', 'form'] }),
  m('combobox', 'Combobox', 'Inputs', 'Searchable select, single or multiple, with descriptions under each option.', { deps: ['cmdk', '@radix-ui/react-popover'], requires: ['badge', 'command', 'popover'], keywords: ['autocomplete', 'search select', 'typeahead', 'multi'] }),
  m('calendar', 'Calendar', 'Inputs', 'Month grid for one day or a range. Arrow keys, Page Up/Down, Home and End work.', { deps: [], keywords: ['date', 'month', 'range', 'schedule'] }),
  m('date-picker', 'Date picker', 'Inputs', 'Date and date range fields that open a calendar. The range picker has optional quick presets (Last 7 days, This month...) and a day count. Closes on pick.', { deps: ['@radix-ui/react-popover'], requires: ['calendar', 'popover'], keywords: ['date', 'range', 'leave', 'schedule', 'calendar'] }),
  m('phone-input', 'Phone input', 'Inputs', 'Phone field with a country picker. Groups digits as you type and hands back the E.164 number and whether it is complete.', { keywords: ['mobile', 'tel', 'country code', 'dial', 'sms'] }),
  m('signature-pad', 'Signature pad', 'Inputs', 'Draw-your-signature canvas for mouse, touch and pen. Sharp on retina screens, exports a PNG.', { requires: ['button'], keywords: ['sign', 'draw', 'canvas', 'contract', 'esign'] }),
  m('event-calendar', 'Event calendar', 'Time', 'Month view with events on their days, multi-day spans, +n more overflow, locale-aware names and RTL arrows.', { requires: ['button', 'calendar', 'icons'], wide: true, keywords: ['schedule', 'agenda', 'month', 'planner', 'holidays'] }),
  m('virtual-list', 'Virtual list', 'Data', 'Windowed list that renders only the visible rows. 100,000 items stay smooth.', { keywords: ['windowing', 'large list', 'performance', 'infinite', 'scroll'] }),
  m('circle-pack-chart', 'Circle pack chart', 'Data', 'One bubble per item, area by value, packed into a cluster. Bubbles pop out from the center biggest first; hover for the share.', { requires: ['charts'], keywords: ['chart', 'bubbles', 'packing', 'proportion', 'animated', 'countries', 'clusters'] }),
  m('marimekko-chart', 'Marimekko chart', 'Data', 'Stacked 100% bars whose widths also mean something: column width is group size, block height is mix. Columns grow up on scroll.', { requires: ['charts'], keywords: ['chart', 'mosaic', 'market share', 'mekko', 'segments', 'animated', 'two dimensions'] }),
  m('punch-card-chart', 'Punch card chart', 'Data', 'A grid of dots where dot size is the value, like commits by weekday and hour. Dots pop in on a diagonal wave.', { requires: ['charts'], keywords: ['chart', 'dots', 'weekday', 'hourly', 'matrix', 'animated', 'activity', 'bubble grid'] }),
  m('forecast-chart', 'Forecast chart', 'Data', 'Solid line for what happened, dashed line inside a shaded band for what is expected. The band is the likely range.', { requires: ['area-chart', 'charts'], keywords: ['chart', 'prediction', 'projection', 'confidence', 'range', 'animated', 'trend', 'future'] }),
  m('venn-chart', 'Venn chart', 'Data', 'Two or three overlapping circles with a count in every region: who is in one group, who is in several.', { requires: ['charts'], keywords: ['chart', 'overlap', 'sets', 'audience', 'intersection', 'animated', 'segments', 'groups'] }),
  m('word-cloud', 'Word cloud', 'Data', 'Words sized by how often they appear, biggest in the middle. Words grow in; hover to focus one, or make them clickable filters.', { requires: ['charts'], keywords: ['chart', 'text', 'tags', 'keywords', 'survey', 'topics', 'animated', 'frequency'] }),
  m('week-strip', 'Week strip', 'Time', 'Seven day pills with previous and next week arrows, a selected day and dots under days that have something. Arrow keys move the day.', { requires: ['icons'], keywords: ['date', 'week', 'schedule', 'attendance', 'booking', 'calendar', 'mobile', 'day picker'] }),
  m('order-tracker', 'Order tracker', 'Navigation', 'Delivery progress as steps joined by a line that fills up to the current one. Horizontal on wide screens, vertical on phones.', { requires: ['icons'], keywords: ['shipping', 'delivery', 'status', 'progress', 'ecommerce', 'tracking', 'steps', 'timeline'] }),
  m('diff-viewer', 'Diff viewer', 'Display', 'Before and after text as a unified diff: red removed lines, green added lines, line numbers, and unchanged stretches folded.', { keywords: ['diff', 'compare', 'changes', 'versions', 'code', 'config', 'review', 'audit'] }),
  m('day-agenda', 'Day agenda', 'Time', 'One day as a time grid: events sit at their time, overlapping ones share the width, a red now-line marks the time.', { keywords: ['schedule', 'calendar', 'day view', 'timetable', 'meetings', 'appointments', 'planner', 'agenda'] }),
  m('pie-chart', 'Pie chart', 'Data', 'Slices of one whole that sweep around on scroll. Hover a slice or legend row and it pulls out.', { requires: ['charts'], keywords: ['chart', 'share', 'percent', 'proportion', 'animated', 'split', 'distribution'] }),
  m('half-donut-chart', 'Half donut chart', 'Data', 'A semicircle split into parts with a total under the arch. Half the height of a donut, so it fits dashboard cards.', { requires: ['charts'], keywords: ['chart', 'semicircle', 'budget', 'storage', 'usage', 'animated', 'arch', 'parliament'] }),
  m('radial-line-chart', 'Radial line chart', 'Data', 'A line chart bent into a circle for things that repeat: 24 hours, 12 months. A smooth closed shape grows from the middle.', { requires: ['charts'], keywords: ['chart', 'radial', 'polar', 'cyclic', 'hourly', 'monthly', 'animated', 'circular'] }),
  m('histogram-chart', 'Histogram chart', 'Data', 'Counts how many values fall in each range from raw data, with a smooth curve over the bars. Bars rise in turn.', { requires: ['area-chart', 'charts'], keywords: ['chart', 'distribution', 'bins', 'frequency', 'animated', 'statistics', 'bell curve'] }),
  m('pareto-chart', 'Pareto chart', 'Data', 'Causes sorted by size as bars plus a running-total line with an 80% mark. Shows which few causes matter most.', { requires: ['area-chart', 'charts'], keywords: ['chart', '80 20', 'defects', 'causes', 'quality', 'animated', 'prioritize', 'cumulative'] }),
  m('combo-chart', 'Combo chart', 'Data', 'Bars, smooth lines and smooth areas on one chart, with an optional second scale on the right. Many values read together; hover a month for all of them.', { requires: ['charts', 'area-chart'], keywords: ['chart', 'bar', 'line', 'area', 'combo', 'mixed', 'dual axis', 'many values', 'compare', 'animated', 'smooth'] }),
  m('outcome-bar', 'Outcome bar', 'Data', 'One thick rounded bar split green and red in proportion (won vs lost), a pale piece for what is still open, a big conversion number above and the counts under each part.', { requires: ['charts'], keywords: ['chart', 'won lost', 'conversion', 'funnel', 'split bar', 'proportion', 'sales', 'animated'] }),
  m('pace-chart', 'Pace chart', 'Data', 'Burn-up for a monthly target: running total, the straight line you should be on, a dashed projection to month end, the target line and an ahead or behind pace chip.', { requires: ['charts'], keywords: ['chart', 'burn up', 'target', 'forecast', 'projection', 'pace', 'monthly', 'sales', 'animated'] }),
  m('sparkline-table', 'Sparkline table', 'Data', 'A table where every row has its own trend line and a green or red change chip. Metrics by team, product or region.', { requires: ['charts', 'icons'], keywords: ['table', 'trend', 'sparkline', 'metrics', 'delta', 'chart'] }),
  m('heat-calendar', 'Heat calendar', 'Data', 'One month as a calendar grid, every day tinted by its value. Hover a day for its number; click to select.', { requires: ['charts'], keywords: ['calendar', 'heatmap', 'month', 'daily', 'chart', 'attendance'] }),
  m('ring-chart', 'Ring chart', 'Data', 'Concentric progress rings, one per measure against its own goal (move, exercise, stand). Rings sweep in on scroll.', { requires: ['charts'], keywords: ['rings', 'activity', 'progress', 'goals', 'chart', 'radial'] }),
  m('range-gauge', 'Range gauge', 'Data', 'Speedometer in coloured bands (poor, fair, good) with a needle that swings to the value and a big number.', { requires: ['charts'], keywords: ['gauge', 'speedometer', 'score', 'bands', 'meter', 'chart'] }),
  m('chart-skeleton', 'Chart skeleton', 'Feedback', 'Loading placeholder shaped like a bar, line, pie chart or table so the page does not jump when data arrives.', { requires: ['skeleton'], keywords: ['loading', 'placeholder', 'chart', 'shimmer'] }),
  m('popconfirm', 'Popconfirm', 'Overlays', 'A small are-you-sure bubble anchored to the button that was pressed. Lighter than an alert dialog.', { deps: ['@radix-ui/react-popover'], requires: ['button', 'popover'], keywords: ['confirm', 'delete', 'popover', 'dialog'] }),
  m('split-button', 'Split button', 'Inputs', 'A button with a menu of related actions attached: the main part runs the usual action, the arrow opens the others.', { deps: ['@radix-ui/react-dropdown-menu'], requires: ['button', 'dropdown-menu', 'icons'], keywords: ['button', 'dropdown', 'menu', 'actions', 'save'] }),
  m('form-wizard', 'Form wizard', 'Inputs', 'A form split into steps: stepper on top, one step at a time, Back and Next with per-step validation.', { requires: ['button', 'stepper'], keywords: ['wizard', 'multi step', 'form', 'steps', 'onboarding', 'checkout'] }),
  m('range-slider', 'Range slider', 'Inputs', 'Slider with two handles for a range such as a price from 20 to 80. Drag or use the arrow keys; handles never cross.', { keywords: ['slider', 'range', 'price', 'filter', 'two handles', 'min max'] }),
  m('gradient-picker', 'Gradient picker', 'Inputs', 'Edit a linear gradient: colours, positions, angle, two to five stops, live preview and CSS to copy.', { requires: ['copy-button'], keywords: ['gradient', 'color', 'css', 'design', 'background'] }),
  m('autocomplete', 'Autocomplete', 'Inputs', 'Text input that suggests as you type, from a fixed list or an async search (address, place). Keyboard friendly.', { requires: ['input'], keywords: ['search', 'suggest', 'address', 'places', 'async', 'typeahead', 'combobox'] }),
  m('resizable-table', 'Resizable table', 'Data', 'Table whose columns resize by dragging the header edge or with the arrow keys. Scrolls sideways when wider than the card.', { keywords: ['table', 'columns', 'resize', 'drag', 'data grid'] }),
  m('image-gallery', 'Image gallery', 'Display', 'Masonry grid of images of different heights with a hover zoom and caption. onSelect gives the index.', { keywords: ['gallery', 'masonry', 'photos', 'images', 'grid', 'portfolio'] }),
  m('media-player', 'Media player', 'Display', 'Video or audio player with themed controls: play, seek, time, mute and fullscreen.', { requires: ['icons'], keywords: ['video', 'audio', 'player', 'media', 'podcast'] }),
  m('kpi-strip', 'KPI strip', 'Data', 'A row of headline numbers sharing one border with dividers between them, with change arrows. The strip at the top of a dashboard.', { requires: ['icons'], keywords: ['kpi', 'stats', 'metrics', 'dashboard', 'header', 'numbers'] }),
  m('cohort-table', 'Cohort table', 'Data', 'Retention triangle: a row per signup group, a column per period, each cell the percent still active and tinted by it.', { requires: ['charts'], keywords: ['cohort', 'retention', 'saas', 'analytics', 'heatmap', 'table', 'chart'] }),
  m('roadmap-timeline', 'Roadmap timeline', 'Data', 'A light roadmap: one bar per item along a month axis, coloured by group, with progress inside and a line for today.', { requires: ['charts'], keywords: ['roadmap', 'timeline', 'gantt', 'plan', 'schedule', 'chart'] }),
  m('date-preset-select', 'Date preset select', 'Time', 'A compact Last 7 days dropdown for dashboards: pick a preset and get a from and to range.', { deps: ['@radix-ui/react-dropdown-menu'], requires: ['button', 'date-picker', 'calendar', 'dropdown-menu', 'icons'], keywords: ['date', 'range', 'preset', 'filter', 'dashboard', 'last 7 days'] }),
  m('filter-builder', 'Filter builder', 'Inputs', 'Field, operator and value rows that all must match, like the Notion or Linear filter, with a helper to filter an array.', { requires: ['button', 'input', 'icons'], keywords: ['filter', 'query', 'rules', 'search', 'table', 'advanced search'] }),
  m('coachmark', 'Coachmark', 'Overlays', 'A single new-feature hint pinned to one element with a Got it button. Lighter than a tour; can remember it was dismissed.', { deps: ['@radix-ui/react-popover'], requires: ['button'], keywords: ['hint', 'onboarding', 'tooltip', 'new feature', 'spotlight', 'tour'] }),
  m('resizable-panels', 'Resizable panels', 'Layout', 'Three panels side by side: drag the left and right panels wider or narrower, or collapse them. For inbox and IDE layouts.', { requires: ['icons'], keywords: ['panels', 'split', 'resize', 'sidebar', 'inbox', 'ide', 'layout'] }),
  m('pricing-comparison', 'Pricing comparison', 'Display', 'The feature grid under a pricing page: plans across the top, features down the side, checks and short text in the cells.', { requires: ['icons'], keywords: ['pricing', 'plans', 'compare', 'features', 'table', 'saas'] }),
  m('signature-field', 'Signature field', 'Inputs', 'A signature box that lets people draw it or type their name in a script font. Both give one PNG data URL.', { requires: ['input', 'signature-pad'], keywords: ['signature', 'sign', 'draw', 'type', 'contract', 'esign'] }),
  m('autosize-textarea', 'Autosize textarea', 'Inputs', 'A textarea that grows with the text up to a set number of lines, then scrolls, with an optional live character counter.', { requires: ['input'], keywords: ['textarea', 'multiline', 'grow', 'auto height', 'counter', 'message'] }),
  m('transfer-list', 'Transfer list', 'Inputs', 'Two lists with arrows between them: tick items and move them across, each side with search and select all. For roles, columns or members.', { requires: ['button', 'checkbox', 'icons'], keywords: ['transfer', 'dual listbox', 'move', 'assign', 'roles', 'permissions', 'picker'] }),
  m('cascader', 'Cascader', 'Inputs', 'A select with a column per level for nested choices like country, state, city. Keyboard friendly; gives the full path.', { deps: ['@radix-ui/react-popover'], requires: ['icons', 'popover'], keywords: ['cascader', 'nested select', 'hierarchy', 'country state city', 'category', 'tree select'] }),
  m('file-tree', 'File tree', 'Navigation', 'Folder and file tree like an editor sidebar: folders first, file-type icons, open and close, arrow-key navigation, full path on select.', { requires: ['icons'], keywords: ['files', 'folders', 'explorer', 'tree', 'ide', 'sidebar', 'directory'] }),
  m('parallel-coordinates', 'Parallel coordinates', 'Data', 'One vertical axis per measure and one line per item crossing each at its value. Compare many measures at once; hover to isolate a line.', { requires: ['charts'], keywords: ['chart', 'multivariate', 'compare', 'axes', 'lines', 'animated', 'many measures'] }),
  m('network-graph', 'Network graph', 'Data', 'Dots joined by lines for services, people or links. Settled layout (no jitter); hover lights up neighbours, click selects.', { requires: ['charts'], keywords: ['chart', 'graph', 'nodes', 'edges', 'relationships', 'dependencies', 'architecture', 'animated'] }),
  m('swimlane-timeline', 'Swimlane timeline', 'Data', 'Rows for people, teams or machines with bars on a shared day axis. Overlapping bars stack; a line marks today.', { requires: ['charts'], keywords: ['chart', 'timeline', 'schedule', 'resource', 'planning', 'gantt', 'lanes', 'team'] }),
  m('bar-race', 'Bar race', 'Data', 'Bars that re-sort and grow as time moves, frame by frame, with play and a scrubber. Shows who overtakes whom.', { keywords: ['chart', 'ranking', 'race', 'animated', 'over time', 'leaderboard', 'history'] }),
  m('agent-trace', 'Agent trace', 'AI', 'An AI agent run as a tree of model calls, tool calls and lookups, each with a bar on a shared time scale. Click a step for its input and output.', { requires: ['icons'], keywords: ['agent', 'trace', 'observability', 'llm', 'tool calls', 'debug', 'spans', 'latency'] }),
  m('citation-popover', 'Citation popover', 'AI', 'A numbered citation inside an answer that opens a card with the site, title and quote on hover or focus. The number is a real link.', { deps: ['@radix-ui/react-hover-card'], requires: ['hover-card', 'icons'], keywords: ['citation', 'source', 'reference', 'rag', 'footnote', 'answer'] }),
  m('message-feedback', 'Message feedback', 'AI', 'Thumbs up or down for an AI answer, then reasons and an optional note. Sends once, only when the person presses Send.', { requires: ['button', 'icons'], keywords: ['feedback', 'thumbs', 'rating', 'ai', 'chat', 'reasons', 'rlhf'] }),
  m('eval-table', 'Eval table', 'AI', 'Test questions run against several models or prompt versions side by side: pass rate per column, pass or fail per cell, open a row for every answer.', { requires: ['icons'], keywords: ['eval', 'evaluation', 'benchmark', 'prompt', 'compare models', 'test cases', 'llm', 'pass rate'] }),
  m('artifact-panel', 'Artifact panel', 'AI', 'The side panel next to a chat for what the AI made: Preview and Code tabs, copy, download, expand and close.', { requires: ['icons'], keywords: ['artifact', 'canvas', 'preview', 'code', 'side panel', 'ai', 'chat', 'document'] }),
  m('api-key-manager', 'API key manager', 'Inputs', 'List, create and revoke API keys. A new key shows once with Show and Copy; stored keys show only their start. Revoke asks first.', { requires: ['badge', 'button', 'icons', 'input'], keywords: ['api key', 'token', 'secret', 'developer', 'settings', 'revoke', 'credentials'] }),
  m('webhook-log', 'Webhook log', 'Data', 'Recent webhook deliveries with status, time and duration. Open one for request and response bodies; failed ones can be resent.', { requires: ['badge', 'button', 'icons'], keywords: ['webhook', 'events', 'deliveries', 'log', 'developer', 'retry', 'http'] }),
  m('team-invite', 'Team invite', 'Inputs', 'Invite people by email: type or paste a list, each address becomes a chip, bad ones are flagged, one role for all, then Send.', { requires: ['button', 'icons'], keywords: ['invite', 'team', 'email', 'members', 'roles', 'onboarding', 'chips'] }),
  m('status-page', 'Status page', 'Display', 'A public status page: an all-systems banner worked out from each service, 90-day uptime bars and incident history with updates.', { requires: ['icons', 'uptime-bar'], keywords: ['status', 'uptime', 'incident', 'outage', 'public', 'health', 'services'] }),
  m('usage-meter', 'Usage meter', 'Display', 'Plan usage rows for a billing page: used of limit, percent, blue to amber to red as it fills, overage spelled out, unlimited rows.', { requires: ['icons'], keywords: ['usage', 'quota', 'billing', 'limits', 'plan', 'meter', 'progress', 'overage'] }),
  m('cron-builder', 'Cron builder', 'Time', 'Pick a schedule in words (every N minutes, daily, weekly, monthly) and get the cron expression, a plain sentence and the next three runs. Custom mode checks your own.', { requires: ['copy-button'], keywords: ['cron', 'schedule', 'recurring', 'jobs', 'scheduler', 'expression', 'timer'] }),
  m('json-tree', 'JSON tree', 'Display', 'Collapsible JSON viewer with colour-coded values, counts on closed branches, expand and collapse all, and copy path or copy JSON.', { requires: ['icons'], keywords: ['json', 'viewer', 'api response', 'payload', 'debug', 'tree', 'inspect'] }),
  m('feature-flag-table', 'Feature flag table', 'Data', 'Flags with a switch, key, environments and a rollout slider (percent of users) that dims while off. Searchable, controlled.', { deps: ['@radix-ui/react-switch'], requires: ['badge', 'switch'], keywords: ['feature flags', 'toggles', 'rollout', 'release', 'settings', 'developer', 'experiments'] }),
  m('token-usage-chart', 'Token usage chart', 'Data', 'AI spend at a glance: tokens per day split into input, output and cached, with totals and an estimated cost from your prices.', { requires: ['stacked-bar-chart'], keywords: ['chart', 'tokens', 'llm', 'cost', 'usage', 'ai', 'billing', 'stacked'] }),
  m('org-switcher', 'Org switcher', 'Navigation', 'The workspace dropdown at the top of a sidebar: current workspace and plan, a menu to switch, and a Create workspace row.', { deps: ['@radix-ui/react-dropdown-menu'], requires: ['avatar', 'dropdown-menu', 'icons'], keywords: ['workspace', 'organization', 'team', 'tenant', 'switch', 'account', 'sidebar'] }),
  m('year-heatmap', 'Year heatmap', 'Data', 'A whole year as small squares, one per day, columns are weeks (the GitHub contributions graph), tinted in five steps by value.', { requires: ['charts'], keywords: ['chart', 'calendar', 'contributions', 'activity', 'streak', 'heatmap', 'habit', 'year'] }),
  m('timezone-picker', 'Timezone picker', 'Time', 'Search every time zone by city or region and see its offset and the time there now. Starts on your own zone.', { deps: ['@radix-ui/react-popover'], requires: ['icons', 'popover'], keywords: ['timezone', 'time zone', 'utc', 'offset', 'clock', 'locale', 'settings', 'meeting'] }),
  m('markdown', 'Markdown', 'Display', 'Renders Markdown text as styled elements with no HTML injection: headings, bold, italic, code, code blocks, lists, quotes and safe links. For AI answers and notes.', { keywords: ['markdown', 'md', 'rich text', 'ai answer', 'render', 'notes', 'safe'] }),
  m('log-viewer', 'Log viewer', 'Data', 'Terminal-style log pane: coloured levels with counts as filters, search with marked matches, and a Follow switch that tracks new lines.', { requires: ['icons'], keywords: ['logs', 'console', 'terminal', 'debug', 'tail', 'devops', 'errors', 'stream'] }),
  m('kv-editor', 'Key value editor', 'Inputs', 'Environment variables or headers as key and value rows: values hidden until shown, duplicate keys flagged, and paste a .env file to fill many rows.', { requires: ['button', 'icons'], keywords: ['env', 'environment variables', 'headers', 'key value', 'config', 'secrets', 'settings', 'developer'] }),
  m('nps-survey', 'NPS survey', 'Feedback', 'The 0 to 10 recommend question with a follow-up that changes for detractors, passives and promoters. Arrow keys move the score.', { requires: ['button', 'icons'], keywords: ['nps', 'survey', 'feedback', 'net promoter', 'csat', 'rating', 'score'] }),
  m('shortcut-recorder', 'Shortcut recorder', 'Inputs', 'A field that records a keyboard shortcut as keycaps: press the keys, Esc cancels, Backspace clears. Saved as Mod+Shift+K so it works on Mac and Windows.', { requires: ['icons', 'kbd'], keywords: ['shortcut', 'hotkey', 'keybinding', 'keyboard', 'record', 'settings', 'command'] }),
  m('duration-input', 'Duration input', 'Inputs', 'Type lengths of time the way people say them (1h 30m, 90m, 2d) and get seconds back, with min and max messages. Tidies the text on blur.', { keywords: ['duration', 'time', 'hours', 'minutes', 'timeout', 'interval', 'sla', 'input'] }),
  m('slope-chart', 'Slope chart', 'Data', 'One line per item between two moments. Steep means big change, crossing means swapped places. Green rose, red fell.', { requires: ['charts'], keywords: ['chart', 'before after', 'change', 'comparison', 'animated', 'two periods', 'delta'] }),
  m('butterfly-chart', 'Butterfly chart', 'Data', 'Two bar sets back to back around shared rows, like a population pyramid. Bars grow outward from the middle.', { requires: ['charts'], keywords: ['chart', 'pyramid', 'comparison', 'back to back', 'demographics', 'animated', 'two groups'] }),
  m('lollipop-chart', 'Lollipop chart', 'Data', 'A bar chart as a thin stick with a dot on the end, sorted largest first. Lighter than bars when there are many items.', { requires: ['charts'], keywords: ['chart', 'ranking', 'bars', 'lollipop', 'animated', 'top items', 'dot plot'] }),
  m('sunburst-chart', 'Sunburst chart', 'Data', 'A hierarchy as concentric rings: each ring splits its parent. Rings sweep outward; hover a slice to light up its parents and children.', { requires: ['charts'], keywords: ['chart', 'hierarchy', 'nested', 'drill down', 'budget', 'animated', 'tree', 'folders'] }),
  m('ridgeline-chart', 'Ridgeline chart', 'Data', 'One smooth curve per row, overlapping like mountain ridges on a shared scale. Ridges rise in turn; hover one to bring it forward.', { requires: ['area-chart', 'charts'], keywords: ['chart', 'joyplot', 'distribution', 'hourly', 'seasonality', 'animated', 'activity'] }),
  m('box-plot-chart', 'Box plot chart', 'Data', 'Spread per group: box for the middle half, median line, whiskers and outlier dots. Boxes open from the median; hover for the five numbers.', { requires: ['charts'], keywords: ['chart', 'distribution', 'quartile', 'statistics', 'latency', 'animated', 'outliers', 'variance'] }),
  m('chord-chart', 'Chord chart', 'Data', 'Flow between every pair of items around a circle. Arcs sweep in, then ribbons fade in; hover an item to keep only its ribbons.', { requires: ['charts'], keywords: ['chart', 'relationships', 'flow', 'network', 'migration', 'animated', 'connections', 'matrix'] }),
  m('uptime-bar', 'Uptime bar', 'Data', 'Status-page strip with one tick per day in green, amber or red, the uptime percentage and an incident note on hover.', { requires: ['charts'], keywords: ['status page', 'uptime', 'incidents', 'sla', 'monitoring', 'health', 'animated', 'availability'] }),
  m('leaderboard', 'Leaderboard', 'Data', 'Ranked people or teams with avatars, score bars, gold, silver and bronze badges and place changes. Sorted for you; bars fill in on scroll.', { requires: ['avatar', 'charts', 'icons'], keywords: ['ranking', 'top', 'sales', 'scores', 'gamification', 'animated', 'winners', 'quiz'] }),
  m('rating-breakdown', 'Rating breakdown', 'Display', 'Review summary: big average, stars and a bar per star level. Rows can act as filters. Bars fill in on scroll.', { requires: ['charts', 'icons'], keywords: ['reviews', 'stars', 'feedback', 'product', 'app store', 'animated', 'histogram', 'ratings'] }),
  m('credit-card', 'Credit card', 'Display', 'Payment card preview that flips in 3D to show the CVV. Formats as the user types, guesses Visa, Mastercard, AmEx or RuPay, and can mask the number.', { keywords: ['payment', 'checkout', 'card', 'wallet', 'billing', 'flip', '3d', 'animated', 'debit'] }),
  m('bump-chart', 'Bump chart', 'Data', 'Rank over time as smooth lines that swap places. Lines draw in one by one; hover a line or name to follow it.', { requires: ['charts'], wide: true, keywords: ['chart', 'ranking', 'leaderboard', 'position', 'animated', 'rank change'] }),
  m('rose-chart', 'Rose chart', 'Data', 'Polar area chart: equal-angle petals whose length is the value. Petals bloom from the center in turn; hover one to read it.', { requires: ['charts'], keywords: ['chart', 'polar', 'radial', 'monthly', 'seasonal', 'animated', 'nightingale'] }),
  m('bullet-chart', 'Bullet chart', 'Data', 'A KPI against its target in one thin row, with shaded bands for poor, ok and good. The bar slides in on scroll.', { requires: ['charts'], keywords: ['chart', 'kpi', 'target', 'goal', 'quota', 'sla', 'animated', 'progress'] }),
  m('dumbbell-chart', 'Dumbbell chart', 'Data', 'Change per item as two dots joined by a line: before and after, plan and actual. Green when good, red when bad.', { requires: ['charts'], keywords: ['chart', 'before after', 'change', 'comparison', 'slope', 'animated', 'delta'] }),
  m('waffle-chart', 'Waffle chart', 'Data', 'A grid of 100 squares, each one percent of the whole. Squares pop in as a wave; hover a legend row to light up its squares.', { requires: ['charts'], keywords: ['chart', 'percent', 'share', 'survey', 'status', 'animated', 'proportion', 'pictogram'] }),
  m('treemap', 'Treemap', 'Data', 'Tiles sized by value, packed to stay square. Budget by team, revenue by product. Spring in on scroll; hover lifts one tile and dims the rest.', { requires: ['charts'], keywords: ['chart', 'budget', 'proportion', 'hierarchy', 'animated', 'disk usage', 'share'] }),
  m('waterfall-chart', 'Waterfall chart', 'Data', 'How a start number becomes an end number: green adds, red subtracts, blue totals. Bars drop in one after another with connector lines.', { requires: ['charts'], keywords: ['chart', 'profit', 'bridge', 'cash flow', 'variance', 'animated', 'finance'] }),
  m('sankey-chart', 'Sankey chart', 'Data', 'Flow diagram where ribbon width is the amount: traffic to page to outcome, budget to team. Ribbons draw in; hover follows a flow.', { requires: ['charts'], wide: true, keywords: ['chart', 'flow', 'funnel', 'journey', 'animated', 'allocation', 'paths'] }),
  m('stream-chart', 'Stream chart', 'Data', 'Streamgraph: smooth stacked flows around a center line to show shifts in mix over time. Ripples in from the left; hover a flow to focus it.', { requires: ['area-chart', 'charts'], keywords: ['chart', 'streamgraph', 'trend', 'composition', 'animated', 'topics', 'time series'] }),
  m('candlestick-chart', 'Candlestick chart', 'Data', 'Open, high, low and close per period. Green closed up, red closed down. Candles grow from their midpoint in sequence; hover for the four numbers.', { requires: ['charts'], keywords: ['chart', 'stock', 'finance', 'ohlc', 'price', 'animated', 'trading', 'range'] }),
  m('area-chart', 'Area chart', 'Data', 'Smooth gradient areas, stacked or overlapping, that wipe in on scroll. Hover for a readout across series.', { requires: ['charts'], keywords: ['chart', 'graph', 'stacked', 'trend', 'traffic', 'animated', 'time series'] }),
  m('scatter-chart', 'Scatter chart', 'Data', 'Scatter and bubble chart with axis labels, groups by color and a nearest-point hover. Points pop in one by one on scroll.', { requires: ['charts'], keywords: ['chart', 'bubble', 'correlation', 'plot', 'animated', 'distribution', 'outliers'] }),
  m('matrix-heatmap', 'Matrix heatmap', 'Data', 'Rows by columns shaded by value: traffic by hour and weekday, cohort retention. Cells fade in as a wave; hover lights up the row and column.', { requires: ['charts'], wide: true, keywords: ['chart', 'heat map', 'cohort', 'grid', 'retention', 'animated', 'hours', 'weekday'] }),
  m('stacked-bar-chart', 'Stacked bar chart', 'Data', 'Bars split into colored segments that grow in on scroll, with a hover breakdown and legend. Sessions by device, revenue by plan.', { requires: ['charts'], keywords: ['chart', 'graph', 'segments', 'breakdown', 'animated', 'analytics'] }),
  m('radial-bar-chart', 'Radial bar chart', 'Data', 'Concentric rings, one per goal, that sweep in on scroll. Legend hover highlights a ring; the middle takes any content.', { requires: ['charts'], keywords: ['chart', 'rings', 'goals', 'targets', 'activity', 'animated', 'okr'] }),
  m('live-chart', 'Live chart', 'Data', 'Streaming line chart that slides left as new values arrive. You give it a function for the next value; pause it any time.', { keywords: ['chart', 'realtime', 'streaming', 'monitoring', 'animated', 'cpu', 'active users'] }),
  m('pivot-table', 'Pivot table', 'Data', 'Cross-tab of your rows: one field down the side, another across the top, sum, count, average, min or max in each cell, with totals and heat shading.', { wide: true, keywords: ['cross tab', 'aggregate', 'group by', 'summary', 'report', 'spreadsheet'] }),
  m('tree-table', 'Tree table', 'Data', 'Table whose rows have child rows. Expand and collapse branches by click or arrow keys.', { requires: ['icons'], wide: true, keywords: ['hierarchy', 'nested', 'expand', 'budget', 'treegrid'] }),
  m('file-uploader', 'File uploader', 'Inputs', 'Multi-file drop area with a progress bar per file, cancel, retry and a concurrency limit. You supply the upload function.', { requires: ['icons', 'progress'], keywords: ['upload', 'progress', 'dropzone', 'attachments', 'drag'] }),
  m('onboarding-carousel', 'Onboarding carousel', 'Navigation', 'Mobile first-run intro with swipeable slides, dots, Skip and a final Get started button.', { requires: ['button'], keywords: ['intro', 'welcome', 'walkthrough', 'mobile', 'swipe', 'first run'] }),
  m('segmented', 'Segmented control', 'Inputs', 'Pick one of a few views or ranges. Smaller than tabs.', { deps: ['@radix-ui/react-toggle-group'], keywords: ['toggle', 'filter', 'range'] }),

  m('theme-toggle', 'Theme toggle', 'Inputs', 'Icon button that flips light and dark mode and remembers the choice. Also exports a useTheme hook.', { requires: ['button', 'icons'], keywords: ['dark mode', 'light mode', 'theme', 'appearance', 'topbar'] }),
  m('user-menu', 'User menu', 'Navigation', 'Avatar button for the topbar that opens a menu with name, email, your links and Sign out.', { requires: ['avatar', 'dropdown-menu', 'icons'], keywords: ['account', 'profile', 'avatar', 'logout', 'topbar', 'sign out'] }),
  m('settings-layout', 'Settings layout', 'Layout', 'Settings page frame: vertical section list on the left, SettingsSection rows (title and help on the left, controls on the right).', { keywords: ['preferences', 'account', 'profile', 'sections', 'form'] }),
  m('description-list', 'Description list', 'Display', 'Label and value pairs for a details panel, in one to three columns, optionally with dividers.', { keywords: ['details', 'key value', 'properties', 'summary', 'record', 'definition'] }),
  m('india-map', 'India map', 'Data', 'India by state and union territory, with a 3D bar or pin standing on every state in your data. Zoom and pan it; click a name in the list to highlight a state.', { requires: ['charts'], keywords: ['chart', 'map', 'india', 'states', 'regions', 'geo', 'bharat', 'orders', 'sales', 'animated', '3d'] }),
  m('world-map', 'World map', 'Data', 'Countries on a flat map or a draggable globe, with a 3D bar or pin standing on every country in your data. Zoom, pan and spin it; click a name in the list to highlight a country.', { requires: ['charts'], wide: true, keywords: ['chart', 'map', 'globe', 'countries', 'geo', 'regions', 'earth', 'locations', 'traffic', 'animated', '3d'] }),
  m('bar-list', 'Bar list', 'Data', 'Ranked list with a bar behind each row: top pages, products, sources, countries.', { keywords: ['top', 'ranking', 'leaderboard', 'analytics', 'horizontal bar', 'dashboard'] }),
  m('comparison-table', 'Comparison table', 'Data', 'Plans across the top, features down the side, a check, dash or text in each cell. For pricing pages.', { requires: ['icons'], wide: true, keywords: ['pricing', 'plans', 'features', 'tiers', 'compare'] }),
  m('invoice', 'Invoice', 'Display', 'Printable invoice with number, status, from and bill-to, line items, tax and total computed from the lines.', { requires: ['badge'], keywords: ['bill', 'receipt', 'billing', 'gst', 'payment', 'order'] }),
  m('landing-sections', 'Landing sections', 'Layout', 'Marketing page parts: Hero, LogoStrip, FeatureGrid, StatsStrip, Faq, CtaBanner and SiteFooter. Stack them with a Navbar.', { requires: ['accordion'], wide: true, keywords: ['marketing', 'homepage', 'hero', 'footer', 'features', 'faq', 'cta', 'website'] }),

  m('accordion', 'Accordion', 'Display', 'Collapsible sections with a smooth height animation. Single or multiple open.', { deps: [], keywords: ['faq', 'collapse', 'expand'] }),
  m('spotlight-card', 'Spotlight card', 'Display', 'Card with a glow and border highlight that follow the cursor.', { keywords: ['hover', 'glow', 'feature', 'marketing'] }),
  m('border-beam', 'Border beam', 'Display', 'A light beam that circles the border. For pricing cards and featured content.', { keywords: ['glow', 'pricing', 'highlight', 'animated border'] }),
  m('marquee', 'Marquee', 'Display', 'Endless logo or tag scroll with edge fade. Pauses on hover.', { keywords: ['logos', 'ticker', 'scroll', 'carousel', 'social proof'] }),
  m('number-ticker', 'Number ticker', 'Data', 'Counts up to a value with easing once it scrolls into view.', { keywords: ['count', 'animate', 'stat', 'kpi'] }),
  m('reveal', 'Reveal', 'Display', 'Scroll-in fade-up wrapper and a blur-in headline. One IntersectionObserver each.', { keywords: ['scroll', 'animation', 'stagger', 'headline', 'text'] }),
  m('copy-button', 'Copy button', 'Inputs', 'Copies text and morphs to a check.', { deps: [], keywords: ['clipboard', 'code', 'share'] }),
  m('otp-input', 'OTP input', 'Inputs', 'Code boxes with paste, backspace, arrow keys, autofill and a shake on error.', { keywords: ['verification', 'pin', 'code', '2fa', 'login'] }),
  m('slider', 'Slider', 'Inputs', 'Native range input with a filled track and floating value bubble.', { keywords: ['range', 'budget', 'volume'] }),
  m('dropzone', 'Dropzone', 'Inputs', 'Drag and drop file area with size check and removable file list.', { deps: [], keywords: ['upload', 'file', 'attachment', 'drag'] }),

  m('radio-group', 'Radio group', 'Inputs', 'Native radios as selectable cards with descriptions.', { keywords: ['option', 'plan', 'choice', 'form'] }),
  m('rating', 'Rating', 'Inputs', 'Star rating with hover preview. Read-only when no handler is given.', { deps: [], keywords: ['stars', 'review', 'feedback'] }),
  m('tag-input', 'Tag input', 'Inputs', 'Type and press Enter to add chips. Backspace removes the last.', { deps: [], keywords: ['chips', 'tags', 'skills', 'multi'] }),
  m('number-stepper', 'Number stepper', 'Inputs', 'Number field with plus and minus buttons and arrow keys.', { deps: [], keywords: ['quantity', 'counter', 'increment'] }),
  m('chip', 'Chip', 'Inputs', 'Toggleable filter chips, single or multi select.', { deps: [], keywords: ['filter', 'tag', 'toggle', 'pill'] }),
  m('carousel', 'Carousel', 'Display', 'Scroll-snap slides with arrows and animated dots.', { deps: [], keywords: ['slider', 'gallery', 'swipe', 'slides'] }),
  m('compare', 'Image compare', 'Display', 'Before and after slider. Drag or use arrow keys.', { keywords: ['before after', 'image', 'diff'] }),
  m('tilt-card', 'Tilt card', 'Display', '3D card that tilts toward the cursor with a moving sheen.', { keywords: ['3d', 'hover', 'perspective', 'id card'] }),
  m('shimmer-text', 'Shimmer text', 'Display', 'Text with a light sweep passing over it.', { keywords: ['heading', 'hero', 'loading text', 'animated text'] }),
  m('countdown', 'Countdown', 'Data', 'Live countdown with flipping digits.', { keywords: ['timer', 'deadline', 'launch', 'clock'] }),
  m('progress-ring', 'Progress ring', 'Data', 'Circular progress with an eased stroke animation.', { keywords: ['circle', 'gauge', 'radial', 'completion'] }),
  m('banner', 'Banner', 'Feedback', 'Announcement bar that collapses smoothly when dismissed.', { deps: [], keywords: ['announcement', 'promo', 'notice'] }),
  m('scroll-progress', 'Scroll progress', 'Navigation', 'Thin bar that fills as you scroll the page or a container.', { keywords: ['reading', 'indicator', 'article'] }),
  m('tree-view', 'Tree view', 'Navigation', 'Nested expandable list with animated open and close.', { deps: [], keywords: ['files', 'folders', 'hierarchy', 'org chart', 'nested'] }),

  m('toggle', 'Toggle', 'Inputs', 'Two-state button for favourite, bold or mute. Announces its state to screen readers.', { requires: [], keywords: ['pressed', 'favourite', 'like', 'bold', 'button'] }),
  m('toggle-group', 'Toggle group', 'Inputs', 'A row of toggles where one or several can be pressed, for formatting toolbars.', { deps: ['@radix-ui/react-toggle-group'], keywords: ['toolbar', 'bold', 'italic', 'multiple', 'formatting'] }),
  m('button-group', 'Button group', 'Inputs', 'Buttons joined into one row or column with shared borders and rounded outer corners.', { keywords: ['joined', 'split button', 'toolbar', 'segmented'] }),
  m('input-group', 'Input group', 'Inputs', 'One field with text, icons or buttons attached at the start or end, like https:// or .com.', { keywords: ['addon', 'prefix', 'suffix', 'url', 'currency'] }),
  m('search-input', 'Search input', 'Inputs', 'Search field with a clear button, Escape to clear and a slash shortcut to focus.', { requires: ['icons'], keywords: ['filter', 'find', 'query', 'shortcut'] }),
  m('password-input', 'Password input', 'Inputs', 'Show and hide toggle with an optional strength meter.', { requires: ['icons', 'input'], keywords: ['secret', 'login', 'sign up', 'strength'] }),
  m('color-picker', 'Color picker', 'Inputs', 'Swatches, hex field and the native picker. Always returns a six-digit hex.', { requires: ['icons'], keywords: ['hex', 'swatch', 'theme', 'brand'] }),
  m('collapsible', 'Collapsible', 'Display', 'One section that opens with a smooth height animation.', { requires: ['icons'], keywords: ['expand', 'show more', 'details', 'disclosure'] }),
  m('dock', 'Dock', 'Navigation', 'Icons that grow toward the pointer, like the macOS dock.', { keywords: ['magnify', 'toolbar', 'apps', 'launcher'] }),
  m('data-table', 'Data table', 'Data', 'Sortable columns, a search box and pagination, with optional row selection and bulk actions, column visibility menu, sticky header, toolbar slot, row action menus and clickable rows. You pass rows and column definitions.', { requires: ['button', 'checkbox', 'dropdown-menu', 'icons', 'pagination', 'table'], keywords: ['sort', 'filter', 'grid', 'list', 'rows', 'select', 'bulk', 'columns', 'sticky'] }),
  m('gauge', 'Gauge', 'Data', 'Half-circle meter with a needle that swings to the value.', { keywords: ['meter', 'speedometer', 'score', 'dial'] }),
  m('typewriter', 'Typewriter', 'Display', 'Types, holds and deletes phrases in a loop. Static for reduced motion.', { keywords: ['text', 'hero', 'rotating', 'headline', 'animated text'] }),
  m('confetti', 'Confetti', 'Feedback', 'Burst of confetti from any button, or call fireConfetti(x, y) yourself.', { keywords: ['celebrate', 'success', 'party', 'delight'] }),
  m('alert-dialog', 'Alert dialog', 'Overlays', 'Confirm before something destructive. Cancel and confirm, controlled by you.', { deps: [], requires: ['icons', 'button', 'dialog'], keywords: ['confirm', 'delete', 'are you sure', 'modal'] }),

  m('time-picker', 'Time picker', 'Time', 'Hour, minute and AM/PM segments you type into or step with arrow keys. 12 or 24 hour.', { requires: ['icons'], keywords: ['clock', 'hour', 'minute', 'shift', 'schedule', 'form'] }),
  m('analog-clock', 'Analog clock', 'Time', 'SVG clock for any time zone, with a second hand that ticks with a small bounce.', { keywords: ['watch', 'timezone', 'hands', 'time'] }),
  m('world-clock', 'World clock', 'Time', 'Cities with live local time, a day or night icon and the hour difference from you.', { requires: ['icons'], keywords: ['timezone', 'team', 'remote', 'cities'] }),
  m('stopwatch', 'Stopwatch', 'Time', 'Start, pause, lap and reset, down to hundredths of a second.', { requires: ['icons', 'button'], keywords: ['lap', 'timer', 'time tracking'] }),
  m('timer', 'Timer', 'Time', 'Countdown with a ring that drains smoothly, presets and an onDone callback.', { requires: ['icons', 'button'], keywords: ['countdown', 'pomodoro', 'focus'] }),
  m('relative-time', 'Relative time', 'Time', '"3 minutes ago", kept live. Hover for the full date. Uses Intl, so it speaks your locale.', { keywords: ['ago', 'timestamp', 'activity', 'feed', 'date'] }),
  m('heatmap', 'Heatmap', 'Data', 'Contribution-style grid for daily activity. Cells pop in column by column.', { keywords: ['activity', 'contributions', 'calendar', 'attendance', 'streak'] }),
  m('pricing-card', 'Pricing card', 'Display', 'Plan card whose price counts to the new value. The highlighted plan gets a travelling border beam.', { requires: ['icons', 'badge', 'border-beam', 'button', 'number-ticker'], keywords: ['plan', 'subscription', 'marketing', 'tier', 'billing'] }),

  m('changelog', 'Changelog', 'Display', 'Release notes: version and date on the left, tagged New, Improved, Fixed or Removed changes on the right.', { requires: ['badge'], keywords: ['release notes', 'updates', 'versions', 'whats new'] }),
  m('testimonial-card', 'Testimonial card', 'Display', 'Customer quote with avatar, role and optional star rating.', { requires: ['avatar', 'icons'], keywords: ['review', 'quote', 'social proof', 'customer'] }),
  m('comment-thread', 'Comment thread', 'Display', 'Nested comments with inline reply boxes, three levels deep.', { requires: ['avatar', 'button', 'input'], keywords: ['discussion', 'replies', 'conversation', 'feedback'] }),
  m('code-block', 'Code block', 'Display', 'Code with a title, optional line numbers and a copy button. No highlighter dependency.', { requires: ['icons'], keywords: ['snippet', 'pre', 'terminal', 'docs'] }),
  m('status-dot', 'Status dot', 'Display', 'Small status light with an optional pulse and label.', { keywords: ['online', 'live', 'health', 'indicator', 'presence'] }),
  m('search-bar', 'Search bar', 'Inputs', 'Search field with live results, highlighted matches, recent searches and full keyboard control.', { requires: ['icons'], keywords: ['autocomplete', 'suggest', 'find', 'typeahead', 'lookup'] }),
  m('currency-input', 'Currency input', 'Inputs', 'Money field that groups digits as you type (1,25,000) and hands you a plain number.', { keywords: ['money', 'amount', 'price', 'salary', 'rupee', 'number'] }),
  m('inline-edit', 'Inline edit', 'Inputs', 'Text that becomes a field on click. Enter saves, Escape cancels.', { requires: ['icons'], keywords: ['rename', 'edit in place', 'title'] }),
  m('kanban', 'Kanban board', 'Data', 'Columns of draggable cards. Drag with the mouse or move a focused card with Alt and the arrow keys. Controlled, no drag library.', { keywords: ['board', 'trello', 'pipeline', 'tasks', 'drag', 'drop', 'columns', 'crm'], wide: true }),
  m('orderlane-kanban', 'Orderlane kanban', 'Data', 'Kanban in three levels: collapsible status groups, fixed-width status columns and cards you drag between them. Edge auto-scroll, locked cards, a + on each column and a hook for gating a move on an attachment. Controlled, no drag library.', { keywords: ['board', 'pipeline', 'orders', 'crm', 'leads', 'drag', 'drop', 'groups', 'swimlane'], wide: true }),
  m('activity-feed', 'Activity feed', 'Display', 'Who did what and when, grouped under Today and Yesterday, with live relative times and an optional quoted detail.', { requires: ['avatar', 'relative-time'], keywords: ['audit', 'log', 'history', 'updates', 'stream', 'events'] }),
  m('permission-matrix', 'Permission matrix', 'Data', 'Roles by permissions grid of checkboxes with per-column toggle and locked roles.', { requires: ['checkbox', 'table'], keywords: ['roles', 'access', 'rbac', 'acl', 'admin', 'permissions'] }),
  m('filter-bar', 'Filter bar', 'Data', 'Removable filter chips with an Add filter menu: pick a field, then a value.', { requires: ['icons', 'button', 'popover'], keywords: ['filters', 'facets', 'refine', 'table', 'chips'] }),
  m('notification-center', 'Notification center', 'Feedback', 'Bell with an unread count and a popover list. Click marks read, Mark all read clears it.', { requires: ['icons', 'button', 'popover'], keywords: ['bell', 'inbox', 'alerts', 'unread', 'notifications'] }),
  m('cookie-consent', 'Cookie consent', 'Feedback', 'Bottom-left consent card that remembers Accept or Decline.', { requires: ['button'], keywords: ['gdpr', 'privacy', 'banner', 'cookies'] }),
  m('table-of-contents', 'Table of contents', 'Navigation', 'On this page list that highlights the section currently in view.', { keywords: ['scrollspy', 'headings', 'docs', 'anchor', 'outline'] }),

  m('product-card', 'Product card', 'Display', 'Product tile with image, rating, price with strike-through, discount tag, wishlist heart and Add button. Also exports Price.', { requires: ['button', 'icons', 'rating'], keywords: ['ecommerce', 'shop', 'store', 'price', 'wishlist', 'catalog', 'cart'] }),
  m('coupon-input', 'Coupon input', 'Inputs', 'Promo code field with async validation, an error message and a removable applied chip.', { requires: ['button', 'icons', 'input'], keywords: ['promo', 'discount', 'voucher', 'code', 'checkout'] }),
  m('order-summary', 'Order summary', 'Display', 'Cart lines with subtotal, discount, shipping, tax and total computed for you. Slots for a coupon field and a checkout button.', { keywords: ['cart', 'checkout', 'invoice', 'totals', 'receipt', 'ecommerce'] }),
  m('split-pane', 'Split pane', 'Layout', 'Two resizable panels with a draggable divider. Keyboard resizable. Horizontal or vertical.', { keywords: ['resizable', 'panels', 'divider', 'layout', 'ide', 'master detail'], wide: true }),
  m('sortable-list', 'Sortable list', 'Display', 'Reorder rows by dragging, or with arrow keys on the grip. Controlled, no drag library.', { keywords: ['drag', 'drop', 'reorder', 'priority', 'checklist', 'rank'] }),
  m('prompt-input', 'Prompt input', 'AI', 'The box you type a prompt into: grows with the text, Enter sends, Shift+Enter adds a line, and the send button turns into Stop while a reply streams.', { requires: ['icons'], keywords: ['chat', 'composer', 'llm', 'ai', 'textarea', 'message box'] }),
  m('ai-message', 'AI message', 'AI', 'One message in an AI chat: a right-aligned user bubble, or an assistant answer with copy, regenerate and thumbs actions and a blinking caret while it streams.', { requires: ['icons'], keywords: ['chat', 'llm', 'assistant', 'answer', 'streaming', 'response'] }),
  m('thinking', 'Thinking', 'AI', 'A shimmering "Thinking" status with bouncing dots, or a collapsible list of the steps the model is working through that settles into "Thought for 4s".', { requires: ['icons'], keywords: ['loading', 'reasoning', 'llm', 'ai', 'status', 'agent'] }),
  m('tool-call', 'Tool call', 'AI', 'A card for one tool or function call an AI made: name, running, done or failed, how long it took, and its input and output to expand.', { requires: ['icons'], keywords: ['agent', 'function', 'llm', 'mcp', 'api call', 'log'] }),
  m('sources', 'Sources', 'AI', 'Numbered citation chips (Cite) to drop inside an answer, and a SourceList of cards with title and site under it.', { requires: ['icons'], keywords: ['citation', 'references', 'links', 'rag', 'ai', 'footnote'] }),
  m('prompt-suggestions', 'Prompt suggestions', 'AI', 'Starter prompts for an empty chat, as two-line cards or compact chips. Selecting one fills the prompt box.', { keywords: ['starter', 'examples', 'chips', 'chat', 'empty state', 'ai'] }),
  m('token-meter', 'Token meter', 'AI', 'How much of a model context window is used: a bar that turns amber and red as it fills, token counts, an optional cost, and a split by prompt, files and reply.', { keywords: ['context', 'usage', 'limit', 'llm', 'cost', 'quota'] }),
  m('streaming-text', 'Streaming text', 'AI', 'Text that arrives word by word, each word fading up out of a soft blur, with a caret that follows the last one. Screen readers get the full text at once.', { keywords: ['typewriter', 'llm', 'stream', 'reveal', 'ai', 'generate'] }),
  m('ai-chat', 'AI chat', 'AI', 'A whole AI chat in one piece: a conversation that follows the newest message with a Latest button, a greeting and starter prompts while empty, a thinking row and the prompt box pinned below.', { requires: ['ai-message', 'icons', 'prompt-input', 'prompt-suggestions', 'thinking'], keywords: ['assistant', 'copilot', 'llm', 'conversation', 'messages', 'chatbot'], wide: true }),
  m('model-picker', 'Model picker', 'AI', 'Compact button that opens a list of models with a description, context size and tags such as Fast or Vision.', { requires: ['icons', 'popover'], keywords: ['llm', 'select', 'choose model', 'provider', 'ai'] }),
  m('voice-wave', 'Voice wave', 'AI', 'Audio level bars for a voice input: they dance while listening and settle to a line when paused. Drive them with a real level or leave them idle.', { keywords: ['microphone', 'audio', 'waveform', 'listening', 'voice', 'speech'] }),
  m('attachment', 'Attachment', 'AI', 'A file attached to a prompt: icon or thumbnail, name, size, an upload progress line, an error state and a remove button.', { requires: ['icons'], keywords: ['file', 'upload', 'chip', 'chat', 'attach', 'document'] }),
  m('chat', 'Chat', 'Display', 'Message bubbles with avatars, timestamps, a typing indicator and a composer. Enter sends.', { requires: ['avatar', 'icons'], keywords: ['messages', 'conversation', 'support', 'inbox', 'dm'] }),
  m('mention-input', 'Mention input', 'Inputs', 'Textarea that suggests people when you type @. Arrow keys and Enter pick.', { requires: ['avatar'], keywords: ['at', 'tag', 'people', 'comment', 'autocomplete'] }),
  m('profile-card', 'Profile card', 'Display', 'Person card with banner, avatar, role, stats and an actions slot.', { requires: ['avatar'], keywords: ['user', 'employee', 'team', 'member', 'bio'] }),
  m('terminal', 'Terminal', 'Display', 'Dark terminal window with prompt lines and output. Optional typing animation.', { keywords: ['console', 'shell', 'cli', 'command', 'code', 'bash'] }),
  m('navbar', 'Navbar', 'Navigation', 'Top bar with brand, links and actions that folds into a menu on small screens.', { requires: ['icons'], keywords: ['header', 'nav', 'menu', 'topbar', 'marketing'], wide: true }),
  m('menubar', 'Menubar', 'Navigation', 'Desktop-app style bar of menus (File, Edit, View) with shortcuts and checkable items.', { deps: ['@radix-ui/react-menubar'], requires: ['icons'], keywords: ['file menu', 'toolbar', 'app menu', 'desktop'] }),
  m('navigation-menu', 'Navigation menu', 'Navigation', 'Desktop top-bar menu whose items open mega-menu panels, with keyboard and focus handled.', { deps: ['@radix-ui/react-navigation-menu'], requires: ['icons'], keywords: ['mega menu', 'header', 'nav', 'dropdown', 'marketing'], wide: true }),
  m('bottom-nav', 'Bottom navigation', 'Navigation', 'Mobile tab bar with icons, labels, an active pill and count badges.', { keywords: ['mobile', 'tab bar', 'app', 'footer nav'] }),
  m('fab', 'Floating action button', 'Inputs', 'Round primary action, extended with a label, or a speed dial that fans out actions.', { requires: ['icons'], keywords: ['speed dial', 'mobile', 'create', 'compose', 'floating'] }),
  m('error-state', 'Error state', 'Feedback', 'Full-section error or not found screen with a code or icon, explanation and retry actions.', { requires: ['icons'], keywords: ['404', '500', 'failed', 'offline', 'not found', 'empty'] }),
  m('image-viewer', 'Image viewer', 'Overlays', 'Lightbox with arrows, click to zoom and keyboard control.', { deps: ['@radix-ui/react-dialog'], requires: ['icons'], keywords: ['gallery', 'lightbox', 'photo', 'zoom', 'preview'] }),

  m('line-chart', 'Line chart', 'Data', 'Multi-series line or area chart in plain SVG with grid, axis labels, legend and a hover readout.', { keywords: ['trend', 'graph', 'area', 'timeseries', 'analytics', 'revenue'] }),
  m('radar-chart', 'Radar chart', 'Data', 'Spider chart for several scores on the same axes: a pentagon with five, a hexagon with six. Shapes grow from the center on scroll; hover a legend name to highlight a series.', { keywords: ['spider', 'skills', 'performance', 'compare', 'review'] }),
  m('audit-log', 'Audit log', 'Data', 'Who changed what and when, with expandable before and after values.', { requires: ['avatar', 'badge', 'icons'], keywords: ['history', 'changes', 'compliance', 'activity', 'diff', 'security'] }),
  m('file-manager', 'File manager', 'Data', 'Folder browser with breadcrumb, list and grid views, selection and double-click or Enter to open.', { requires: ['icons'], keywords: ['files', 'folders', 'documents', 'drive', 'explorer'] }),
  m('swipe-actions', 'Swipe actions', 'Display', 'List row you swipe left to reveal action buttons. Touch, mouse drag and keyboard.', { keywords: ['mobile', 'list', 'archive', 'delete', 'gesture', 'row'] }),
  m('pull-to-refresh', 'Pull to refresh', 'Feedback', 'Scroll area you pull down from the top to refresh, with a spinner until your promise settles.', { requires: ['icons'], keywords: ['mobile', 'reload', 'gesture', 'refresh', 'feed'] }),
  m('datetime-picker', 'Date and time picker', 'Inputs', 'One field for a day and a time: calendar on top, time picker below.', { requires: ['calendar', 'icons', 'popover', 'time-picker'], keywords: ['schedule', 'appointment', 'meeting', 'slot', 'datetime'] }),
  m('image-upload', 'Image upload', 'Inputs', 'Thumbnail grid with remove buttons, a cover label and a drop tile. Limits count, type and size.', { requires: ['icons'], keywords: ['photos', 'gallery', 'product images', 'avatar', 'upload', 'preview'] }),
  m('drawer', 'Drawer', 'Overlays', 'Panel that slides in from any edge and follows your finger: drag the grip to dismiss. Bottom drawers can rest half open (snap points) and be pulled to full height.', { deps: ['@radix-ui/react-dialog'], keywords: ['drawer', 'sheet', 'slide over', 'side panel', 'snap points', 'mobile', 'modal', 'bottom sheet'] }),
  m('bottom-sheet', 'Bottom sheet', 'Overlays', 'Sheet that rises from the bottom, with a drag handle to dismiss. Radix Dialog underneath.', { deps: ['@radix-ui/react-dialog'], keywords: ['mobile', 'drawer', 'modal', 'action sheet', 'picker'] }),

  m('avatar-upload', 'Avatar upload', 'Inputs', 'Click-to-change profile picture with instant preview, size and type checks, and a Remove link.', { requires: ['avatar', 'icons'], keywords: ['profile', 'photo', 'picture', 'account', 'settings'] }),
  m('schema-form', 'Schema form', 'Inputs', 'Build a form from a description: text, email, number, date, select, textarea and checkbox fields, validation, and optional multi-step wizard with a stepper.', { requires: ['button', 'checkbox', 'input', 'label', 'select', 'stepper'], keywords: ['form builder', 'wizard', 'multi step', 'validation', 'onboarding', 'dynamic form', 'json'] }),
  m('rich-text-editor', 'Rich text editor', 'Inputs', 'Small editor with bold, italic, underline, heading, lists, quote and link. Value is HTML. Built on contentEditable, no dependency.', { keywords: ['wysiwyg', 'notes', 'email', 'comment', 'html', 'editor', 'markdown'] }),
  m('notification-preferences', 'Notification preferences', 'Inputs', 'Grid of events by channel (email, push, SMS, in-app) with a switch per cell and a switch per channel.', { requires: ['switch'], keywords: ['settings', 'alerts', 'subscribe', 'channels', 'email', 'preferences'] }),
  m('saved-views', 'Saved views', 'Data', 'Menu of saved table setups: pick one, save the current one under a name, delete.', { requires: ['button', 'icons', 'popover'], keywords: ['filters', 'presets', 'bookmarks', 'table', 'segments'] }),
  m('funnel-chart', 'Funnel chart', 'Data', 'Conversion funnel with a bar per stage and the step-to-step rate.', { keywords: ['conversion', 'sales', 'pipeline', 'stages', 'marketing', 'drop off'] }),
  m('gantt', 'Gantt chart', 'Data', 'Schedule view with a bar per task, progress fill, weekend shading and a today line.', { keywords: ['timeline', 'schedule', 'project', 'plan', 'roadmap', 'tasks', 'calendar'], wide: true }),
  m('org-chart', 'Org chart', 'Data', 'Reporting tree with connector lines and collapsible teams.', { requires: ['avatar', 'icons'], keywords: ['hierarchy', 'reporting', 'team', 'structure', 'people', 'tree'], wide: true }),
  m('approval-flow', 'Approval flow', 'Display', 'Chain of approvers with decisions, comments and times. The current approver gets Approve and Reject buttons.', { requires: ['avatar', 'button', 'icons'], keywords: ['workflow', 'request', 'sign off', 'review', 'leave', 'purchase'] }),
  m('onboarding-checklist', 'Onboarding checklist', 'Display', 'Getting-started card with a progress bar, tick-off items, short help text and actions. Collapsible.', { requires: ['icons', 'progress'], keywords: ['setup', 'getting started', 'steps', 'activation', 'tasks'] }),
  m('tag-manager', 'Tag manager', 'Display', 'Create, rename, recolor and delete labels, with usage counts.', { requires: ['icons'], keywords: ['labels', 'categories', 'colors', 'badges', 'settings'] }),
  m('shortcuts-dialog', 'Shortcuts dialog', 'Overlays', 'Keyboard cheat sheet that opens on ? and shows grouped shortcuts as keycaps.', { requires: ['dialog', 'kbd'], keywords: ['help', 'hotkeys', 'keyboard', 'cheat sheet', 'accessibility'] }),
  m('format', 'Format helpers', 'Display', 'formatCurrency, formatCompact, formatPercent, formatBytes, formatDuration and a signed Currency component. Indian rupees by default.', { keywords: ['number', 'money', 'currency', 'rupee', 'lakh', 'intl', 'format'] }),

  m('version-log', 'Version log', 'Display', 'Animated version history: the rail draws and dots pop as releases scroll in, entries slide in one by one, releases fold open, with a version jump strip and a kind filter.', { requires: ['badge', 'icons', 'segmented'], keywords: ['changelog', 'releases', 'history', 'versions', 'release notes', 'whats new', 'timeline'], wide: true }),
  m('card', 'Card', 'Display', 'Bordered surface with header, content and footer parts.', { keywords: ['panel', 'container', 'surface'] }),
  m('brand-icons', 'Brand icons', 'Display', 'Logos of popular services as single-colour SVGs that follow the text colour, for sign-in buttons and integration lists.', { keywords: ['logo', 'google', 'github', 'social', 'login', 'payment', 'visa', 'stripe'] }),
  m('badge', 'Badge', 'Display', 'Status pill with semantic colors and an optional dot.', { keywords: ['status', 'tag', 'chip', 'label'] }),
  m('avatar', 'Avatar', 'Display', 'Image with initials fallback in a stable color. Five sizes, circle or square, presence dot (online, away, busy, offline), a stacked group with hover names, and UserInfo for avatar plus name and subtitle.', { deps: ['@radix-ui/react-avatar'], keywords: ['user', 'profile', 'people', 'presence', 'status', 'initials', 'team'] }),
  m('table', 'Table', 'Display', 'Dense table parts with hover rows, a selected state, footer and caption.', { keywords: ['grid', 'list', 'rows', 'data'] }),
  m('separator', 'Separator', 'Display', 'Horizontal or vertical divider.', { deps: ['@radix-ui/react-separator'], keywords: ['divider', 'line'] }),
  m('kbd', 'Kbd', 'Display', 'Keyboard key hint.', { keywords: ['shortcut', 'key'] }),
  m('empty-state', 'Empty state', 'Display', 'Dashed placeholder with icon, text and an action.', { keywords: ['blank', 'no data', 'zero'] }),
  m('timeline', 'Timeline', 'Display', 'Vertical activity feed with tone-colored markers.', { keywords: ['activity', 'history', 'log', 'feed'] }),

  m('stat-card', 'Stat card', 'Data', 'KPI tile with value, trend delta and a sparkline slot.', { deps: [], requires: ['card'], keywords: ['kpi', 'metric', 'number', 'dashboard'] }),
  m('charts', 'Charts', 'Data', 'Sparkline, bar chart and donut in plain SVG. No chart library.', { keywords: ['graph', 'bar', 'donut', 'sparkline', 'plot'] }),
  m('progress', 'Progress', 'Data', 'Thin progress bar with four tones.', { deps: ['@radix-ui/react-progress'], keywords: ['bar', 'loading', 'budget'] }),

  m('alert', 'Alert', 'Feedback', 'Inline message in info, success, warning and danger.', { deps: [], keywords: ['banner', 'notice', 'message'] }),
  m('toast', 'Toast', 'Feedback', 'Call toast.success() from anywhere. No provider needed.', { deps: [], keywords: ['notification', 'snackbar'] }),
  m('skeleton', 'Skeleton', 'Feedback', 'Shimmering placeholder for content that is loading.', { keywords: ['loading', 'placeholder'] }),
  m('loader', 'Loader', 'Feedback', 'Six loading animations (ring, dots, bars, pulse, orbit, dual), an indeterminate or determinate bar loader, and a loading overlay.', { keywords: ['loading', 'spinner', 'wait', 'busy', 'progress', 'overlay', 'bar'] }),
  m('spinner', 'Spinner', 'Feedback', 'Tiny CSS spinner that inherits text color.', { keywords: ['loading', 'wait'] }),

  m('dialog', 'Dialog and Sheet', 'Overlays', 'Centered modal and edge-docked sheet on Radix Dialog.', { deps: ['@radix-ui/react-dialog'], keywords: ['modal', 'drawer', 'popup'] }),
  m('dropdown-menu', 'Dropdown menu', 'Overlays', 'Action menu with checkbox items, shortcuts and destructive items.', { deps: ['@radix-ui/react-dropdown-menu'], keywords: ['menu', 'actions', 'context'] }),
  m('popover', 'Popover', 'Overlays', 'Floating panel anchored to a trigger.', { deps: ['@radix-ui/react-popover'], keywords: ['floating', 'quick'] }),
  m('tour', 'Tour', 'Overlays', 'Spotlight a part of the page and step through it with a card, for product walkthroughs.', { requires: ['button', 'popover'], keywords: ['walkthrough', 'onboarding', 'coachmark', 'guide', 'spotlight', 'intro'] }),
  m('hover-card', 'Hover card', 'Overlays', 'Rich preview that opens when you hover or focus a link, for profiles and references.', { deps: ['@radix-ui/react-hover-card'], keywords: ['preview', 'mention', 'profile', 'peek'] }),
  m('context-menu', 'Context menu', 'Overlays', 'Right-click menu with items, shortcuts, checkbox items, labels and nested submenus.', { deps: ['@radix-ui/react-context-menu'], keywords: ['right click', 'menu', 'actions', 'popup'] }),
  m('tooltip', 'Tooltip', 'Overlays', 'Hint on hover and focus. Optional title, keyboard shortcut, light style and arrow, plus an (i) InfoTip and a TruncatedText that only shows a tooltip when cut off.', { deps: ['@radix-ui/react-tooltip'], requires: ['icons', 'kbd'], keywords: ['hint', 'hover', 'info', 'help', 'truncate', 'shortcut'] }),
  m('command', 'Command palette', 'Overlays', 'Searchable palette on cmdk. Bind it to Ctrl or Cmd K.', { deps: ['cmdk', '@radix-ui/react-dialog'], keywords: ['search', 'spotlight', 'cmdk'] }),

  m('tabs', 'Tabs', 'Navigation', 'Underline or pill tabs on Radix Tabs.', { deps: ['@radix-ui/react-tabs'], keywords: ['sections', 'switch'] }),
  m('breadcrumb', 'Breadcrumb', 'Navigation', 'Trail of parent pages.', { deps: [], keywords: ['path', 'trail'] }),
  m('pagination', 'Pagination', 'Navigation', 'Page buttons with ellipsis for long ranges.', { deps: [], keywords: ['pages', 'next', 'previous'] }),
  m('stepper', 'Stepper', 'Navigation', 'Horizontal steps for multi-step forms and onboarding.', { deps: [], keywords: ['wizard', 'steps', 'onboarding'] }),

  m('sidebar', 'Sidebar', 'Layout', 'Collapsible nav with groups, nested links and badges. Icon rail on desktop, slide-over on mobile.', { deps: ['@radix-ui/react-dialog', '@radix-ui/react-tooltip'], requires: ['dialog', 'tooltip'], keywords: ['nav', 'menu', 'navigation', 'drawer', 'rail'], wide: true }),
  m('app-shell', 'App shell', 'Layout', 'Sidebar, topbar and scrolling content area, plus a page header.', { deps: [], requires: ['sidebar'], keywords: ['layout', 'dashboard', 'frame', 'page', 'admin'], wide: true }),
];

// Everything is loaded on demand, so the docs site opens fast even with 130+ components.
type Loader<T> = Record<string, () => Promise<T>>;
const uiSrc = import.meta.glob('/src/components/ui/*.tsx', { query: '?raw', import: 'default' }) as Loader<string>;
const exMod = import.meta.glob('/src/examples/*.tsx') as Loader<{ default: ComponentType }>;
const exSrc = import.meta.glob('/src/examples/*.tsx', { query: '?raw', import: 'default' }) as Loader<string>;

export const components: Entry[] = metas.map((meta) => {
  const f = (dir: string, ext = '.tsx') => `/src/${dir}/${meta.slug}${ext}`;
  return {
    ...meta,
    // Real imports (generated by registry:build) win over the hand-written list, so "copy these files" is always complete.
    requires: (realRequires as Record<string, string[]>)[meta.slug] ?? meta.requires,
    isNew: NEW_SLUGS.has(meta.slug),
    Demo: lazy(exMod[f('examples')]),
    loadDemoSource: exSrc[f('examples')],
    loadSource: uiSrc[f('components/ui')],
    path: `components/ui/${meta.slug}.tsx`,
    guide: (guides as Record<string, ChartGuide>)[meta.slug],
  };
});

export const categories: Category[] = ['Layout', 'Inputs', 'Time', 'Display', 'AI', 'Data', 'Feedback', 'Overlays', 'Navigation'];

export interface Block {
  slug: string;
  name: string;
  module: 'HRMS' | 'Marketing' | 'Auth' | 'Layout' | 'Reports' | 'Account' | 'Dashboard' | 'Commerce' | 'Landing' | 'Messaging' | 'Productivity';
  description: string;
  uses: string[];
  Demo: ComponentType;
  loadSource: () => Promise<string>;
  path: string;
}

const bMeta: Omit<Block, 'Demo' | 'loadSource' | 'path'>[] = [
  { slug: 'analytics-dashboard', name: 'Analytics dashboard', module: 'Dashboard', description: 'Visitors, page views, session time and conversion KPIs, a traffic area chart, device donut, top pages bar list and weekday bars.', uses: ['stat-card', 'charts', 'area-chart', 'stacked-bar-chart', 'radial-bar-chart', 'live-chart', 'bar-list', 'card'] },
  { slug: 'ecommerce-dashboard', name: 'Ecommerce dashboard', module: 'Commerce', description: 'Sales, orders, customers and to-ship KPIs, revenue chart, top products and a recent orders table with status badges.', uses: ['stat-card', 'line-chart', 'bar-list', 'table', 'badge', 'avatar', 'format'] },
  { slug: 'project-overview', name: 'Project overview', module: 'Dashboard', description: 'Project header with status and team, progress ring with phase bars, task list and a milestone timeline.', uses: ['card', 'progress', 'progress-ring', 'badge', 'avatar', 'timeline'] },
  { slug: 'user-management', name: 'User management', module: 'Account', description: 'Team members table with search, sort, role and status, row actions (suspend, remove) and an invite dialog with validation.', uses: ['data-table', 'dialog', 'dropdown-menu', 'select', 'avatar', 'badge', 'toast'] },
  { slug: 'profile-page', name: 'Profile page', module: 'Account', description: 'Cover and avatar header with actions, then About (details list) and Activity (timeline) tabs.', uses: ['card', 'avatar', 'description-list', 'tabs', 'timeline', 'badge'] },
  { slug: 'billing-page', name: 'Billing page', module: 'Account', description: 'Current plan with seat and storage usage bars, payment method card and an invoice history table.', uses: ['card', 'progress', 'table', 'badge', 'button', 'toast'] },
  { slug: 'api-keys-page', name: 'API keys page', module: 'Account', description: 'Create, reveal, copy and revoke keys, with a masked secret and an empty state.', uses: ['card', 'input', 'copy-button', 'empty-state', 'badge', 'toast'] },
  { slug: 'invoice-page', name: 'Invoice page', module: 'Commerce', description: 'A full invoice with print, download and send actions.', uses: ['invoice', 'button', 'toast'] },
  { slug: 'checkout-page', name: 'Checkout page', module: 'Commerce', description: 'Delivery address form with validation, shipping options, coupon code and a live order summary.', uses: ['card', 'input', 'label', 'radio-group', 'order-summary', 'coupon-input', 'button', 'toast'] },
  { slug: 'landing-page', name: 'Landing page', module: 'Landing', description: 'Whole marketing page: navbar, hero, logos, feature grid, stats, FAQ, call to action and footer.', uses: ['navbar', 'landing-sections', 'button', 'icons'] },
  { slug: 'not-found-page', name: 'Not found page', module: 'Layout', description: 'Full-page 404 with search and two ways out. Reuse for 403 and 500.', uses: ['error-state', 'search-input', 'button'] },
  { slug: 'inbox', name: 'Inbox', module: 'Layout', description: 'Two-pane mail view: searchable list with unread dots, message reader with reply, archive and delete. Single pane on mobile.', uses: ['avatar', 'search-input', 'empty-state', 'button'] },
  { slug: 'top-nav-layout', name: 'Top-nav layout', module: 'Layout', description: 'App frame with a top navigation bar instead of a sidebar, with notifications, theme toggle and user menu.', uses: ['navbar', 'user-menu', 'theme-toggle', 'stat-card', 'card'] },
  { slug: 'admin-shell', name: 'Admin shell', module: 'Layout', description: 'Full app frame: grouped sidebar with nested links, topbar with search, alerts and user menu, and a dashboard page.', uses: ['app-shell', 'sidebar', 'date-picker', 'stat-card', 'dropdown-menu', 'breadcrumb', 'timeline'] },
  { slug: 'hrms-overview', name: 'People overview', module: 'HRMS', description: 'Headcount, attendance, department split and activity feed.', uses: ['stat-card', 'charts', 'card', 'timeline', 'avatar'] },
  { slug: 'employee-directory', name: 'Employee directory', module: 'HRMS', description: 'Searchable table with status filter, row selection, actions and pagination.', uses: ['table', 'checkbox', 'segmented', 'dropdown-menu', 'pagination', 'badge', 'avatar'] },
  { slug: 'reports-table', name: 'Reports table', module: 'Reports', description: 'Searchable, filterable, sortable reports table with row action menus and a details drawer.', uses: ['data-table', 'filter-bar', 'dropdown-menu', 'dialog', 'charts', 'badge', 'toast'] },
  { slug: 'sales-dashboard', name: 'Sales dashboard', module: 'Marketing', description: 'KPI cards, revenue line chart against target, pipeline funnel and a top deals table.', uses: ['stat-card', 'line-chart', 'funnel-chart', 'charts', 'table', 'badge', 'avatar', 'format'] },
  { slug: 'leave-approvals', name: 'Leave approvals', module: 'HRMS', description: 'Manager inbox with tabs, balance bars and approve or reject toasts.', uses: ['tabs', 'card', 'progress', 'badge', 'toast', 'empty-state'] },
  { slug: 'leave-request-form', name: 'Leave request form', module: 'HRMS', description: 'Date range, approver combobox, multi-select notify list, working-day count and field validation.', uses: ['date-picker', 'combobox', 'select', 'input', 'label', 'alert', 'toast', 'card'] },
  { slug: 'new-hire-form', name: 'New hire form', module: 'HRMS', description: 'Sectioned onboarding form with ten dropdowns: selects, searchable comboboxes and a multi-select, plus required-field validation.', uses: ['select', 'combobox', 'input', 'label', 'toast', 'card'] },
  { slug: 'campaign-performance', name: 'Campaign performance', module: 'Marketing', description: 'Channel KPIs, weekly leads chart and a campaign budget table.', uses: ['stat-card', 'charts', 'table', 'progress', 'badge'] },
  { slug: 'lead-pipeline', name: 'Lead pipeline', module: 'Marketing', description: 'Drag-and-drop board with column totals and a keyboard-friendly move button.', uses: ['card', 'badge', 'avatar', 'toast'] },
  { slug: 'pricing-page', name: 'Pricing page', module: 'Marketing', description: 'Headline, monthly or yearly switch, three plan cards with a highlighted one, and an FAQ.', uses: ['pricing-card', 'segmented', 'accordion', 'reveal', 'toast'] },
  { slug: 'settings-page', name: 'Settings page', module: 'Account', description: 'Profile form with photo and phone number, notification switches and language and time zone, in tabs.', uses: ['tabs', 'card', 'avatar', 'input', 'label', 'phone-input', 'select', 'switch', 'toast'] },
  { slug: 'sign-up', name: 'Sign up', module: 'Auth', description: 'Registration card with name, email, password strength meter, terms checkbox, validation and a check-your-inbox confirmation.', uses: ['card', 'input', 'label', 'password-input', 'checkbox', 'button', 'brand-icons'] },
  { slug: 'reset-password', name: 'Reset password', module: 'Auth', description: 'Four steps: ask for email, check your inbox with a resend timer, choose a new password, done.', uses: ['card', 'input', 'label', 'password-input', 'button'] },
  { slug: 'sign-in', name: 'Sign in', module: 'Auth', description: 'Login card with validation, loading button and an error alert.', uses: ['card', 'input', 'label', 'checkbox', 'alert', 'button', 'brand-icons'] },
  { slug: 'otp-verify', name: 'OTP verify', module: 'Auth', description: 'Six-digit code entry with a resend countdown, an error state and a success screen.', uses: ['card', 'otp-input', 'button'] },
  { slug: 'onboarding-wizard', name: 'Onboarding wizard', module: 'Account', description: 'Four-step setup (profile, team, preferences, done) with a stepper, validation and values kept when you go back.', uses: ['card', 'stepper', 'label', 'input', 'segmented', 'switch', 'button'] },
  { slug: 'notifications-page', name: 'Notifications page', module: 'Account', description: 'Full-page inbox with All and Unread tabs, mark as read and mark all read.', uses: ['card', 'tabs', 'avatar', 'empty-state', 'button'] },
  { slug: 'server-error-page', name: 'Server error page', module: 'Layout', description: 'A 500 page with a retry that loads, a status link and a short incident timeline.', uses: ['card', 'error-state', 'timeline', 'button'] },
  { slug: 'team-page', name: 'Team page', module: 'Marketing', description: 'Heading, a grid of team members with roles and short bios, and a hiring call to action.', uses: ['avatar', 'card', 'button'] },
  { slug: 'contact-page', name: 'Contact page', module: 'Marketing', description: 'Contact form with validation and a confirmation, beside an FAQ accordion.', uses: ['card', 'label', 'input', 'accordion', 'button'] },
  { slug: 'finance-dashboard', name: 'Finance dashboard', module: 'Dashboard', description: 'Balance, income, spending and savings rate, a cash-flow chart, spending by category and recent transactions.', uses: ['stat-card', 'charts', 'line-chart', 'bar-list', 'table', 'badge', 'format', 'card'] },
  { slug: 'kanban-board-page', name: 'Kanban board page', module: 'Dashboard', description: 'Full-page board with search, a priority filter, column totals and a dialog for each task. Drag a card or move it with Alt and the arrow keys.', uses: ['kanban', 'avatar', 'badge', 'dialog', 'segmented', 'input', 'icons'] },
  { slug: 'chat-app', name: 'Chat app', module: 'Messaging', description: 'Conversation list with unread badges beside a thread with a composer and a typing indicator.', uses: ['chat', 'avatar', 'badge'] },
  { slug: 'calendar-app', name: 'Calendar app', module: 'Productivity', description: 'Month and week calendar where you click a day or press New event to add an event in a dialog.', uses: ['event-calendar', 'dialog', 'label', 'input', 'segmented', 'button'] },
];

const bMod = import.meta.glob('/src/blocks/*.tsx') as Loader<{ default: ComponentType }>;
const bSrc = import.meta.glob('/src/blocks/*.tsx', { query: '?raw', import: 'default' }) as Loader<string>;

export const blocks: Block[] = bMeta.map((b) => ({
  ...b,
  Demo: lazy(bMod[`/src/blocks/${b.slug}.tsx`]),
  loadSource: bSrc[`/src/blocks/${b.slug}.tsx`],
  path: `blocks/${b.slug}.tsx`,
}));

export const globalCss: string = (
  import.meta.glob('/src/index.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
)['/src/index.css'];
export const utilsSource: string = (
  import.meta.glob('/src/lib/utils.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
)['/src/lib/utils.ts'];
