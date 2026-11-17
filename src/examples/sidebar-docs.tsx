import * as React from 'react';
import { SidebarDocs } from '@/components/ui/sidebar-docs';

function Page({ title }: { title: string }) {
  return (
    <div className="flex-1 p-6">
      <h3 className="text-lg font-semibold capitalize">{title}</h3>
      <div className="mt-4 grid gap-2"><div className="h-3 w-3/4 rounded bg-muted" /><div className="h-3 w-1/2 rounded bg-muted" /><div className="h-24 rounded-lg bg-muted/60" /></div>
    </div>
  );
}

const sections = [
  { title: 'Getting started', items: [{ id: 'intro', label: 'Introduction' }, { id: 'install', label: 'Installation' }, { id: 'quick', label: 'Quick start', tag: 'New' }] },
  { title: 'Guides', items: [
    { id: 'auth', label: 'Authentication', children: [{ id: 'auth-keys', label: 'API keys' }, { id: 'auth-oauth', label: 'OAuth' }] },
    { id: 'webhooks', label: 'Webhooks', tag: 'Beta' },
    { id: 'errors', label: 'Errors' },
  ] },
  { title: 'Reference', items: [{ id: 'api', label: 'REST API' }, { id: 'sdk', label: 'SDKs' }] },
];

export default function SidebarDocsDemo() {
  const [v, setV] = React.useState('auth-keys');
  return (
    <div className="flex h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl border bg-background">
      <SidebarDocs sections={sections} value={v} onChange={setV} />
      <Page title={v.replace('-', ' ')} />
    </div>
  );
}
