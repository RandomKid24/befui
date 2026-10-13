// Open-state and behavior tests for the components added in 1.7.0. The all-examples test only sees overlays closed.
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { Tour, type TourProps, type TourStep } from '@/components/ui/tour';
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

it('Menubar opens with the keyboard, moves between menus, shows a checked item, and passes axe while open', async () => {
  render(
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent><MenubarItem>Undo</MenubarItem></MenubarContent>
      </MenubarMenu>
    </Menubar>,
  );
  const file = screen.getByRole('menuitem', { name: 'File' });
  file.focus();
  fireEvent.keyDown(file, { key: 'Enter' });
  expect(await screen.findByRole('menuitem', { name: /New/ })).toBeInTheDocument();
  expect(screen.getByRole('menuitemcheckbox', { name: 'Autosave' })).toHaveAttribute('aria-checked', 'true');
  expect((await scan()).violations).toEqual([]);
  fireEvent.keyDown(screen.getByRole('menuitem', { name: /New/ }), { key: 'ArrowRight' });
  expect(await screen.findByRole('menuitem', { name: 'Undo' })).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Undo' }), { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'Undo' })).toBeNull());
});

const at = (id: string) => `[data-tour="${id}"]`;
const threeSteps: TourStep[] = [
  { target: at('a'), title: 'One' },
  { target: at('b'), title: 'Two' },
  { target: at('c'), title: 'Three' },
];
function TourPage({ ids = ['a', 'b', 'c'], ...tour }: { ids?: string[] } & TourProps) {
  return (
    <>
      <button type="button">Outside</button>
      {ids.map((id) => <button type="button" key={id} data-tour={id}>Target {id}</button>)}
      <Tour {...tour} />
    </>
  );
}
const dialog = () => screen.getByRole('dialog');
const press = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

it('Tour steps forward and back with a counter, and Done finishes once', () => {
  const onFinish = vi.fn();
  const onOpenChange = vi.fn();
  render(<TourPage steps={threeSteps} open onOpenChange={onOpenChange} onFinish={onFinish} />);
  expect(within(dialog()).getByText('One')).toBeInTheDocument();
  expect(within(dialog()).getByText('1 of 3')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  press('Next');
  expect(within(dialog()).getByText('Two')).toBeInTheDocument();
  expect(within(dialog()).getByText('2 of 3')).toBeInTheDocument();
  press('Back');
  expect(within(dialog()).getByText('One')).toBeInTheDocument();
  press('Next');
  press('Next');
  expect(within(dialog()).getByText('Three')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
  press('Done');
  expect(onFinish).toHaveBeenCalledTimes(1);
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it('Tour Skip and Escape close without finishing, and ArrowRight advances', () => {
  const onFinish = vi.fn();
  const onOpenChange = vi.fn();
  render(<TourPage steps={threeSteps} open onOpenChange={onOpenChange} onFinish={onFinish} />);
  fireEvent.keyDown(document, { key: 'ArrowRight' });
  expect(within(dialog()).getByText('Two')).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'ArrowLeft' });
  expect(within(dialog()).getByText('One')).toBeInTheDocument();
  press('Skip');
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
  fireEvent.keyDown(dialog(), { key: 'Escape' });
  expect(onOpenChange).toHaveBeenCalledTimes(2);
  expect(onFinish).not.toHaveBeenCalled();
});

it('Tour skips steps whose target is missing and numbers only the steps it can show', () => {
  render(<TourPage ids={['a', 'c']} steps={threeSteps} open onOpenChange={() => {}} />);
  expect(within(dialog()).getByText('1 of 2')).toBeInTheDocument();
  press('Next');
  expect(within(dialog()).getByText('Three')).toBeInTheDocument();
  expect(within(dialog()).getByText('2 of 2')).toBeInTheDocument();
});

it('Tour renders nothing for empty steps, all-missing targets, or a target removed mid-tour', () => {
  const onFinish = vi.fn();
  const base = { open: true, onOpenChange: () => {}, onFinish };
  const { rerender } = render(<TourPage steps={[]} {...base} />);
  expect(screen.queryByRole('dialog')).toBeNull();
  rerender(<TourPage ids={[]} steps={threeSteps} {...base} />);
  expect(screen.queryByRole('dialog')).toBeNull();
  rerender(<TourPage ids={['a']} steps={[threeSteps[0]]} {...base} />);
  expect(within(dialog()).getByText('One')).toBeInTheDocument();
  rerender(<TourPage ids={[]} steps={[threeSteps[0]]} {...base} />);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(onFinish).not.toHaveBeenCalled();
});

it('Tour moves focus into the card and gives it back on close', async () => {
  const props = { steps: threeSteps, onOpenChange: () => {} };
  const { rerender } = render(<TourPage {...props} open={false} />);
  const outside = screen.getByRole('button', { name: 'Outside' });
  outside.focus();
  rerender(<TourPage {...props} open />);
  await waitFor(() => expect(dialog().contains(document.activeElement)).toBe(true));
  rerender(<TourPage {...props} open={false} />);
  await waitFor(() => expect(outside).toHaveFocus());
});

it.each([[true, 'auto'], [false, 'smooth']])('Tour scrolls its target with reduced motion = %s using behavior %s', (reduce, behavior) => {
  const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');
  const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation(
    (query) => ({ matches: reduce && query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
  );
  try {
    render(<TourPage steps={threeSteps} open onOpenChange={() => {}} />);
    expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ behavior }));
  } finally {
    scrollIntoView.mockRestore();
    matchMedia.mockRestore();
  }
});

it('Tour passes axe while open', async () => {
  render(<TourPage steps={threeSteps} open onOpenChange={() => {}} />);
  expect(dialog()).toBeInTheDocument();
  expect((await scan()).violations).toEqual([]);
});
