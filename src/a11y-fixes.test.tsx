// Behavior the all-examples axe scan cannot prove: names wired to controls, ARIA structure, keyboard still working after the fixes.
import * as React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { expect, it } from 'vitest';
import { Accordion } from '@/components/ui/accordion';
import { Calendar } from '@/components/ui/calendar';
import { FileManager } from '@/components/ui/file-manager';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { MentionInput } from '@/components/ui/mention-input';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { TagInput } from '@/components/ui/tag-input';

const scan = (node: Element) => axe(node, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } });

it('Field labels its control without the caller wiring htmlFor and id, and keeps an id the caller set', () => {
  render(
    <>
      <Field label="Full name"><Input /></Field>
      <Field label="Email"><Input id="mine" /></Field>
    </>,
  );
  expect(screen.getByLabelText('Full name')).toBeInstanceOf(HTMLInputElement);
  expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'mine');
});

it('Calendar is a grid of rows of seven cells and arrow keys still move focus', async () => {
  const { container } = render(<Calendar selected={new Date(2026, 9, 13)} onSelect={() => {}} />);
  const grid = screen.getByRole('grid');
  const rows = within(grid).getAllByRole('row');
  expect(rows).toHaveLength(6);
  for (const row of rows) expect(within(row).getAllByRole('gridcell')).toHaveLength(7);
  const day = within(grid).getByRole('button', { name: /October 13, 2026/ });
  day.focus();
  fireEvent.keyDown(day, { key: 'ArrowRight' });
  await waitFor(() => expect(within(grid).getByRole('button', { name: /October 14, 2026/ })).toHaveFocus());
  expect((await scan(container)).violations).toEqual([]);
});

it('FileManager is a named listbox of options and selecting one marks it selected', async () => {
  const items = [
    { id: 'a', name: 'Report.pdf', type: 'file' as const, modified: 'Today', size: 2048 },
    { id: 'b', name: 'Docs', type: 'folder' as const, modified: 'Today' },
  ];
  const { container } = render(<FileManager path={['Home']} items={items} onNavigate={() => {}} onOpen={() => {}} />);
  const options = within(screen.getByRole('listbox', { name: 'Files and folders' })).getAllByRole('option');
  expect(options).toHaveLength(2);
  fireEvent.click(options[0]);
  expect(options[0]).toHaveAttribute('aria-selected', 'true');
  expect((await scan(container)).violations).toEqual([]);
});

it('MentionInput is a textbox that points at the active suggestion while the list is open', async () => {
  function Harness() {
    const [text, setText] = React.useState('');
    return <MentionInput value={text} onChange={setText} people={[{ id: '1', name: 'Aarav' }, { id: '2', name: 'Diya' }]} />;
  }
  const { container } = render(<Harness />);
  const box = screen.getByRole('textbox');
  fireEvent.change(box, { target: { value: 'Hi @' } });
  const list = await screen.findByRole('listbox');
  const [first] = within(list).getAllByRole('option');
  expect(box).toHaveAttribute('aria-controls', list.id);
  expect(box).toHaveAttribute('aria-activedescendant', first.id);
  expect((await scan(container)).violations).toEqual([]);
});

it('Accordion names each panel after its heading', () => {
  render(<Accordion items={[{ id: 'a', title: 'Billing', content: 'Invoices' }]} defaultOpen={['a']} />);
  expect(screen.getByRole('region', { name: 'Billing' })).toBeInTheDocument();
});

it('Progress and ProgressRing take an accessible name', () => {
  render(<><Progress value={40} aria-label="Storage used" /><ProgressRing value={60} aria-label="Profile complete" /></>);
  expect(screen.getByRole('progressbar', { name: 'Storage used' })).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: 'Profile complete' })).toBeInTheDocument();
});

it('TagInput keeps an accessible name once tags have replaced the placeholder, and takes a custom one', () => {
  const { rerender } = render(<TagInput value={['react']} onValueChange={() => {}} />);
  expect(screen.getByRole('textbox', { name: 'Add a tag' })).toBeInTheDocument();
  rerender(<TagInput value={['react']} onValueChange={() => {}} aria-label="Skills" />);
  expect(screen.getByRole('textbox', { name: 'Skills' })).toBeInTheDocument();
});
