// Open-state and behavior tests for the components added in 1.7.0. The all-examples test only sees overlays closed.
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { expect, it } from 'vitest';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { InputAddon, InputGroup, InputGroupInput } from '@/components/ui/input-group';

it('ButtonGroup groups its buttons under an accessible name', () => {
  render(<ButtonGroup aria-label="Align"><Button>A</Button><Button>B</Button></ButtonGroup>);
  expect(within(screen.getByRole('group', { name: 'Align' })).getAllByRole('button')).toHaveLength(2);
});

it('InputGroup puts one focus ring on the row and keeps the input labelled', async () => {
  const { container } = render(<InputGroup><InputAddon>https://</InputAddon><InputGroupInput aria-label="Site" /></InputGroup>);
  expect(screen.getByRole('textbox', { name: 'Site' })).toBeInTheDocument();
  expect((container.firstChild as HTMLElement).className).toContain('focus-within:');
  expect((await axe(container)).violations).toEqual([]);
});

it('uses logical direction classes only', () => {
  const sources = import.meta.glob('/src/components/ui/{hover-card,button-group,input-group,toggle-group,navigation-menu,menubar,tour}.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
  const physical = /(?:^|[\s'"`:!\[])-?(?:ml|mr|pl|pr|left|right)-[\w\[]|rounded-(?:l|r|tl|tr|bl|br)\b|border-[lr]\b/;
  expect(Object.keys(sources).length).toBeGreaterThan(0);
  for (const [path, src] of Object.entries(sources)) expect(src, path).not.toMatch(physical);
});
