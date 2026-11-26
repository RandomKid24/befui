import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { expect, it } from 'vitest';
import { CapsuleBars } from '@/components/ui/desk-kit';
import { splitCount } from '@/components/ui/number-ticker';
import { PaintGrid } from '@/components/ui/paint-grid';

it('counts only labels with exactly one number, keeping their format', () => {
  const p = splitCount('₹12,34,567 won')!;
  expect([p.prefix, p.value, p.suffix, p.format(p.value)]).toEqual(['₹', 1234567, ' won', '12,34,567']);
  const q = splitCount('$1,234,567.50')!;
  expect(q.format(q.value)).toBe('1,234,567.50');
  expect(splitCount('2026')!.format(2026)).toBe('2026');
  for (const text of ['9:00', '3 of 8', '6h 30m', 'None', '007']) expect(splitCount(text)).toBeNull();
});

it('paints with the keyboard and moves with the arrows', () => {
  function Demo() {
    const [v, setV] = React.useState([[0, 0], [0, 0]]);
    return <PaintGrid label="Cover" rows={['Mon', 'Tue']} cols={['09:00', '10:00']} levels={[{ label: 'Closed' }, { label: 'Open' }]} value={v} onChange={setV} />;
  }
  render(<Demo />);
  const first = screen.getByRole('gridcell', { name: 'Mon 09:00: Closed' });
  fireEvent.click(first);
  expect(first).toHaveAccessibleName('Mon 09:00: Open');
  fireEvent.keyDown(first, { key: 'ArrowDown' });
  expect(screen.getByRole('gridcell', { name: 'Tue 09:00: Closed' })).toHaveFocus();
});

it('hatches pending bars and keeps the label on the last real one', () => {
  render(<CapsuleBars label="Orders" data={[{ label: 'Mon', value: 4 }, { label: 'Tue', value: 7 }, { label: 'Wed', value: 0, pending: true }]} />);
  expect(screen.getByRole('img', { name: 'Wed: no data yet' })).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();
});
