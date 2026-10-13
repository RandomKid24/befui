// Guards the icon set: every icon is in the `icons` map (the docs page and AI catalog read it) and draws something.
import type { ComponentType } from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import * as mod from '@/components/ui/icons';

const icons = mod.icons as unknown as Record<string, ComponentType>;

/** Icons added per release batch. Add a batch here first, watch it fail, then draw the icons. */
const BATCHES: Record<string, string[]> = {
  'health, finance, charts': [
    'Stethoscope', 'Syringe', 'HeartPulse', 'Brain', 'Bandage', 'Dna', 'Microscope', 'Ambulance', 'Hospital', 'Tooth', 'MedicalCross', 'Bed',
    'Euro', 'Pound', 'Yen', 'Bitcoin', 'PiggyBank', 'Safe', 'Handshake', 'Invoice',
    'ScatterChart', 'Funnel', 'Sigma', 'RadarChart', 'CandlestickChart', 'DonutChart', 'StackedBar', 'Histogram',
  ].map((n) => `${n}Icon`),
  'weather, transport': [
    'CloudRain', 'CloudSnow', 'CloudLightning', 'CloudSun', 'CloudFog', 'Wind', 'Sunrise', 'Sunset', 'Umbrella', 'Snowflake',
    'Bus', 'Train', 'Bike', 'Ship', 'Plane', 'Fuel', 'Parking', 'Anchor', 'Scooter', 'Road',
  ].map((n) => `${n}Icon`),
  'ui and frontend essentials': [
    'ArrowLeftRight', 'ArrowUpDown', 'ChevronsUp', 'ChevronsDown', 'CornerUpLeft', 'CornerUpRight', 'CornerDownLeft', 'ArrowDownToLine', 'ArrowUpFromLine',
    'PanelLeftClose', 'PanelLeftOpen', 'Expand', 'Shrink', 'Fullscreen', 'SidebarRight', 'LayoutTemplate',
    'AlignJustify', 'ListOrdered', 'Heading1', 'Heading2', 'Heading3', 'Indent', 'Outdent', 'Highlighter', 'Pilcrow',
    'FileImage', 'FileVideo', 'FileAudio', 'FileX', 'FileDown', 'FileUp', 'FileArchive', 'FileJson',
    'Braces', 'Brackets', 'Webhook', 'Puzzle', 'GitCommit', 'GitPullRequest', 'GitFork', 'Binary',
    'Unlink', 'PinOff', 'ThumbsDown', 'GripVertical', 'GripHorizontal', 'ToggleRight', 'Crosshair', 'Dot', 'Equal',
    'UserCog', 'CalendarPlus', 'CalendarDays', 'CalendarX', 'ReplyAll',
    'Keyboard', 'Cast', 'SignalBars', 'BatteryCharging', 'Fingerprint',
  ].map((n) => `${n}Icon`),
};

it('every exported *Icon is in the icons map', () => {
  const exported = Object.keys(mod).filter((k) => k.endsWith('Icon')).sort();
  expect(exported.filter((k) => !(k in icons))).toEqual([]);
});

it('every icon renders an svg with at least one shape', () => {
  const empty = Object.entries(icons)
    .filter(([, Icon]) => !render(<Icon />).container.querySelector('svg path, svg circle, svg rect'))
    .map(([name]) => name);
  expect(empty).toEqual([]);
});

it.each(Object.entries(BATCHES))('batch "%s" is in the icons map', (_, names) => {
  expect(names.filter((n) => !(n in icons))).toEqual([]);
});
