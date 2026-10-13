// Open-state and behavior tests for the components added in 1.7.0. The all-examples test only sees overlays closed.
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { InputAddon, InputGroup, InputGroupInput } from '@/components/ui/input-group';

/** axe over the whole body (portalled overlays live there). Page-landmark and contrast rules need a real page, so they are off. */
const scan = (node: Element = document.body) => axe(node, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } });

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

const card = (props = {}) =>
  render(
    <HoverCard {...props}>
      <HoverCardTrigger asChild><a href="/u/ada">@ada</a></HoverCardTrigger>
      <HoverCardContent>Ada Lovelace</HoverCardContent>
    </HoverCard>,
  );

it('HoverCard opens on keyboard focus, closes on blur, and passes axe while open', async () => {
  card({ openDelay: 0, closeDelay: 0 });
  const link = screen.getByRole('link', { name: '@ada' });
  fireEvent.focus(link);
  expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
  expect((await scan()).violations).toEqual([]);
  fireEvent.blur(link);
  await waitFor(() => expect(screen.queryByText('Ada Lovelace')).toBeNull());
});

it('HoverCard waits 200 ms to open and 100 ms to close by default', () => {
  vi.useFakeTimers();
  try {
    card();
    const link = screen.getByRole('link', { name: '@ada' });
    fireEvent.pointerEnter(link);
    act(() => { vi.advanceTimersByTime(199); });
    expect(screen.queryByText('Ada Lovelace')).toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    fireEvent.pointerLeave(link);
    act(() => { vi.advanceTimersByTime(99); });
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByText('Ada Lovelace')).toBeNull();
  } finally {
    vi.useRealTimers();
  }
});

it('ToggleGroup multiple presses several at once and passes axe', async () => {
  const onValueChange = vi.fn();
  const { container } = render(
    <ToggleGroup type="multiple" aria-label="Format" value={['bold']} onValueChange={onValueChange}>
      <ToggleGroupItem value="bold" aria-label="Bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">I</ToggleGroupItem>
    </ToggleGroup>,
  );
  expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
  expect(onValueChange).toHaveBeenCalledWith(['bold', 'italic']);
  expect((await scan(container)).violations).toEqual([]);
});

it('ToggleGroup multiple with an empty value has nothing pressed and reports the first press', () => {
  const onValueChange = vi.fn();
  render(
    <ToggleGroup type="multiple" aria-label="Format" value={[]} onValueChange={onValueChange}>
      <ToggleGroupItem value="bold" aria-label="Bold">B</ToggleGroupItem>
    </ToggleGroup>,
  );
  expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
  expect(onValueChange).toHaveBeenCalledWith(['bold']);
});

it('NavigationMenu opens a panel from its trigger, closes on Escape, and passes axe while open', async () => {
  render(
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent><NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink></NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>,
  );
  const trigger = screen.getByRole('button', { name: 'Products' });
  fireEvent.click(trigger);
  expect(await screen.findByRole('link', { name: 'Analytics' })).toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect((await scan()).violations).toEqual([]);
  fireEvent.keyDown(trigger, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('link', { name: 'Analytics' })).toBeNull());
});
