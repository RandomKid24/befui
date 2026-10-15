import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Segmented } from '@/components/ui/segmented';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Marquee } from '@/components/ui/marquee';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CodeBlock } from './code';

type Values = Record<string, string | number | boolean>;
type Control =
  | { key: string; type: 'select'; options: string[] }
  | { key: string; type: 'boolean' }
  | { key: string; type: 'text' }
  | { key: string; type: 'number'; min: number; max: number };

interface Spec {
  tag: string;
  controls: Control[];
  initial: Values;
  /** JSX children as text, taken from the `label` value. */
  label?: string;
  render: (v: Values) => React.ReactNode;
}

const sel = (key: string, options: string[]): Control => ({ key, type: 'select', options });

const specs: Record<string, Spec> = {
  button: {
    tag: 'Button',
    label: 'Click me',
    controls: [
      sel('variant', ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link', 'soft', 'dark', 'glow', 'shine', 'brutal', 'raised', 'outlineGlow']),
      sel('size', ['xs', 'sm', 'md', 'lg']),
      sel('shape', ['default', 'pill']),
      { key: 'loading', type: 'boolean' },
      { key: 'disabled', type: 'boolean' },
      { key: 'label', type: 'text' },
    ],
    initial: { variant: 'primary', size: 'md', shape: 'pill', loading: false, disabled: false, label: 'Click me' },
    render: (v) => <Button variant={v.variant as 'primary'} size={v.size as 'md'} shape={v.shape as 'pill'} loading={!!v.loading} disabled={!!v.disabled}>{String(v.label)}</Button>,
  },
  badge: {
    tag: 'Badge',
    label: 'Approved',
    controls: [sel('variant', ['default', 'outline', 'primary', 'success', 'warning', 'danger', 'info']), { key: 'dot', type: 'boolean' }, { key: 'label', type: 'text' }],
    initial: { variant: 'success', dot: true, label: 'Approved' },
    render: (v) => <Badge variant={v.variant as 'success'} dot={!!v.dot}>{String(v.label)}</Badge>,
  },
  alert: {
    tag: 'Alert',
    label: 'Your changes were saved.',
    controls: [sel('variant', ['info', 'success', 'warning', 'danger']), { key: 'label', type: 'text' }],
    initial: { variant: 'success', label: 'Your changes were saved.' },
    render: (v) => <Alert variant={v.variant as 'info'} className="w-80">{String(v.label)}</Alert>,
  },
  progress: {
    tag: 'Progress',
    controls: [{ key: 'value', type: 'number', min: 0, max: 100 }, sel('tone', ['primary', 'success', 'warning', 'danger'])],
    initial: { value: 60, tone: 'primary' },
    render: (v) => <Progress value={Number(v.value)} tone={v.tone as 'primary'} className="w-72" />,
  },
  'progress-ring': {
    tag: 'ProgressRing',
    controls: [{ key: 'value', type: 'number', min: 0, max: 100 }, { key: 'size', type: 'number', min: 48, max: 160 }, { key: 'stroke', type: 'number', min: 2, max: 16 }],
    initial: { value: 72, size: 96, stroke: 8 },
    render: (v) => <ProgressRing value={Number(v.value)} size={Number(v.size)} stroke={Number(v.stroke)} />,
  },
  marquee: {
    tag: 'Marquee',
    controls: [{ key: 'speed', type: 'number', min: 5, max: 60 }, { key: 'reverse', type: 'boolean' }],
    initial: { speed: 20, reverse: false },
    render: (v) => (
      <Marquee speed={Number(v.speed)} reverse={!!v.reverse} className="w-96">
        {['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map((b) => <Chip key={b}>{b}</Chip>)}
      </Marquee>
    ),
  },
};

export const hasPlayground = (slug: string) => slug in specs;

const defaults: Values = { variant: 'primary', size: 'md', shape: 'default', tone: 'primary', value: 0 };

function codeFor(spec: Spec, v: Values) {
  const props = spec.controls
    .filter((c) => c.key !== 'label')
    .map((c) => {
      const val = v[c.key];
      if (val === defaults[c.key] || val === false || val === undefined) return '';
      if (typeof val === 'boolean') return ` ${c.key}`;
      return typeof val === 'number' ? ` ${c.key}={${val}}` : ` ${c.key}="${val}"`;
    })
    .join('');
  return spec.label ? `<${spec.tag}${props}>${v.label}</${spec.tag}>` : `<${spec.tag}${props} />`;
}

/** Live props editor. Controls are declared per component in `specs`. */
export function Playground({ slug }: { slug: string }) {
  const spec = specs[slug];
  const [v, setV] = React.useState<Values>(spec.initial);
  const deferred = React.useDeferredValue(v); // the usage snippet follows a beat behind, so typing in a control never waits for it
  const set = (k: string, x: string | number | boolean) => setV((o) => ({ ...o, [k]: x }));
  return (
    <div className="grid overflow-hidden rounded-xl border lg:grid-cols-[1fr_17rem]">
      <div className="grid min-h-56 place-items-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-8">{spec.render(v)}</div>
      <div className="grid content-start gap-4 border-t bg-muted/40 p-4 lg:border-l lg:border-t-0">
        {spec.controls.map((c) => (
          <div key={c.key} className="grid gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">{c.key}</label>
            {c.type === 'select' && c.options.length <= 4 && (
              <Segmented className="w-fit" value={String(v[c.key])} onValueChange={(x) => set(c.key, x)} options={c.options.map((o) => ({ value: o, label: o }))} />
            )}
            {c.type === 'select' && c.options.length > 4 && (
              <Select value={String(v[c.key])} onValueChange={(x) => set(c.key, x)}>
                <SelectTrigger className="h-8 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>{c.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            )}
            {c.type === 'boolean' && <Switch checked={!!v[c.key]} onCheckedChange={(x) => set(c.key, x)} />}
            {c.type === 'text' && <Input value={String(v[c.key])} onChange={(e) => set(c.key, e.target.value)} className="h-8 text-[13px]" />}
            {c.type === 'number' && <Slider value={Number(v[c.key])} min={c.min} max={c.max} onValueChange={(x) => set(c.key, x)} />}
          </div>
        ))}
      </div>
      <div className="border-t lg:col-span-2"><CodeBlock code={codeFor(spec, deferred)} title="Usage" /></div>
    </div>
  );
}
