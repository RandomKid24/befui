import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Kanban } from '@/components/ui/kanban';
import { Toaster, toast } from '@/components/ui/toast';

afterEach(() => { vi.useRealTimers(); delete (document as { elementFromPoint?: unknown }).elementFromPoint; });

function Board({ onChange }: { onChange: (v: Record<string, { id: string }[]>) => void }) {
  return <Kanban columns={[{ id: 'todo', title: 'To do' }, { id: 'done', title: 'Done' }]} value={{ todo: [{ id: 'a' }], done: [] }} onChange={onChange} renderCard={(c) => c.id} />;
}
// jsdom has no PointerEvent, so send mouse events under the pointer names
const point = (target: Element | Window, type: string, x: number, y: number) => act(() => { target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: x, clientY: y })); });

it('Kanban: a pointer drag moves a card, and Escape cancels', () => {
  const onChange = vi.fn();
  render(<Board onChange={onChange} />);
  document.elementFromPoint = () => screen.getByRole('region', { name: 'Done' });
  const card = screen.getByText('a');
  point(card, 'pointerdown', 0, 0);
  point(window, 'pointermove', 40, 10);
  expect(document.querySelector('[data-drag-ghost]')).not.toBeNull();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(onChange).not.toHaveBeenCalled();
  expect(document.querySelector('[data-drag-ghost]')).toBeNull();

  point(card, 'pointerdown', 0, 0);
  point(window, 'pointermove', 40, 10);
  point(window, 'pointerup', 40, 10);
  expect(onChange).toHaveBeenCalledWith({ todo: [], done: [{ id: 'a' }] });
});

it('toast waits while the pointer is on it', () => {
  vi.useFakeTimers();
  render(<Toaster />);
  act(() => { toast.success('Saved', undefined, { duration: 3000 }); });
  const el = screen.getByRole('status');
  fireEvent.pointerEnter(el);
  act(() => { vi.advanceTimersByTime(10_000); });
  expect(screen.getByText('Saved')).toBeInTheDocument();
  fireEvent.pointerLeave(el);
  act(() => { vi.advanceTimersByTime(3000); });
  expect(screen.queryByText('Saved')).not.toBeInTheDocument();
});
