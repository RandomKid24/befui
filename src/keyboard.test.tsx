// Keyboard-only behaviour of the widgets axe cannot judge: no mouse, no drag.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '@/components/ui/calendar';
import { Combobox } from '@/components/ui/combobox';
import { SortableList } from '@/components/ui/sortable-list';
import { Switch } from '@/components/ui/switch';

describe('keyboard', () => {
  it('Switch toggles with Space', async () => {
    const on = vi.fn();
    render(<Switch aria-label="Notify" onCheckedChange={on} />);
    await userEvent.tab();
    expect(screen.getByRole('switch')).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(on).toHaveBeenCalledWith(true);
  });

  it('Calendar moves by day and week with arrows and picks with Enter', async () => {
    const onSelect = vi.fn();
    render(<Calendar defaultMonth={new Date(2026, 9, 1)} selected={new Date(2026, 9, 15)} onSelect={onSelect} />);
    const grid = screen.getByRole('grid');
    const day = within(grid).getAllByRole('gridcell').map((c) => c.querySelector('button') ?? c).find((b) => b.tabIndex === 0)!;
    day.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}{Enter}'); // 15th -> 16th -> 23rd
    expect(onSelect).toHaveBeenCalled();
    expect((onSelect.mock.calls[0]![0] as Date).getDate()).toBe(23);
  });

  it('SortableList reorders with the arrow keys on the grip', async () => {
    const Harness = () => {
      const [items, set] = React.useState([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
      return <SortableList items={items} onChange={set} renderItem={(i) => <span>{i.id}</span>} />;
    };
    render(<Harness />);
    const grips = () => screen.getAllByRole('button');
    grips()[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['b', 'a', 'c']);
  });

  it('Combobox opens from the keyboard, filters, and selects with Enter', async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={[{ value: 'a', label: 'Apple' }, { value: 'b', label: 'Banana' }]} onValueChange={onValueChange} />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('ban{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});

// Keyboard focus must stay visible: jsdom cannot compute styles, so guard the source instead.
describe('focus visibility', () => {
  it('base layer draws a ring on every focusable element', async () => {
    const { readFileSync } = await import('node:fs');
    const css = readFileSync('src/index.css', 'utf8');
    expect(css).toMatch(/:where\([^{]*button[^{]*\):focus-visible\s*\{[^}]*outline: 2px/);
  });

  it('no button, link or tabbable element hides its outline without a replacement', async () => {
    const { readdirSync, readFileSync } = await import('node:fs');
    const dir = 'src/components/ui';
    const bad: string[] = [];
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.tsx'))) {
      readFileSync(`${dir}/${f}`, 'utf8').split('\n').forEach((line, i) => {
        if (/<(button|a|span)\b[^>]*(tabIndex|onClick|href)/.test(line) && /outline-none/.test(line) && !/focus-visible|focus:|ring/.test(line)) bad.push(`${f}:${i + 1}`);
      });
    }
    expect(bad).toEqual([]);
  });
});
