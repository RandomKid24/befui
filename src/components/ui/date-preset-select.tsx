'use client';

import * as React from 'react';
import { Button } from './button';
import { CalendarIcon, ChevronDownIcon } from './icons';
import { defaultRangePresets, type RangePreset } from './date-picker';
import type { DateRange } from './calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

/**
 * A compact "Last 7 days" dropdown for dashboards: pick a preset, get a `{ from, to }` range. Smaller than the date range picker when you
 * do not need a calendar. `value` is the label that is selected; `onChange` gets the label and the range worked out for today.
 */
export function DatePresetSelect({ value, onChange, presets = defaultRangePresets, className }: { value: string; onChange: (label: string, range: DateRange) => void; presets?: RangePreset[]; className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <CalendarIcon className="size-4 text-muted-foreground" />
          {value}
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {presets.map((p) => <DropdownMenuItem key={p.label} onSelect={() => onChange(p.label, p.range())}>{p.label}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
