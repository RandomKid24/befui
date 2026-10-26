import * as React from 'react';
import { flushSync } from 'react-dom';
import { Github } from 'lucide-react';
import { BarChartIcon, BefMark, BellIcon, BlocksIcon, ChevronRightIcon, ClockIcon, CodeIcon, EditIcon, ImageIcon, LayersIcon, ListIcon, BookIcon, CommandKeyIcon, ComponentsIcon, MenuIcon, MoonIcon, PaletteIcon, PhoneIcon, SearchIcon, SparkleIcon, SunIcon, ZapIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/dialog';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { SearchInput } from '@/components/ui/search-input';
import { Toaster } from '@/components/ui/toast';
import './site.css';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { blocks, categories, components, NEW_SLUGS } from '@/registry';
import { cn } from '@/lib/utils';
import { Link, go } from './router';
import { platformList } from './platform-lists';

export const REPO = 'https://github.com/RandomKid24/befui';

export function Logo() {
  return (
    <Link to="/" className="font-display flex items-center gap-2 text-[17px] font-bold tracking-tight">
      <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
<BefMark weight={3} className="size-3.5" />
      </span>
      befui
    </Link>
  );
}

function useTheme() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  /** Circular reveal that grows from the clicked button. Falls back to an instant switch. */
  const toggle = (e?: React.MouseEvent) => {
    const next = !dark;
    const apply = () => {
      flushSync(() => setDark(next));
      document.documentElement.classList.toggle('dark', next);
    };
    try {
      localStorage.setItem('befui-theme', next ? 'dark' : 'light');
    } catch {
      /* storage can be blocked */
    }
    const vt = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void> } }).startViewTransition;
    if (!vt || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
    const r = e?.currentTarget instanceof HTMLElement ? e.currentTarget.getBoundingClientRect() : null;
    const x = r ? r.left + r.width / 2 : innerWidth - 40;
    const y = r ? r.top + r.height / 2 : 28;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement.style;
    root.setProperty('--vt-x', `${x}px`);
    root.setProperty('--vt-y', `${y}px`);
    root.setProperty('--vt-r', `${radius}px`);
    const t = vt.call(document, apply);
    t.ready.catch(() => {});
    t.finished.catch(() => {});
    t.updateCallbackDone.catch(() => {});
  };
  return { dark, toggle };
}

function SearchPalette({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const pick = (to: string) => {
    setOpen(false);
    go(to);
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen} label="Search components and blocks">
      <CommandInput placeholder="Search components and blocks..." />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => pick('/docs')}><BookIcon /> Getting started</CommandItem>
          <CommandItem onSelect={() => pick('/components')}><ComponentsIcon /> All components</CommandItem>
          <CommandItem onSelect={() => pick('/blocks')}><BlocksIcon /> All blocks</CommandItem>
          <CommandItem onSelect={() => pick('/icons')}><SparkleIcon /> Icons</CommandItem>
          <CommandItem onSelect={() => pick('/themes')}><PaletteIcon /> Themes</CommandItem>
          <CommandItem onSelect={() => pick('/ai')}><ZapIcon /> Use with AI</CommandItem>
          <CommandItem onSelect={() => pick('/recipes')}><LayersIcon /> Recipes</CommandItem>
          <CommandItem onSelect={() => pick('/html')}><CodeIcon /> Use from HTML and htmx</CommandItem>
          <CommandItem onSelect={() => pick('/flutter')}><PhoneIcon /> Use in Flutter</CommandItem>
          <CommandItem onSelect={() => pick('/changelog')}><ClockIcon /> Changelog</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Components">
          {components.map((c) => (
            <CommandItem key={c.slug} value={`${c.name} ${c.category} ${c.keywords.join(' ')}`} onSelect={() => pick(`/components/${c.slug}`)}>
              <CommandKeyIcon /> {c.name}
              <span className="ml-auto text-xs text-muted-foreground">{c.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Blocks">
          {blocks.map((b) => (
            <CommandItem key={b.slug} value={`${b.name} ${b.module} block`} onSelect={() => pick(`/blocks/${b.slug}`)}>
              <BlocksIcon /> {b.name}
              <span className="ml-auto text-xs text-muted-foreground">{b.module}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

const GROUP_ICONS = {
  Layout: BlocksIcon,
  Inputs: EditIcon,
  Display: ImageIcon,
  Data: BarChartIcon,
  Feedback: BellIcon,
  Overlays: LayersIcon,
  Navigation: ListIcon,
  Time: ClockIcon,
  AI: SparkleIcon,
  Blocks: ComponentsIcon,
} as const;

function NavGroup({ title, count, open, onToggle, current, children }: { title: keyof typeof GROUP_ICONS; count: number; open: boolean; onToggle: () => void; current: boolean; children: React.ReactNode }) {
  const Icon = GROUP_ICONS[title];
  // a group's links are only built once it has been opened (the sidebar has about 200 of them)
  const [built, setBuilt] = React.useState(open);
  React.useEffect(() => { if (open) setBuilt(true); }, [open]);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={cn(
          'group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm font-semibold outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/40',
          current ? 'text-foreground' : 'text-foreground/80',
        )}
      >
        <Icon className={cn('transition-colors', current ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
        <span className="flex-1">{title}</span>
        <span className="rounded-full bg-secondary px-1.5 py-px text-[11px] font-medium tabular-nums text-muted-foreground">{count}</span>
        <ChevronRightIcon className={cn('size-3.5 text-muted-foreground transition-transform duration-200', open && 'rotate-90')} />
      </button>
      <div className={cn('grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="ml-[1.1rem] mt-0.5 grid gap-px border-l pl-2.5 pb-1">{built || open ? children : null}</div>
        </div>
      </div>
    </div>
  );
}

export function SidebarNav({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  const platform = /^\/(html|flutter)(\/|$)/.exec(path)?.[1] as 'html' | 'flutter' | undefined;
  const groups = React.useMemo(() => {
    if (platform) {
      const have = new Set(platformList(platform).map((c) => c.slug));
      return categories
        .map((cat) => ({ title: cat as keyof typeof GROUP_ICONS, items: components.filter((c) => c.category === cat && have.has(c.slug)).map((c) => ({ to: `/${platform}/${c.slug}`, label: c.name, extra: c.keywords.join(' ') })) }))
        .filter((g) => g.items.length);
    }
    return [
      ...categories.map((cat) => ({ title: cat as keyof typeof GROUP_ICONS, items: components.filter((c) => c.category === cat).map((c) => ({ to: `/components/${c.slug}`, label: c.name, extra: c.keywords.join(' ') })) })),
      { title: 'Blocks' as const, items: blocks.map((b) => ({ to: `/blocks/${b.slug}`, label: b.name, extra: b.module })) },
    ];
  }, [platform]);
  const currentGroup = groups.find((g) => g.items.some((i) => i.to === path))?.title;
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => ({ [currentGroup ?? '']: true }));
  const [q, setQ] = React.useState('');
  const root = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (currentGroup) setOpen((o) => (o[currentGroup] ? o : { ...o, [currentGroup]: true }));
  }, [currentGroup]);
  // Keep the current link visible by scrolling only the sidebar. scrollIntoView would also move the page.
  React.useEffect(() => {
    const t = setTimeout(() => {
      const el = root.current?.querySelector<HTMLElement>('[aria-current="page"]');
      const box = root.current?.closest('aside');
      if (!el || !box) return;
      const e = el.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      if (e.top < b.top + 40 || e.bottom > b.bottom - 40) box.scrollTo({ top: box.scrollTop + e.top - b.top - b.height / 2 + e.height / 2 });
    }, 320);
    return () => clearTimeout(t);
  }, [path]);

  const term = React.useDeferredValue(q.trim().toLowerCase());
  const item = (to: string, label: string) => (
    <Link
      key={to}
      to={to}
      onClick={onNavigate}
      aria-current={path === to ? 'page' : undefined}
      className={cn(
        'relative block rounded-md py-1.5 pl-3 pr-2 text-sm transition-colors',
        path === to
          ? 'bg-accent font-medium text-accent-foreground before:absolute before:-left-[11px] before:top-1 before:bottom-1 before:w-0.5 before:rounded-full before:bg-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      {label}
      {to.startsWith('/components/') && NEW_SLUGS.has(to.slice(12)) && <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-px align-middle text-[10px] font-semibold text-primary">New</span>}
    </Link>
  );
  const top = [['/docs', 'Getting started', BookIcon], ['/components', 'All components', ComponentsIcon], ['/blocks', 'All blocks', BlocksIcon], ['/icons', 'Icons', SparkleIcon], ['/themes', 'Themes', PaletteIcon], ['/ai', 'Use with AI', ZapIcon], ['/html', 'HTML and htmx', CodeIcon], ['/flutter', 'Flutter', PhoneIcon], ['/changelog', 'Changelog', ClockIcon]] as const;
  const platformTop = platform
    ? ([[`/${platform}`, platform === 'html' ? 'HTML overview' : 'Flutter overview', platform === 'html' ? CodeIcon : PhoneIcon], ['/components', 'React components', ComponentsIcon], ['/themes', 'Themes', PaletteIcon], ['/ai', 'Use with AI', ZapIcon]] as const)
    : null;
  const allOpen = groups.every((g) => open[g.title]);
  const visible = groups
    .map((g) => ({ ...g, shown: term ? g.items.filter((i) => `${i.label} ${i.extra}`.toLowerCase().includes(term)) : g.items }))
    .filter((g) => g.shown.length);

  return (
    <nav ref={root} className="grid gap-4">
      <SearchInput value={q} onValueChange={setQ} shortcut="" placeholder={platform ? `Filter ${platform === 'html' ? 'HTML' : 'Flutter'} components` : 'Filter components'} />
      {!term && (
        <div className="grid gap-px">
          {(platformTop ?? top).map(([to, label, Icon]) => (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={path === to ? 'page' : undefined}
              className={cn('flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors', path === to ? 'bg-accent text-accent-foreground' : 'text-foreground/80 hover:bg-secondary hover:text-foreground')}
            >
              <Icon className={path === to ? 'text-primary' : 'text-muted-foreground'} /> {label}
            </Link>
          ))}
        </div>
      )}
      <div className="grid gap-1">
        {!term && (
          <button type="button" onClick={() => setOpen(Object.fromEntries(groups.map((g) => [g.title, !allOpen])))} className="mb-1 ml-2.5 w-fit text-xs font-medium text-primary hover:underline">
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        )}
        {visible.map((g) => (
          <NavGroup key={g.title} title={g.title} count={g.shown.length} open={term ? true : !!open[g.title]} onToggle={() => setOpen((o) => ({ ...o, [g.title]: !o[g.title] }))} current={g.title === currentGroup}>
            {g.shown.map((i) => item(i.to, i.label))}
          </NavGroup>
        ))}
        {visible.length === 0 && <p className="px-2.5 py-4 text-sm text-muted-foreground">Nothing matches "{q}".</p>}
      </div>
    </nav>
  );
}

/** "On this page": lists the h2s in <main> and highlights the one being read. */
function Toc({ path }: { path: string }) {
  const [items, setItems] = React.useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = React.useState('top');
  React.useEffect(() => {
    let io: IntersectionObserver | undefined;
    const t = setTimeout(() => {
      const hs = [...document.querySelectorAll<HTMLElement>('main h2')];
      hs.forEach((h) => { h.id ||= (h.textContent ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); });
      setItems([{ id: 'top', text: 'Overview' }, ...hs.map((h) => ({ id: h.id, text: (h.textContent ?? '').replace(/^\d+/, '').trim() }))]);
      setActive('top');
      const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-80px 0px -65% 0px' });
      hs.forEach((h) => obs.observe(h));
      io = obs;
    }, 150);
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
  }, [path]);
  if (items.length < 3) return null;
  return (
    <nav aria-label="On this page" className="grid gap-1 border-l pl-3 text-[13px]">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">On this page</p>
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${path}`}
          onClick={(e) => {
            e.preventDefault();
            (i.id === 'top' ? document.documentElement : document.getElementById(i.id))?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cn('-ml-[calc(0.75rem+1px)] border-l-2 py-0.5 pl-3 transition-colors', active === i.id ? 'border-primary font-medium text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
        >
          {i.text}
        </a>
      ))}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-3 px-4 py-6 text-[13px] text-muted-foreground sm:px-6">
        <span>befui. MIT licensed.</span>
        <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"><Github className="size-4" /> Source on GitHub</a>
      </div>
    </footer>
  );
}

export function Shell({ path, docs, children }: { path: string; docs: boolean; children: React.ReactNode }) {
  const { dark, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navLink = (to: string, label: string, match: string) => (
    <Link
      to={to}
      className={cn('font-display rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-foreground', path.startsWith(match) ? 'text-foreground' : 'text-muted-foreground')}
    >
      {label}
    </Link>
  );

  return (
    <TooltipProvider>
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-4 px-4 sm:px-6">
          <Button variant="ghost" size="icon-sm" className="xl:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <MenuIcon />
          </Button>
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 xl:flex">
            {navLink('/docs', 'Docs', '/docs')}
            {navLink('/components', 'Components', '/components')}
            {navLink('/blocks', 'Blocks', '/blocks')}
            {navLink('/recipes', 'Recipes', '/recipes')}
            {navLink('/icons', 'Icons', '/icons')}
            {navLink('/ai', 'AI', '/ai')}
            {navLink('/html', 'HTML', '/html')}
            {navLink('/flutter', 'Flutter', '/flutter')}
            {navLink('/changelog', 'Changelog', '/changelog')}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden h-8 w-56 items-center gap-2 rounded-md border bg-muted/60 px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary sm:flex"
            >
              <SearchIcon className="size-3.5" /> Search
              <span className="ml-auto flex gap-0.5"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
            </button>
            <Button variant="ghost" size="icon-sm" className="sm:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
              <SearchIcon />
            </Button>
            <Tooltip content="GitHub">
              <Button asChild variant="ghost" size="icon-sm">
                <a href={REPO} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
              </Button>
            </Tooltip>
            <Tooltip content={dark ? 'Light mode' : 'Dark mode'}>
              <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Toggle theme">
                {dark ? <SunIcon key="sun" className="size-4 animate-spin-in" /> : <MoonIcon key="moon" className="size-4 animate-spin-in" />}
              </Button>
            </Tooltip>
          </div>
        </div>
      </header>

      <SearchPalette open={searchOpen} setOpen={setSearchOpen} />
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="max-w-xs overflow-y-auto" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Logo />
          <nav className={cn('mt-4 grid gap-1 xl:hidden', docs && 'border-b pb-4')}>
            {[['/docs', 'Docs'], ['/components', 'Components'], ['/blocks', 'Blocks'], ['/icons', 'Icons'], ['/ai', 'Use with AI'], ['/html', 'HTML and htmx'], ['/flutter', 'Flutter'], ['/changelog', 'Changelog']].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="rounded-md px-2.5 py-2 text-sm font-medium hover:bg-secondary">{label}</Link>
            ))}
          </nav>
          {docs && <div className="mt-4"><SidebarNav path={path} onNavigate={() => setMenuOpen(false)} /></div>}
        </SheetContent>
      </Sheet>

      {docs ? (
        <div className="mx-auto flex max-w-[90rem] gap-10 px-4 sm:px-6">
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto py-6 pr-3 lg:block">
            <SidebarNav path={path} />
          </aside>
          <main className="min-w-0 flex-1 py-8 pb-24">{children}</main>
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-48 shrink-0 overflow-y-auto py-10 xl:block">
            <Toc path={path} />
          </aside>
        </div>
      ) : (
        <main>{children}</main>
      )}
      <Footer />
      <Toaster />
    </TooltipProvider>
  );
}
