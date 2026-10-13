import * as React from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import { MonitorIcon, MoonIcon, PhoneIcon, SunIcon, TabletIcon } from '@/components/ui/icons';
import { Segmented } from '@/components/ui/segmented';
import { Tooltip } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CodeBlock } from './code';

const widths = { full: '100%', tablet: '768px', mobile: '390px' } as const;
type Width = keyof typeof widths;
type Theme = 'site' | 'light' | 'dark';

/** Live render with Code (and optional Playground) tabs, plus width and theme switches. `bleed` drops the dotted backdrop and padding for page-size blocks. */
export function Preview({
  children,
  code,
  title,
  bleed,
  className,
  playground,
}: {
  children: React.ReactNode;
  code: string;
  title: string;
  bleed?: boolean;
  className?: string;
  playground?: React.ReactNode;
}) {
  const [width, setWidth] = React.useState<Width>('full');
  const [theme, setTheme] = React.useState<Theme>('site');
  const [rtl, setRtl] = React.useState(false);
  return (
    <Tabs defaultValue="preview" className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <TabsList variant="pill">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {playground && <TabsTrigger value="playground">Playground</TabsTrigger>}
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Tooltip content={rtl ? 'Right-to-left: on' : 'Test right-to-left'}>
            <button type="button" aria-pressed={rtl} onClick={() => setRtl(!rtl)} className={cn('h-8 rounded-md border px-2 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40', rtl ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary')}>RTL</button>
          </Tooltip>
          <Segmented<Width>
            className="hidden sm:inline-flex"
            value={width}
            onValueChange={setWidth}
            options={[
              { value: 'full', label: <Tooltip content="Full width"><MonitorIcon aria-label="Full width" /></Tooltip> },
              { value: 'tablet', label: <Tooltip content="Tablet, 768px"><TabletIcon aria-label="Tablet width" /></Tooltip> },
              { value: 'mobile', label: <Tooltip content="Mobile, 390px"><PhoneIcon aria-label="Mobile width" /></Tooltip> },
            ]}
          />
          <Segmented<Theme>
            value={theme}
            onValueChange={setTheme}
            options={[
              { value: 'site', label: <Tooltip content="Follow site theme"><MonitorIcon aria-label="Site theme" /></Tooltip> },
              { value: 'light', label: <Tooltip content="Light"><SunIcon aria-label="Light" /></Tooltip> },
              { value: 'dark', label: <Tooltip content="Dark"><MoonIcon aria-label="Dark" /></Tooltip> },
            ]}
          />
        </div>
      </div>
      <TabsContent value="preview" className="mt-3">
        <div
          className={cn(
            'mx-auto rounded-xl border bg-background text-foreground transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            theme === 'dark' && 'dark',
            theme === 'light' && 'light',
            !bleed && 'flex min-h-56 items-center justify-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-6 sm:p-10',
            bleed && 'bg-muted/40 p-4 sm:p-6',
            className,
          )}
          style={{ maxWidth: widths[width] }}
          dir={rtl ? 'rtl' : undefined}
        >
          {/* dir on the wrapper flips CSS; Radix components (menus, tabs, toggle groups) read their arrow-key direction from this provider instead. */}
          <DirectionProvider dir={rtl ? 'rtl' : 'ltr'}>
            <div className={cn(bleed ? 'mx-auto w-full max-w-6xl' : 'max-w-full')}>{children}</div>
          </DirectionProvider>
        </div>
      </TabsContent>
      {playground && <TabsContent value="playground" className="mt-3">{playground}</TabsContent>}
      <TabsContent value="code" className="mt-3">
        <CodeBlock code={code} title={title} maxHeight={480} />
      </TabsContent>
    </Tabs>
  );
}
